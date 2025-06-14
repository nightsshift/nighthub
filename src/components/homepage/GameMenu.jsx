import React, { useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const GameMenu = () => {
  const { notifications } = useContext(AppContext);

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center text-white relative">
      {notifications > 2 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
        >
          {notifications > 10 ? '10+ New Posts' : `${notifications} New Posts`}
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto px-4 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6">NightHub</h1>
        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Connect anonymously, share freely, and dive into vibrant communities.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { href: '/chat', label: 'Chat' },
            { href: '/social', label: 'Social' },
            { href: '/hubs', label: 'Hubs' },
            { href: '/settings', label: 'Settings' },
          ].map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={item.href}>
                <Button className="w-full">{item.label}</Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameMenu;