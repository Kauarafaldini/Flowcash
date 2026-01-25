import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/me", authMiddleware, async (req, res) => {
  const { data } = await req.supabase
    .from("user_modules")
    .select("enabled, modules(slug)")
    .eq("user_id", req.user.id);

  res.json(data);
});

export default router;
