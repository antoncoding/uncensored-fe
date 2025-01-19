import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    {
      path: '../fonts/Inter/static/Inter-Light.ttf',
      weight: '300', // Light weight is typically 300
      style: 'normal',
    },
    {
      path: '../fonts/Inter/static/Inter-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Inter/static/Inter-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-inter',
});
