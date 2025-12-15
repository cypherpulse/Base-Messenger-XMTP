import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Conversation } from '@/store/chatStore';
import { useChatStore } from '@/store/chatStore';
import { AddressAvatar } from './AddressAvatar';
import { truncateAddress, formatMessageTime } from '@/utils/address';
import { Users, Check, CheckCheck } from 'lucide-react';

interface ChatListItemProps {
  conversation: Conversation;
}

export function ChatListItem({ conversation }: ChatListItemProps) {
  const { activeConversationId, setActiveConversation, getContact, profile } = useChatStore();
  const isActive = activeConversationId === conversation.id;

  // Get display name for the conversation
  const getDisplayName = () => {
    if (conversation.type === 'group' && conversation.name) {
      return conversation.name;
    }
    
    // For DMs, show the other participant
    const otherAddress = conversation.participants[0];
    const contact = getContact(otherAddress);
    
    if (contact?.ensName) return contact.ensName;
    if (contact?.nickname) return contact.nickname;
    return truncateAddress(otherAddress);
  };

  // Get primary address for avatar
  const primaryAddress = conversation.participants[0];

  // Check if last message was sent by current user
  const isSentByMe = conversation.lastMessage?.senderAddress.toLowerCase() === profile?.address?.toLowerCase();

  // Message status icon
  const StatusIcon = () => {
    if (!isSentByMe || !conversation.lastMessage) return null;
    
    const status = conversation.lastMessage.status;
    if (status === 'read') {
      return <CheckCheck className="w-4 h-4 text-primary" />;
    } else if (status === 'delivered' || status === 'sent') {
      return <CheckCheck className="w-4 h-4 text-muted-foreground" />;
    }
    return <Check className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'hsl(var(--secondary))' }}
      onClick={() => setActiveConversation(conversation.id)}
      className={cn(
        'flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-lg mx-2',
        isActive && 'bg-secondary'
      )}
    >
      {/* Avatar */}
      <div className="relative">
        <AddressAvatar address={primaryAddress} size="lg" />
        {conversation.type === 'group' && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Users className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-foreground truncate">
            {getDisplayName()}
          </span>
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {formatMessageTime(new Date(conversation.lastMessage.timestamp))}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <StatusIcon />
          <p className="text-sm text-muted-foreground truncate flex-1">
            {conversation.lastMessage?.content || 'No messages yet'}
          </p>
          
          {/* Unread badge */}
          {conversation.unreadCount > 0 && (
            <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
