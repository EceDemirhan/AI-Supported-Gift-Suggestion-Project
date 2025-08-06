/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../lib/lib/db';

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { request_id, suggestions } = req.body;

  if (!request_id || !Array.isArray(suggestions)) {
    return res.status(400).json({ error: 'Eksik veya hatalı veri gönderildi.' });
  }

  try {
    const insertedSuggestions = [];

    for (const suggestion of suggestions) {
      const { baslik, aciklama, link } = suggestion;

      const result = await pool.query(
        `INSERT INTO gift_suggestions (request_id, baslik, aciklama, link, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id`,
        [request_id, baslik, aciklama, link]
      );

      const insertedId = result.rows[0].id;

      insertedSuggestions.push({
        id: insertedId,
        baslik,
        aciklama,
        link,
      });
    }

    // ✔️ Yeni ID'lerle birlikte öneri listesi dönülür
    res.status(200).json({ message: 'Tüm öneriler kaydedildi.', suggestions: insertedSuggestions });
  } catch (error) {
    console.error('Öneri kayıt hatası:', error);
    res.status(500).json({ error: 'Veritabanına kayıt sırasında hata oluştu.' });
  }
}
