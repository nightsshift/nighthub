import React from 'react';

const Button = ({ children, onClick, className }) => (
  <button
    className={`px-6 py-3 rounded-xl font-bold text-lg transition-transform duration-200 transform hover:scale-105 ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;