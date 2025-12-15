import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquarePlus, Users, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/chatStore';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { ChatListItem } from './ChatListItem';
import { AddressAvatar } from './AddressAvatar';
import { truncateAddress } from '@/utils/address';
import { NewChatModal } from './NewChatModal';
import { NewGroupModal } from './NewGroupModal';

export function Sidebar() {
  const { 
    conversations, 
    searchQuery, 
    setSearchQuery,
    isNewChatModalOpen,
    setNewChatModalOpen,
    isNewGroupModalOpen,
    setNewGroupModalOpen,
    setProfilePanelOpen,
    profile,
  } = useChatStore();
  
  const { disconnect, address } = useWalletConnection();

  // Filter conversations based on search
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    // Search by group name
    if (conv.name?.toLowerCase().includes(query)) return true;
    
    // Search by participant address
    if (conv.participants.some(p => p.toLowerCase().includes(query))) return true;
    
    // Search in last message
    if (conv.lastMessage?.content.toLowerCase().includes(query)) return true;
    
    return false;
  });

  return (
    <>
      <div className="w-full md:w-96 h-full bg-sidebar flex flex-col border-r border-sidebar-border">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setProfilePanelOpen(true)}
            >
              {address && <AddressAvatar address={address} size="md" />}
              <div>
                <h2 className="font-semibold text-foreground">
                  {profile?.nickname || 'Web3 Messenger'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {address ? truncateAddress(address) : 'Not connected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProfilePanelOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => disconnect()}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 p-3 border-b border-sidebar-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setNewChatModalOpen(true)}
          >
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => setNewGroupModalOpen(true)}
          >
            <Users className="w-4 h-4" />
            New Group
          </Button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4">
              <MessageSquarePlus className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-center text-sm">
                {searchQuery 
                  ? 'No conversations found' 
                  : 'No conversations yet. Start chatting!'}
              </p>
            </div>
          ) : (
            <motion.div layout>
              {filteredConversations.map((conversation) => (
                <ChatListItem key={conversation.id} conversation={conversation} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewChatModal 
        open={isNewChatModalOpen} 
        onOpenChange={setNewChatModalOpen} 
      />
      <NewGroupModal 
        open={isNewGroupModalOpen} 
        onOpenChange={setNewGroupModalOpen} 
      />
    </>
  );
}
