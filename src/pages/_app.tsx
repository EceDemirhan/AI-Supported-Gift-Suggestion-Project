// src/pages/_app.tsx
// eslint-disable-next-line import/order
import type { AppProps } from 'next/app';
import '../styles/main.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={1500}
        newestOnTop
        pauseOnHover={false}
        closeOnClick
      />
    </>
  );
}
