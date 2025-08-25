/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

const PWD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/; // 8+, 1 küçük, 1 büyük, 1 sayı, 1 özel

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // form geçerliliği
  const isPwdValid = PWD_RULE.test(newPassword);
  const isMatch = newPassword === confirmPassword;
  const canSubmit = Boolean(token) && isPwdValid && isMatch && !loading;

  useEffect(() => {
    setErr('');
    setMsg('');
  }, [newPassword, confirmPassword]);

  const handleReset = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setErr('');
    setMsg('');
    try {
      const r = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j?.message || 'İşlem başarısız.');
      } else {
        setMsg(j?.message || 'Şifre güncellendi.');
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch {
      setErr('Sunucuya ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <img
          src="../assets/images/website-logo.png"
          alt="Logo"
          className="mx-auto my-6 w-40 h-auto -mt-10"
        />

        <h1 className="text-xl font-semibold text-center mb-6">Yeni Şifre Belirle</h1>

        {msg && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-green-700 text-sm">
            {msg}
          </div>
        )}
        {err && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm">
            {err}
          </div>
        )}

        {/* Şifre */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
          <div className="relative mt-1">
            <input
              type={showPwd1 ? 'text' : 'password'}
              placeholder="En az 8 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              aria-invalid={!isPwdValid && newPassword.length > 0}
              className={`w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                newPassword.length > 0 && !isPwdValid
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-red-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPwd1((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
              aria-label={showPwd1 ? 'Şifreyi gizle' : 'Şifreyi göster'}
            >
              {/* basit göz ikonu (SVG) */}
              {showPwd1 ? (
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

          <p
            className={`mt-1 text-xs ${
              isPwdValid || newPassword.length === 0 ? 'text-gray-500' : 'text-red-600'
            }`}
          >
            En az 8 karakter, 1 büyük, 1 küçük, 1 sayı ve 1 özel karakter içermelidir.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Şifre (Tekrar)</label>
          <div className="relative mt-1">
            <input
              type={showPwd2 ? 'text' : 'password'}
              placeholder="Şifreyi tekrar yazın"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              aria-invalid={!isMatch && confirmPassword.length > 0}
              className={`w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 ${
                confirmPassword.length > 0 && !isMatch
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-gray-300 focus:ring-red-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPwd2((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-gray-500 hover:text-gray-700"
              aria-label={showPwd2 ? 'Şifreyi gizle' : 'Şifreyi göster'}
            >
              {showPwd2 ? (
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
          {!isMatch && confirmPassword.length > 0 && (
            <p className="mt-1 text-xs text-red-600">Şifreler uyuşmuyor.</p>
          )}
        </div>

        <button
          onClick={handleReset}
          disabled={!canSubmit}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>
      </div>
    </div>
  );
}
