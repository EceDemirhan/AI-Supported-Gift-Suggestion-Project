/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* pages/login.tsx */
import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon, UserPlusIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useDeviceType } from '../hooks/useDeviceType';

const LoginPage = () => {
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !loading && !showForgot) {
        const btn = document.getElementById('login-submit');
        (btn as HTMLButtonElement)?.click();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loading, showForgot]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (loading) return;

    setErr(null);
    setLoading(true);

    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let j: any = {};
      try {
        j = await r.json();
      } catch {
        // TODO: handle error
      }

      if (!r.ok) {
        setErr(
          j?.message || (r.status === 401 ? 'E-posta veya şifre hatalı.' : 'Giriş başarısız.')
        );
        if (j?.dev) console.error('LOGIN_DEV:', j.dev);
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', j.user?.email || email);
      toast.success('Giriş başarılı!');
      router.push('/');
    } catch {
      setErr('Şu anda giriş yapılamıyor. Lütfen birazdan tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (forgotLoading) return;
    setForgotLoading(true);
    setForgotMsg('');
    try {
      const r = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const j = await r.json();
      setForgotMsg(j?.message || 'Eğer hesap varsa, e‑posta gönderildi.');
    } catch {
      setForgotMsg('Sunucuya ulaşılamadı.');
    } finally {
      setForgotLoading(false);
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

        {err && (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700"
            style={{ fontSize: s.note }}
          >
            {err}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5" style={{ gap: s.gap } as any}>
          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
              E‑posta
            </label>
            <input
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(err && /e-?posta/i.test(err))}
              className={`w-full mt-1 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                err && /e-?posta/i.test(err) ? 'border-red-400' : 'border-gray-300'
              }`}
              style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
              Şifre
            </label>
            <div className="relative mt-1">
              <input
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                aria-invalid={Boolean(err && /şifre/i.test(err))}
                className={`w-full pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  err && /şifre/i.test(err) ? 'border-red-400' : 'border-gray-300'
                }`}
                style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}` }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                // eslint-disable-next-line @typescript-eslint/no-shadow
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                aria-label={showPwd ? 'Şifreyi gizle' : 'Şifreyi göster'}
                style={{ lineHeight: 0 }}
              >
                {showPwd ? (
                  <EyeSlashIcon style={{ width: s.icon, height: s.icon }} />
                ) : (
                  <EyeIcon style={{ width: s.icon, height: s.icon }} />
                )}
              </button>
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white font-semibold rounded-lg transition disabled:opacity-60"
            style={{ fontSize: s.btn, padding: `${s.padY} ${s.padX}` }}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>

          <div className="space-y-2">
            <div className="rounded-md bg-gray-50" style={{ padding: s.padY }}>
              <div className="flex items-start gap-2">
                <UserPlusIcon
                  className="text-red-600 mt-0.5"
                  style={{ width: s.icon, height: s.icon }}
                />
                <div className="text-center w-full" style={{ fontSize: s.note }}>
                  <p className="text-gray-700">
                    <span className="font-medium">Hesabınız yok mu?</span> Hemen kayıt olun.
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="mt-2 text-red-600 hover:text-red-700 hover:underline"
                    style={{ fontSize: s.note }}
                  >
                    Kayıt Ol
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-gray-50" style={{ padding: s.padY }}>
              <div className="flex items-start gap-2">
                <KeyIcon
                  className="text-red-600 mt-0.5"
                  style={{ width: s.icon, height: s.icon }}
                />
                <div className="text-center w-full" style={{ fontSize: s.note }}>
                  <p className="text-gray-700">
                    <span className="font-medium">Şifrenizi mi unuttunuz?</span> Mail adresinize
                    link gönderelim.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(true);
                      setForgotMsg('');
                      setForgotEmail(email || '');
                    }}
                    className="mt-1 text-red-600 hover:text-red-700 hover:underline"
                    style={{ fontSize: s.note }}
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
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-sm"
              style={{ padding: s.cardPad }}
            >
              <h2 className="font-semibold mb-3 text-center" style={{ fontSize: s.title }}>
                Şifre Sıfırlama Talebi
              </h2>
              {forgotMsg && (
                <p className="mb-2 text-gray-700 text-center" style={{ fontSize: s.note }}>
                  {forgotMsg}
                </p>
              )}
              <input
                type="email"
                placeholder="E‑posta adresiniz"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full border rounded-lg"
                style={{ fontSize: s.input, padding: `${s.padY} ${s.padX}`, marginBottom: s.padY }}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowForgot(false);
                    setForgotMsg('');
                  }}
                  className="text-gray-600"
                  style={{ fontSize: s.note, padding: `${s.padY} ${s.padX}` }}
                >
                  Kapat
                </button>
                <button
                  onClick={handleForgot}
                  disabled={forgotLoading || !forgotEmail}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60"
                  style={{ fontSize: s.note, padding: `${s.padY} ${s.padX}` }}
                >
                  {forgotLoading ? 'Gönderiliyor...' : 'Gönder'}
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
