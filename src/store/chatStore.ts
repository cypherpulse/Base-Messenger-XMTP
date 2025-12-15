/**
 * Chat Store - Zustand state management
 * Manages conversations, messages, and UI state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  conversationId: string;
  senderAddress: string;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  reactions?: { emoji: string; from: string }[];
}

export interface Conversation {
  id: string;
  type: 'dm' | 'group';
  participants: string[];
  name?: string; // For groups
  avatarUrl?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  address: string;
  nickname?: string;
  ensName?: string;
  avatarUrl?: string;
  lastSeen?: Date;
}

export interface UserProfile {
  address: string;
  nickname?: string;
  avatarUrl?: string;
  ensName?: string;
}

interface ChatState {
  // User
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;

  // Messages
  messages: Record<string, Message[]>; // conversationId -> messages
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;

  // Contacts
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  updateContact: (address: string, updates: Partial<Contact>) => void;
  getContact: (address: string) => Contact | undefined;

  // UI State
  isNewChatModalOpen: boolean;
  setNewChatModalOpen: (open: boolean) => void;
  isNewGroupModalOpen: boolean;
  setNewGroupModalOpen: (open: boolean) => void;
  isProfilePanelOpen: boolean;
  setProfilePanelOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // User
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      // Conversations
      conversations: [],
      activeConversationId: null,
      setActiveConversation: (id) => {
        set({ activeConversationId: id });
        // Mark messages as read when opening conversation
        if (id) {
          set((state) => ({
            conversations: state.conversations.map((c) =>
              c.id === id ? { ...c, unreadCount: 0 } : c
            ),
          }));
        }
      },
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
          messages: { ...state.messages, [conversation.id]: [] },
        })),
      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        })),

      // Messages
      messages: {},
      addMessage: (message) =>
        set((state) => {
          const conversationMessages = state.messages[message.conversationId] || [];
          const newMessages = {
            ...state.messages,
            [message.conversationId]: [...conversationMessages, message],
          };

          // Update conversation with last message
          const conversations = state.conversations.map((c) => {
            if (c.id === message.conversationId) {
              const isActive = state.activeConversationId === c.id;
              const isSentByMe = message.senderAddress === state.profile?.address;
              return {
                ...c,
                lastMessage: message,
                updatedAt: new Date(),
                unreadCount: isActive || isSentByMe ? c.unreadCount : c.unreadCount + 1,
              };
            }
            return c;
          });

          // Sort conversations by updatedAt
          conversations.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

          return { messages: newMessages, conversations };
        }),
      updateMessageStatus: (messageId, status) =>
        set((state) => ({
          messages: Object.fromEntries(
            Object.entries(state.messages).map(([convId, msgs]) => [
              convId,
              msgs.map((m) => (m.id === messageId ? { ...m, status } : m)),
            ])
          ),
        })),

      // Contacts
      contacts: [],
      addContact: (contact) =>
        set((state) => ({
          contacts: [...state.contacts.filter((c) => c.address !== contact.address), contact],
        })),
      updateContact: (address, updates) =>
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.address.toLowerCase() === address.toLowerCase() ? { ...c, ...updates } : c
          ),
        })),
      getContact: (address) =>
        get().contacts.find((c) => c.address.toLowerCase() === address.toLowerCase()),

      // UI State
      isNewChatModalOpen: false,
      setNewChatModalOpen: (open) => set({ isNewChatModalOpen: open }),
      isNewGroupModalOpen: false,
      setNewGroupModalOpen: (open) => set({ isNewGroupModalOpen: open }),
      isProfilePanelOpen: false,
      setProfilePanelOpen: (open) => set({ isProfilePanelOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'web3-messenger-storage',
      partialize: (state) => ({
        profile: state.profile,
        contacts: state.contacts,
        // Don't persist conversations/messages - they come from XMTP
      }),
    }
  )
);
