# Base Messenger

A decentralized, WhatsApp-style messaging web app built on the Base network using the XMTP protocol for end-to-end encrypted messaging. Users connect their wallets via Reown/WalletConnect, leveraging their Ethereum addresses on Base as identities for direct and group messaging.

## Features

- **Wallet-Based Authentication**: Connect using Reown/WalletConnect with support for EOAs and Smart Contract Wallets on Base.
- **End-to-End Encrypted Messaging**: Powered by XMTP protocol – no custom crypto, no plaintext storage.
- **WhatsApp-Style UX**: Recent chats, 1:1 DMs via wallet addresses or ENS, group chats, real-time messaging with timestamps and status indicators.
- **Real-Time Updates**: Utilizes XMTP streaming APIs for live message delivery.
- **Local Contacts**: Client-side storage for nicknames, ENS resolution, and avatars.
- **Spam Control**: Built-in consent management using XMTP consent states.

## Tech Stack

- **Frontend**: React 19+, TypeScript, Tailwind CSS
- **Messaging**: XMTP Browser SDK (@xmtp/browser-sdk)
- **Wallets**: Reown/WalletConnect AppKit (EVM wallets on Base)
- **Network**: Base mainnet (chainId: 8453)
- **State Management**: React hooks with Zustand/React Query

## Architecture

Single-page React app with WhatsApp Web-inspired layout:

- **Left Sidebar**: Wallet identity, search, recent conversations, new chat/group actions
- **Right Pane**: Chat header, scrollable messages, composer with text/emoji/attachments

Wallet connection initializes XMTP Client; messages are handled via XMTP conversations for encryption and delivery.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Browser wallet (e.g., MetaMask) with Base mainnet funds
- WalletConnect/Reown project ID
- XMTP-compatible wallet identity

### Installation

```bash
git clone <repo-url>
cd base-messenger
npm install
npm install @xmtp/browser-sdk
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure Tailwind for React (content: `./src/**/*.{js,jsx,ts,tsx}`).

### Environment Variables

Create `.env.local`:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_XMTP_ENV=production
VITE_BASE_CHAIN_ID=8453
```

### Run

```bash
npm run dev
```

Connect wallet, initialize XMTP, and start messaging.

## Core Flows

1. **Connect Wallet & XMTP**: Derive signer, create XMTP Client.
2. **Conversations**: List/filter allowed DMs/groups, load messages.
3. **New Chats**: Create DMs or groups via XMTP APIs.
4. **Messaging**: Send/receive via conversation streams.
5. **Profiles**: Local contacts and profile management.

## Security & Privacy

- End-to-end encryption via XMTP.
- No centralized plaintext storage.
- Secure media handling for future features.

## Roadmap

- Push notifications
- Media previews and decentralized storage
- Advanced reactions and threading
- On-chain features with Base tokens

## Contributing

Open issues and PRs for improvements.

## Acknowledgements

- XMTP for messaging infrastructure
- Base for L2 network and identities
- Reown/WalletConnect for wallet connections
