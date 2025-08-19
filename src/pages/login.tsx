/* eslint-disable prettier/prettier */
/* pages/login.tsx */
import { useState } from "react";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // forgot states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let j: any = {};
      try { j = await r.json(); } catch { /* ignore */ }

      if (!r.ok) {
        setErr(j?.message || (r.status === 401 ? "E-posta veya şifre hatalı." : "Giriş başarısız."));
        if (j?.dev) console.error("LOGIN_DEV:", j.dev);
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", j.user?.email || email);
      toast.success("Giriş başarılı!");
      router.push("/");
    } catch {
      setErr("Şu anda giriş yapılamıyor. Lütfen birazdan tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setForgotLoading(true);
    setForgotMsg("");
    try {
      const r = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const j = await r.json();
      setForgotMsg(j?.message || "Eğer hesap varsa, e‑posta gönderildi.");
    } catch {
      setForgotMsg("Sunucuya ulaşılamadı.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl transition hover:shadow-2xl duration-300 relative">
        <img
          src="../assets/images/website-logo.png"
          alt="Logo"
          className="mx-auto my-6 w-60 h-auto -mt-10 transition-transform duration-300 ease-in-out hover:scale-110"
        />

        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(err && /e-?posta/i.test(err))}
              className={`w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                err && /e-?posta/i.test(err) ? "border-red-400" : "border-gray-300"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(err && /şifre/i.test(err))}
              className={`w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                err && /şifre/i.test(err) ? "border-red-400" : "border-gray-300"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <button
              type="button"
              onClick={() => { setShowForgot(true); setForgotMsg(""); setForgotEmail(email || ""); }}
              className="text-red-600 hover:underline"
            >
              Şifremi Unuttum
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/register" className="text-red-600 hover:underline">Kayıt Ol</a>
          </div>
        </form>

        
        {showForgot && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
              <h2 className="text-lg font-semibold mb-3 text-center">Şifre Sıfırlama Talbei</h2>
              {forgotMsg && <p className="mb-2 text-sm text-gray-700 text-center">{forgotMsg}</p>}
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowForgot(false); setForgotMsg(""); }}
                  className="px-3 py-2 text-gray-600"
                >
                  Kapat
                </button>
                <button
                  onClick={handleForgot}
                  disabled={forgotLoading || !forgotEmail}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60"
                >
                  {forgotLoading ? "Gönderiliyor..." : "Gönder"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
