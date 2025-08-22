/* eslint-disable prettier/prettier */
import OpenAI from "openai";

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
Kategori tercihleri: ${(form.kategoriler || []).join(", ")}

Görev: Bu kişiye uygun 3 özgün hediye önerisi üret ve SADECE geçerli JSON DİZİSİ döndür:
[
  { "baslik": "ürün adı (marka + model)", "aciklama": "neden uygun", "link": "ürün sayfası" },
  { "baslik": "...", "aciklama": "...", "link": "..." },
  { "baslik": "...", "aciklama": "...", "link": "..." }
]

Kurallar:
- Linkler güvenilir sitelerden olsun Türkiye siteleri olsun.
- Her öneri tam olarak **tek** link içersin; birden fazla link verme. Her linkte TEK bir ürün olsun TÜM ARAMA SONUÇLARI DEĞİL.
- Aynı türden 3 ürün verme; farklı kategorilerden ve farklı fiyat aralıklarından seç.
- Sadece JSON döndür; açıklama/markdown/backtick ekleme.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Sadece geçerli JSON üret." },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const text = completion.choices?.[0]?.message?.content ?? "";


  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/\[\s*{[\s\S]*}\s*\]/);
  let jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
  jsonString = jsonString.replace(/^[^\[]*\[/, "[").replace(/\][^\]]*$/, "]");

  try {
    const arr = JSON.parse(jsonString);
    if (Array.isArray(arr)) {
      return arr.slice(0, 3).map((x) => ({
        aciklama: String(x?.aciklama ?? "").trim(),
        link: String(x?.link ?? "").trim(),
        baslik: String(x?.baslik ?? "").trim(),
      })).filter(x => x.aciklama && x.link && x.baslik);
    }
    return arr;
  } catch {
    return text.split(/\n+/).filter(s => s.trim()).map(s => s.replace(/^\d+[\.\-]?\s*/, ""));
  }
}
