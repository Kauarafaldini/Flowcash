import express from 'express'
import 'dotenv/config'

import expensesRoutes from './routes/expenses.routes.js'
import goalsRoutes from './routes/goals.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()
app.use(express.json())

app.use('/expenses', expensesRoutes)
app.use('/goals', goalsRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/admin', adminRoutes)

export default app
