
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className, ...props }) => {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 duration-300";
  
  const variantClasses = {
    primary: "bg-brand-primary text-white hover:bg-pink-500 focus:ring-brand-primary",
    secondary: "bg-white text-brand-primary border border-brand-primary hover:bg-brand-light focus:ring-brand-primary"
  };

  const disabledClasses = "disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
