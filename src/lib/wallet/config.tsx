/**
 * Wallet Configuration for Reown AppKit / WalletConnect
 * Uses Base mainnet (chain ID 8453) as primary network
 */

import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { base } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

// Get projectId from environment or use placeholder
// TODO: Replace with your actual WalletConnect project ID from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd';

const metadata = {
  name: 'Base Messenger',
  description: 'Decentralized messaging on Base with XMTP',
  url: 'http://localhost:8080',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks: [base],
  projectId,
  ssr: true
});

// 2. Create modal
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [base],
  metadata,
  projectId,
});

// 3. Create AppKitProvider component
export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Chain ID for Base mainnet - used in XMTP SCW signer
export const BASE_CHAIN_ID = 8453;
