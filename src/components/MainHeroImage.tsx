/* eslint-disable prettier/prettier */
import React from "react";

import config from "../config/index.json";

const MainHeroImage = () => {
  const { mainHero } = config as any;

  return (
    <>
     
      <div className="mt-8 px-4 sm:px-6 lg:hidden">
        <img
          src={mainHero.img}
          alt="happy team image"
          className="block w-full h-auto object-contain rounded-lg"
          loading="lazy"
        />
      </div>

      
      <div
        className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 overflow-hidden"
        style={{ clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)" }}
      >
        <img
          src={mainHero.img}
          alt="happy team image"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </>
  );
};

export default MainHeroImage;
