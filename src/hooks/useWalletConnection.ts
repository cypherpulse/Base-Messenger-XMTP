/**
 * Hook for wallet connection state and actions
 * Uses Wagmi hooks for wallet connectivity
 */

import { useAccount, useConnect, useDisconnect, useSignMessage, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { useChatStore } from '@/store/chatStore';
import { useCallback, useEffect } from 'react';

export function useWalletConnection() {
  const { address, isConnected, isConnecting, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { switchChain } = useSwitchChain();
  const { setProfile, profile } = useChatStore();

  // Check if on Base network
  const isOnBase = chainId === base.id;

  // Switch to Base if needed
  const switchToBase = useCallback(async () => {
    if (!isOnBase && switchChain) {
      switchChain({ chainId: base.id });
    }
  }, [isOnBase, switchChain]);

  // Update profile when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      if (!profile || profile.address !== address) {
        setProfile({
          address,
          nickname: undefined,
          avatarUrl: undefined,
          ensName: undefined,
        });
      }
    } else if (!isConnected) {
      setProfile(null);
    }
  }, [isConnected, address, profile, setProfile]);

  // Connect to first available connector (typically injected wallet)
  const handleConnect = useCallback(() => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  }, [connect, connectors]);

  // Sign a message (used for XMTP initialization)
  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!isConnected || !address) throw new Error('Wallet not connected');
      return signMessageAsync({ message, account: address });
    },
    [isConnected, signMessageAsync, address]
  );

  return {
    // State
    address,
    isConnected,
    isConnecting,
    isOnBase,
    chainId,
    connectors,
    
    // Actions
    connect: handleConnect,
    connectWith: (connector: typeof connectors[number]) => connect({ connector }),
    disconnect: () => disconnect(),
    switchToBase,
    signMessage,
  };
}
