/* eslint-disable prettier/prettier */
import React from 'react';

interface LoginRequiredModalProps {
  show: boolean;
  onClose: () => void;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-center">Giriş Yapmanız Gerekiyor</h2>
        <p className="mb-4 text-center">Hediye önerisi alabilmek için lütfen giriş yapın.</p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Vazgeç
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              onClose();
              window.location.href = '/login'; // Giriş sayfasına yönlendir
            }}
          >
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
