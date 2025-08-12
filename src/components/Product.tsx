/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';

import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';

// eslint-disable-next-line import/order
import { getGiftSuggestions } from '../lib/gemini';

import 'react-toastify/dist/ReactToastify.css';
import LoginRequiredModal from './LoginRequiredModal';
// eslint-disable-next-line import/order
import { useDeviceType } from '../hooks/useDeviceType';


const sizes = {
  mobile: {
    h1: "clamp(24px, 7vw, 38px)",
    label: "clamp(14px, 3.6vw, 18px)",
    input: "clamp(14px, 3.6vw, 18px)",
    cardTitle: "clamp(18px, 4.6vw, 22px)",
    cardBody: "clamp(13px, 3.2vw, 16px)",
    link: "clamp(14px, 3.6vw, 18px)",
    btn: "clamp(14px, 3.6vw, 18px)",
    padY: "clamp(10px, 2.8vw, 14px)",
    padX: "clamp(18px, 5.5vw, 26px)",
  },
  tablet: {
    h1: "clamp(28px, 5.2vw, 48px)",
    label: "clamp(15px, 2.2vw, 19px)",
    input: "clamp(15px, 2.2vw, 19px)",
    cardTitle: "clamp(20px, 3vw, 24px)",
    cardBody: "clamp(14px, 2vw, 17px)",
    link: "clamp(15px, 2.2vw, 19px)",
    btn: "clamp(15px, 2.2vw, 19px)",
    padY: "clamp(10px, 1.8vw, 14px)",
    padX: "clamp(20px, 3.4vw, 30px)",
  },
  laptop: {
    h1: "clamp(32px, 3.8vw, 60px)",
    label: "clamp(16px, 1.2vw, 20px)",
    input: "clamp(16px, 1.2vw, 20px)",
    cardTitle: "clamp(20px, 1.4vw, 24px)",
    cardBody: "clamp(14px, 1vw, 18px)",
    link: "clamp(16px, 1.2vw, 20px)",
    btn: "clamp(16px, 1.2vw, 20px)",
    padY: "clamp(12px, 1vw, 16px)",
    padX: "clamp(22px, 1.6vw, 36px)",
  },
  desktop: {
    h1: "clamp(36px, 3vw, 55px)",
    label: "clamp(16px, 0.9vw, 22px)",
    input: "clamp(16px, 0.9vw, 22px)",
    cardTitle: "clamp(22px, 1.1vw, 26px)",
    cardBody: "clamp(14px, 0.9vw, 18px)",
    link: "clamp(16px, 0.9vw, 22px)",
    btn: "clamp(16px, 0.9vw, 22px)",
    padY: "clamp(12px, 0.8vw, 20px)",
    padX: "clamp(20px, 1vw, 40px)",
  },
} as const;

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
  const { deviceType } = useDeviceType();
  const s = sizes[deviceType];

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [animatedHeartId, setAnimatedHeartId] = useState<string | null>(null);

  const [oneriler, setOneriler] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const handler = () => setFavoriModal(true);
    window.addEventListener("show-favori-modal", handler);
    return () => window.removeEventListener("show-favori-modal", handler);
  }, [setFavoriModal]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated === null) return;
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {

      const formResponse = await fetch('/api/formEkle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kullanici_id: 1, // TODO: login’den al
          kime_hediye: form.kime,
          neden_hediye: form.neden,
          yas: Number(form.yas),
          cinsiyet: form.cinsiyet,
          burc: form.burc,
          sevdigi_medya: form.sevdigi,
          hobiler: form.hobiler,
          kategori_tercihleri: form.kategoriler,
        }),
      });

      const formData = await formResponse.json();
      const requestId = formData.id;

      const cevaplar = await getGiftSuggestions(form);

      const oneriResponse = await fetch('/api/oneriEkle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          suggestions: cevaplar,
        }),
      });

      const oneriData = await oneriResponse.json();
      setOneriler(oneriData.suggestions);
    } catch (error) {
      console.error('API HATASI:', error);
      alert('Bir hata oluştu. Konsolu kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavori = async (item: any) => {
    const zatenEkli = favoriler.find((f) => f.baslik === item.baslik);
    if (zatenEkli) {
      setFavoriler(favoriler.filter((f) => f.baslik !== item.baslik));
    } else {
      setFavoriler([...favoriler, item]);

      try {
        await fetch('/api/favoriEkle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 1,
            suggestion_id: item.id,
          }),
        });
      } catch (err) {
        console.error("Favori veritabanına eklenemedi:", err);
      }

      // konfeti
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#ff4d4f', '#ff85c0', '#ffadd2'],
        scalar: 0.7,
      });

      toast.success("Ürün favorilere eklendi!");

      setAnimatedHeartId(item.baslik);
      setTimeout(() => setAnimatedHeartId(null), 350);
    }
  };

  const kategoriSecenekleri = ['Kıyafet', 'Ayakkabı', 'Ev Eşyası', 'Aksesuar', 'Elektronik', 'Kitap', 'Kozmetik'];

  return (
    <>

      <section
        id="product"
        className="relative min-h-screen flex items-center justify-center"
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundImage: "url('/assets/images/tasarım.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: deviceType === 'mobile' ? 'cover' : 'contain',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70 z-0" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2
              className="font-bold text-center text-red-600 mb-6"
              style={{ fontSize: s.h1, lineHeight: 1.15 }}
            >
              Hediye Öneri Formu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
                  Kime hediye alıyorsun? *
                </label>
                <select
                  name="kime"
                  value={form.kime}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                  style={{ fontSize: s.input }}
                >
                  <option value="">Seçiniz</option>
                  <option>Anne</option>
                  <option>Baba</option>
                  <option>Sevgili</option>
                  <option>Arkadaş</option>
                  <option>Eş</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
                  Ne için alıyorsun? *
                </label>
                <select
                  name="neden"
                  value={form.neden}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                  style={{ fontSize: s.input }}
                >
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
                <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
                  Yaşı
                </label>
                <input
                  type="number"
                  name="yas"
                  value={form.yas}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  style={{ fontSize: s.input }}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
                  Cinsiyet *
                </label>
                <select
                  name="cinsiyet"
                  value={form.cinsiyet}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1"
                  style={{ fontSize: s.input }}
                >
                  <option value="">Seçiniz</option>
                  <option>Kadın</option>
                  <option>Erkek</option>
                  <option>Belirtmek İstemiyor</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
                  Burç
                </label>
                <input
                  type="text"
                  name="burc"
                  value={form.burc}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1"
                  style={{ fontSize: s.input }}
                />
              </div>
            </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
      Sevdiği dizi, film veya müzik
    </label>
    <textarea
      name="sevdigi"
      value={form.sevdigi}
      onChange={handleInputChange}
      className="w-full border rounded px-3 py-2 mt-1"
      style={{ fontSize: s.input }}
    />
  </div>

  <div>
    <label className="block font-medium text-gray-700" style={{ fontSize: s.label }}>
      Hobileri
    </label>
    <textarea
      name="hobiler"
      value={form.hobiler}
      onChange={handleInputChange}
      className="w-full border rounded px-3 py-2 mt-1"
      style={{ fontSize: s.input }}
    />
  </div>
</div>


            <div>
              <label className="block font-medium text-gray-700 mb-2" style={{ fontSize: s.label }}>
                Kategori Tercihleri *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 border rounded px-4 py-4">
                {kategoriSecenekleri.map((kategori) => (
                  <label key={kategori} className="inline-flex items-center space-x-2" style={{ fontSize: s.input }}>
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
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition"
                disabled={loading}
                style={{ fontSize: s.btn, padding: `${s.padY} ${s.padX}` }}
              >
                {loading ? 'Yükleniyor...' : 'Önerileri Göster'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {oneriler?.length >= 3 && (
        <section className="bg-white py-12" id="pricing">
          <div className="container mx-auto px-4">
            <h1
              className="font-bold text-center text-primary mb-6"
              style={{ fontSize: s.h1, lineHeight: 1.15 }}
            >
              Önerilen Hediyeler
            </h1>
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
                    aria-label="Favorilere ekle"
                    type="button"
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
                    <h3
                      className="text-center text-red-500 mb-4 font-bold"
                      style={{ fontSize: s.cardTitle }}
                    >
                      {item.baslik || 'Başlık yok'}
                    </h3>
                    <p
                      className="text-gray-700 text-center"
                      style={{ fontSize: s.cardBody }}
                    >
                      {item.aciklama || 'Açıklama yok'}
                    </p>
                  </div>
                  <div className="mt-4 text-center">
                    <a
                      href={item.link?.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline text-blue-600"
                      style={{ fontSize: s.link }}
                    >
                      Ürünü Gör
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {favoriModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setFavoriModal(false)}
              type="button"
              aria-label="Kapat"
            >
              ✖
            </button>
            <h2
              className="font-bold mb-4 text-center text-red-500"
              style={{ fontSize: s.h1 }}
            >
              Favori Ürünler
            </h2>
            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {favoriler.length === 0 ? (
                <p className="text-center text-gray-600" style={{ fontSize: s.cardBody }}>
                  Henüz favori eklenmedi.
                </p>
              ) : (
                favoriler.map((item, i) => (
                  <li key={i} className="border-b py-2 flex justify-between items-center">
                    <span className="font-medium" style={{ fontSize: s.cardBody }}>
                      {item.baslik}
                    </span>
                    <a
                      href={item.link?.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                      style={{ fontSize: s.link }}
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

      <LoginRequiredModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default Product;
