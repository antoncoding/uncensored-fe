import { Address } from 'viem';

const CUSTOM_NETWORKS_KEY = 'uncensored_custom_networks';

export type CustomNetwork = {
  name: string;
  rpcUrl: string;
  chainId: number;
  optimismPortalAddress: Address;
  isOpstack: boolean;

  // optional
  explorerUrl?: string;
  etherscanApiKey?: string;
  etherscanApiUrl?: string;
};

export const getCustomNetworks = (): Record<number, CustomNetwork> => {
  const stored = localStorage.getItem(CUSTOM_NETWORKS_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

export const addCustomNetwork = (chainId: number, network: CustomNetwork) => {
  const current = getCustomNetworks();
  current[chainId] = network;
  localStorage.setItem(CUSTOM_NETWORKS_KEY, JSON.stringify(current));
};

export const removeCustomNetwork = (chainId: number) => {
  const current = getCustomNetworks();
  delete current[chainId];
  localStorage.setItem(CUSTOM_NETWORKS_KEY, JSON.stringify(current));
};
