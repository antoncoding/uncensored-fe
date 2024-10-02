import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Ensure you have this import
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { CiSettings } from 'react-icons/ci';
import SettingsModal from './SettingsModal'; // You'll need to create this component

const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <nav className="flex justify-between items-center px-12 py-4 bg-card">
      <div className="flex items-center">
        <Link href="/">
          <Image src="/img/logo.png" alt="Logo" width={50} height={50} />
        </Link>
      </div>
      <div className="ml-auto pr-4 flex items-center">
        <ConnectButton />
        <div
          className="ml-4 cursor-pointer"
          onClick={() => setIsSettingsOpen(true)}
        >
          <CiSettings size={30} />
        </div>
      </div>
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
