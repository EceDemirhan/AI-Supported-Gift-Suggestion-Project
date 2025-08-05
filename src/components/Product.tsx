<<<<<<< HEAD
=======
/* eslint-disable prettier/prettier */
<<<<<<< HEAD
>>>>>>> 9c3ec1d (sayfa cssleri düzenlendi.)
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';


import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
>>>>>>> 2512043 (Favorilere ekleme özelliği eklendi – react-toastify ve canvas-confetti entegre edildi)

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

import 'react-toastify/dist/ReactToastify.css';



const Product = ({
  favoriModal,
  setFavoriModal,
  favoriler,
  setFavoriler,
}: {
  favoriModal: boolean;
  setFavoriModal: React.Dispatch<React.SetStateAction<boolean>>;
  favoriler: any[];
  setFavoriler: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
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
const [animatedHeartId, setAnimatedHeartId] = useState<string | null>(null);


  const [hataMesaji, setHataMesaji] = useState('');

<<<<<<< HEAD
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
=======
  useEffect(() => {
    const handler = () => setFavoriModal(true);
    window.addEventListener("show-favori-modal", handler);
    return () => window.removeEventListener("show-favori-modal", handler);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
>>>>>>> 2512043 (Favorilere ekleme özelliği eklendi – react-toastify ve canvas-confetti entegre edildi)
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

const toggleFavori = (item: any) => {
  const zatenEkli = favoriler.find((f) => f.baslik === item.baslik);
  if (zatenEkli) {
    setFavoriler(favoriler.filter((f) => f.baslik !== item.baslik));
  } else {
    setFavoriler([...favoriler, item]);

    // 🎉 konfeti efekti
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#ff4d4f', '#ff85c0', '#ffadd2'],
      scalar: 0.7,
    });

    // ✅ Uyarı mesajı
    toast.success("Ürün favorilere eklendi!");

    // 💓 animasyon için
    setAnimatedHeartId(item.baslik);
    setTimeout(() => setAnimatedHeartId(null), 350);
  }
};




  const kategoriSecenekleri = ['Kıyafet', 'Ayakkabı', 'Ev Eşyası', 'Aksesuar', 'Elektronik', 'Kitap', 'Kozmetik'];

>>>>>>> 4eed998 (hediye önerileri divi için css düzenlendi.)
  return (
    <>
      {/* 🎁 FORM KISMI */}
      <section
        id="product"
        className="relative min-h-screen flex items-center justify-center"
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundImage: "url('/assets/images/tasarım.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70 z-0"></div>

<<<<<<< HEAD
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
=======
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-4xl font-bold text-center text-red-600 mb-6">Hediye Öneri Formu</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
>>>>>>> 6e9b5b7 (form düzenlendi..)

            <div>
              <label className="block font-medium text-gray-700">Sevdiği dizi, film veya müzik</label>
              <textarea name="sevdigi" value={form.sevdigi} onChange={handleInputChange} className="w-full border rounded px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="block font-medium text-gray-700">Hobileri</label>
              <textarea name="hobiler" value={form.hobiler} onChange={handleInputChange} className="w-full border rounded px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Kategori Tercihleri *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 border rounded px-4 py-4">
                {kategoriSecenekleri.map((kategori) => (
                  <label key={kategori} className="inline-flex items-center space-x-2">
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
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-lg px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition"
                disabled={loading}
              >
                {loading ? 'Yükleniyor...' : 'Önerileri Göster'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 🎯 ÖNERİLEN HEDİYELER */}
      {oneriler.length >= 3 && (
        <section className="bg-white py-12" id="pricing">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-primary mb-6">Önerilen Hediyeler</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {oneriler.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className={`relative rounded-lg bg-white shadow-md p-6 flex flex-col justify-between ${
                    index === 1 ? 'border-2 border-red-500' : ''
                  }`}
                >
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:scale-125 transition-transform"
                    onClick={() => toggleFavori(item)}
                  >
                   <svg
  xmlns="http://www.w3.org/2000/svg"
  className={`h-6 w-6 transition-all duration-300 ${
    (favoriler ?? []).some((f) => f.baslik === item.baslik)
      ? 'text-red-500 fill-red-500'
      : 'text-gray-400 fill-transparent'
  } ${animatedHeartId === item.baslik ? 'heart-pop' : ''}`}

                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeWidth="1.5"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                           4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 
                           16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 
                           11.54L12 21.35z"
                      />
                    </svg>
                  </button>

                  <div>
                    <h3 className="text-xl font-bold text-center text-red-500 mb-4">{item.baslik || 'Başlık yok'}</h3>
                    <p className="text-sm text-gray-700 text-center">{item.aciklama || 'Açıklama yok'}</p>
                  </div>
                  <div className="mt-4 text-center">
                    <a
                      href={item.link?.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Ürünü Gör
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
<<<<<<< HEAD
        )}
>>>>>>> 9c3ec1d (sayfa cssleri düzenlendi.)
      </div>
=======
        </section>
      )}
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 4eed998 (hediye önerileri divi için css düzenlendi.)
    </section>
=======
=======

      {/* ❤️ FAVORİLER MODAL */}
      {favoriModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setFavoriModal(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Favori Ürünler</h2>
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {favoriler.length === 0 ? (
                <p className="text-center text-gray-600">Henüz favori eklenmedi.</p>
              ) : (
                favoriler.map((item, i) => (
                  <li key={i} className="border-b py-2 flex justify-between items-center">
                    <span className="font-medium">{item.baslik}</span>
                    <a
                      href={item.link?.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      className="text-blue-600 text-sm hover:underline" rel="noreferrer"
                    >
                      Ürünü Gör
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
>>>>>>> 2512043 (Favorilere ekleme özelliği eklendi – react-toastify ve canvas-confetti entegre edildi)
    </>
>>>>>>> 6e9b5b7 (form düzenlendi..)
  );
};

export default Product;
