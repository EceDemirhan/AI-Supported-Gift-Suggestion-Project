import React, { useState } from 'react';

const kategoriSecenekleri = [
  'Kıyafet',
  'Ayakkabı',
  'Ev Eşyası',
  'Aksesuar',
  'Elektronik',
  'Kitap',
  'Kozmetik',
];

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
    setHataMesaji('');
    console.log('Form verileri:', form);
    alert('Form başarıyla gönderildi!');
  };

  return (
    <section className="bg-background py-10" id="product">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-primary mb-8">
          Hediye Öneri Formu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div>
            <label className="block font-medium text-gray-700">Hobileri</label>
            <textarea
              name="hobiler"
              value={form.hobiler}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

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

          <div className="text-center">
            <button
              type="submit"
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition"
            >
              Önerileri Göster
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Product;
