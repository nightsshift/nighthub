import React, { useContext } from 'react';
import Link from 'next/link';
import { AppContext } from '../../context/AppContext';
import ThemeToggle from '../common/ThemeToggle';

const GameMenu = () => {
  const { notifications } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white flex flex-col items-center justify-center relative bg-gradient-to-br from-[#00BFFF]/20 to-[#A100F2]/20 animate-bg-pulse">
      {notifications > 2 && (
        <div
          className="fixed top-4 bg-[#A100F2] text-white px-4 py-2 rounded-full cursor-pointer animate-pulse text-sm"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {notifications > 10 ? '10+ New Posts' : `${notifications} New Posts`}
        </div>
      )}
      <h1 className="text-5xl font-bold text-[#00BFFF] mb-10 font-montserrat tracking-wide">
        NightHub
      </h1>
      <div className="grid grid-cols-2 gap-6 max-w-md w-full px-6">
        <Link
          href="/chat"
          className="bg-[#00BFFF] text-white p-8 rounded-xl text-center font-bold text-lg hover:bg-[#FF69B4] transition-transform transform hover:scale-105"
        >
          Chat
        </Link>
        <Link
          href="/social"
          className="bg-[#00BFFF] text-white p-8 rounded-xl text-center font-bold text-lg hover:bg-[#FF69B4] transition-transform transform hover:scale-105"
        >
          Social
        </Link>
        <Link
          href="/hubs"
          className="bg-[#00BFFF] text-white p-8 rounded-xl text-center font-bold text-lg hover:bg-[#FF69B4] transition-transform transform hover:scale-105"
        >
          Hubs
        </Link>
        <Link
          href="/settings"
          className="bg-[#00BFFF] text-white p-8 rounded-xl text-center font-bold text-lg hover:bg-[#FF69B4] transition-transform transform hover:scale-105"
        >
          Settings
        </Link>
      </div>
      <div className="mt-10">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default GameMenu;