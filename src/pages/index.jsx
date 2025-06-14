import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '../common/Button';

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg text-white">
      <div className="w-full max-w-7xl mx-auto px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">NightHub</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Connect anonymously, share freely, and explore vibrant communities with a cutting-edge experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
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
                className="card p-6"
              >
                <Link href={item.href} passHref>
                  <Button className="w-full">{item.label}</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}