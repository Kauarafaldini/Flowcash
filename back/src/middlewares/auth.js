import { supabaseAdmin } from '../supabase.js'

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado' })
  }

  const token = authHeader.replace('Bearer ', '')

  // Validar usuário pelo token
  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  // Buscar perfil (ignora RLS com service role)
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (profileError || !profile) {
    return res.status(403).json({ error: 'Perfil não encontrado' })
  }

  req.user = {
    ...data.user,
    ...profile,
  }

  next()
}
