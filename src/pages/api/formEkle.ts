/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../lib/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Sadece POST istekleri destekleniyor' });
  }

  try {
    const {
      
      email,       
      kullanici_id,    
      kime_hediye,
      neden_hediye,
      yas,
      cinsiyet,
      burc,
      sevdigi_medya,
      hobiler,
      kategori_tercihleri,
    } = req.body as {
      email?: string | null;
      kullanici_id?: number | null;
      kime_hediye?: string | null;
      neden_hediye?: string | null;
      yas?: number | string | null;
      cinsiyet?: string | null;
      burc?: string | null;
      sevdigi_medya?: string | null;
      hobiler?: string | null;
      kategori_tercihleri?: unknown;
    };

 
    let userId: number | null = null;

    if (kullanici_id != null) {
      const maybe = Number(kullanici_id);
      if (!Number.isNaN(maybe)) {
        const chk = await pool.query('SELECT 1 FROM public.users WHERE id = $1', [maybe]);
        if ((chk.rowCount ?? 0) > 0) userId = maybe;
      }
    }

    
    if (userId === null && email) {
      const norm = String(email).trim().toLowerCase();
      const q = await pool.query('SELECT id FROM public.users WHERE email = $1', [norm]);
      if ((q.rowCount ?? 0) > 0) {
        userId = q.rows[0].id as number;
      } else {
        // users.password NOT NULL olduğu için boş string veriyoruz; mail_verified=true
        const ins = await pool.query(
          `INSERT INTO public.users (email, "password", mail_verified)
           VALUES ($1, $2, TRUE)
           RETURNING id`,
          [norm, '']
        );
        userId = ins.rows[0].id as number;
      }
    }

    if (userId === null) {
      return res.status(400).json({ error: 'Kullanıcı bulunamadı. Lütfen giriş yapın ya da email gönderin.' });
    }

    const kime_alinacak      = String(kime_hediye ?? '').trim();
    const ne_icin_alinacak   = String(neden_hediye ?? '').trim();
    const _cinsiyet          = String(cinsiyet ?? '').trim();
    const _yas               = yas === '' || yas == null ? null : Number(yas);
    const sevdigi_dizi_muzik = String(sevdigi_medya ?? '').trim();
    const _burc              = String(burc ?? '').trim();
    const _hobiler           = String(hobiler ?? '').trim();


    const _kategori =
      typeof kategori_tercihleri === 'object' && kategori_tercihleri !== null
        ? JSON.stringify(kategori_tercihleri)
        : String(kategori_tercihleri ?? '').trim();

    const sql = `
      INSERT INTO public.gift_requests
        (user_id, kime_alinacak, ne_icin_alinacak, cinsiyet, yas, sevdigi_dizi_muzik, burc, hobiler, kategori_tercihleri)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id
    `;
    const params = [
      userId,
      kime_alinacak,
      ne_icin_alinacak,
      _cinsiyet,
      _yas,
      sevdigi_dizi_muzik,
      _burc,
      _hobiler,
      _kategori,
    ];

    const ins = await pool.query(sql, params);
    return res.status(200).json({ ok: true, request_id: ins.rows[0].id });
  } catch (error) {
    console.error('Veritabanı ekleme hatası:', error);
    return res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  }
}
