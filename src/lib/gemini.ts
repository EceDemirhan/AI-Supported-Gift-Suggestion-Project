/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyCgAisK3-JseC3w2I5zOhBbuhd26uRqVJA"); // <-- KEY burada mı?

export async function getGiftSuggestions(form: any): Promise<string[]> {
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
1. Ürün adı
2. Açıklama (neden uygun olduğu)
3. **Gerçek ve çalışır bir ürün linki** (tercihen Trendyol veya Hepsiburada gibi sitelerden)

Yalnızca yukarıdaki 3 öneriyi yap. Liste halinde yaz. Format bozulmasın.
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // 1. - 2. - 3. gibi ayırırsak
  return text
    .split(/\n+/)
    .filter((s) => s.trim())
    .map((s) => s.replace(/^\d+[\.\-]?\s*/, ''));
}
