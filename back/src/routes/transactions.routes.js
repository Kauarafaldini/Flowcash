import { Router } from "express";

const router = Router();

/**
 * Criar transação (com ou sem parcelas)
 */
router.post("/", async (req, res) => {
  const supabase = req.supabase;

  const {
    user_id,
    type, // "income" | "expense"
    title,
    amount,
    category,
    date,
    installments = 1,
  } = req.body;

  if (!user_id || !type || !title || !amount || !date) {
    return res.status(400).json({ error: "Dados obrigatórios faltando" });
  }

  try {
    const transactions = [];

    for (let i = 0; i < installments; i++) {
      const installmentDate = new Date(date);
      installmentDate.setMonth(installmentDate.getMonth() + i);

      transactions.push({
        user_id,
        type,
        title: installments > 1 ? `${title} (${i + 1}/${installments})` : title,
        amount: amount / installments,
        category,
        date: installmentDate.toISOString(),
        installment_number: i + 1,
        total_installments: installments,
      });
    }

    const { error } = await supabase
      .from("transactions")
      .insert(transactions);

    if (error) throw error;

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Listar transações (filtro por mês/ano)
 * /transactions?user_id=123&month=1&year=2026
 */
router.get("/", async (req, res) => {
  const supabase = req.supabase;
  const { user_id, month, year } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id é obrigatório" });
  }

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user_id)
    .order("date", { ascending: false });

  if (month && year) {
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 0, 23, 59, 59).toISOString();

    query = query.gte("date", start).lte("date", end);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

/**
 * Deletar transação
 */
router.delete("/:id", async (req, res) => {
  const supabase = req.supabase;
  const { id } = req.params;

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

export default router;
