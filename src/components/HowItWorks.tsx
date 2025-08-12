/* eslint-disable prettier/prettier */
import React from "react";

import config from "../config/index.json";
import { useDeviceType } from "../hooks/useDeviceType";

const HowItWorks = () => {
  const { title, subtitle, description, steps } = config.howItWorks;
  const { deviceType } = useDeviceType();

  const sizes = {
    mobile: {
      title:       "clamp(24px, 7vw, 38px)",
      sub:         "clamp(16px, 4.5vw, 24px)",
      body:        "clamp(14px, 3.6vw, 18px)",
      stepTitle:   "clamp(15px, 3.8vw, 20px)",
      stepBody:    "clamp(13px, 3.4vw, 16px)",
      icon:        "clamp(56px, 15vw, 80px)",
      padY:        "clamp(16px, 5vw, 28px)",
      // yeni dinamik boşluklar:
      gridGap:     "clamp(16px, 4vw, 24px)",
      gridTop:     "clamp(20px, 6vw, 36px)",   // grid üstündeki boşluk
      iconGap:     "clamp(12px, 3.5vw, 18px)", // ikon -> h3 arası
      stepGap:     "clamp(6px, 2.8vw, 10px)",  // h3 -> p arası
    },
    tablet: {
      title:       "clamp(28px, 5.2vw, 48px)",
      sub:         "clamp(18px, 3.2vw, 28px)",
      body:        "clamp(15px, 2.2vw, 19px)",
      stepTitle:   "clamp(16px, 2.4vw, 22px)",
      stepBody:    "clamp(14px, 2vw, 17px)",
      icon:        "clamp(64px, 10vw, 90px)",
      padY:        "clamp(18px, 3.2vw, 32px)",
      gridGap:     "clamp(20px, 3vw, 28px)",
      gridTop:     "clamp(22px, 4vw, 42px)",
      iconGap:     "clamp(14px, 2.4vw, 22px)",
      stepGap:     "clamp(6px, 2vw, 12px)",
    },
    laptop: {
      title:       "clamp(28px, 3vw, 50px)",   // senin istediğin gibi biraz küçültülmüş
      sub:         "clamp(20px, 2.4vw, 32px)",
      body:        "clamp(16px, 1.2vw, 20px)",
      stepTitle:   "clamp(17px, 1.4vw, 24px)",
      stepBody:    "clamp(14px, 1.1vw, 18px)",
      icon:        "clamp(72px, 7vw, 100px)",
      padY:        "clamp(20px, 2vw, 36px)",
      gridGap:     "clamp(24px, 2.4vw, 36px)",
      gridTop:     "clamp(24px, 3vw, 48px)",
      iconGap:     "clamp(16px, 1.8vw, 26px)",
      stepGap:     "clamp(8px, 1.2vw, 14px)",
    },
    desktop: {
      title:       "clamp(36px, 3.6vw, 72px)", // yatayda daha yayılıyor
      sub:         "clamp(22px, 1.8vw, 36px)",
      body:        "clamp(16px, 0.9vw, 22px)",
      stepTitle:   "clamp(18px, 1.1vw, 26px)",
      stepBody:    "clamp(14px, 0.9vw, 20px)",
      icon:        "clamp(80px, 5.6vw, 112px)",
      padY:        "clamp(22px, 1.4vw, 40px)",
      gridGap:     "clamp(28px, 1.8vw, 56px)", // kartlar arası boşluk (row/col)
      gridTop:     "clamp(28px, 3vw, 52px)",   // grid üstünde
      iconGap:     "clamp(18px, 1.2vw, 28px)", // ikon -> h3
      stepGap:     "clamp(8px, 0.9vw, 16px)",  // h3 -> p
    },
  } as const;

  const s = sizes[deviceType];

  return (
    <section id="works" className="w-full min-h-screen flex flex-col justify-center items-center px-6">
      <div
        id="how-it-works"
        className="bg-white w-full"
        style={{ paddingTop: s.padY, paddingBottom: s.padY }}
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="font-bold text-primary" style={{ fontSize: s.title, lineHeight: 1.15 }}>
            {title}
          </h2>
          <p className="mt-2 text-tertiary" style={{ fontSize: s.sub, lineHeight: 1.25 }}>
            {subtitle}
          </p>
          <p className="mt-4 text-gray-500" style={{ fontSize: s.body, lineHeight: 1.55 }}>
            {description}
          </p>
        </div>

        {/* grid boşlukları dinamik: class gap kaldırıldı */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-12 max-w-6xl mx-auto px-4"
          style={{
            marginTop: s.gridTop,
            columnGap: s.gridGap,
            rowGap: s.gridGap,
          }}
        >
          {steps.map((step: any, index: number) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={step.icon}
                alt={step.name}
                className="rounded-full shadow-lg"
                style={{
                  width: s.icon,
                  height: s.icon,
                  objectFit: "cover",
                  marginBottom: s.iconGap, // ikon -> başlık arası
                }}
              />
              <h3 className="font-semibold text-primary" style={{ fontSize: s.stepTitle, lineHeight: 1.25 }}>
                {step.name}
              </h3>
              <p
                className="text-gray-500"
                style={{
                  fontSize: s.stepBody,
                  lineHeight: 1.5,
                  marginTop: s.stepGap, // başlık -> açıklama arası
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;