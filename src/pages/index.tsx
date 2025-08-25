/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

import About from '../components/About';
import Header from '../components/Header';
import HowItWorks from '../components/HowItWorks';
import MainHero from '../components/MainHero';
import MainHeroImage from '../components/MainHeroImage';
import Product from '../components/Product';

const App = () => {
  const [favoriler, setFavoriler] = useState<any[]>([]);
  const [favoriModal, setFavoriModal] = useState(false);

  return (
    <div className={`bg-background grid gap-y-16 overflow-hidden`}>
      <div className={`relative bg-background`}>
        <div className="w-full px-4 lg:px-8 xl:px-12">
          <div
            className={`relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}
          >
            <Header />
            <MainHero />
          </div>
        </div>
        <MainHeroImage />
      </div>

      <>
        <Product
          favoriler={favoriler}
          setFavoriler={setFavoriler}
          favoriModal={favoriModal}
          setFavoriModal={setFavoriModal}
        />
      </>

      <div id="howitworks">
        <HowItWorks />
      </div>

      <>
        <About />
      </>
    </div>
  );
};

export default App;
