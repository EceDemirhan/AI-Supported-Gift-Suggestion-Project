/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from "next";

import pool from "../../../lib/lib/db";

type ApiBody = { code: string; message: string } | any;
const reply = (res: NextApiResponse<ApiBody>, status: number, code: string, message: string) =>
  res.status(status).json({ code, message });

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiBody>) {
  if (req.method !== "POST") {
    return reply(res, 405, "METHOD_NOT_ALLOWED", "Bu işlem için POST göndermeniz gerekir.");
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return reply(res, 400, "VALIDATION", "E-posta ve şifre zorunludur.");
  }

  try {
    
    const q = await pool.query(
      `SELECT id, email, ad, soyad
         FROM public.users
        WHERE email = $1
          AND "password" = crypt($2, "password")
        LIMIT 1`,
      [email, password]
    );

    if (q.rowCount === 0) {
      return reply(res, 401, "INVALID_CREDENTIALS", "E-posta veya şifre hatalı.");
    }

    return res.status(200).json({ user: q.rows[0] });
  } catch (e: any) {
    console.error("LOGIN_ERR:", e);
    return reply(res, 500, "SERVER_ERROR", "Şu anda giriş yapılamıyor. Lütfen birazdan tekrar deneyin.");
  }
}
