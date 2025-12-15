import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, MessageCircle, Zap, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function LandingPage() {
  const { connect, connectWith, connectors, isConnecting } = useWalletConnection();
  const [showConnectors, setShowConnectors] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'End-to-End Encrypted',
      description: 'Messages secured by XMTP protocol',
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'No central servers or data collection',
    },
    {
      icon: Zap,
      title: 'Built on Base',
      description: 'Fast, low-cost transactions on L2',
    },
  ];

  const handleConnectorClick = (connector: typeof connectors[number]) => {
    connectWith(connector);
    setShowConnectors(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">Web3 Messenger</span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-2xl gradient-primary flex items-center justify-center glow animate-pulse-glow"
          >
            <MessageCircle className="w-12 h-12 text-primary-foreground" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-foreground">Messaging for the </span>
            <span className="gradient-text">Decentralized Web</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto">
            Private, encrypted conversations using your wallet address. 
            No phone number needed. Built on Base with XMTP.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => setShowConnectors(true)}
              disabled={isConnecting}
              className="gradient-primary text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl glow hover:opacity-90 transition-opacity"
            >
              <Wallet className="w-5 h-5 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </motion.div>

          <p className="mt-4 text-sm text-muted-foreground">
            Connect with MetaMask, Coinbase Wallet, or WalletConnect
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="p-6 rounded-2xl glass hover:border-primary/30 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-sm text-muted-foreground">
        <p>Powered by XMTP • Built on Base</p>
      </footer>

      {/* Connector Selection Modal */}
      <Dialog open={showConnectors} onOpenChange={setShowConnectors}>
        <DialogContent className="sm:max-w-md glass border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Connect Wallet
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-4">
            {connectors.map((connector) => (
              <Button
                key={connector.uid}
                variant="outline"
                className="w-full justify-between h-14 px-4"
                onClick={() => handleConnectorClick(connector)}
              >
                <span className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{connector.name}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
