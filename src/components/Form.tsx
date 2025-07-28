/* eslint-disable prettier/prettier */
import React from 'react';

const Form = () => {
  return (
    <form className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Hediye alacağınız kişinin yaşı"
        className="border p-2 w-full"
      />
      <select className="border p-2 w-full">
        <option>Hediye amacı</option>
        <option>Doğum Günü</option>
        <option>Yılbaşı</option>
        <option>Sevgililer Günü</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Önerileri Getir
      </button>
    </form>
  );
};

export default Form;
