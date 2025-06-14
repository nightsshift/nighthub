import React from 'react';
import { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, children }) => {
  const handlers = useSwipeable({
    onSwipedDown: onClose,
    trackMouse: true,
    delta: 50,
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
    >
      <motion.div
        {...handlers}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-[#1A1A1A] rounded-2xl p-8 max-w-sm w-full mx-4 glassmorphism shadow-2xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;