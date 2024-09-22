import {
  arbitrum,
  arbitrumSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
} from 'viem/chains';

export function chainIdToExplorer(chainId: number | undefined, txHash: string) {
  if (!chainId) chainId = mainnet.id;

  switch (chainId) {
    case mainnet.id:
      return `https://etherscan.io/tx/${txHash}`;
    case optimism.id:
      return `https://optimistic.etherscan.io/tx/${txHash}`;
    case arbitrum.id:
      return `https://arbiscan.io/tx/${txHash}`;
    case sepolia.id:
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    case arbitrumSepolia.id:
      return `https://sepolia.arbiscan.io/tx/${txHash}`;
    case optimismSepolia.id:
      return `https://sepolia-optimism.etherscan.io/tx/${txHash}`;
    default:
      return `https://etherscan.io/tx/${txHash}`;
  }
}
