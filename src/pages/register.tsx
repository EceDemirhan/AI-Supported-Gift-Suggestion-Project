/* eslint-disable prettier/prettier */
import { useState } from "react";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

type Errors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    tel_no: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
   
    setErrors((s) => ({ ...s, [name]: undefined, general: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.email) e.email = "E-posta zorunludur.";
    if (form.password.length < 8) e.password = "Şifre en az 8 karakter olmalıdır.";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Şifreler uyuşmuyor.";
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setLoading(true);
    setErrors({}); 
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ad: form.ad || undefined,
          soyad: form.soyad || undefined,
          tel_no: form.tel_no || undefined,
          email: form.email,
          password: form.password,
        }),
      });

      let j: any = {};
      try {
        j = await r.json();
      } catch {
        /* ignore */
      }

      if (r.status === 409) {
        
        setErrors({ email: "Bu e-posta zaten kayıtlı." });
        return;
      }
      if (!r.ok) {
        
        setErrors({ general: j?.message || "Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin." });
        
        if (j?.dev) console.error("REGISTER_DEV:", j.dev);
        return;
      }

      
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      setTimeout(() => router.push("/login"), 1200);
    } catch {
      setErrors({ general: "Sunucuya ulaşılamadı. Lütfen birazdan tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
        <img
          src="../assets/images/website-logo.png"
          alt="Logo"
          className="mx-auto my-6 w-60 h-auto -mt-10"
        />

      
        {errors.general && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700">
            {errors.general}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              name="ad"
              placeholder="Ad"
              className="border rounded-lg px-3 py-2"
              onChange={onChange}
              autoComplete="given-name"
            />
            <input
              name="soyad"
              placeholder="Soyad"
              className="border rounded-lg px-3 py-2"
              onChange={onChange}
              autoComplete="family-name"
            />
          </div>

          <input
            name="tel_no"
            placeholder="Telefon (opsiyonel)"
            className="w-full border rounded-lg px-3 py-2"
            onChange={onChange}
            autoComplete="tel"
          />

          <div>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              required
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
              onChange={onChange}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Şifre (min 8 karakter)"
              required
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.password ? "border-red-400" : "border-gray-300"
              }`}
              onChange={onChange}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Şifre (tekrar)"
              required
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              className={`w-full border rounded-lg px-3 py-2 ${
                errors.confirmPassword ? "border-red-400" : "border-gray-300"
              }`}
              onChange={onChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>
      </div>
    </div>
  );
}
