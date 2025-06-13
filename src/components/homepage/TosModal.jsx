import React, { useContext } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Link from 'next/link';
import { AppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const TosModal = () => {
  const { acceptTos, tosAgreed } = useContext(AppContext);

  return (
    <Modal isOpen={!tosAgreed} onClose={() => {}}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-[#00BFFF] mb-6 font-montserrat tracking-wide"
      >
        Welcome to NightHub
      </motion.h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white text-sm mb-4"
      >
        <p>- 13+ to use NightHub.</p>
        <p>- 18+ for mature content.</p>
        <p>- Anonymous. No personal data unless you break rules.</p>
        <p>- No illegal or harmful content.</p>
        <p>- NightHub not liable for user posts.</p>
        <p>- Report violations to us.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white text-sm mb-6"
      >
        <p>- No personal data collected unless reported.</p>
        <p>- IP logged only if reported.</p>
        <p>- Settings stored on your device.</p>
        <p>- Cookies for session only.</p>
        <p>- Chats encrypted.</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between mb-6"
      >
        <Link href="/tos" className="text-[#00BFFF] hover:text-[#FF69B4] text-sm font-bold">
          Full Terms
        </Link>
        <Link href="/privacy" className="text-[#00BFFF] hover:text-[#FF69B4] text-sm font-bold">
          Full Privacy
        </Link>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={acceptTos}
          className="bg-white text-[#1A1A1A] w-full hover:bg-[#A100F2] hover:text-white"
        >
          Agree
        </Button>
      </motion.div>
    </Modal>
  );
};

export default TosModal;