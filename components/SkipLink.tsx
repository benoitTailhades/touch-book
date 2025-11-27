import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="absolute top-0 left-0 -translate-y-full transition-transform focus:translate-y-0 bg-braille-accent text-black font-bold p-4 z-50 border-2 border-white"
    >
      Passer au contenu principal
    </a>
  );
};

export default SkipLink;