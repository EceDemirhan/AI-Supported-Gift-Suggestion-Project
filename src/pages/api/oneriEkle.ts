/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../lib/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Yalnızca POST istekleri desteklenir.' });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { request_id, suggestions } = req.body as {
    request_id?: number | string;
    suggestions?: Array<{ baslik?: string; aciklama?: string; link?: string }>;
  };

  // 1) Basit doğrulamalar
  const reqIdNum = request_id === '' || request_id == null ? NaN : Number(request_id);
  if (!Number.isFinite(reqIdNum) || !Array.isArray(suggestions) || suggestions.length === 0) {
    return res.status(400).json({ error: 'Eksik veya hatalı veri gönderildi.' });
  }

  const client = await pool.connect();
  try {
    
    const rq = await client.query('SELECT 1 FROM public.gift_requests WHERE id=$1', [reqIdNum]);
    if ((rq.rowCount ?? 0) === 0) {
      client.release();
      return res.status(400).json({ error: 'Geçersiz request_id.' });
    }

    
    await client.query('BEGIN');

    const insertedSuggestions: Array<{ id: number; baslik: string; aciklama: string; link: string }> = [];

    for (const s of suggestions) {
      const baslik = String(s?.baslik ?? '').trim();
      const aciklama = String(s?.aciklama ?? '').trim();
      const rawLink = String(s?.link ?? '').trim();
      const link = rawLink.startsWith('http') ? rawLink : rawLink ? `https://${rawLink}` : '';

      const result = await client.query(
        `INSERT INTO public.gift_suggestions (request_id, baslik, aciklama, link)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [reqIdNum, baslik, aciklama, link]
      );

      insertedSuggestions.push({
        id: result.rows[0].id as number,
        baslik,
        aciklama,
        link,
      });
    }

    await client.query('COMMIT');
    client.release();

    return res.status(200).json({ message: 'Tüm öneriler kaydedildi.', suggestions: insertedSuggestions });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch { 
       // console.error('Rollback hatası:', err);
     }
    client.release();
    console.error('Öneri kayıt hatası:', error);
    return res.status(500).json({ error: 'Veritabanına kayıt sırasında hata oluştu.' });
  }
}
