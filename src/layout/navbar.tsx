import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuHistory } from 'react-icons/lu';

import { useAccount } from 'wagmi';
import SettingsModal from './SettingsModal';

const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { address } = useAccount();

  return (
    <nav className="flex justify-between items-center px-12 py-4 bg-card">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/img/logo.png" alt="Logo" width={50} height={50} />
        </Link>
      </div>
      <div className="ml-auto pr-4 flex items-center">
        <ConnectButton />
        <Link
          href={address ? `/history/${address}` : '#'}
          className={`ml-4 ${!address ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
        >
          <LuHistory size={24} />
        </Link>
        <div
          className="ml-4 cursor-pointer hover:opacity-80"
          onClick={() => setIsSettingsOpen(true)}
        >
          <IoSettingsOutline size={24} />
        </div>
      </div>
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
