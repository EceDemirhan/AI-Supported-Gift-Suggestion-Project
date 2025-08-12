/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
import React from "react";

import config from "../config/index.json";
import { useDeviceType } from "../hooks/useDeviceType";

const MainHero = () => {
  const mainHero = config.mainHero;
  const { deviceType } = useDeviceType();

 
  const sizes = {
    mobile:  {
      title:   "clamp(24px, 7vw, 38px)",
      sub:     "clamp(16px, 4.5vw, 24px)",
      body:    "clamp(14px, 3.6vw, 18px)",
      button:  "clamp(14px, 3.6vw, 18px)",
      padY:    "clamp(10px, 2.8vw, 14px)",
      padX:    "clamp(18px, 5.5vw, 26px)",
    },
    tablet:  {
      title:   "clamp(28px, 5.2vw, 48px)",
      sub:     "clamp(18px, 3.2vw, 28px)",
      body:    "clamp(15px, 2.2vw, 19px)",
      button:  "clamp(15px, 2.2vw, 19px)",
      padY:    "clamp(10px, 1.8vw, 14px)",
      padX:    "clamp(20px, 3.4vw, 30px)",
    },
    laptop:  {
      title:   "clamp(32px, 3.8vw, 60px)",
      sub:     "clamp(20px, 2.4vw, 32px)",
      body:    "clamp(16px, 1.2vw, 20px)",
      button:  "clamp(16px, 1.2vw, 20px)",
      padY:    "clamp(12px, 1vw, 16px)",
      padX:    "clamp(22px, 1.6vw, 36px)",
    },
    desktop: {
      title:   "clamp(36px, 3vw, 68px)",
      sub:     "clamp(22px, 1.8vw, 36px)",
      body:    "clamp(10px, 0.9vw, 22px)",
      button:  "clamp(16px, 0.9vw, 22px)",
      padY:    "clamp(12px, 0.8vw, 18px)",
      padX:    "clamp(20px, 1.0vw, 40px)",
    },
  } as const;

  const s = sizes[deviceType];

  return (
    <section id="hero" className="w-full min-h-screen flex items-center px-6 snap-start">
      <div className="sm:text-center lg:text-left">
        <h1 className="tracking-tight font-bold text-gray-900 leading-tight">
          <span className="block" style={{ fontSize: s.title }}>{mainHero.title}</span>
          <span className="block text-primary mt-2" style={{ fontSize: s.sub }}>
            {mainHero.subtitle}
          </span>
        </h1>

        <p className="mt-5 text-gray-500 sm:max-w-xl sm:mx-auto lg:mx-0" style={{ fontSize: s.body }}>
          {mainHero.description}
        </p>

        <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
          <a
            href={mainHero.primaryAction.href}
            className="border border-transparent rounded-md text-background bg-primary hover:bg-border hover:text-primary"
            style={{ fontSize: s.button, padding: `${s.padY} ${s.padX}` }}
          >
            {mainHero.primaryAction.text}
          </a>

          {mainHero.secondaryAction && (
            <a
              href={mainHero.secondaryAction.href}
              className="mt-3 sm:mt-0 sm:ml-3 border border-transparent rounded-md border-primary text-secondary bg-background hover:bg-border hover:text-primary"
              style={{ fontSize: s.button, padding: `${s.padY} ${s.padX}` }}
            >
              {mainHero.secondaryAction.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainHero;
