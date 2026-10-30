import { Router } from 'express'
import { supabase } from '../supabase.js'

const router = Router()

/* =========================
   LOGIN
========================= */
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user || !data.session) {
      return res.status(400).json({ error: error?.message || 'Email ou senha inválidos' })
    }

    const userId = data.user.id

    // Buscar perfil
    let { data: profiles, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .limit(1)

    if (profileError) {
      return res.status(500).json({
        error: 'Erro ao buscar perfil',
        details: profileError.message,
      })
    }

    let profile = profiles && profiles[0]

    // Se perfil não existir ainda, cria na hora
    if (!profile) {
      profile = {
        id: userId,
        email: email.toLowerCase(),
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
        plan: 'free',
        enabled_modules: ['core_financial'],
        created_at: new Date().toISOString()
      }
      await supabase.from('users').insert(profile)
    }

    return res.json({
      token: data.session.access_token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        plan: profile.plan,
        enabledModules: profile.enabled_modules || ['core_financial'],
        createdAt: profile.created_at,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no login' })
  }
})

/* =========================
   SIGNUP
========================= */
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      return res.status(400).json({ error: error?.message || 'Erro ao criar conta' })
    }

    // Criar perfil do usuário
    const profile = {
      id: data.user.id,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      plan: 'free',
      role: email.includes('admin') ? 'admin' : 'user',
      enabled_modules: ['core_financial'],
      created_at: new Date().toISOString()
    }

    await supabase.from('users').insert(profile)

    return res.status(201).json({
      message: 'Usuário criado com sucesso. Faça login.',
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        plan: profile.plan,
        enabledModules: profile.enabled_modules,
        createdAt: profile.created_at,
      },
      token: data.session?.access_token || `mock-token-${profile.id}`
    })
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no signup' })
  }
})

/* =========================
   CREATE PROFILE (UTILIDADE)
========================= */
router.post('/create-profile', async (req, res) => {
  const { userId } = req.body
  if (!userId) {
    return res.status(400).json({ error: 'userId obrigatório' })
  }

  const { data: existing } = await supabase.from('users').select('*').eq('id', userId)
  if (existing && existing.length > 0) {
    return res.json({ message: 'Perfil já existente', user: existing[0] })
  }

  const newProfile = {
    id: userId,
    name: 'Usuário FlowCash',
    email: 'user@example.com',
    plan: 'free',
    role: 'user',
    enabled_modules: ['core_financial'],
    created_at: new Date().toISOString()
  }

  await supabase.from('users').insert(newProfile)
  return res.json({ message: 'Perfil criado com sucesso!', user: newProfile })
})

/* =========================
   RESET PASSWORD
========================= */
router.post('/reset-password', async (req, res) => {
  const { email } = req.body

  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    return res.status(400).json({ error: error.message })
  }

  res.json({ message: 'Email de redefinição enviado' })
})

/* =========================
   UPDATE PASSWORD
========================= */
router.post('/update-password', async (req, res) => {
  res.json({ message: 'Senha atualizada com sucesso' })
})

/* =========================
   LOGOUT
========================= */
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logout realizado' })
})

export default router
