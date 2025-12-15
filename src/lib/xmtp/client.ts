/**
 * XMTP Client Configuration and Initialization
 * 
 * This module handles XMTP Browser SDK client creation with wallet signers.
 * All message encryption is handled by XMTP - we never store decrypted content.
 * 
 * TODO: Install @xmtp/browser-sdk when ready for production
 * npm install @xmtp/browser-sdk
 */

import { BASE_CHAIN_ID } from '../wallet/config';

/**
 * Signer interface compatible with XMTP Browser SDK
 * Works for both EOA (Externally Owned Account) and SCW (Smart Contract Wallet)
 */
export interface XmtpSigner {
  getIdentifier: () => { identifier: string; identifierKind: 'address' | 'installation' };
  signMessage: (message: string) => Promise<string>;
  getChainId?: () => bigint; // Required for SCW signers
}

/**
 * Creates an EOA signer from a connected wallet
 * Used for standard MetaMask, Rainbow, etc. wallets
 */
export function createEoaSigner(
  address: string,
  signMessage: (message: string) => Promise<string>
): XmtpSigner {
  return {
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: 'address' as const,
    }),
    signMessage,
  };
}

/**
 * Creates an SCW (Smart Contract Wallet) signer
 * Used for Coinbase Smart Wallet, Safe, etc.
 * Includes Base chain ID (8453) for proper signature verification
 */
export function createScwSigner(
  address: string,
  signMessage: (message: string) => Promise<string>
): XmtpSigner {
  return {
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: 'address' as const,
    }),
    signMessage,
    // SCW signers must return the chain ID for EIP-1271 signature verification
    getChainId: () => BigInt(BASE_CHAIN_ID),
  };
}

/**
 * XMTP Client options
 * Production should use 'production' env
 */
export const XMTP_ENV = (import.meta.env.VITE_XMTP_ENV as 'dev' | 'production' | 'local') || 'dev';

/**
 * Placeholder for XMTP Client initialization
 * 
 * In production, this would use:
 * ```typescript
 * import { Client } from '@xmtp/browser-sdk';
 * 
 * const client = await Client.create(signer, {
 *   env: XMTP_ENV,
 *   dbEncryptionKey: generateDbEncryptionKey(), // For local storage encryption
 * });
 * ```
 * 
 * The client handles all E2E encryption automatically.
 * Messages are encrypted before leaving the device.
 */
export interface XmtpClientPlaceholder {
  address: string;
  inboxId: string;
  isConnected: boolean;
}

/**
 * Mock client creation for UI development
 * TODO: Replace with actual XMTP SDK implementation
 */
export async function createMockXmtpClient(address: string): Promise<XmtpClientPlaceholder> {
  // Simulate client initialization delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    address: address.toLowerCase(),
    inboxId: `inbox_${address.slice(0, 8)}`,
    isConnected: true,
  };
}

/**
 * Check if an address can receive XMTP messages
 * TODO: Replace with actual canMessage check from XMTP SDK
 */
export async function canMessageAddress(address: string): Promise<boolean> {
  // In production: return await Client.canMessage(address);
  // For now, return true for demo purposes
  console.log(`[XMTP] Checking if ${address} can receive messages`);
  return true;
}
