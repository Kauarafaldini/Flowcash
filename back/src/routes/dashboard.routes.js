import { Router } from "express";

const router = Router();

/**
 * DASHBOARD RESUMO
 */
router.get("/summary", async (req, res) => {
  const supabase = req.supabase;
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("type, amount")
    .eq("user_id", userId);

  if (error) return res.status(500).json({ error: error.message });

  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === "income") income += Number(t.amount);
    if (t.type === "expense") expense += Number(t.amount);
  });

  res.json({
    income,
    expense,
    balance: income - expense
  });
});

/**
 * DASHBOARD GRÁFICO (6 MESES)
 */
router.get("/chart", async (req, res) => {
  const supabase = req.supabase;
  const userId = req.headers["x-user-id"];

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5);

  const { data, error } = await supabase
    .from("transactions")
    .select("type, amount, date")
    .eq("user_id", userId)
    .gte("date", sixMonthsAgo.toISOString());

  if (error) return res.status(500).json({ error: error.message });

  const grouped = {};

  data.forEach(t => {
    const month = new Date(t.date).toLocaleString("pt-BR", { month: "short" });

    if (!grouped[month]) {
      grouped[month] = { income: 0, expense: 0 };
    }

    grouped[month][t.type] += Number(t.amount);
  });

  res.json(grouped);
});

export default router;
