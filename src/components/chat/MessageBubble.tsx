import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '@/store/chatStore';
import { useChatStore } from '@/store/chatStore';
import { formatBubbleTime, truncateAddress } from '@/utils/address';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  showSender?: boolean;
}

export function MessageBubble({ message, showSender = false }: MessageBubbleProps) {
  const { profile, getContact } = useChatStore();
  const isSentByMe = message.senderAddress.toLowerCase() === profile?.address?.toLowerCase();

  const getSenderName = () => {
    const contact = getContact(message.senderAddress);
    if (contact?.nickname) return contact.nickname;
    if (contact?.ensName) return contact.ensName;
    return truncateAddress(message.senderAddress);
  };

  const StatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3.5 h-3.5 text-muted-foreground" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-primary" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex mb-1',
        isSentByMe ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[75%] md:max-w-[65%] px-3 py-2 rounded-2xl relative',
          isSentByMe 
            ? 'bg-chat-sent text-white rounded-br-md' 
            : 'bg-chat-received text-foreground rounded-bl-md'
        )}
      >
        {/* Sender name for group chats */}
        {showSender && !isSentByMe && (
          <p className="text-xs font-medium text-primary mb-1">
            {getSenderName()}
          </p>
        )}

        {/* Message content */}
        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Timestamp and status */}
        <div className={cn(
          'flex items-center gap-1 mt-1',
          isSentByMe ? 'justify-end' : 'justify-start'
        )}>
          <span className={cn(
            'text-[10px]',
            isSentByMe ? 'text-white/70' : 'text-muted-foreground'
          )}>
            {formatBubbleTime(new Date(message.timestamp))}
          </span>
          {isSentByMe && <StatusIcon />}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="absolute -bottom-3 left-2 flex gap-0.5">
            {message.reactions.slice(0, 3).map((reaction, idx) => (
              <span 
                key={idx}
                className="bg-secondary text-sm px-1.5 py-0.5 rounded-full border border-border"
              >
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
