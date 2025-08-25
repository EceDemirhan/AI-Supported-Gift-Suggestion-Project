/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;

  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!token || typeof token !== 'string') return;
    (async () => {
      setStatus('loading');
      try {
        const r = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const j = await r.json();
        if (!r.ok) {
          setStatus('error');
          setMsg(j?.message || 'Doğrulama başarısız.');
          return;
        }
        setStatus('ok');
        setMsg(j?.message || 'E-posta doğrulandı.');
      } catch {
        setStatus('error');
        setMsg('Sunucuya ulaşılamadı.');
      }
    })();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl text-center">
        <img
          src="../assets/images/website-logo.png"
          alt="Logo"
          className="mx-auto my-6 w-48 h-auto -mt-10"
        />
        <h1 className="text-xl font-semibold mb-4">E-posta Doğrulama</h1>

        {status === 'loading' && <p className="text-gray-600">Doğrulanıyor...</p>}

        {status === 'ok' && <p className="text-green-700 font-medium">{msg}</p>}

        {status === 'error' && <p className="text-red-700 font-medium">{msg}</p>}

        <button
          onClick={() => router.push('/login')}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}
