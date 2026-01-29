import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword, updatePassword, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [hasRecoveryToken, setHasRecoveryToken] = useState(false);

  const displayError = localError || error;

  // Check if we have a recovery token in the URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") && hash.includes("access_token")) {
      setHasRecoveryToken(true);
    }
  }, []);

  // Handle password reset request (when user enters email)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email) {
      setLocalError("Please enter your email");
      return;
    }

    try {
      clearError();
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed";
      setLocalError(message);
    }
  };

  // Handle password update (when user has recovery token)
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      clearError();
      await updatePassword(password);
      // Clear URL hash after successful update
      window.history.replaceState({}, document.title, window.location.pathname);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Password update failed";
      setLocalError(message);
    }
  };

  // If user has recovery token, show password update form
  if (hasRecoveryToken) {
    if (submitted) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -z-10" />
          <div className="w-full max-w-md">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 shadow-xl text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Senha atualizada!</h2>
              <p className="text-slate-300 mb-6">Sua senha foi alterada com sucesso. Você pode fazer login agora com a nova senha.</p>
              <Link to="/auth/login" className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200">
                Ir para Login
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
              <h1 className="text-2xl font-bold text-white">FlowCash</h1>
            </div>
            <p className="text-slate-400">Definir nova senha</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-2">Nova senha</h2>
            <p className="text-slate-400 text-sm mb-6">Digite sua nova senha para recuperar acesso à sua conta.</p>
            {displayError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{displayError}</p>
              </div>
            )}
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nova senha</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Confirmar senha</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-400">Senhas não conferem</p>}
              </div>
              <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors duration-200">
                {loading ? "Atualizando..." : "Atualizar senha"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 shadow-xl text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">E-mail enviado!</h2>
            <p className="text-slate-300 mb-6">Verifique sua caixa de e-mail e clique no link para resetar sua senha. O link expira em 24 horas.</p>
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-200">
                Não recebeu o e-mail?{" "}
                <button onClick={() => setSubmitted(false)} className="text-blue-400 hover:text-blue-300 font-semibold">
                  Tentar novamente
                </button>
              </p>
            </div>
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/auth/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
            <h1 className="text-2xl font-bold text-white">FlowCash</h1>
          </div>
          <p className="text-slate-400">Recuperar acesso à sua conta</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Resetar senha</h2>
          <p className="text-slate-400 text-sm mb-6">Digite seu e-mail e enviaremos um link para resetar sua senha.</p>
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{displayError}</p>
            </div>
          )}
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors" />
            </div>
            <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors duration-200">
              {loading ? "Enviando..." : "Enviar link de reset"}
            </button>
          </form>
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-200">💡 Para fins de demo, você pode resetar usando qualquer e-mail cadastrado no sistema.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
