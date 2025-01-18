import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
// Importing Next Themes
import { ThemeProvider } from 'next-themes';
// TanStack
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Importing Layout
import Layout from '@/layout';
// Importing Styles
import '@/assets/styles/globals.scss';
// Raimbow Kit
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, lightTheme, Theme } from '@rainbow-me/rainbowkit';
// Wagmi
import { WagmiProvider } from 'wagmi';
// Wagmi Config
import { wagmiConfig } from '@/lib/constants/wagmiConfig';
import { NextUIProvider } from '@nextui-org/react';
// Import Tailwind CSS
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
// Import font
import { inter } from '@/config/fonts';

// Merge
import merge from 'lodash.merge';

const theme = merge(lightTheme(), {
  colors: {
    accentColor: '#0ea5e9', // Updated to match primary color in tailwind.config.js
    accentColorForeground: '#fff',
    actionButtonSecondaryBackground: '#93c5fd', // Updated to match secondary color in tailwind.config.js
    connectButtonBackground: '#fff',
    connectButtonBackgroundError: '#fff',
    connectButtonInnerBackground: '#fff',
    connectButtonText: '#000',
    connectButtonTextError: '#FF494A',
  },
} as Theme);

// Create a client
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  return (
    <NextUIProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={theme}>
            <ThemeProvider attribute="data-theme">
              <main className={`${inter.className}`}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </main>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </NextUIProvider>
  );
}
