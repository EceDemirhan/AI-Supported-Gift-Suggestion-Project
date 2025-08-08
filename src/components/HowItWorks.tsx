/* eslint-disable prettier/prettier */
import React from "react";

import config from "../config/index.json";

const HowItWorks = () => {
  const { title, subtitle, description, steps } = config.howItWorks;

  return (
    <section  id="works"
      className="w-full min-h-screen flex flex-col justify-center items-center px-6 ">
    <div className="py-20 bg-white" id="how-it-works">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-primary">{title}</h2>
        <p className="text-lg mt-2 text-tertiary">{subtitle}</p>
        <p className="mt-4 text-gray-500">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-6xl mx-auto px-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <img
              src={step.icon}
              alt={step.name}
              className="h-20 w-20 mb-4 rounded-full shadow-lg"
            />
            <h3 className="text-lg font-semibold text-primary">{step.name}</h3>
            <p className="text-sm text-gray-500 mt-2">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default HowItWorks;

