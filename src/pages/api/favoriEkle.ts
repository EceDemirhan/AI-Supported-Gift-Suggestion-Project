// /pages/api/favoriEkle.ts
/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../lib/lib/db';

// eslint-disable-next-line consistent-return
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { user_id, suggestion_id } = req.body;

  if (!user_id || !suggestion_id) {
    return res.status(400).json({ error: 'Gerekli bilgiler eksik.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, suggestion_id, added_at)
       VALUES ($1, $2, NOW()) RETURNING *`,
      [user_id, suggestion_id]
    );

    res.status(200).json({ message: 'Favoriye eklendi', data: result.rows[0] });
  } catch (error) {
    console.error('Favori ekleme hatası:', error);
    res.status(500).json({ error: 'Veritabanına kayıt sırasında hata oluştu.' });
  }
}
