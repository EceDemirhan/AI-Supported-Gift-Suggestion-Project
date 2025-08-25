/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import crypto from 'crypto';

import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../../lib/lib/db';
import { sendVerificationEmail } from '../../../lib/lib/email';

type ApiBody = { code?: string; message?: string } | any;
const reply = (res: NextApiResponse<ApiBody>, status: number, code: string, message: string) =>
  res.status(status).json({ code, message });

// 8+, 1 küçük, 1 büyük, 1 sayı, 1 özel karakter
const PWD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiBody>) {
  if (req.method !== 'POST') {
    return reply(res, 405, 'METHOD_NOT_ALLOWED', 'Bu işlem için POST göndermelisiniz.');
  }

  const { email, password, ad, soyad, tel_no } = req.body || {};
  const e = String(email ?? '').trim();
  const p = String(password ?? '');

  if (!e || !p) {
    return reply(res, 400, 'VALIDATION', 'E-posta ve şifre zorunludur.');
  }
  // Sunucu tarafı parola kuralı
  if (!PWD_RULE.test(p)) {
    return reply(
      res,
      400,
      'WEAK_PASSWORD',
      'Şifre en az 8 karakter olmalı ve 1 büyük, 1 küçük, 1 sayı ve 1 özel karakter içermelidir.'
    );
  }

  const telRaw = String(tel_no ?? '').trim();
  const telDigits = telRaw ? telRaw.replace(/[^\d]/g, '') : '';
  const tel = telDigits && telDigits.length >= 7 && telDigits.length <= 15 ? telDigits : null;

  const _ad = ad ? String(ad).trim().slice(0, 80) : null;
  const _soyad = soyad ? String(soyad).trim().slice(0, 80) : null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const dupe = await client.query(
      'SELECT 1 FROM public.users WHERE lower(email)=lower($1) LIMIT 1',
      [e]
    );
    if (dupe.rowCount && dupe.rowCount > 0) {
      await client.query('ROLLBACK');
      return reply(res, 409, 'EMAIL_EXISTS', 'Bu e-posta zaten kayıtlı.');
    }

    const ins = await client.query(
      `INSERT INTO public.users (email, "password", ad, soyad, tel_no, mail_verified)
       VALUES ($1, crypt($2, gen_salt('bf', 12)), $3, $4, $5, false)
       RETURNING id, email, ad, soyad, created_at`,
      [e, p, _ad, _soyad, tel]
    );

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    await client.query(
      `UPDATE public.users
         SET verify_token=$1,
             verify_expires_at=$2
       WHERE id=$3`,
      [token, expiresAt, ins.rows[0].id]
    );

    const base = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const link = `${base}/verify?token=${encodeURIComponent(token)}`;

    await sendVerificationEmail(e, link);

    await client.query('COMMIT');

    return res.status(201).json({
      user: ins.rows[0],
      message: 'Kayıt oluşturuldu. Lütfen e-postanızı doğrulayın.',
    });
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // TODO: handle error
    }
    console.error('REGISTER_ERR:', err);
    return reply(
      res,
      500,
      'SERVER_ERROR',
      'Şu anda kayıt işlemi yapılamıyor. Lütfen birazdan tekrar deneyin.'
    );
  } finally {
    client.release();
  }
}
