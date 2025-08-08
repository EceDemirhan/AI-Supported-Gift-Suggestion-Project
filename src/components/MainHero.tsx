/* eslint-disable prettier/prettier */
import React from 'react';

import config from '../config/index.json';

type MainHeroType = {
  title: string;
  subtitle: string;
  description: string;
  img: string;
  primaryAction: { text: string; href: string };
  secondaryAction?: { text: string; href: string };
};

const MainHero = () => {
  // eslint-disable-next-line prefer-destructuring
  const mainHero: MainHeroType = config.mainHero;

  return (
    <section
      id="hero"
      className="w-full min-h-screen flex items-center px-6 snap-start"
    >
      <div className="sm:text-center lg:text-left">
        <h1 className="text-3xl tracking-tight font-bold text-gray-900 sm:text-4xl md:text-5xl leading-tight">
          <span className="block">{mainHero.title}</span>
          <span className="block text-primary text-xl sm:text-2xl md:text-3xl mt-2">
            {mainHero.subtitle}
          </span>
        </h1>

        <p className="mt-5 text-sm text-gray-500 sm:text-base sm:max-w-xl sm:mx-auto md:text-lg lg:mx-0">
          {mainHero.description}
        </p>

        <div className="mt-8 sm:flex sm:justify-center lg:justify-start">
          <div className="rounded-md shadow">
            <a
              href={mainHero.primaryAction.href}
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-background bg-primary hover:bg-border hover:text-primary md:py-4 md:text-lg md:px-10"
            >
              {mainHero.primaryAction.text}
            </a>
          </div>

          {mainHero.secondaryAction && (
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a
                href={mainHero.secondaryAction.href}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md border-primary text-secondary bg-background hover:bg-border hover:text-primary md:py-4 md:text-lg md:px-10"
              >
                {mainHero.secondaryAction.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MainHero;
