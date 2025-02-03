import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';
import { IoSettingsOutline, IoBookOutline } from 'react-icons/io5';
import { FaGithub, FaTelegramPlane } from 'react-icons/fa';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';

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
      <div className="ml-auto pr-4 flex items-center gap-4">
        <Link
          href={address ? `/history/${address}` : '#'}
          className={`${!address ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
        >
          History
        </Link>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light" className="text-base">
              More
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="More actions">
            <DropdownItem>
              <Link
                href="https://rollup-fortress.github.io/uncensored-book/"
                target="_blank"
                className="flex items-center gap-2"
              >
                <IoBookOutline size={18} />
                Docs
              </Link>
            </DropdownItem>
            <DropdownItem onClick={() => setIsSettingsOpen(true)}>
              <div className="flex items-center gap-2">
                <IoSettingsOutline size={18} />
                Settings
              </div>
            </DropdownItem>
            <DropdownItem>
              <Link
                href="https://github.com/rollup-fortress/uncensored"
                target="_blank"
                className="flex items-center gap-2"
              >
                <FaGithub size={18} />
                SDK
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link
                href="https://t.me/+22BY-SQHEFc1ZjA1"
                target="_blank"
                className="flex items-center gap-2"
              >
                <FaTelegramPlane size={18} />
                Send Feedback
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <ConnectButton showBalance={false} chainStatus={'none'} />
      </div>
      {isSettingsOpen && (
        <SettingsModal onClose={() => setIsSettingsOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
