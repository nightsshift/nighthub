import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, className }) => {
  return (
    <motion.button
      className={`px-6 py-3 rounded-lg font-semibold text-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;