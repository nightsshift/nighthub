import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Button from './Button';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Button onClick={toggleTheme}>
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;