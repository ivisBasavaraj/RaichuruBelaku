import React from 'react';
import headerImage from './image.png';

export default function Masthead() {
  return (
    <div className="w-full bg-white border-b border-zinc-200 px-4">
      <div className="max-w-7xl mx-auto py-2 md:py-4">
        <img
          src={headerImage}
          alt="Satyada Dari Newspaper Header"
          className="w-full h-auto object-contain max-h-[120px] md:max-h-[200px]"
        />
      </div>
    </div>
  );
}
