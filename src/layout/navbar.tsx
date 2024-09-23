import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Ensure you have this import
import Image from 'next/image';
import Link from 'next/link'; // Import Link from next/link
import { CiSettings } from 'react-icons/ci';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-12 py-4">
      <div className="flex items-center">
        <Image src="/img/logo.png" alt="Logo" width={50} height={50} />
      </div>
      <div className="ml-auto pr-4 flex items-center">
        <ConnectButton />
        <Link href="/settings">
          <div className="ml-4">
            <CiSettings size={30} />
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
