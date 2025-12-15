/**
 * Hook for XMTP client management
 * Handles client initialization, conversations, and real-time messaging
 * 
 * NOTE: This is a placeholder implementation for UI development.
 * TODO: Replace with actual @xmtp/browser-sdk integration
 */

import { useState, useEffect, useCallback } from 'react';
import { useWalletConnection } from './useWalletConnection';
import { createMockXmtpClient, XmtpClientPlaceholder } from '@/lib/xmtp/client';
import { useChatStore, Conversation, Message } from '@/store/chatStore';

// Mock data for development
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    type: 'dm',
    participants: ['0x742d35Cc6634C0532925a3b844Bc9e7595f1dB38'],
    name: undefined,
    unreadCount: 2,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 300000),
    lastMessage: {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f1dB38',
      content: 'Hey! Did you see the latest Base updates? 🚀',
      timestamp: new Date(Date.now() - 300000),
      status: 'delivered',
    },
  },
  {
    id: 'conv_2',
    type: 'group',
    participants: [
      '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    ],
    name: 'Base Builders',
    unreadCount: 5,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 60000),
    lastMessage: {
      id: 'msg_2',
      conversationId: 'conv_2',
      senderAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      content: 'Just deployed my first contract on Base! 🎉',
      timestamp: new Date(Date.now() - 60000),
      status: 'sent',
    },
  },
  {
    id: 'conv_3',
    type: 'dm',
    participants: ['0xFABB0ac9d68B0B445fB7357272Ff202C5651694a'],
    name: undefined,
    unreadCount: 0,
    createdAt: new Date(Date.now() - 604800000),
    updatedAt: new Date(Date.now() - 3600000),
    lastMessage: {
      id: 'msg_3',
      conversationId: 'conv_3',
      senderAddress: '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
      content: 'Sure, I can help with that smart contract audit',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
    },
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  conv_1: [
    {
      id: 'msg_1_1',
      conversationId: 'conv_1',
      senderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f1dB38',
      content: 'Hey there! 👋',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
    },
    {
      id: 'msg_1_2',
      conversationId: 'conv_1',
      senderAddress: 'self',
      content: 'Hi! How are you doing?',
      timestamp: new Date(Date.now() - 3500000),
      status: 'read',
    },
    {
      id: 'msg_1_3',
      conversationId: 'conv_1',
      senderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f1dB38',
      content: "I'm great! Been working on some cool Web3 stuff",
      timestamp: new Date(Date.now() - 3400000),
      status: 'read',
    },
    {
      id: 'msg_1_4',
      conversationId: 'conv_1',
      senderAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f1dB38',
      content: 'Hey! Did you see the latest Base updates? 🚀',
      timestamp: new Date(Date.now() - 300000),
      status: 'delivered',
    },
  ],
  conv_2: [
    {
      id: 'msg_2_1',
      conversationId: 'conv_2',
      senderAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
      content: 'Welcome everyone to the Base Builders group!',
      timestamp: new Date(Date.now() - 172800000),
      status: 'read',
    },
    {
      id: 'msg_2_2',
      conversationId: 'conv_2',
      senderAddress: '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
      content: "Thanks for adding me! Excited to be here",
      timestamp: new Date(Date.now() - 172000000),
      status: 'read',
    },
    {
      id: 'msg_2_3',
      conversationId: 'conv_2',
      senderAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      content: 'Just deployed my first contract on Base! 🎉',
      timestamp: new Date(Date.now() - 60000),
      status: 'sent',
    },
  ],
  conv_3: [
    {
      id: 'msg_3_1',
      conversationId: 'conv_3',
      senderAddress: 'self',
      content: 'Hi! I saw your profile - could you help review a smart contract?',
      timestamp: new Date(Date.now() - 7200000),
      status: 'read',
    },
    {
      id: 'msg_3_2',
      conversationId: 'conv_3',
      senderAddress: '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
      content: 'Sure, I can help with that smart contract audit',
      timestamp: new Date(Date.now() - 3600000),
      status: 'read',
    },
  ],
};

export function useXmtpClient() {
  const { address, isConnected, signMessage } = useWalletConnection();
  const [client, setClient] = useState<XmtpClientPlaceholder | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    conversations, 
    addConversation, 
    messages,
    addMessage,
    profile,
  } = useChatStore();

  // Initialize XMTP client when wallet connects
  const initializeClient = useCallback(async () => {
    if (!address || !isConnected) return;

    setIsInitializing(true);
    setError(null);

    try {
      // Create mock client for now
      const xmtpClient = await createMockXmtpClient(address);
      setClient(xmtpClient);

      // Load mock conversations if none exist
      if (conversations.length === 0) {
        MOCK_CONVERSATIONS.forEach((conv) => {
          addConversation(conv);
        });

        // Load mock messages
        Object.entries(MOCK_MESSAGES).forEach(([convId, msgs]) => {
          msgs.forEach((msg) => {
            if (msg.senderAddress === 'self' && profile?.address) {
              msg.senderAddress = profile.address;
            }
            addMessage(msg);
          });
        });
      }

      console.log('[XMTP] Client initialized for:', address);
    } catch (err) {
      console.error('[XMTP] Failed to initialize:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize XMTP');
    } finally {
      setIsInitializing(false);
    }
  }, [address, isConnected, conversations.length, addConversation, addMessage, profile]);

  // Auto-initialize when wallet connects
  useEffect(() => {
    if (isConnected && address && !client && !isInitializing) {
      initializeClient();
    }
  }, [isConnected, address, client, isInitializing, initializeClient]);

  // Reset client when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setClient(null);
    }
  }, [isConnected]);

  return {
    client,
    isInitializing,
    error,
    isReady: !!client && client.isConnected,
    initializeClient,
  };
}
