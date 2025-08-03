/* eslint-disable prettier/prettier */
import React from 'react';

import config from '../config/index.json';

const MainHeroImage = () => {
  const { mainHero } = config;
  return (
    <div
      className="relative w-full h-72 sm:h-96 md:h-[32rem] lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full overflow-hidden"
      style={{
        clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0% 100%)', // Sağdan eğik kesim
      }}
    >
      <img
        className="w-full h-full object-cover"
        src={mainHero.img}
        alt="happy team image"
      />
    </div>
  );
};

export default MainHeroImage;
