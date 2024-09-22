const { nextui } = require('@nextui-org/react');

const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#93c5fd',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
