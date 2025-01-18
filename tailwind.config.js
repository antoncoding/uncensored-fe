const { nextui } = require('@nextui-org/react');
const { Interface } = require('ethers');
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)'],
      },
      fontWeight: {
        light: '300', // maps to font-light
        semibold: '600', // maps to font-semibold
        bold: '700', // maps to font-semibold
      },
      colors: {
        primary: '#0ea5e9',
        secondary: '#93c5fd',
      },
      keyframes: {
        'variable-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(180deg)' },
          '50%': { transform: 'rotate(270deg)' },
          '75%': { transform: 'rotate(315deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'variable-spin':
          'variable-spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
