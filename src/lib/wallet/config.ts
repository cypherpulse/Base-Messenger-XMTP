/**
 * Wallet Configuration for Reown AppKit / WalletConnect
 * Uses Base mainnet (chain ID 8453) as primary network
 */

import { http, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get projectId from environment or use placeholder
// TODO: Replace with your actual WalletConnect project ID from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd';

// Create wagmi config with connectors
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
});

// Chain ID for Base mainnet - used in XMTP SCW signer
export const BASE_CHAIN_ID = 8453;
