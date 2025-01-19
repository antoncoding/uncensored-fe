import {
  optimismSepolia,
  optimism,
  base,
  baseSepolia,
  ink,
  inkSepolia,
} from 'viem/chains';
import { isTestnet } from './environment';
import { UncensoredSDK, AdapterType } from '@rollup-uncensored/sdk';
import { Address } from 'viem';
import { getCustomNetworks } from './customNetworks';

export interface ChainConfig {
  name: string;
  optimismPortalAddress: `0x${string}`;
  chainId: number;
  isOpstack?: boolean;
  maxWaitTime?: number;

  rpcUrl?: string;
  logo?: string;
  explorerUrl?: string;
  etherscanApiUrl?: string;
  etherscanApiKey?: string;
}

// Optimism Configurations
export const opMainnetConfig: ChainConfig = {
  name: 'Optimism',
  optimismPortalAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
  chainId: optimism.id,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/op.png',
  explorerUrl: 'https://optimistic.etherscan.io',
  etherscanApiUrl: 'https://api-optimistic.etherscan.io/api',
  etherscanApiKey: process.env.NEXT_PUBLIC_OPTIMISM_ETHERSCAN_API_KEY,
};

export const opSepoliaConfig: ChainConfig = {
  name: 'Optimism Sepolia',
  optimismPortalAddress: '0x16Fc5058F25648194471939df75CF27A2fdC48BC',
  chainId: optimismSepolia.id,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/op.png',
  explorerUrl: 'https://sepolia-optimism.etherscan.io',
  etherscanApiUrl: 'https://api-sepolia-optimistic.etherscan.io/api',
  etherscanApiKey: process.env.NEXT_PUBLIC_OPTIMISM_ETHERSCAN_API_KEY,
};

// Base Configurations
export const baseMainnetConfig: ChainConfig = {
  name: 'Base',
  optimismPortalAddress: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
  chainId: base.id,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/base.png',
  explorerUrl: base.blockExplorers.default.url,
  etherscanApiUrl: 'https://api.basescan.org/api',
  etherscanApiKey: process.env.NEXT_PUBLIC_BASE_ETHERSCAN_API_KEY,
};

export const baseSepoliaConfig: ChainConfig = {
  name: 'Base Sepolia',
  optimismPortalAddress: '0x49f53e41452C74589E85cA1677426Ba426459e85',
  chainId: baseSepolia.id,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/base.png',
  explorerUrl: baseSepolia.blockExplorers.default.url,
  etherscanApiUrl: 'https://api-sepolia.basescan.org/api',
  etherscanApiKey: process.env.NEXT_PUBLIC_BASE_ETHERSCAN_API_KEY,
};

export const inkSepoliaConfig: ChainConfig = {
  name: 'Ink Sepolia',
  optimismPortalAddress: '0x5c1d29c6c9c8b0800692acc95d700bcb4966a1d7',
  chainId: inkSepolia.id,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/ink.png',
  explorerUrl: inkSepolia.blockExplorers.default.url,
};

export const inkConfig: ChainConfig = {
  name: 'Ink',
  optimismPortalAddress: '0x5d66c1782664115999c47c9fa5cd031f495d3e4f',
  chainId: ink.id,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/ink.png',
  explorerUrl: ink.blockExplorers.default.url,
};

// Chain Configurations Map
export const chainConfigs: Record<number, ChainConfig> = isTestnet
  ? {
      [optimismSepolia.id]: opSepoliaConfig,
      [baseSepolia.id]: baseSepoliaConfig,
      [inkSepolia.id]: inkSepoliaConfig,
    }
  : {
      [optimism.id]: opMainnetConfig,
      [base.id]: baseMainnetConfig,
      [ink.id]: inkConfig,
    };

// All configs including custom networks

export const getAllChainConfigs = () => {
  const customNetworks = getCustomNetworks();
  return [...Object.values(customNetworks), ...Object.values(chainConfigs)];
};

export const getAllChainConfigMap = () => {
  const customNetworks = getCustomNetworks();
  return {
    ...customNetworks,
    ...chainConfigs,
  };
};

// Initialize SDK with all supported chains
const getUncensoredSDK = () => {
  const sdkConfig = Object.entries(getAllChainConfigs()).reduce(
    (acc, [, config]) => {
      if (config.isOpstack) {
        acc[Number(config.chainId)] = {
          type: AdapterType.OPStack,
          optimismPortalAddress: config.optimismPortalAddress,
        };
      }
      return acc;
    },
    {} as Record<number, { type: AdapterType; optimismPortalAddress: Address }>
  );

  console.log('sdkConfig', sdkConfig);

  return new UncensoredSDK(sdkConfig);
};

export const uncensoredSDK = getUncensoredSDK();
export const getSDKWithCurrentConfigs = () => getUncensoredSDK();
