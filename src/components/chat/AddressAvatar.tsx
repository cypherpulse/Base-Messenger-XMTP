import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getAddressColor, truncateAddress } from '@/utils/address';
import { useChatStore } from '@/store/chatStore';

interface AddressAvatarProps {
  address: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function AddressAvatar({ 
  address, 
  size = 'md', 
  showOnline = false,
  className 
}: AddressAvatarProps) {
  const { getContact } = useChatStore();
  const contact = getContact(address);

  const avatarUrl = contact?.avatarUrl;
  const initials = useMemo(() => {
    if (contact?.nickname) {
      return contact.nickname.slice(0, 2).toUpperCase();
    }
    // Use first 2 chars after 0x
    return address.slice(2, 4).toUpperCase();
  }, [address, contact?.nickname]);

  const bgColor = getAddressColor(address);

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={contact?.nickname || truncateAddress(address)}
          className={cn(
            'rounded-full object-cover',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold text-white',
            sizeClasses[size],
            bgColor
          )}
        >
          {initials}
        </div>
      )}
      
      {showOnline && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-background" />
      )}
    </div>
  );
}
