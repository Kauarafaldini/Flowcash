import { Router } from 'express'
import { supabase } from '../supabase.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

// Criar gasto
router.post('/', authMiddleware, async (req, res) => {
  const { value, category, payment_method, installments, description, date } = req.body

  const { error } = await supabase
    .from('expenses')
    .insert({
      user_id: req.user.id,
      value,
      category,
      payment_method,
      installments,
      description,
      date
    })

  if (error) return res.status(400).json({ error: error.message })

  res.status(201).json({ success: true })
})

// Listar gastos
router.get('/', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })

  res.json(data)
})

export default router
