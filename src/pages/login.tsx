/* eslint-disable prettier/prettier */
/* pages/login.tsx */
import { useState } from "react";

import { useRouter } from "next/router";
import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const tempUser = {
    email: "ece@gmail.com",
    password: "123456",
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === tempUser.email && password === tempUser.password) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      toast.success("Giriş başarılı!");
      router.push("/");
    } else {
      toast.error("Hatalı e-posta ya da şifre");
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
       

      

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
         <button
  type="submit"
  className="w-full bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white font-semibold py-2 rounded-lg transition"
>
  Giriş Yap
</button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
