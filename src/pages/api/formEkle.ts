/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prettier/prettier */
import type { NextApiRequest, NextApiResponse } from 'next';

import pool from '../../lib/lib/db'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      kullanici_id,
      kime_hediye,
      neden_hediye,
      yas,
      cinsiyet,
      burc,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      sevdigi_medya,
      hobiler,
      kategori_tercihleri
      
    } = req.body;
console.log("formEkle gelen veri:", req.body)
    try {
      const result = await pool.query(
        `INSERT INTO gift_requests 
        (user_id, kime_alinacak, ne_icin_alinacak, yas, cinsiyet, burc, sevdigi_dizi_muzik, hobiler, kategori_tercihleri)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
          kullanici_id,
          kime_hediye,
          neden_hediye,
          yas, // yaş string gelirse integer'a çevir
          cinsiyet,
          burc,
          sevdigi_medya,
          hobiler,
          kategori_tercihleri,
        ]
      );

     res.status(200).json(result.rows[0])
    } catch (error) {
      console.error('Veritabanı ekleme hatası:', error);
      res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
    }
  } else {
    res.status(405).json({ error: 'Sadece POST istekleri destekleniyor' });
  }
}
