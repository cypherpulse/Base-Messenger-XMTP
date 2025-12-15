/**
 * Hook for wallet connection state and actions
 * Uses Reown AppKit for wallet connectivity
 */

import { useAccount, useDisconnect, useSignMessage, useSwitchChain } from 'wagmi';
import { base } from '@reown/appkit/networks';
import { useChatStore } from '@/store/chatStore';
import { useCallback, useEffect } from 'react';
import { appKit } from '@/lib/wallet/config';

export function useWalletConnection() {
  const { address, isConnected, isConnecting, chainId } = useAccount();
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

  // Open AppKit modal for connection
  const handleConnect = useCallback(() => {
    appKit.open();
  }, []);

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
    
    // Actions
    connect: handleConnect,
    disconnect: () => disconnect(),
    switchToBase,
    signMessage,
  };
}
