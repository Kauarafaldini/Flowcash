export async function adminMiddleware(req, res, next) {
  const { data: profile } = await req.supabase
    .from("users")
    .select("role")
    .eq("id", req.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado" });
  }

  next();
}
