
import React from 'react';
import { useApp } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const { currentUser, logout } = useApp();

  return (
    <header className="bg-white/50 backdrop-blur-md shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1"></div>
          <div className="flex-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-serif text-brand-dark">Vera Magrin</h1>
          </div>
          <div className="flex-1 flex justify-end">
            {currentUser && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-brand-text hidden sm:block">
                  Olá, <span className="font-semibold">{currentUser.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-full hover:bg-pink-500 transition-colors shadow-md"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;