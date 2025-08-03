<<<<<<< HEAD
=======
/* eslint-disable prettier/prettier */
>>>>>>> 9c3ec1d (sayfa cssleri düzenlendi.)
import React, { useState } from 'react';

<<<<<<< HEAD
const kategoriSecenekleri = [
  'Kıyafet',
  'Ayakkabı',
  'Ev Eşyası',
  'Aksesuar',
  'Elektronik',
  'Kitap',
  'Kozmetik',
];
=======
import { getGiftSuggestions } from '../lib/gemini';
>>>>>>> 4eed998 (hediye önerileri divi için css düzenlendi.)

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

  const [hataMesaji, setHataMesaji] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.kategoriler.length === 0) {
      setHataMesaji('Lütfen en az bir kategori seçin.');
      return;
    }
<<<<<<< HEAD
    setHataMesaji('');
    console.log('Form verileri:', form);
    alert('Form başarıyla gönderildi!');
  };

=======
  };

  const kategoriSecenekleri = ['Kıyafet', 'Ayakkabı', 'Ev Eşyası', 'Aksesuar', 'Elektronik', 'Kitap', 'Kozmetik'];

>>>>>>> 4eed998 (hediye önerileri divi için css düzenlendi.)
  return (
    <section
 

    >
      {/* Form */}
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Hediye Öneri Formu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
<<<<<<< HEAD
=======
          {/* Kime */}
>>>>>>> 4eed998 (hediye önerileri divi için css düzenlendi.)
          <div>
            <label className="block font-medium text-gray-700">
              Kime hediye alıyorsun? *
            </label>
            <select
              name="kime"
              value={form.kime}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Seçiniz</option>
              <option>Anne</option>
              <option>Baba</option>
              <option>Sevgili</option>
              <option>Arkadaş</option>
              <option>Eş</option>
            </select>
          </div>

          {/* Neden */}
          <div>
            <label className="block font-medium text-gray-700">
              Ne için alıyorsun? *
            </label>
            <select
              name="neden"
              value={form.neden}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Seçiniz</option>
              <option>Doğum Günü</option>
              <option>Evlilik Yıldönümü</option>
              <option>Terfi</option>
              <option>Diğer</option>
            </select>
          </div>

          {/* Yaş */}
          <div>
            <label className="block font-medium text-gray-700">Yaşı</label>
            <input
              type="number"
              name="yas"
              value={form.yas}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Cinsiyet */}
          <div>
            <label className="block font-medium text-gray-700">
              Cinsiyet *
            </label>
            <select
              name="cinsiyet"
              value={form.cinsiyet}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Seçiniz</option>
              <option>Kadın</option>
              <option>Erkek</option>
              <option>Belirtmek İstemiyor</option>
            </select>
          </div>

          {/* Burç */}
          <div>
            <label className="block font-medium text-gray-700">Burç</label>
            <input
              type="text"
              name="burc"
              value={form.burc}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Sevdikleri */}
          <div>
            <label className="block font-medium text-gray-700">
              Sevdiği dizi, film veya müzik
            </label>
            <textarea
              name="sevdigi"
              value={form.sevdigi}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Hobileri */}
          <div>
            <label className="block font-medium text-gray-700">Hobileri</label>
            <textarea
              name="hobiler"
              value={form.hobiler}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Kategori tercihleri <span className="text-red-500">*</span>
            </label>
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
            {hataMesaji && (
              <p className="text-red-500 text-sm mt-1">{hataMesaji}</p>
            )}
          </div>

          {/* Buton */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
            >
              Önerileri Göster
            </button>
          </div>
        </form>
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
      </div>
>>>>>>> 4eed998 (hediye önerileri divi için css düzenlendi.)

     
     
      {oneriler.length >= 3 && (
        <section className="bg-white py-8" id="pricing">
          <div className="container mx-auto px-2 pt-4 pb-12 text-primary">
            <h1 className="w-full my-2 text-5xl font-bold leading-tight text-center text-primary">
              Önerilen Hediyeler
            </h1>
            <div className="w-full mb-4">
              <div className="h-1 mx-auto bg-primary w-64 opacity-25 my-0 py-0 rounded-t"></div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center pt-12 my-12 sm:my-4 flex-wrap">
              {oneriler.slice(0, 3).map((item, index) => {
                const baslik = item.baslik || 'Başlık yok';
                const aciklama = item.aciklama || 'Açıklama yok';
                const link = item.link || '#';
                const isPro = index === 1;

                return (
                  <div
                    key={index}
                    style={{ width: isPro ? '400px' : '360px' }}
                    className={`flex flex-col mx-4 rounded-lg bg-white mt-4 shadow-lg ${
                      isPro ? 'sm:-mt-6 z-10' : ''
                    }`}
                  >
                    <div className="flex-1 text-gray-600 rounded-t rounded-b-none overflow-hidden shadow">
                      <div className={`p-8 text-2xl font-bold text-center ${isPro ? 'text-red-500' : 'text-primary'}`}>
                        {baslik}
                      </div>
                      <ul className="w-full text-center text-sm px-6 py-4 leading-relaxed">
                        <li>{aciklama}</li>
                      </ul>
                    </div>
                    <div className="flex-none mt-auto rounded-b overflow-hidden shadow p-6">
                      <div className="w-full pt-2 text-center">
                        <a
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold hover:underline"
                        >
                          Ürünü Gör
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
<<<<<<< HEAD
        )}
>>>>>>> 9c3ec1d (sayfa cssleri düzenlendi.)
      </div>
=======
        </section>
      )}
>>>>>>> 4eed998 (hediye önerileri divi için css düzenlendi.)
    </section>
  );
};

export default Product;
