import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Button from './Button';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <motion.div
      whileHover={{ rotate: 10 }}
      className="relative"
    >
      <Button
        onClick={toggleTheme}
        className="bg-[#00BFFF] text-white hover:bg-[#A100F2]"
      >
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;