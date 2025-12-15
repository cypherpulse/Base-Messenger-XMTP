import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useChatStore } from '@/store/chatStore';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { AddressAvatar } from './AddressAvatar';
import { truncateAddress } from '@/utils/address';
import { toast } from 'sonner';

export function ProfilePanel() {
  const { isProfilePanelOpen, setProfilePanelOpen, profile, updateProfile } = useChatStore();
  const { address, isOnBase, switchToBase } = useWalletConnection();
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    updateProfile({
      nickname: nickname.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
    });
    toast.success('Profile updated!');
  };

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Address copied!');
  };

  return (
    <Sheet open={isProfilePanelOpen} onOpenChange={setProfilePanelOpen}>
      <SheetContent className="glass border-border w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {address && (
                <AddressAvatar address={address} size="xl" />
              )}
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center">
              <h3 className="font-semibold text-foreground">
                {profile?.nickname || 'Anonymous'}
              </h3>
              <div 
                className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={copyAddress}
              >
                <span className="font-mono">{address ? truncateAddress(address, 6, 4) : 'Not connected'}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Network status */}
          <div className="p-4 bg-secondary rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Network</span>
              <span className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${isOnBase ? 'bg-online' : 'bg-destructive'}`} />
                {isOnBase ? 'Base' : 'Wrong Network'}
              </span>
            </div>
            {!isOnBase && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={switchToBase}
              >
                Switch to Base
              </Button>
            )}
          </div>

          {/* XMTP Status */}
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">XMTP Status</span>
              <span className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-online" />
                Connected
              </span>
            </div>
          </div>

          {/* Edit profile */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Display Name</Label>
              <Input
                id="nickname"
                placeholder="Enter your display name"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-secondary border-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="bg-secondary border-none"
              />
            </div>

            <Button onClick={handleSave} className="w-full gradient-primary">
              Save Changes
            </Button>
          </div>

          {/* Links */}
          <div className="pt-4 border-t border-border space-y-2">
            <a
              href="https://base.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <span className="text-sm">About Base</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
            <a
              href="https://xmtp.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <span className="text-sm">About XMTP</span>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
