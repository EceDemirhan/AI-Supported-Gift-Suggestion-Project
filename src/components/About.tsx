import React from 'react';

import config from '../config/index.json';

const About = () => {
  const { company, about } = config;
  const { logo, name: companyName } = company;
  const { socialMedia, sections, contact } = about;

  return (
    <div
      id="about"
      className="mx-auto container xl:px-20 lg:px-12 sm:px-6 px-4 py-12"
    >
      <div className="flex flex-col items-center justify-center">
        {/* Logo */}
        <div>
          <img src={logo} alt={companyName} className="w-44 h-44" />
        </div>

        {/* Açıklama */}
        <div className="text-center max-w-2xl mt-4 text-gray-800 dark:text-gray-300">
          <h2 className="text-xl font-semibold mb-2">{sections[0].name}</h2>
          <p>{sections[0].content}</p>
        </div>

        {/* İletişim Bilgileri */}
        <div className="mt-6 space-y-1 text-center text-gray-700 dark:text-gray-200">
          <p>
            📧{' '}
            <a
              href={`mailto:${contact.email}`}
              className="text-primary hover:underline"
            >
              {contact.email}
            </a>
          </p>
          <p>📞 {contact.phone}</p>
          <p>
            💼{' '}
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

        {/* Sosyal Medya */}
        <div className="flex items-center gap-x-6 mt-6">
          {socialMedia.github && (
            <a
              href={socialMedia.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <svg
                className="w-6 h-6 fill-current hover:text-primary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.373..." /> {/* SVG PATH kısaltıldı */}
              </svg>
            </a>
          )}
        </div>

        {/* Alt metin */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>
            © 2025{' '}
            <span>
              designed by{' '}
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
