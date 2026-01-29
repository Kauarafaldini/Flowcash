import { Router } from 'express'
import { supabase } from '../supabase.js'

const router = Router()

// Criar perfil manualmente para usuários existentes (debug)
router.post('/create-profile', async (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório' })
  }

  try {
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (existing) {
      return res.status(400).json({ error: 'Perfil já existe' })
    }

    // Buscar dados do auth.users
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)

    if (authError || !authUser.user) {
      return res.status(400).json({ error: 'Usuário não encontrado no auth' })
    }

    // Criar perfil
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        name: authUser.user.email,
        email: authUser.user.email,
        plan: 'free',
        role: 'user',
        enabled_modules: ['core_financial']
      })

    if (insertError) {
      return res.status(400).json({ error: insertError.message })
    }

    // Atualizar app_metadata
    await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: 'user' }
    })

    res.json({ message: 'Perfil criado com sucesso' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno', details: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  console.log('🔐 Tentativa de login:', { email })

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log('❌ Erro no auth.signInWithPassword:', error)
      return res.status(400).json({ error: error.message })
    }

    console.log('✅ Auth bem-sucedido, user ID:', data.user.id)

    // Buscar dados adicionais do usuário
    console.log('🔍 Buscando perfil do usuário...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)

    console.log('📊 Resultado da query users:', { userData, userError })

    if (userError) {
      console.error('❌ Erro ao buscar perfil do usuário:', userError)
      return res.status(400).json({
        error: 'Perfil do usuário não encontrado. Execute o schema.sql no Supabase primeiro.',
        details: userError.message
      })
    }

    if (!userData || userData.length === 0) {
      console.error('❌ Nenhum perfil encontrado para o usuário')
      return res.status(400).json({
        error: 'Perfil do usuário não encontrado. O trigger pode não ter funcionado.'
      })
    }

    if (userData.length > 1) {
      console.error('❌ Múltiplos perfis encontrados:', userData.length)
      return res.status(400).json({
        error: 'Múltiplos perfis encontrados. Dados corrompidos.'
      })
    }

    const profile = userData[0]
    console.log('✅ Perfil encontrado:', { id: profile.id, email: profile.email, role: profile.role })

    // Atualizar app_metadata com o role para incluir no JWT
    await supabase.auth.admin.updateUserById(data.user.id, {
      app_metadata: { role: profile.role }
    })

    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        plan: profile.plan,
        role: profile.role,
        createdAt: profile.created_at,
        enabledModules: profile.enabled_modules,
        lastLogin: new Date().toISOString(),
      },
      token: data.session.access_token,
    })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  console.log('📝 Tentativa de signup:', { name, email })

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('❌ Erro no auth.signUp:', error)
      return res.status(400).json({ error: error.message })
    }

    console.log('✅ Usuário criado no auth:', data.user.id)

    // Aguardar um pouco para o trigger executar
    await new Promise(resolve => setTimeout(resolve, 500))

    // Verificar se o perfil foi criado pelo trigger
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    console.log('🔍 Verificando se perfil foi criado:', { existingUser, checkError })

    if (existingUser) {
      console.log('✅ Perfil já existe (criado pelo trigger)')
      return res.status(201).json({
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          plan: existingUser.plan,
          role: existingUser.role,
          createdAt: existingUser.created_at,
          enabledModules: existingUser.enabled_modules,
          lastLogin: new Date().toISOString(),
        },
        token: data.session?.access_token,
      })
    }

    // Se o trigger não funcionou, criar manualmente
    console.log('⚠️ Trigger não criou perfil, criando manualmente...')
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        name,
        email,
        plan: 'free',
        role: 'user',
        enabled_modules: ['core_financial']
      })

    if (profileError) {
      console.error('❌ Erro ao criar perfil manualmente:', profileError)
      return res.status(400).json({
        error: 'Database error saving new user',
        details: profileError.message
      })
    }

    console.log('✅ Perfil criado com sucesso manualmente')

    res.status(201).json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        plan: 'free',
        role: 'user',
        createdAt: new Date().toISOString(),
        enabledModules: ['core_financial'],
        lastLogin: new Date().toISOString(),
      },
      token: data.session?.access_token,
    })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Reset password
router.post('/reset-password', async (req, res) => {
  const { email } = req.body

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Email de redefinição enviado' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Update password (após clicar no link do email de recovery)
router.post('/update-password', async (req, res) => {
  const { password, access_token } = req.body

  try {
    if (!password || !access_token) {
      return res.status(400).json({ error: 'Senha e token são obrigatórios' })
    }

    // Usar o access_token para validar e atualizar
    const { data, error } = await supabase.auth.updateUser(
      { password },
      { access_token }
    )

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({ message: 'Senha atualizada com sucesso' })
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar senha' })
  }
})

// Logout (opcional, mas pode ser usado para invalidar token)
router.post('/logout', async (req, res) => {
  // No Supabase, logout é feito no cliente, mas podemos confirmar
  res.json({ message: 'Logout realizado' })
})

export default router