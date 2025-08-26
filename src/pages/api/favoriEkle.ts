/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../lib/lib/db';

// POST /api/favoriEkle
// Body: { email?: string, user_id?: number, suggestion_id: number }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { email, user_id, suggestion_id } = req.body as {
      email?: string | null;
      user_id?: number | null;
      suggestion_id?: number | null;
    };

    if (!suggestion_id) {
      return res.status(400).json({ error: 'suggestion_id zorunludur.' });
    }

    let resolvedUserId: number | null = null;

    if (email) {
      const norm = String(email).trim().toLowerCase();

      
      const q = await pool.query('SELECT id FROM public.users WHERE email = $1', [norm]);
      if ((q.rowCount ?? 0) > 0) {
        resolvedUserId = q.rows[0].id;
      } else {
        const ins = await pool.query(
          `INSERT INTO public.users (email, "password", mail_verified)
           VALUES ($1, $2, TRUE)
           RETURNING id`,
          [norm, '']
        );
        resolvedUserId = ins.rows[0].id;
      }
    } else if (user_id) {
      // Eski istemciler için fallback (mümkünse artık kullanmıyoruz)
      const chk = await pool.query('SELECT 1 FROM public.users WHERE id=$1', [user_id]);
      if (chk.rowCount === 0) {
        return res.status(400).json({ error: 'Geçersiz user_id.' });
      }
      resolvedUserId = Number(user_id);
    } else {
      return res.status(400).json({ error: 'Kullanıcı bilgisi eksik (email veya user_id gereklidir).' });
    }

    // 2) Favoriye ekle — tekrar eklemelerde sessizce geç
    const favSql = `
      INSERT INTO public.favorites (user_id, suggestion_id, added_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id, suggestion_id) DO NOTHING
      RETURNING *;
    `;
    const fav = await pool.query(favSql, [resolvedUserId, suggestion_id]);

    
    if (fav.rowCount === 0) {
     
      return res.status(200).json({ message: 'Zaten favorilerde', already: true });
    }
    return res.status(200).json({ message: 'Favoriye eklendi', data: fav.rows[0] });
  } catch (error) {
    console.error('Favori ekleme hatası:', error);
    return res.status(500).json({ error: 'Veritabanına kayıt sırasında hata oluştu.' });
  }
}
