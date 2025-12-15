import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Video, MoreVertical, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/chatStore';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { AddressAvatar } from './AddressAvatar';
import { truncateAddress } from '@/utils/address';
import { cn } from '@/lib/utils';

export function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    activeConversationId, 
    setActiveConversation,
    conversations, 
    messages,
    getContact,
  } = useChatStore();
  
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const conversationMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Get display name
  const getDisplayName = () => {
    if (!activeConversation) return '';
    
    if (activeConversation.type === 'group' && activeConversation.name) {
      return activeConversation.name;
    }
    
    const otherAddress = activeConversation.participants[0];
    const contact = getContact(otherAddress);
    
    if (contact?.ensName) return contact.ensName;
    if (contact?.nickname) return contact.nickname;
    return truncateAddress(otherAddress);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  // Empty state
  if (!activeConversation) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center glow">
            <svg 
              className="w-12 h-12 text-primary-foreground" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Web3 Messenger
          </h2>
          <p className="text-muted-foreground max-w-md">
            Select a conversation or start a new chat to send end-to-end encrypted messages on Base
          </p>
        </motion.div>
      </div>
    );
  }

  const isGroup = activeConversation.type === 'group';
  const primaryAddress = activeConversation.participants[0];

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 px-4 flex items-center gap-3 border-b border-border bg-card/50 backdrop-blur-sm">
        {/* Back button (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-muted-foreground"
          onClick={() => setActiveConversation(null)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Avatar */}
        <AddressAvatar address={primaryAddress} size="md" showOnline />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {getDisplayName()}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {isGroup ? (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {activeConversation.participants.length} participants
              </span>
            ) : (
              truncateAddress(primaryAddress)
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        className={cn(
          'flex-1 overflow-y-auto scrollbar-thin p-4',
          'bg-gradient-to-b from-background to-background/95'
        )}
      >
        <AnimatePresence initial={false}>
          {conversationMessages.map((message, index) => {
            const prevMessage = conversationMessages[index - 1];
            const showSender = isGroup && 
              (!prevMessage || prevMessage.senderAddress !== message.senderAddress);
            
            return (
              <MessageBubble 
                key={message.id} 
                message={message}
                showSender={showSender}
              />
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <MessageComposer conversationId={activeConversation.id} />
    </div>
  );
}
