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
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    >
      <motion.div
        {...handlers}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-2xl mx-4 p-8 rounded-2xl bg-[#1F1F1F] text-white"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;