/* eslint-disable prettier/prettier */
import React from "react";

import config from "../config/index.json";
import { useDeviceType } from "../hooks/useDeviceType";

const About = () => {
  const { company, about } = config;
  const { logo, name: companyName } = company;
  const { socialMedia, sections, contact } = about;

  const { deviceType } = useDeviceType();

  const sizes = {
    mobile: {
      title:  "clamp(18px, 5.5vw, 24px)",
      body:   "clamp(14px, 3.8vw, 18px)",
      meta:   "clamp(13px, 3.4vw, 16px)",
      logo:   "clamp(96px, 28vw, 160px)",
      gap:    "clamp(10px, 3.5vw, 16px)",
    },
    tablet: {
      title:  "clamp(20px, 3.6vw, 28px)",
      body:   "clamp(15px, 2.6vw, 19px)",
      meta:   "clamp(14px, 2.2vw, 18px)",
      logo:   "clamp(120px, 20vw, 180px)",
      gap:    "clamp(12px, 2.6vw, 18px)",
    },
    laptop: {
      title:  "clamp(22px, 2.4vw, 32px)",
      body:   "clamp(16px, 1.4vw, 20px)",
      meta:   "clamp(14px, 1.2vw, 18px)",
      logo:   "clamp(140px, 16vw, 200px)",
      gap:    "clamp(12px, 1.6vw, 20px)",
    },
    desktop: {
      title:  "clamp(24px, 1.8vw, 36px)",
      body:   "clamp(16px, 1.0vw, 22px)",
      meta:   "clamp(14px, 0.9vw, 20px)",
      logo:   "clamp(160px, 12vw, 220px)",
      gap:    "clamp(12px, 1.2vw, 22px)",
    },
  } as const;

  const s = sizes[deviceType];

  return (
    <div id="about" className="mx-auto container xl:px-20 lg:px-12 sm:px-6 px-4 py-12">
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div>
          <img
            src={logo}
            alt={companyName}
            style={{ width: s.logo, height: s.logo }}
            className="object-contain"
          />
        </div>

        {/* Açıklama */}
        <div className="text-center max-w-2xl mt-4 text-gray-800 dark:text-gray-300">
          <h2 className="font-semibold mb-2" style={{ fontSize: s.title }}>
            {sections[0].name}
          </h2>
          <p style={{ fontSize: s.body }}>{sections[0].content}</p>
        </div>

        <div className="mt-6 space-y-1 text-center text-gray-700 dark:text-gray-200" style={{ fontSize: s.body }}>
          <p>
            📧{" "}
            <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
              {contact.email}
            </a>
          </p>
          <p>📞 {contact.phone}</p>
          <p>
            💼{" "}
            <a
              href={socialMedia.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          </p>
        </div>

        <div className="flex items-center mt-6 hidden" style={{ gap: s.gap }}>
          {socialMedia.github && (
            <a href={socialMedia.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="fill-current hover:text-primary"
                style={{ width: s.body, height: s.body }}
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.82-.261.82-.58 0-.287-.011-1.244-.017-2.258-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.419-1.305.762-1.606-2.665-.304-5.466-1.333-5.466-5.931 0-1.31.469-2.381 1.235-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.007-.322 3.3 1.23.957-.266 1.984-.399 3.005-.404 1.02.005 2.048.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.243 2.873.12 3.176.77.84 1.234 1.911 1.234 3.221 0 4.609-2.805 5.624-5.476 5.921.43.372.814 1.102.814 2.222 0 1.604-.015 2.896-.015 3.29 0 .321.217.696.825.578C20.565 21.796 24 17.299 24 12 24 5.373 18.627 0 12 0z" />
              </svg>
            </a>
          )}
        </div>

  
        <div className="mt-8 text-gray-500 dark:text-gray-400" style={{ fontSize: s.meta }}>
          <p>
            © 2025{" "}
            <span>
              designed by{" "}
              <a href="https://github.com/EceDemirhan">
                <strong>Ece Demirhan</strong>
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
