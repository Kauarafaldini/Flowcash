import { Router } from 'express'
import { supabaseAdmin } from '../supabase.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

// Stats do dashboard
router.get('/stats', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const { data: users } = await supabaseAdmin
    .from('users')
    .select('id, plan')

  const totalUsers = users.length
  const usersByPlan = {
    free: users.filter(u => u.plan === 'free').length,
    premium: users.filter(u => u.plan === 'premium').length,
    pro: users.filter(u => u.plan === 'pro').length,
  }

  res.json({
    totalUsers,
    activeUsers: Math.floor(totalUsers * 0.7),
    usersByPlan,
    monthlyGrowth: 12.5,
  })
})

// Promover usuário
router.post('/users/:id/promote', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const { id } = req.params

  await supabaseAdmin
    .from('users')
    .update({ role: 'admin' })
    .eq('id', id)

  await supabaseAdmin.auth.admin.updateUserById(id, {
    app_metadata: { role: 'admin' },
  })

  res.json({ message: 'Usuário promovido a admin' })
})

export default router
