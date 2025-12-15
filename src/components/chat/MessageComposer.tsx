import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore, Message } from '@/store/chatStore';
import { cn } from '@/lib/utils';

interface MessageComposerProps {
  conversationId: string;
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { addMessage, profile, updateMessageStatus } = useChatStore();

  const handleSend = async () => {
    if (!message.trim() || !profile?.address) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderAddress: profile.address,
      content: message.trim(),
      timestamp: new Date(),
      status: 'sending',
    };

    setMessage('');
    setIsSending(true);
    addMessage(newMessage);

    // Simulate sending delay
    // TODO: Replace with actual XMTP send
    setTimeout(() => {
      updateMessageStatus(newMessage.id, 'sent');
      setIsSending(false);
      
      // Simulate delivery after a bit
      setTimeout(() => {
        updateMessageStatus(newMessage.id, 'delivered');
      }, 1000);
    }, 500);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setMessage(target.value);
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="flex items-end gap-2">
        {/* Emoji button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <Smile className="w-5 h-5" />
        </Button>

        {/* Attachment button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            rows={1}
            className={cn(
              'w-full bg-secondary rounded-2xl px-4 py-2.5 text-sm resize-none',
              'focus:outline-none focus:ring-1 focus:ring-primary',
              'placeholder:text-muted-foreground',
              'max-h-[120px] scrollbar-thin'
            )}
          />
        </div>

        {/* Send / Voice button */}
        <motion.div whileTap={{ scale: 0.95 }}>
          {message.trim() ? (
            <Button
              size="icon"
              className="gradient-primary rounded-full flex-shrink-0 glow"
              onClick={handleSend}
              disabled={isSending}
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
