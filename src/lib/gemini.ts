/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string); 

export async function getGiftSuggestions(form: any): Promise<any[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
    Kime: ${form.kime}
    Neden: ${form.neden}
    Yaş: ${form.yas}
    Cinsiyet: ${form.cinsiyet}
    Burç: ${form.burc}
    Sevdiği dizi/film/müzik: ${form.sevdigi}
    Hobileri: ${form.hobiler}
    Kategori tercihleri: ${form.kategoriler.join(', ')}

    Yukarıdaki bilgileri dikkate alarak bu kişiye alınabilecek 3 yaratıcı hediye önerisi yap. 
Her bir öneri şu formatta olsun:

[{aciklama:'Buraya açıklama girilecek',link:'https..',baslik:'ürün adı yazacak'}]
Yalnızca yukarıdaki 3 öneriyi yap. Liste halinde yaz. JSON Formatında cevapla yorum yapma. Verdiğin önerilerdeki linkler trendyol veya hepsiburada sitelerinden olsun ve linkler doğru, çalışabilir linkler olsun.
  `;

  const result = await model.generateContent(prompt); // POST isteği yapılıyor fetch gibi
  const text = await result.response.text();

  // Kod bloklarını ve gereksiz satırları temizle
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/\[\s*{[\s\S]*}\s*\]/);
  let jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

  // Fazladan kod bloğu veya satır başı karakterlerini temizle
  jsonString = jsonString.replace(/^[^\[]*\[/, '[').replace(/\][^\]]*$/, ']');

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // Parse edilemezse fallback olarak eski split yöntemiyle döndür
    return text
      .split(/\n+/)
      .filter((s) => s.trim())
      .map((s) => s.replace(/^\d+[\.\-]?\s*/, ''));
  }
}
