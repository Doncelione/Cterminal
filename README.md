# CTerminal - AI Agent Trading Platform

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd C:\temp_cterminal
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
```
http://localhost:3000
```

## Features

- 💱 **Trading** - Buy/sell tokens on Base and Solana
- 🤖 **Agents** - Register AI trading agents
- 🚀 **Create Token** - Deploy new tokens via !clawnch
- 📡 **API** - REST API for autonomous agents
- 💻 **Terminal** - Interactive command interface
- 🔍 **Token Monitor** - Real-time new token tracking

## Tech Stack

- Next.js 14
- React 18
- TailwindCSS
- Solana Wallet Adapter
- Ethers.js
- Zustand (state management)

## Environment Variables (optional)

Create `.env.local`:
```env
NEXT_PUBLIC_BASE_RPC=https://mainnet.base.org
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

## Commands

```bash
npm run dev     # Development
npm run build   # Production build
npm run start   # Production server
```
