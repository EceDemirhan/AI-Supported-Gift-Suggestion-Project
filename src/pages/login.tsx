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
      try { j = await r.json(); } catch { /* boş bırak */ }

      if (!r.ok) {
        // kullanıcıya sade mesaj
        setErr(j?.message || (r.status === 401 ? "E-posta veya şifre hatalı." : "Giriş başarısız."));
       
        if (j?.dev) {
          // eslint-disable-next-line no-console
          console.error("LOGIN_DEV:", j.dev);
        }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl transition hover:shadow-2xl duration-300">
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


          <div className="text-center text-sm text-gray-500">
            Hesabın yok mu?{" "}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/register" className="text-red-600 hover:underline">Kayıt Ol</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
