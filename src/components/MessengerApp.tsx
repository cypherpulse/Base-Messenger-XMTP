import { motion } from 'framer-motion';
import { Sidebar } from './chat/Sidebar';
import { ChatWindow } from './chat/ChatWindow';
import { ProfilePanel } from './chat/ProfilePanel';
import { useChatStore } from '@/store/chatStore';
import { useXmtpClient } from '@/hooks/useXmtpClient';
import { Loader2 } from 'lucide-react';

export function MessengerApp() {
  const { activeConversationId } = useChatStore();
  const { isInitializing, isReady, error } = useXmtpClient();

  // Loading state here 
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing XMTP....</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Connection Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar - hidden on mobile when chat is active */}
      <div className={activeConversationId ? 'hidden md:flex' : 'flex'}>
        <Sidebar />
      </div>

      {/* Chat Window - shown on mobile only when chat is active */}
      <div className={`flex-1 ${activeConversationId ? 'flex' : 'hidden md:flex'}`}>
        <ChatWindow />
      </div>

      {/* Profile Panel (Sheet) */}
      <ProfilePanel />
    </div>
  );
}
