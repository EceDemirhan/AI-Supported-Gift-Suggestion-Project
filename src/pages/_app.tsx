/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
// src/pages/_app.tsx
// eslint-disable-next-line import/order
import type { AppProps } from 'next/app';
import '../styles/main.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState, useEffect } from 'react';

import LoginRequiredModal from '../components/LoginRequiredModal';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const handler = () => setShowLoginModal(true);
    window.addEventListener('show-login-modal', handler);
    return () => window.removeEventListener('show-login-modal', handler);
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5500}
        newestOnTop
        pauseOnHover={false}
        closeOnClick
      />
      <LoginRequiredModal show={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
