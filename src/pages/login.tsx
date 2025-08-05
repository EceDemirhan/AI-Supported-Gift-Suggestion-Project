/* eslint-disable prettier/prettier */
/* pages/login.tsx */
import { useState } from "react";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Geçici kullanıcı bilgisi
  const tempUser = {
    email: "test@example.com",
    password: "123456",
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === tempUser.email && password === tempUser.password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      toast.success("Giriş başarılı!");
      router.push("/"); // Anasayfaya yönlendir
    } else {
      toast.error("Hatalı e-posta ya da şifre");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Giriş Yap</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="123456"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
