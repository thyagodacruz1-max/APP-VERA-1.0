
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/50 backdrop-blur-md shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-dark">Vera Magrin</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;