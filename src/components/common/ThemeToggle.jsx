import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Button from './Button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <Button
      onClick={toggleTheme}
      className="bg-[#00BFFF] text-white hover:bg-[#FF69B4]"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </Button>
  );
};

export default ThemeToggle;