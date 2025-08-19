/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from "next";

import pool from "../../../lib/lib/db";

const PWD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "POST göndermelisiniz." });
  }

  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Eksik veri." });
  }

  
  if (!PWD_RULE.test(String(newPassword))) {
    return res.status(400).json({
      message:
        "Şifre en az 8 karakter olmalı ve 1 büyük, 1 küçük, 1 sayı ve 1 özel karakter içermelidir.",
    });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, reset_expires_at FROM public.users WHERE reset_token=$1 LIMIT 1`,
      [token]
    );
    if (!rows.length) {
      return res.status(400).json({ message: "Geçersiz bağlantı." });
    }
    const u = rows[0];
    if (!u.reset_expires_at || new Date(u.reset_expires_at).getTime() < Date.now()) {
      return res.status(400).json({ message: "Bağlantının süresi dolmuş." });
    }

    await pool.query(
      `UPDATE public.users
         SET "password" = crypt($1, gen_salt('bf', 12)),
             reset_token=NULL,
             reset_expires_at=NULL
       WHERE id=$2`,
      [newPassword, u.id]
    );

    return res.status(200).json({ message: "Şifre güncellendi. Artık giriş yapabilirsiniz." });
  } catch (e) {
    console.error("RESET_ERR:", e);
    return res.status(500).json({ message: "Sunucu hatası." });
  }
}
