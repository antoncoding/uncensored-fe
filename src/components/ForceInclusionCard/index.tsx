import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
//Importing icon
import { HiSun, HiMoon } from 'react-icons/hi';

export default function ForceInclusionCard() {
  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Force Inclusion Card</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        This card demonstrates the usage of the Uncensored SDK to enhance
        censorship resistance in Layer 2 (L2) blockchain networks.
      </p>
      <div className="flex justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Get Started
        </button>
      </div>
    </div>
  );
}
