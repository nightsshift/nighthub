import React, { useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '../../context/AppContext';
import ThemeToggle from '../common/ThemeToggle';
import ParticleBackground from '../common/ParticleBackground';
import { motion } from 'framer-motion';

const GameMenu = () => {
  const { notifications } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col items-center justify-center relative overflow-hidden">
      <ParticleBackground />
      {notifications > 2 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 bg-[#A100F2] text-white px-4 py-2 rounded-full cursor-pointer animate-pulse text-sm z-10"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {notifications > 10 ? '10+ New Posts' : `${notifications} New Posts`}
        </motion.div>
      )}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-bold text-[#00BFFF] mb-12 font-montserrat tracking-wider"
      >
        NightHub
      </motion.h1>
      <motion.div
        className="grid grid-cols-2 gap-8 max-w-md w-full px-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {[
          { href: '/chat', label: 'Chat' },
          { href: '/social', label: 'Social' },
          { href: '/hubs', label: 'Hubs' },
          { href: '/settings', label: 'Settings' },
        ].map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
            whileHover={{ scale: 1.1, rotateY: 10 }}
          >
            <Link
              href={item.href}
              className="block bg-[#00BFFF] text-white p-10 rounded-xl text-center font-bold text-xl glassmorphism gradient-border hover:bg-[#FF69B4] transition-transform"
            >
              {item.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 z-10"
      >
        <ThemeToggle />
      </motion.div>
    </div>
  );
};

export default GameMenu;