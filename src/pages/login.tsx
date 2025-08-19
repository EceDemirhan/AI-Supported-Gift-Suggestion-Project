/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* pages/login.tsx */
import { useEffect, useState } from "react";

import {
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // forgot states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Enter tuşu ile submit
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading && !showForgot) {
        const btn = document.getElementById("login-submit");
        (btn as HTMLButtonElement)?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, showForgot]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (loading) return;

    setErr(null);
    setLoading(true);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let j: any = {};
      try {
        j = await r.json();
      } catch {
        /* ignore */
      }

      if (!r.ok) {
        setErr(
          j?.message ||
            (r.status === 401 ? "E-posta veya şifre hatalı." : "Giriş başarısız.")
        );
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
    if (forgotLoading) return;
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
            <div className="relative mt-1">
              <input
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                aria-invalid={Boolean(err && /şifre/i.test(err))}
                className={`w-full px-4 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  err && /şifre/i.test(err) ? "border-red-400" : "border-gray-300"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                aria-label={showPwd ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPwd ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>

<div className="mt-3 space-y-2 text-xs">
  <div className="rounded-md bg-gray-50 p-2">
    <div className="flex items-start gap-2">
      <UserPlusIcon className="h-6 w-6 text-red-600 mt-0.5" />
      <div className="text-xs text-center w-full">
        <p className="text-gray-700">
          <span className="font-medium">Hesabınız yok mu?</span> Hemen kayıt olun.
        </p>
    <button
  type="button"
  onClick={() => router.push("/register")}
  className="mt-2 text-red-600 hover:text-red-700 hover:underline"
>
  Kayıt Ol
</button>
      </div>
    </div>
  </div>

  <div className="rounded-md bg-gray-50 p-2">
    <div className="flex items-start gap-2">
      <KeyIcon className="h-6 w-6 text-red-600 mt-0.5" />
      <div className="text-center w-full text-xs"> 
        <p className="text-gray-700">
          <span className="font-medium">Şifrenizi mi unuttunuz?</span> Mail adresinize link gönderelim.
        </p>
        <button
          type="button"
          onClick={() => {
            setShowForgot(true);
            setForgotMsg("");
            setForgotEmail(email || "");
          }}
          className="mt-1 text-red-600 hover:text-red-700 hover:underline"
        >
          Şifremi Unuttum
        </button>
      </div>
    </div>
  </div>
</div>


        </form>

        
        {showForgot && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl">
              <h2 className="text-lg font-semibold mb-3 text-center">Şifre Sıfırlama Talebi</h2>
              {forgotMsg && (
                <p className="mb-2 text-sm text-gray-700 text-center">{forgotMsg}</p>
              )}
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowForgot(false);
                    setForgotMsg("");
                  }}
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
