/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../../lib/lib/db';

type ApiBody = { code?: string; message?: string } | any;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiBody>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED', message: 'POST gönderin.' });
  }

  const { token } = req.body || {};
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ code: 'VALIDATION', message: 'Token gereklidir.' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, verify_expires_at, mail_verified
         FROM public.users
        WHERE verify_token=$1
        LIMIT 1`,
      [token]
    );

    if (!rows.length) {
      return res
        .status(400)
        .json({ code: 'INVALID_TOKEN', message: 'Geçersiz veya kullanılmış bağlantı.' });
    }

    const u = rows[0];
    if (u.mail_verified) {
      return res.status(200).json({ message: 'E-posta zaten doğrulanmış.' });
    }

    if (!u.verify_expires_at || new Date(u.verify_expires_at).getTime() < Date.now()) {
      return res
        .status(400)
        .json({ code: 'EXPIRED', message: 'Doğrulama bağlantısının süresi dolmuş.' });
    }

    await pool.query(
      `UPDATE public.users
          SET mail_verified=true,
              verify_token=NULL,
              verify_expires_at=NULL
        WHERE id=$1`,
      [u.id]
    );

    return res.status(200).json({ message: 'E-posta doğrulandı. Artık giriş yapabilirsiniz.' });
  } catch (e) {
    console.error('VERIFY_ERR:', e);
    return res.status(500).json({ code: 'SERVER_ERROR', message: 'Sunucu hatası.' });
  }
}
