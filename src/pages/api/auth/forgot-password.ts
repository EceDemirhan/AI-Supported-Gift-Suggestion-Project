/* eslint-disable prettier/prettier */
import crypto from 'crypto';

import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../../lib/lib/db';
import { sendResetEmail } from '../../../lib/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'POST göndermelisiniz.' });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'E-posta gereklidir.' });

  try {
    const { rows } = await pool.query(
      `SELECT id FROM public.users WHERE lower(email)=lower($1) LIMIT 1`,
      [email]
    );

    if (!rows.length)
      return res.status(200).json({ message: 'Eğer hesap varsa, e‑posta gönderildi.' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await pool.query(`UPDATE public.users SET reset_token=$1, reset_expires_at=$2 WHERE id=$3`, [
      token,
      expiresAt,
      rows[0].id,
    ]);

    const base = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const link = `${base}/reset-password?token=${encodeURIComponent(token)}`;

    await sendResetEmail(email, link);
    return res.status(200).json({ message: 'Eğer hesap varsa, e‑posta gönderildi.' });
  } catch (e) {
    console.error('FORGOT_ERR:', e);
    return res.status(500).json({ message: 'Sunucu hatası.' });
  }
}
