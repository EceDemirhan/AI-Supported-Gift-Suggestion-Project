/* eslint-disable prettier/prettier */
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

export async function getGiftSuggestions(form: any): Promise<any[]> {
  const prompt = `
Kime: ${form.kime}
Neden: ${form.neden}
Yaş: ${form.yas}
Cinsiyet: ${form.cinsiyet}
Burç: ${form.burc}
Sevdiği dizi/film/müzik: ${form.sevdigi}
Hobileri: ${form.hobiler}
Kategori tercihleri: ${(form.kategoriler || []).join(', ')}

Görev: Bu kişiye uygun tam **3** özgün hediye önerisi üret.
SADECE şu şemaya tam uyan tek bir JSON **obje** döndür (başka açıklama yok):
{
  "items": [
    { "baslik": "Marka + model", "aciklama": "neden uygun", "link": "https://..." },
    { "baslik": "Marka + model", "aciklama": "neden uygun", "link": "https://..." },
    { "baslik": "Marka + model", "aciklama": "neden uygun", "link": "https://..." }
  ]
}
Kurallar:
- Linkler TR’de yaygın güvenilir sitelerden olsun (tekil ürün sayfası, arama sonucu değil).
- 3 öneri farklı kategori/fiyat aralıklarında olsun.
- **aciklama** Türkçe, **2–3 cümle** ve **en az 35–60 kelime** olsun; hediye alanın profiline bağlanan somut gerekçeler içersin.
- Sadece JSON obje döndür.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'gift_suggestions',
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              minItems: 3,
              maxItems: 3,
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['baslik', 'aciklama', 'link'],
                properties: {
                  baslik: { type: 'string', minLength: 3 },
                  aciklama: { type: 'string', minLength: 5 },
                  link: { type: 'string', minLength: 8 }
                }
              }
            }
          }
        }
      }
    },
    messages: [
      { role: 'system', content: 'Sadece geçerli JSON üret.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const text = completion.choices?.[0]?.message?.content ?? '{"items": []}';
  const { items } = JSON.parse(text) as { items: any[] };

  // UI’nın beklediği format
  return (items || []).map(x => ({
    baslik: String(x?.baslik ?? '').trim(),
    aciklama: String(x?.aciklama ?? '').trim(),
    link: String(x?.link ?? '').trim(),
  }));
}
