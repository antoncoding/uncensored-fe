import { ChainConfig } from './chainConfig';
import storage from 'local-storage-fallback';

const CUSTOM_NETWORKS_KEY = 'uncensored_custom_networks';

export const getCustomNetworks = (): Record<number, ChainConfig> => {
  const stored = storage.getItem(CUSTOM_NETWORKS_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

export const addCustomNetwork = (chainId: number, network: ChainConfig) => {
  const current = getCustomNetworks();
  current[chainId] = network;
  storage.setItem(CUSTOM_NETWORKS_KEY, JSON.stringify(current));
};

export const updateCustomNetwork = (
  chainId: number,
  updates: Partial<ChainConfig>
) => {
  const networks = getCustomNetworks();
  if (!networks[chainId]) {
    throw new Error(`Network with chain ID ${chainId} not found`);
  }
  networks[chainId] = {
    ...networks[chainId],
    ...updates,
  };
  storage.setItem(CUSTOM_NETWORKS_KEY, JSON.stringify(networks));
};

export const removeCustomNetwork = (chainId: number) => {
  const current = getCustomNetworks();
  delete current[chainId];
  storage.setItem(CUSTOM_NETWORKS_KEY, JSON.stringify(current));
};
