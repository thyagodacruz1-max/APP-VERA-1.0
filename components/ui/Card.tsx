
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-white/50 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
