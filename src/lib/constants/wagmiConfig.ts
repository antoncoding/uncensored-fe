// Raimbow Kit
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  bitgetWallet,
  bifrostWallet,
  bitskiWallet,
  braveWallet,
  coinbaseWallet,
  coin98Wallet,
  coreWallet,
  dawnWallet,
  enkryptWallet,
  foxWallet,
  frameWallet,
  frontierWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  mewWallet,
  okxWallet,
  omniWallet,
  oneKeyWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  safeheronWallet,
  tahoWallet,
  talismanWallet,
  tokenaryWallet,
  tokenPocketWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
  xdefiWallet,
  zerionWallet,
} from '@rainbow-me/rainbowkit/wallets';
// Wagmi
import { http } from 'wagmi';
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
  ink,
  inkSepolia,
} from 'wagmi/chains';
import { getCustomNetworks } from '@/config/customNetworks';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_ID || '';
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

export const alchemyUrls: { [key: number]: string } = {
  [mainnet.id]: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [optimism.id]: `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [arbitrum.id]: `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [base.id]: `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  [ink.id]: `https://ink-mainnet.g.alchemy.com/v2/${alchemyKey}`,
  //
  [optimismSepolia.id]: `https://opt-sepolia.g.alchemy.com/v2/${alchemyKey}`,
  [arbitrumSepolia.id]: `https://arb-sepolia.g.alchemy.com/v2/${alchemyKey}`,
  [sepolia.id]: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
  [baseSepolia.id]: `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}`,
  [inkSepolia.id]: `https://ink-sepolia.g.alchemy.com/v2/${alchemyKey}`,
};

export const getTransport = (chainId: number) => {

  console.log('getTransport with chainId', chainId)
  
  if (alchemyUrls[chainId]) {
    return http(alchemyUrls[chainId]);
  }

  // check custom networks
  const chain = getCustomNetworks()[chainId];
  if (chain) {
    return http(chain.rpcUrl);
  }

  return http(undefined);
};

const wallets = [
  //...getDefaultWallets().wallets,
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet,
      rainbowWallet,
      rabbyWallet,
      ledgerWallet,
      walletConnectWallet,
      phantomWallet,
      coinbaseWallet,
      coin98Wallet,
      trustWallet,
      uniswapWallet,
    ],
  },
  {
    groupName: 'Other Wallets',
    wallets: [
      argentWallet,
      bitgetWallet,
      bifrostWallet,
      bitskiWallet,
      braveWallet,
      coreWallet,
      dawnWallet,
      enkryptWallet,
      foxWallet,
      frameWallet,
      frontierWallet,
      imTokenWallet,
      injectedWallet,
      mewWallet,
      okxWallet,
      omniWallet,
      oneKeyWallet,
      safeWallet,
      safeheronWallet,
      tahoWallet,
      talismanWallet,
      tokenaryWallet,
      tokenPocketWallet,
      xdefiWallet,
      zerionWallet,
    ],
  },
];

export const wagmiConfig = getDefaultConfig({
  appName: 'Uncensored',
  projectId: projectId,
  wallets: wallets,
  chains: [
    mainnet,
    optimism,
    arbitrum,
    base,
    optimismSepolia,
    arbitrumSepolia,
    sepolia,
    baseSepolia,
    ink,
    inkSepolia,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  transports: {
    ...Object.values(getCustomNetworks()).reduce((acc, network) => ({
      ...acc,
      [network.chainId]: http(network.rpcUrl),
    }), {}),
    [mainnet.id]: getTransport(mainnet.id),
    [optimism.id]: getTransport(optimism.id),
    [arbitrum.id]: getTransport(arbitrum.id),
    [base.id]: getTransport(base.id),
    [optimismSepolia.id]: getTransport(optimismSepolia.id),
    [arbitrumSepolia.id]: getTransport(arbitrumSepolia.id),
    [sepolia.id]: getTransport(sepolia.id),
    [baseSepolia.id]: getTransport(baseSepolia.id),
    [ink.id]: getTransport(ink.id),
    [inkSepolia.id]: getTransport(inkSepolia.id),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});
