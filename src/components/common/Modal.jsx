import React from 'react';
import { useSwipeable } from 'react-swipeable';

const Modal = ({ isOpen, onClose, children }) => {
  const handlers = useSwipeable({
    onSwipedDown: onClose,
    trackMouse: true,
    delta: 50,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div
        {...handlers}
        className="bg-[#1A1A1A] rounded-2xl p-8 max-w-sm w-full mx-4 shadow-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;