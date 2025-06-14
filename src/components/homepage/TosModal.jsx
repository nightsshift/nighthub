import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '../common/Button';

const TosModal = () => {
  const { acceptTos, tosAgreed } = useContext(AppContext);

  if (tosAgreed) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl mx-4 p-8 rounded-2xl bg-[#1F1F1F] text-white"
      >
        <h2 className="text-3xl font-bold mb-6">Welcome to NightHub</h2>
        <div className="space-y-4 text-sm text-gray-300">
          <p>• 13+ to use NightHub; 18+ for mature content.</p>
          <p>• Anonymous platform. No personal data collected unless you violate rules.</p>
          <p>• No illegal or harmful content allowed.</p>
          <p>• NightHub is not liable for user-generated content.</p>
          <p>• Report violations to our team.</p>
          <p>• IP logged only if reported. Chats are encrypted.</p>
          <p>• Settings stored locally on your device.</p>
        </div>
        <div className="flex justify-between mt-6 text-sm">
          <Link href="/tos" className="text-blue-400 hover:text-blue-300">Full Terms</Link>
          <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>
        </div>
        <div className="mt-8">
          <Button onClick={acceptTos} className="w-full">Agree & Continue </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TosModal;