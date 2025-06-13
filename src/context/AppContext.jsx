import React, { createContext, useState, useEffect } from 'react';
import localforage from 'localforage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [tosAgreed, setTosAgreed] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    localforage.getItem('tosAgreed').then((value) => {
      if (value) setTosAgreed(true);
    });
    localforage.getItem('theme').then((value) => {
      const newTheme = value || 'dark';
      setTheme(newTheme);
      document.documentElement.className = newTheme;
    });
  }, []);

  const acceptTos = async () => {
    await localforage.setItem('tosAgreed', true);
    setTosAgreed(true);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    await localforage.setItem('theme', newTheme);
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };

  return (
    <AppContext.Provider
      value={{ tosAgreed, acceptTos, theme, toggleTheme, notifications, setNotifications }}
    >
      {children}
    </AppContext.Provider>
  );
};