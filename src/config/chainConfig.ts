import { Chain, optimismSepolia } from 'viem/chains';

export interface ChainConfig {
  portalAddress: `0x${string}`;
  startBlock: number;
  chain: Chain;
  isOpstack?: boolean;
}

export const chainConfigs: Record<number, ChainConfig> = {
  // [base.id]: {
  //   portalAddress: '0x0000000000000000000000000000000000000000', // Replace with actual address
  //   startBlock: 0, // Replace with actual start block
  //   chain: base,
  //   isOpstack: true
  // },
  [optimismSepolia.id]: {
    portalAddress: '0x16Fc5058F25648194471939df75CF27A2fdC48BC', // Replace with actual address
    startBlock: 4071248, // Replace with actual start block
    chain: optimismSepolia,
    isOpstack: true,
  },
};
