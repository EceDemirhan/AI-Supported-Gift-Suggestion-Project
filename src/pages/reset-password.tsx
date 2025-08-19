/* eslint-disable prettier/prettier */
import { useState } from "react";

import { useRouter } from "next/router";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const j = await r.json();
      setMsg(j.message || (r.ok ? "Şifre güncellendi." : "İşlem başarısız."));
      if (r.ok) setTimeout(() => router.push("/login"), 1500);
    } catch {
      setMsg("Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
        <img src="../assets/images/website-logo.png" alt="Logo" className="mx-auto my-4 w-40 h-auto" />
        <h1 className="text-lg font-semibold mb-3">Yeni Şifre Belirle</h1>
        {msg && <p className="mb-3 text-sm">{msg}</p>}
        <input
          type="password"
          placeholder="Yeni şifre (min 8 karakter)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />
        <button
          onClick={handleReset}
          disabled={loading || newPassword.length < 8 || !token}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
        </button>
      </div>
    </div>
  );
}
