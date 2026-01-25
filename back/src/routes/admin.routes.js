import { Router } from 'express'
import { supabase } from '../supabase.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) return res.status(400).json({ error: error.message })

  res.json(data.users)
})

// Promover usuário a admin
router.post('/users/:userId/promote', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const { userId } = req.params

  try {
    // Atualizar role na tabela users
    const { error: userError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userId)

    if (userError) {
      return res.status(400).json({ error: userError.message })
    }

    // Atualizar app_metadata para incluir no JWT
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      app_metadata: { role: 'admin' }
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    res.json({ message: 'Usuário promovido a admin com sucesso' })
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router
