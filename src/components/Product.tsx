/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';

import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import LoginRequiredModal from './LoginRequiredModal';
import { useDeviceType } from '../hooks/useDeviceType';

const sizes = {
  mobile: {
    title: 'clamp(24px, 7vw, 38px)',
    sub: 'clamp(16px, 4.5vw, 24px)',
    body: 'clamp(14px, 3.6vw, 16px)',
    button: 'clamp(14px, 3.6vw, 16px)',
    padY: 'clamp(10px, 2.8vw, 14px)',
    padX: 'clamp(18px, 5.5vw, 26px)',
    formWidth: 'clamp(300px, 92vw, 420px)',
  },
  tablet: {
    title: 'clamp(28px, 5.2vw, 42px)',
    sub: 'clamp(18px, 3.2vw, 26px)',
    body: 'clamp(15px, 2.2vw, 18px)',
    button: 'clamp(15px, 2.2vw, 18px)',
    padY: 'clamp(10px, 1.8vw, 14px)',
    padX: 'clamp(20px, 3.4vw, 28px)',
    formWidth: 'clamp(360px, 78vw, 620px)',
  },
  laptop: {
    title: 'clamp(26px, 2.6vw, 38px)',
    sub: 'clamp(17px, 1.8vw, 24px)',
    body: 'clamp(14px, 1.1vw, 17px)',
    button: 'clamp(14px, 1.1vw, 17px)',
    padY: 'clamp(8px, 0.9vw, 12px)',
    padX: 'clamp(16px, 1.2vw, 22px)',
    formWidth: 'clamp(420px, 56vw, 680px)',
  },
  desktop: {
    title: 'clamp(36px, 3vw, 56px)',
    sub: 'clamp(22px, 1.8vw, 30px)',
    body: 'clamp(16px, 0.9vw, 36px)',
    button: 'clamp(16px, 1vw, 20px)',
    padY: 'clamp(12px, 0.8vw, 18px)',
    padX: 'clamp(20px, 1.2vw, 40px)',
    formWidth: 'clamp(480px, 44vw, 820px)',
  },
} as const;

const RELATION_OPTIONS = [
  'Anne',
  'Baba',
  'Kardeş',
  'Sevgili',
  'Arkadaş',
  'İş Arkadaşı',
  'Öğretmen',
  'Eş',
  'Çocuk',
] as const;

type Relation = typeof RELATION_OPTIONS[number];

const GENDERS = ['Kadın', 'Erkek', 'Belirtmek İstemiyor'] as const;

const genderOptionsForRelation = (r: Relation | ''): readonly string[] => {
  if (r === 'Anne') return ['Kadın', 'Belirtmek İstemiyor'] as const;
  if (r === 'Baba') return ['Erkek', 'Belirtmek İstemiyor'] as const;
  return GENDERS;
};

const OCCASION_OPTIONS = [
  'Doğum Günü',
  'Evlilik Yıldönümü',
  'Sevgililer Günü',
  'Yılbaşı',
  'Anneler Günü',
  'Babalar Günü',
  'Mezuniyet',
  'Yeni İş/Terfi',
  'Yeni Ev',
  'Nişan/Düğün',
  'Geçmiş Olsun',
  'Teşekkür',
  'Sınav Başarısı',
  'Diğer',
];

const KATEGORI_SECENEKLERI = [
  'Kıyafet',
  'Ayakkabı',
  'Aksesuar',
  'Elektronik',
  'Ev Eşyası',
  'Kitap',
  'Kozmetik',
  'Oyun/Hobi',
  'Spor/Outdoor',
  'Mutfak',
];

const FREE_TRY_KEY = 'hediye_free_try_used';
const LOGIN_KEY = 'isLoggedIn';
const USER_EMAIL_KEY = 'userEmail';


async function fetchGiftSuggestions(form: any) {
  const resp = await fetch('/api/giftSuggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const js = await resp.json();
  if (!resp.ok || !js.ok) {
    throw new Error(js?.error || 'AI error');
  }
  return js.data as any[];
}

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
    kime: '' as Relation | '',
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
  const [freeTryUsed, setFreeTryUsed] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);


  // Auto-scroll
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (oneriler && oneriler.length >= 3 && suggestionsRef.current) {
      const el = suggestionsRef.current;
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [oneriler]);

  useEffect(() => {
    const handler = () => setFavoriModal(true);
    window.addEventListener('show-favori-modal', handler);
    return () => window.removeEventListener('show-favori-modal', handler);
  }, [setFavoriModal]);

