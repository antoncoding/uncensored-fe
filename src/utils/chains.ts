import { mainnet, sepolia } from 'viem/chains';
import { isTestnet, L1_CHAIN } from '@/config/environment';
import { chainConfigs } from '@/config/chainConfig';

export function chainIdToExplorer(chainId: number | undefined, txHash: string) {
  if (!chainId) chainId = L1_CHAIN.id;

  // Check if it's a supported L2 chain
  const chainConfig = chainConfigs[chainId];
  if (chainConfig) {
    return `${chainConfig.explorerUrl}/tx/${txHash}`;
  }

  // L1 chains
  if (chainId === mainnet.id) {
    return `https://etherscan.io/tx/${txHash}`;
  }
  if (chainId === sepolia.id) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }

  // Default to L1 explorer based on environment
  return isTestnet
    ? `https://sepolia.etherscan.io/tx/${txHash}`
    : `https://etherscan.io/tx/${txHash}`;
}

export function chainIdToAddressExplorer(
  chainId: number | undefined,
  address: string
) {
  if (!chainId) chainId = L1_CHAIN.id;

  // Check if it's a supported L2 chain
  const chainConfig = chainConfigs[chainId];
  if (chainConfig) {
    return `${chainConfig.explorerUrl}/address/${address}`;
  }

  // L1 chains
  if (chainId === mainnet.id) {
    return `https://etherscan.io/address/${address}`;
  }
  if (chainId === sepolia.id) {
    return `https://sepolia.etherscan.io/address/${address}`;
  }

  // Default to L1 explorer based on environment
  return isTestnet
    ? `https://sepolia.etherscan.io/address/${address}`
    : `https://etherscan.io/address/${address}`;
}
