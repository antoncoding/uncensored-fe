import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="sm:flex sm:items-center sm:justify-between p-2 sm:p-6 xl:p-8 text-gray-500 text-sm bg-card">
      <div>
        <Link
          href="https://github.com/rollup-fortress/uncensored"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors duration-300"
        >
          SDK GitHub
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
