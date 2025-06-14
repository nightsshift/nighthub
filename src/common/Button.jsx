import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className }) => {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    buttonRef.current.style.setProperty('--x', `${x}px`);
    buttonRef.current.style.setProperty('--y', `${y}px`);
    onClick && onClick(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`px-6 py-3 rounded-xl font-bold text-lg glassmorphism gradient-border ripple ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 191, 255, 0.5)' }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;