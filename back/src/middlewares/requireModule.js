export function requireModule(moduleKey) {
  return async (req, res, next) => {
    const supabase = req.supabase;
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Busca plano do usuário
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(403).json({ error: "Usuário inválido" });
    }

    // Busca módulos ativos para o plano
    const { data: module, error: moduleError } = await supabase
      .from("plan_modules")
      .select("*")
      .eq("plan", user.plan)
      .eq("module_key", moduleKey)
      .eq("enabled", true)
      .single();

    if (moduleError || !module) {
      return res.status(403).json({
        error: "Módulo não disponível para seu plano",
        module: moduleKey,
      });
    }

    next();
  };
}
