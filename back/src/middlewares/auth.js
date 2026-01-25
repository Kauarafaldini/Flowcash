import { supabase } from '../supabase.js'

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado' })
  }

  const token = authHeader.replace('Bearer ', '')

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    return res.status(401).json({ error: 'Token inválido' })
  }

  // Buscar dados adicionais do usuário da tabela users
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (userError) {
    return res.status(400).json({ error: userError.message })
  }

  req.user = {
    ...data.user,
    ...userData
  }
  next()
}
