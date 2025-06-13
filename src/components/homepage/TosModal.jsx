import React, { useContext } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Link from 'next/link';
import { AppContext } from '../../context/AppContext';

const TosModal = () => {
  const { acceptTos, tosAgreed } = useContext(AppContext);

  return (
    <Modal isOpen={!tosAgreed} onClose={() => {}}>
      <h2 className="text-3xl font-bold text-[#00BFFF] mb-6 font-montserrat">NightHub</h2>
      <div className="text-white text-sm mb-4">
        <p>- 13+ to use NightHub.</p>
        <p>- 18+ for mature content.</p>
        <p>- Anonymous. No personal data unless you break rules.</p>
        <p>- No illegal or harmful content.</p>
        <p>- NightHub not liable for user posts.</p>
        <p>- Report violations to us.</p>
      </div>
      <div className="text-white text-sm mb-6">
        <p>- No personal data collected unless reported.</p>
        <p>- IP logged only if reported.</p>
        <p>- Settings stored on your device.</p>
        <p>- Cookies for session only.</p>
        <p>- Chats encrypted.</p>
      </div>
      <div className="flex justify-between mb-6">
        <Link href="/tos" className="text-[#00BFFF] hover:text-[#A100F2] text-sm">
          Full Terms
        </Link>
        <Link href="/privacy" className="text-[#00BFFF] hover:text-[#A100F2] text-sm">
          Full Privacy
        </Link>
      </div>
      <Button
        onClick={acceptTos}
        className="bg-white text-[#1A1A1A] w-full hover:bg-[#A100F2] hover:text-white"
      >
        Agree
      </Button>
    </Modal>
  );
};

export default TosModal;