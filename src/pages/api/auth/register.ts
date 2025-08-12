/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from "next";

import pool from "../../../lib/lib/db";

type ApiBody = { code: string; message: string } | any;
const reply = (res: NextApiResponse<ApiBody>, status: number, code: string, message: string) =>
  res.status(status).json({ code, message });

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiBody>) {
  if (req.method !== "POST") {
    return reply(res, 405, "METHOD_NOT_ALLOWED", "Bu işlem için POST göndermelisiniz.");
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { email, password, ad, soyad, tel_no } = req.body || {};
  if (!email || !password) {
    return reply(res, 400, "VALIDATION", "E-posta ve şifre zorunludur.");
  }

  const tel = tel_no && String(tel_no).trim() !== "" ? String(tel_no).replace(/[^\d]/g, "") : null;

  try {
    const dupe = await pool.query(
      "SELECT 1 FROM public.users WHERE lower(email)=lower($1) LIMIT 1",
      [email]
    );
    if (dupe.rowCount && dupe.rowCount > 0) {
      return reply(res, 409, "EMAIL_EXISTS", "Bu e-posta zaten kayıtlı.");
    }

   
    const ins = await pool.query(
      `INSERT INTO public.users (email, "password", ad, soyad, tel_no)
       VALUES ($1, crypt($2, gen_salt('bf', 12)), $3, $4, $5)
       RETURNING id, email, ad, soyad, created_at`,
      [email, password, ad || null, soyad || null, tel]
    );

    return res.status(201).json({ user: ins.rows[0] });
  } catch (e: any) {
    console.error("REGISTER_ERR:", e);
    return reply(res, 500, "SERVER_ERROR", "Şu anda kayıt işlemi yapılamıyor. Lütfen birazdan tekrar deneyin.");
  }
}
