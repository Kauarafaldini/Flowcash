import "dotenv/config"; // 👈 SEMPRE NO TOPO

import express from "express";
import cors from "cors";
import { supabase } from "./supabase.js";

import transactions from "./routes/transactions.routes.js";
import goals from "./routes/goals.routes.js";
import modules from "./routes/modules.routes.js";
import admin from "./routes/admin.routes.js";
import dashboard from "./routes/dashboard.routes.js";
import auth from "./routes/auth.routes.js";
import expenses from "./routes/expenses.routes.js";

const app = express();
const PORT = process.env.PORT || 3333;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Injeta o supabase em todas as rotas
app.use((req, _, next) => {
  req.supabase = supabase;
  next();
});

// Rota de health check (muito importante)
app.get("/", (_, res) => {
  res.json({ status: "ok", api: "FlowCash API 🚀" });
});

// Rotas
app.use("/transactions", transactions);
app.use("/goals", goals);
app.use("/modules", modules);
app.use("/admin", admin);
app.use("/dashboard", dashboard);
app.use("/auth", auth);
app.use("/expenses", expenses);

// Rota de diagnóstico (antes das outras para não precisar de auth)
app.get("/diagnostics", async (req, res) => {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      message: "Execute o schema.sql no Supabase primeiro se as tabelas não existirem",
      checks: {}
    }

    // Verificar conexão com Supabase
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      diagnostics.checks.users_table = error ? `ERROR: ${error.message}` : 'OK - Tabela existe'
    } catch (err) {
      diagnostics.checks.users_table = `ERROR: ${err.message}`
    }

    // Verificar tabela expenses
    try {
      const { data, error } = await supabase.from('expenses').select('count').limit(1)
      diagnostics.checks.expenses_table = error ? `ERROR: ${error.message}` : 'OK - Tabela existe'
    } catch (err) {
      diagnostics.checks.expenses_table = `ERROR: ${err.message}`
    }

    res.json(diagnostics)
  } catch (err) {
    res.status(500).json({ error: 'Erro no diagnóstico', details: err.message })
  }
});


// Middleware de erro global (opcional, mas recomendado)
app.use((err, req, res, next) => {
  console.error("🔥 Erro:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 FlowCash API running on port ${PORT}`);
});
