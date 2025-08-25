/* eslint-disable prettier/prettier */
import { useState, useMemo } from 'react';

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useDeviceType } from '../hooks/useDeviceType';

type Errors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

const PWD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/; // 8+, 1 küçük, 1 büyük, 1 sayı, 1 özel

export default function RegisterPage() {
  const router = useRouter();
  const { deviceType } = useDeviceType();

  const sizes = {
    mobile: {
      logo: 'clamp(200px, 26vw, 200px)',
      title: 'clamp(18px, 5vw, 26px)',
      label: 'clamp(12px, 3vw, 14px)',
      input: 'clamp(13px, 3.2vw, 15px)',
      btn: 'clamp(13px, 3.2vw, 15px)',
      note: 'clamp(11px, 2.8vw, 13px)',
      icon: 'clamp(16px, 4vw, 20px)',
      padY: 'clamp(8px, 2.2vw, 12px)',
      padX: 'clamp(12px, 4vw, 18px)',
      cardPad: 'clamp(14px, 4vw, 20px)',
      gap: 'clamp(8px, 3vw, 14px)',
      logoShift: 'clamp(6px, 2vw, 12px)',
    },
    tablet: {
      logo: 'clamp(100px, 18vw, 150px)',
      title: 'clamp(20px, 3.8vw, 28px)',
      label: 'clamp(12px, 2.2vw, 14px)',
      input: 'clamp(13px, 2.2vw, 15px)',
      btn: 'clamp(13px, 2.2vw, 15px)',
      note: 'clamp(11px, 2vw, 13px)',
      icon: 'clamp(16px, 2.4vw, 20px)',
      padY: 'clamp(8px, 1.8vw, 12px)',
      padX: 'clamp(12px, 2.4vw, 18px)',
      cardPad: 'clamp(16px, 2.6vw, 22px)',
      gap: 'clamp(8px, 2vw, 14px)',
      logoShift: 'clamp(6px, 1.6vw, 12px)',
    },
    laptop: {
      logo: 'clamp(120px, 14vw, 280px)',
      title: 'clamp(20px, 2vw, 28px)',
      label: 'clamp(12px, 1vw, 14px)',
      input: 'clamp(13px, 1vw, 15px)',
      btn: 'clamp(13px, 1vw, 15px)',
      note: 'clamp(11px, 0.8vw, 13px)',
      icon: 'clamp(16px, 1.2vw, 20px)',
      padY: 'clamp(8px, 0.8vw, 12px)',
      padX: 'clamp(12px, 1.2vw, 18px)',
      cardPad: 'clamp(16px, 1.2vw, 24px)',
      gap: 'clamp(8px, 1vw, 14px)',
      logoShift: 'clamp(4px, 0.8vw, 10px)',
    },
    desktop: {
      logo: 'clamp(140px, 12vw, 380px)',
      title: 'clamp(20px, 1.6vw, 38px)',
      label: 'clamp(12px, 0.8vw, 26px)',
      input: 'clamp(13px, 0.8vw, 18px)',
      btn: 'clamp(13px, 0.8vw, 18px)',
      note: 'clamp(11px, 0.6vw, 15px)',
      icon: 'clamp(16px, 1vw, 24px)',
      padY: 'clamp(8px, 0.6vw, 12px)',
      padX: 'clamp(12px, 1vw, 18px)',
      cardPad: 'clamp(16px, 1vw, 24px)',
      gap: 'clamp(8px, 0.8vw, 24px)',
      logoShift: 'clamp(4px, 0.6vw, 8px)',
    },
  } as const;

  const s = sizes[deviceType];

  const [form, setForm] = useState({
    ad: '',
    soyad: '',
    tel_no: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const isPwdValid = useMemo(() => PWD_RULE.test(form.password), [form.password]);
  const isMatch = useMemo(
    () => form.password === form.confirmPassword,
    [form.password, form.confirmPassword]
  );
  const canSubmit = !loading && form.email && isPwdValid && isMatch;

  const isPwdPresent = form.password.length > 0;
  const showPwdHint = isPwdPresent && !isPwdValid;

  const isConfirmPresent = form.confirmPassword.length > 0;
  const showConfirmError = isConfirmPresent && !isMatch;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s0) => ({ ...s0, [name]: value }));
    setErrors((s0) => ({ ...s0, [name]: undefined, general: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.email.trim()) e.email = 'E-posta zorunludur.';
    if (!isPwdValid)
      e.password = 'En az 8, 1 büyük, 1 küçük, 1 sayı ve 1 özel karakter içermelidir.';
    if (!isMatch) e.confirmPassword = 'Şifreler uyuşmuyor.';
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
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ad: form.ad || undefined,
          soyad: form.soyad || undefined,
          tel_no: form.tel_no || undefined,
          email: form.email.trim(),
          password: form.password,
        }),
      });

      let j: any = {};
      try {
        j = await r.json();
      } catch {
        // TODO: handle error
      }

      if (r.status === 409) {
        setErrors({ email: 'Bu e-posta zaten kayıtlı.' });
        return;
      }
      if (!r.ok) {
        setErrors({
          general: j?.message || 'Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin.',
        });
        if (j?.dev) console.error('REGISTER_DEV:', j.dev);
        return;
      }

      toast.success('Kayıt başarılı! E‑posta doğrulamasını tamamlayın.');
      setTimeout(() => router.push('/login'), 1200);
    } catch {
      setErrors({ general: 'Sunucuya ulaşılamadı. Lütfen birazdan tekrar deneyin.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-xl transition hover:shadow-2xl duration-300 relative"
        style={{ padding: s.cardPad }}
      >
        <img
          src="../assets/images/website-logo.png"
          alt="Logo"
          className="
            mx-auto -mt-10 object-contain
            transition-transform duration-500 ease-out
            hover:scale-110
          "
          style={{
            width: s.logo,
            height: 'auto',
            transform: `translateY(${s.logoShift}) scale(var(--tw-scale-x,1), var(--tw-scale-y,1))`,
            willChange: 'transform',
          }}
        />

        {errors.general && (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700"
            style={{ fontSize: s.note }}
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4" style={{ gap: s.gap } as any}>
          {/* Ad Soyad */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="ad"
              placeholder="Ad"
              className="border rounded-lg"
              onChange={onChange}
              autoComplete="given-name"
              style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
            />
            <input
              name="soyad"
              placeholder="Soyad"
              className="border rounded-lg"
              onChange={onChange}
              autoComplete="family-name"
              style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
            />
          </div>

          <input
            name="tel_no"
            placeholder="Telefon (opsiyonel)"
            className="w-full border rounded-lg"
            onChange={onChange}
            autoComplete="tel"
            style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
          />

          <div>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              required
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className={`w-full border rounded-lg ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
              onChange={onChange}
              style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
            />
            {errors.email && (
              <p className="mt-1 text-red-600" style={{ fontSize: s.note }}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPwd1 ? 'text' : 'password'}
                name="password"
                placeholder="Şifre"
                required
                autoComplete="new-password"
                aria-invalid={showPwdHint}
                className={`w-full border rounded-lg pr-10 ${
                  showPwdHint ? 'border-red-400' : 'border-gray-300'
                }`}
                onChange={onChange}
                style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
              />
              <button
                type="button"
                onClick={() => setShowPwd1((x) => !x)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
                aria-label={showPwd1 ? 'Şifreyi gizle' : 'Şifreyi göster'}
                style={{ lineHeight: 0 }}
              >
                {showPwd1 ? (
                  /* eye-off svg */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      d="M3 3l18 18M10.58 10.59A3 3 0 0012 15a3 3 0 002.42-4.41M9.88 5.1C10.56 5.03 11.27 5 12 5c6 0 9 5.5 9 5.5a14.8 14.8 0 01-3.06 3.58M6.59 6.58A14.8 14.8 0 003 10.5S6 16 12 16c1.03 0 2-.13 2.9-.36"
                    />
                  </svg>
                ) : (
                  /* eye svg */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeWidth="2" d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>

            {showPwdHint && (
              <p className="mt-1 text-red-600" style={{ fontSize: s.note }}>
                En az 8 karakter, 1 büyük, 1 küçük, 1 sayı ve 1 özel karakter içermelidir.
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={showPwd2 ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Şifre (tekrar)"
                required
                autoComplete="new-password"
                aria-invalid={showConfirmError}
                className={`w-full border rounded-lg pr-10 ${
                  showConfirmError ? 'border-red-400' : 'border-gray-300'
                }`}
                onChange={onChange}
                style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
              />
              <button
                type="button"
                onClick={() => setShowPwd2((x) => !x)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
                aria-label={showPwd2 ? 'Şifreyi gizle' : 'Şifreyi göster'}
                style={{ lineHeight: 0 }}
              >
                {/* eye svg */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path strokeWidth="2" d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>
              </button>
            </div>

            {showConfirmError && (
              <p className="mt-1 text-red-600" style={{ fontSize: s.note }}>
                Şifreler uyuşmuyor.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg disabled:opacity-60"
            style={{ fontSize: s.btn, padding: `${s.padY} ${s.padX}` }}
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-3 space-y-2" style={{ fontSize: s.note }}>
          <div className="rounded-md bg-gray-50" style={{ padding: s.padY }}>
            <div className="flex items-start gap-2">
              <ArrowRightOnRectangleIcon
                className="text-red-600"
                style={{ width: s.icon, height: s.icon }}
              />
              <div className="w-full text-center">
                <p className="text-gray-700">
                  <span className="font-medium">Zaten hesabınız var mı?</span> Giriş yapın.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="mt-1 text-red-600 hover:text-red-700 hover:underline"
                  style={{ fontSize: s.note }}
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
