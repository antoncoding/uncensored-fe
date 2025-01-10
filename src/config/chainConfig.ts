import {
  Chain,
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

export interface ChainConfig {
  portalAddress: `0x${string}`;
  startBlock: number;
  chain: Chain;
  isOpstack?: boolean;
  maxWaitTime?: number;
  logo: string;
  explorerUrl: string;
}

// Optimism Configurations
export const opMainnetConfig: ChainConfig = {
  portalAddress: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
  startBlock: 17365802,
  chain: optimism,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/op.png',
  explorerUrl: 'https://optimistic.etherscan.io',
};

export const opSepoliaConfig: ChainConfig = {
  portalAddress: '0x16Fc5058F25648194471939df75CF27A2fdC48BC',
  startBlock: 4071248,
  chain: optimismSepolia,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/op.png',
  explorerUrl: 'https://sepolia-optimism.etherscan.io',
};

// Base Configurations
export const baseMainnetConfig: ChainConfig = {
  portalAddress: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
  startBlock: 17482143,
  chain: base,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/base.png',
  explorerUrl: base.blockExplorers.default.url,
};

export const baseSepoliaConfig: ChainConfig = {
  portalAddress: '0x49f53e41452C74589E85cA1677426Ba426459e85',
  startBlock: 4370901,
  chain: baseSepolia,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/base.png',
  explorerUrl: baseSepolia.blockExplorers.default.url,
};

export const inkSepoliaConfig: ChainConfig = {
  portalAddress: '0x5c1d29c6c9c8b0800692acc95d700bcb4966a1d7',
  startBlock: 4370901,
  chain: inkSepolia,
  isOpstack: true,
  maxWaitTime: 12 * 3600, // 12 hours
  logo: '/img/ink.png',
  explorerUrl: inkSepolia.blockExplorers.default.url,
};

export const inkConfig: ChainConfig = {
  portalAddress: '0x5d66c1782664115999c47c9fa5cd031f495d3e4f',
  startBlock: 21344310,
  chain: ink,
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

// Initialize SDK with all supported chains
const sdkConfig = Object.entries(chainConfigs).reduce(
  (acc, [chainId, config]) => {
    if (config.isOpstack) {
      acc[Number(chainId)] = {
        type: AdapterType.OPStack,
        optimismPortalAddress: config.portalAddress,
      };
    }
    return acc;
  },
  {} as Record<number, { type: AdapterType; optimismPortalAddress: Address }>
);

export const uncensoredSDK = new UncensoredSDK(sdkConfig);
