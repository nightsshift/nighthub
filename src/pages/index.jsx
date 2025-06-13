import React, { useContext } from 'react';
import TosModal from '../components/homepage/TosModal';
import GameMenu from '../components/homepage/GameMenu';
import { AppContext } from '../context/AppContext';

export default function Home() {
  const { tosAgreed } = useContext(AppContext);

  return (
    <div className="min-h-screen">
      <TosModal />
      {tosAgreed && <GameMenu />}
    </div>
  );
}