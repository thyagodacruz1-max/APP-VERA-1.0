
import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const { user, logout } = useApp();

  return (
    <header className="bg-white/50 backdrop-blur-md shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-dark">Vera Magrin</h1>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-brand-text">
              Olá, <span className="font-semibold">{user?.name?.split(' ')[0]}</span>!
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-brand-primary bg-white border border-brand-primary rounded-full hover:bg-brand-light transition-colors duration-300"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