useEffect(() => {
  const loggedIn = localStorage.getItem(LOGIN_KEY) === 'true';
  setIsAuthenticated(loggedIn);
  setFreeTryUsed(localStorage.getItem(FREE_TRY_KEY) === 'true');
  setUserEmail(localStorage.getItem(USER_EMAIL_KEY));
}, []);

  const currentGenderOptions = genderOptionsForRelation(form.kime);

  useEffect(() => {
    if (form.cinsiyet && !currentGenderOptions.includes(form.cinsiyet as any)) {
      setForm((p) => ({ ...p, cinsiyet: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.kime]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleKategori = (kategori: string) => {
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
      if (!freeTryUsed) {
        setLoading(true);
        try {
          const cevaplar = await fetchGiftSuggestions(form); // DEĞİŞTİ
          setOneriler(cevaplar || []);
          setFreeTryUsed(true);
          localStorage.setItem(FREE_TRY_KEY, 'true');
          toast.info(
            'Bu önerileri sizin için hazırladık. Favorilemek ve devam etmek için lütfen giriş yapınız.'
          );
        } catch (error) {
          console.error('FREE TRY HATASI:', error);
          alert('Bir hata oluştu. Konsolu kontrol edin.');
        } finally {
          setLoading(false);
        }
        return;
      }

      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    try {
      const formResponse = await fetch('/api/formEkle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail, 
          kime_hediye: form.kime,
          neden_hediye: form.neden,
          yas: Number(form.yas || 0),
          cinsiyet: form.cinsiyet,
          burc: form.burc,
          sevdigi_medya: form.sevdigi,
          hobiler: form.hobiler,
          kategori_tercihleri: form.kategoriler,
        }),
      });

      const formData = await formResponse.json();
      const requestId = formData.request_id ?? formData.id;


      const cevaplar = await fetchGiftSuggestions(form); // DEĞİŞTİ

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
    if (!isAuthenticated) {
      setShowLoginModal(true);
      toast.info('Favorilere eklemek için önce giriş yapınız.');
      return;
    }

    const zatenEkli = favoriler.find((f) => f.baslik === item.baslik);
    if (zatenEkli) {
      setFavoriler(favoriler.filter((f) => f.baslik !== item.baslik));
      return;
    }

    setFavoriler([...favoriler, item]);

    try {
      await fetch('/api/favoriEkle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          suggestion_id: item.id,
        }),
      });
    } catch (err) {
      console.error('Favori veritabanına eklenemedi:', err);
    }

    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.4 },
      colors: ['#ff4d4f', '#ff85c0', '#ffadd2'],
      scalar: 0.7,
    });

    toast.success('Ürün favorilere eklendi!', {
      toastId: 'favori-eklendi',
      position: 'top-right',
    });
    setAnimatedHeartId(item.baslik);
    setTimeout(() => setAnimatedHeartId(null), 350);
  };

  return (
    <>
      <section
        id="product"
        className="relative min-h-screen flex items-center justify-center"
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundImage: "url('/assets/images/formguncel.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-white bg-opacity-70 z-0" />

        <div className="relative z-10 mx-auto px-4" style={{ width: s.formWidth }}>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2
              className="font-bold text-center text-primary mb-6"
              style={{ fontSize: s.title, lineHeight: 1.15 }}
            >
              Hediye Öneri Formu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-900" style={{ fontSize: s.body }}>
                  Kime hediye alıyorsun? *
                </label>
                <select
                  name="kime"
                  value={form.kime}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1 text-gray-900"
                  style={{ fontSize: s.body }}
                >
                  <option value="">Seçiniz</option>
                  {RELATION_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-900" style={{ fontSize: s.body }}>
                  Ne için alıyorsun? *
                </label>
                <select
                  name="neden"
                  value={form.neden}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1 text-gray-900"
                  style={{ fontSize: s.body }}
                >
                  <option value="">Seçiniz</option>
                  {OCCASION_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium text-gray-900" style={{ fontSize: s.body }}>
                  Yaşı
                </label>
                <input
                  type="number"
                  name="yas"
                  value={form.yas}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-gray-900"
                  style={{ fontSize: s.body }}
                />
              </div>

              <div>
                <label className="block font-medium text-gray-900" style={{ fontSize: s.body }}>
                  Cinsiyet *
                </label>
                <select
                  name="cinsiyet"
                  value={form.cinsiyet}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2 mt-1 text-gray-900"
                  style={{ fontSize: s.body }}
                >
                  <option value="">Seçiniz</option>
                  {currentGenderOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-900" style={{ fontSize: s.body }}>
                  Burç
                </label>
                <input
                  type="text"
                  name="burc"
                  value={form.burc}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-gray-900"
                  style={{ fontSize: s.body }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-900" style={{ fontSize: s.body }}>
                  Sevdiği dizi, film veya müzik
                </label>
                <textarea
                  name="sevdigi"
                  value={form.sevdigi}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-gray-900"
                  style={{ fontSize: s.body }}
                />
              </div>

              <div>
                <label className="block font-medium text-gray-900" style={{ fontSize: s.body }}>
                  Hobileri
                </label>
                <textarea
                  name="hobiler"
                  value={form.hobiler}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2 mt-1 text-gray-900"
                  style={{ fontSize: s.body }}
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-900 mb-2" style={{ fontSize: s.body }}>
                Kategori Tercihleri *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 border rounded px-4 py-4">
                {KATEGORI_SECENEKLERI.map((kategori) => (
                  <label
                    key={kategori}
                    className="inline-flex items-center space-x-2 text-gray-900"
                    style={{ fontSize: s.body }}
                  >
                    <input
                      type="checkbox"
                      value={kategori}
                      checked={form.kategoriler.includes(kategori)}
                      onChange={() => toggleKategori(kategori)}
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
                className="w-full bg-gradient-to-r from-red-600 to-red-400 hover:from-red-700 hover:to-red-500 text-white font-semibold rounded-lg transition disabled:opacity-60"
                disabled={loading}
                style={{ fontSize: s.button, padding: `${s.padY} ${s.padX}` }}
              >
                {loading ? 'Yükleniyor...' : 'Önerileri Göster'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {oneriler?.length >= 3 && (
        <section ref={suggestionsRef} className="bg-white py-12" id="pricing">
          <div className="container mx-auto px-4">
            <h1
              className="font-bold text-center text-primary mb-6"
              style={{ fontSize: s.title, lineHeight: 1.15 }}
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

                  <div className="mt-4">
                    <h3
                      className="text-center text-primary mb-4 font-bold"
                      style={{ fontSize: s.sub }}
                    >
                      {item.baslik || 'Başlık yok'}
                    </h3>
                    <p className="text-gray-700 text-center" style={{ fontSize: s.body }}>
                      {item.aciklama || 'Açıklama yok'}
                    </p>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      onClick={() =>
                        window.open(
                          item.link?.startsWith('http') ? item.link : `https://${item.link}`,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                      className="font-medium text-red-600 border-b-2 border-transparent hover:border-red-600 hover:text-red-700 transition"
                      style={{ fontSize: s.button }}
                      type="button"
                    >
                      Ürünü Gör
                    </button>
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

            <h2 className="font-bold mb-4 text-center text-primary" style={{ fontSize: s.sub }}>
              Favori Ürünler
            </h2>

            <ul className="space-y-2 max-h-[400px] overflow-y-auto">
              {favoriler.length === 0 ? (
                <p className="text-center text-gray-600" style={{ fontSize: s.body }}>
                  Henüz favori eklenmedi.
                </p>
              ) : (
                favoriler.map((item, i) => (
                  <li key={i} className="border-b py-2 flex justify-between items-center">
                    <span className="font-medium" style={{ fontSize: s.body }}>
                      {item.baslik}
                    </span>
                    <button
                      onClick={() =>
                        window.open(
                          item.link?.startsWith('http') ? item.link : `https://${item.link}`,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                      className="text-red-600 border-b-2 border-transparent hover:border-red-600 hover:text-red-700 transition"
                      style={{ fontSize: s.button }}
                      type="button"
                    >
                      Ürünü Gör
                    </button>
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
