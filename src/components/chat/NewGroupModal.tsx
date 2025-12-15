import { useState } from 'react';
import { X, Users, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChatStore, Conversation } from '@/store/chatStore';
import { isValidAddress, truncateAddress } from '@/utils/address';
import { AddressAvatar } from './AddressAvatar';
import { toast } from 'sonner';

interface NewGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewGroupModal({ open, onOpenChange }: NewGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const { addConversation, setActiveConversation } = useChatStore();

  const handleAddParticipant = () => {
    if (!isValidAddress(newAddress)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    if (participants.includes(newAddress.toLowerCase())) {
      toast.error('Address already added');
      return;
    }

    setParticipants([...participants, newAddress.toLowerCase()]);
    setNewAddress('');
  };

  const handleRemoveParticipant = (address: string) => {
    setParticipants(participants.filter(p => p !== address));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (participants.length < 2) {
      toast.error('Add at least 2 participants');
      return;
    }

    setIsCreating(true);

    try {
      // TODO: Create actual XMTP group with:
      // await client.conversations.newGroup(participants, {
      //   name: groupName,
      //   imageUrl: groupAvatar,
      // });

      const newGroup: Conversation = {
        id: `conv_group_${Date.now()}`,
        type: 'group',
        participants,
        name: groupName.trim(),
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addConversation(newGroup);
      setActiveConversation(newGroup.id);
      onOpenChange(false);
      resetForm();

      toast.success('Group created!');
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create group. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setGroupName('');
    setNewAddress('');
    setParticipants([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            New Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-secondary border-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Add Participants ({participants.length})</Label>
            <div className="flex gap-2">
              <Input
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="bg-secondary border-none font-mono text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddParticipant()}
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleAddParticipant}
                disabled={!isValidAddress(newAddress)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Participants list */}
          {participants.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {participants.map((address) => (
                <div
                  key={address}
                  className="flex items-center gap-2 p-2 bg-secondary rounded-lg"
                >
                  <AddressAvatar address={address} size="sm" />
                  <span className="flex-1 text-sm font-mono truncate">
                    {truncateAddress(address)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveParticipant(address)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || participants.length < 2 || isCreating}
            className="w-full gradient-primary"
          >
            {isCreating ? 'Creating...' : 'Create Group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
