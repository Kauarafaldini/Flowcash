import { Router } from 'express'
import { supabase } from '../supabase.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.post('/', authMiddleware, async (req, res) => {
  const { title, total_value, current_value } = req.body

  const { error } = await supabase
    .from('goals')
    .insert({
      user_id: req.user.id,
      title,
      total_value,
      current_value
    })

  if (error) return res.status(400).json({ error: error.message })

  res.status(201).json({ success: true })
})

router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', req.user.id)

  if (error) return res.status(400).json({ error: error.message })

  res.json(data)
})

export default router
