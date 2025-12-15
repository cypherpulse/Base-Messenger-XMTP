import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChatStore, Conversation } from '@/store/chatStore';
import { isValidAddress, truncateAddress } from '@/utils/address';
import { canMessageAddress } from '@/lib/xmtp/client';
import { toast } from 'sonner';

interface NewChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewChatModal({ open, onOpenChange }: NewChatModalProps) {
  const [address, setAddress] = useState('');
  const [nickname, setNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  
  const { 
    addConversation, 
    setActiveConversation, 
    conversations,
    addContact,
  } = useChatStore();

  const handleStartChat = async () => {
    if (!isValidAddress(address)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    // Check if conversation already exists
    const existingConv = conversations.find(
      c => c.type === 'dm' && c.participants[0].toLowerCase() === address.toLowerCase()
    );

    if (existingConv) {
      setActiveConversation(existingConv.id);
      onOpenChange(false);
      resetForm();
      return;
    }

    setIsChecking(true);

    try {
      // Check if address can receive XMTP messages
      const canMessage = await canMessageAddress(address);
      
      if (!canMessage) {
        toast.error('This address has not enabled XMTP messaging');
        return;
      }

      // Save contact if nickname provided
      if (nickname) {
        addContact({
          address: address.toLowerCase(),
          nickname,
        });
      }

      // Create new conversation
      const newConversation: Conversation = {
        id: `conv_dm_${Date.now()}`,
        type: 'dm',
        participants: [address.toLowerCase()],
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addConversation(newConversation);
      setActiveConversation(newConversation.id);
      onOpenChange(false);
      resetForm();
      
      toast.success('Chat started!');
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast.error('Failed to start chat. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const resetForm = () => {
    setAddress('');
    setNickname('');
  };

  const isValid = isValidAddress(address);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            New Chat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="address">Wallet Address</Label>
            <Input
              id="address"
              placeholder="0x..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-secondary border-none font-mono text-sm"
            />
            {address && !isValid && (
              <p className="text-xs text-destructive">
                Please enter a valid Ethereum address
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (optional)</Label>
            <Input
              id="nickname"
              placeholder="Give this contact a name"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-secondary border-none"
            />
          </div>

          <Button
            onClick={handleStartChat}
            disabled={!isValid || isChecking}
            className="w-full gradient-primary"
          >
            {isChecking ? 'Checking...' : 'Start Chat'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
