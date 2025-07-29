/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

import Slider from 'react-slick';

import { getGiftSuggestions } from '../lib/gemini';

const Product = () => {
  const [form, setForm] = useState({
    kime: '',
    neden: '',
    yas: '',
    cinsiyet: '',
    burc: '',
    sevdigi: '',
    hobiler: '',
    kategoriler: [] as string[],
  });

  const [oneriler, setOneriler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleKategoriToggle = (kategori: string) => {
    setForm((prev) => {
      const secili = prev.kategoriler.includes(kategori)
        ? prev.kategoriler.filter((k) => k !== kategori)
        : [...prev.kategoriler, kategori];
      return { ...prev, kategoriler: secili };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cevaplar = await getGiftSuggestions(form);
      console.log('Gemini cevabı:', cevaplar);
      setOneriler(cevaplar);
    } catch (error) {
      console.error('API HATASI:', error);
      alert('Bir hata oluştu. Konsolu kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const kategoriSecenekleri = ['Kıyafet', 'Ayakkabı', 'Ev Eşyası', 'Aksesuar', 'Elektronik', 'Kitap', 'Kozmetik'];

  const sliderAyar = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <section className="bg-background py-10" id="product">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">Hediye Öneri Formu</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form alanları */}
          <div>
            <label className="block font-medium text-gray-700">Kime hediye alıyorsun? *</label>
            <select name="kime" value={form.kime} onChange={handleInputChange} required className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Seçiniz</option>
              <option>Anne</option>
              <option>Baba</option>
              <option>Sevgili</option>
              <option>Arkadaş</option>
              <option>Eş</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Ne için alıyorsun? *</label>
            <select name="neden" value={form.neden} onChange={handleInputChange} required className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Seçiniz</option>
              <option>Doğum Günü</option>
              <option>Evlilik Yıldönümü</option>
              <option>Terfi</option>
              <option>Diğer</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Yaşı</label>
            <input type="number" name="yas" value={form.yas} onChange={handleInputChange} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Cinsiyet *</label>
            <select name="cinsiyet" value={form.cinsiyet} onChange={handleInputChange} required className="w-full border rounded px-3 py-2 mt-1">
              <option value="">Seçiniz</option>
              <option>Kadın</option>
              <option>Erkek</option>
              <option>Belirtmek İstemiyor</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700">Burç</label>
            <input type="text" name="burc" value={form.burc} onChange={handleInputChange} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Sevdiği dizi, film veya müzik</label>
            <textarea name="sevdigi" value={form.sevdigi} onChange={handleInputChange} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Hobileri</label>
            <textarea name="hobiler" value={form.hobiler} onChange={handleInputChange} className="w-full border rounded px-3 py-2 mt-1" />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Kategori tercihleri *</label>
            <div className="border rounded px-4 py-2 space-y-2 bg-white">
              {kategoriSecenekleri.map((kategori) => (
                <label key={kategori} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={kategori}
                    checked={form.kategoriler.includes(kategori)}
                    onChange={() => handleKategoriToggle(kategori)}
                    className="form-checkbox text-primary"
                  />
                  <span>{kategori}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition" disabled={loading}>
              {loading ? 'Yükleniyor...' : 'Önerileri Göster'}
            </button>
          </div>
        </form>

        {loading && <p className="text-center text-gray-500 mt-4">Yükleniyor...</p>}

        {oneriler.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-center mb-6">🎁 Önerilen Hediyeler</h3>
            <Slider {...sliderAyar}>
              {oneriler.map((item, index) => {
                const baslik = item.baslik || 'Başlık yok';
                const aciklama = item.aciklama || 'Açıklama yok';
                const link = item.link || '#';
                const hostname = link.startsWith('http') ? new URL(link).hostname : '';

                return (
                  <div key={index} className="p-4 bg-white border rounded shadow mx-4">
                    <div className="text-center">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${hostname}`}
                        alt="favicon"
                        className="inline-block mb-2"
                      />
                      <h3 className="text-xl font-bold mb-2">{baslik}</h3>
                      <p className="mb-3">{aciklama}</p>
                      <a
                        href={link.startsWith('http') ? link : `https://${link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ürünü Gör
                      </a>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        )}
      </div>
    </section>
  );
};

export default Product;
