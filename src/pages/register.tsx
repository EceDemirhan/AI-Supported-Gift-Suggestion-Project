/* eslint-disable prettier/prettier */
import { useState, useMemo } from "react";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

type Errors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

const PWD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/; // 8+, 1 küçük, 1 büyük, 1 sayı, 1 özel

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
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const isPwdValid = useMemo(() => PWD_RULE.test(form.password), [form.password]);
  const isMatch = useMemo(() => form.password === form.confirmPassword, [form.password, form.confirmPassword]);
  const canSubmit = !loading && form.email && isPwdValid && isMatch;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((s) => ({ ...s, [name]: undefined, general: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.email.trim()) e.email = "E-posta zorunludur.";
    if (!isPwdValid)
      e.password = "En az 8, 1 büyük, 1 küçük, 1 sayı ve 1 özel karakter içermelidir.";
    if (!isMatch) e.confirmPassword = "Şifreler uyuşmuyor.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
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
          email: form.email.trim(),
          password: form.password,
        }),
      });

      let j: any = {};
      try { j = await r.json(); } catch {}

      if (r.status === 409) {
        setErrors({ email: "Bu e-posta zaten kayıtlı." });
        return;
      }
      if (!r.ok) {
        setErrors({ general: j?.message || "Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin." });
        if (j?.dev) console.error("REGISTER_DEV:", j.dev);
        return;
      }

      toast.success("Kayıt başarılı! E‑posta doğrulamasını tamamlayın.");
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

          {/* Şifre */}
          <div>
            <div className="relative">
              <input
                type={showPwd1 ? "text" : "password"}
                name="password"
                placeholder="Şifre (min 8, 1 büyük, 1 küçük, 1 sayı, 1 özel)"
                required
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                className={`w-full border rounded-lg px-3 py-2 pr-10 ${
                  errors.password ? "border-red-400" : "border-gray-300"
                }`}
                onChange={onChange}
              />
              <button
                type="button"
                onClick={() => setShowPwd1((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
                aria-label={showPwd1 ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPwd1 ? (
                  // eye-off
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M3 3l18 18M10.58 10.59A3 3 0 0012 15a3 3 0 002.42-4.41M9.88 5.1C10.56 5.03 11.27 5 12 5c6 0 9 5.5 9 5.5a14.8 14.8 0 01-3.06 3.58M6.59 6.58A14.8 14.8 0 003 10.5S6 16 12 16c1.03 0 2-.13 2.9-.36" />
                  </svg>
                ) : (
                  // eye
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
            <p className={`mt-1 text-xs ${isPwdValid || !form.password ? "text-gray-500" : "text-red-600"}`}>
              En az 8 karakter, 1 büyük, 1 küçük, 1 sayı ve 1 özel karakter içermelidir.
            </p>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPwd2 ? "text" : "password"}
                name="confirmPassword"
                placeholder="Şifre (tekrar)"
                required
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                className={`w-full border rounded-lg px-3 py-2 pr-10 ${
                  errors.confirmPassword ? "border-red-400" : "border-gray-300"
                }`}
                onChange={onChange}
              />
              <button
                type="button"
                onClick={() => setShowPwd2((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
                aria-label={showPwd2 ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {showPwd2 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M3 3l18 18M10.58 10.59A3 3 0 0012 15a3 3 0 002.42-4.41M9.88 5.1C10.56 5.03 11.27 5 12 5c6 0 9 5.5 9 5.5a14.8 14.8 0 01-3.06 3.58M6.59 6.58A14.8 14.8 0 003 10.5S6 16 12 16c1.03 0 2-.13 2.9-.36" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
            {!isMatch && form.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Şifreler uyuşmuyor.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>

     
        <div className="mt-3 space-y-2 text-xs">
          <div className="rounded-md bg-gray-50 p-2">
            <div className="flex items-start gap-2">
              <ArrowRightOnRectangleIcon  className="h-6 w-6 text-red-600" />
              <div className="w-full text-center">
                <p className="text-gray-700">
                  <span className="font-medium">Zaten hesabınız var mı?</span> Giriş yapın.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="mt-1 text-red-600 hover:text-red-700 hover:underline"
                >
                  Giriş Yap
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
