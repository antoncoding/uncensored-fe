// Environment configuration
import { mainnet, sepolia } from 'viem/chains';

// Make sure to use NEXT_PUBLIC_ prefix for client-side env variables
export const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET === 'true';

// Chain configuration based on environment
export const L1_CHAIN = isTestnet ? sepolia : mainnet;
