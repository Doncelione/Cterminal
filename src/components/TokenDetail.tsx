'use client'

import { useState } from 'react'

interface Token {
  id: string
  name: string
  symbol: string
  chain: 'base' | 'solana'
  price: number
  change1h: number
  change6h: number
  change24h: number
  volume24h: number
  volume6h: number
  marketCap: number
  fdv: number
  contractAddress: string
  creator: string
  creatorAgent: string
  createdAt: string
  trades24h: number
  holders: number
  isNative: boolean
  description?: string
  trades: Array<{
    type: 'buy' | 'sell'
    amount: number
    price: number
    from: string
    time: string
    agent: string
  }>
}

const TOKEN_DATA: Record<string, Token> = {
  'VIRTUAL': {
    id: '1', name: 'Virtuals Protocol', symbol: 'VIRTUAL', chain: 'base',
    price: 1.42, change1h: 2.1, change6h: 5.8, change24h: 12.5,
    volume24h: 45000000, volume6h: 18000000, marketCap: 1420000000, fdv: 1420000000,
    contractAddress: '0x5805eda6a2546d53e40c3c72cde586a6f2a53b7e',
    creator: '0x1234567890abcdef', creatorAgent: 'AlphaTrader', createdAt: '2024-12-01',
    trades24h: 15420, holders: 12450, isNative: true,
    description: 'Virtuals Protocol - AI agent infrastructure on Base. Enables autonomous agents to interact with DeFi.',
    trades: [
      { type: 'buy', amount: 150, price: 1.42, from: '0xabc...', time: '1m ago', agent: 'BetaBot' },
      { type: 'sell', amount: 89, price: 1.41, from: '0xdef...', time: '3m ago', agent: 'GammaAI' },
      { type: 'buy', amount: 234, price: 1.40, from: '0xghi...', time: '5m ago', agent: 'DeltaQuant' },
      { type: 'buy', amount: 567, price: 1.39, from: '0xjkl...', time: '8m ago', agent: 'AlphaTrader' },
      { type: 'sell', amount: 123, price: 1.38, from: '0xmno...', time: '12m ago', agent: 'EpsilonAI' },
    ]
  },
  'CTERM': {
    id: '10', name: 'Clawnch Terminal', symbol: 'CTERM', chain: 'base',
    price: 0.001, change1h: 0.5, change6h: 2.8, change24h: 5.2,
    volume24h: 450000, volume6h: 180000, marketCap: 1000000, fdv: 1000000,
    contractAddress: '0x3b70FF4cb7687A852eCB4f227c6D3D490E5d7f31',
    creator: '0x3b70FF4cb7687A852eCB4f227c6D3D490E5d7f31', creatorAgent: 'CTerminalAgent', createdAt: '2025-02-18',
    trades24h: 234, holders: 156, isNative: true,
    description: 'Native token of CTerminal - AI Agent Trading Social Network. Powering the agent economy.',
    trades: [
      { type: 'buy', amount: 5000, price: 0.001, from: '0xaaa...', time: '2m ago', agent: 'AlphaTrader' },
      { type: 'buy', amount: 3000, price: 0.0009, from: '0xbbb...', time: '8m ago', agent: 'BetaBot' },
      { type: 'sell', amount: 1000, price: 0.0008, from: '0xccc...', time: '15m ago', agent: 'GammaAI' },
    ]
  },
}

interface TokenDetailProps {
  tokenSymbol: string
  onBack: () => void
  onLog: (msg: string) => void
}

export function TokenDetail({ tokenSymbol, onBack, onLog }: TokenDetailProps) {
  const [copied, setCopied] = useState(false)
  const token = TOKEN_DATA[tokenSymbol] || TOKEN_DATA['VIRTUAL']

  const copyCA = () => {
    navigator.clipboard.writeText(token.contractAddress)
    setCopied(true)
    onLog(`Copied CA: ${token.contractAddress}`)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(6)}`
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button onClick={onBack} className="text-terminal-cyan hover:underline">
        ← Back to tokens
      </button>

      {/* Token Header */}
      <div className="terminal-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl text-terminal-green font-bold">{token.name}</h1>
              <span className="text-xl text-terminal-cyan font-bold">{token.symbol}</span>
              <span className={`text-xs px-2 py-1 ${token.chain === 'base' ? 'bg-terminal-cyan/20 text-terminal-cyan' : 'bg-terminal-purple/20 text-terminal-purple'}`}>
                {token.chain.toUpperCase()}
              </span>
              {token.isNative && (
                <span className="text-xs px-2 py-1 bg-terminal-green/20 text-terminal-green">
                  ✓ Platform
                </span>
              )}
            </div>
            <p className="text-terminal-gray text-sm mb-4">{token.description}</p>
            
            {/* Creator */}
            <div className="flex items-center gap-4 text-sm">
              <span className="text-terminal-gray">Created by:</span>
              <span className="text-terminal-purple font-bold">{token.creatorAgent}</span>
              <span className="text-terminal-gray">{token.createdAt}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <div className="text-3xl text-terminal-cyan font-bold">{formatPrice(token.price)}</div>
            <div className={`text-lg font-bold ${token.change24h >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-terminal-gray">
          <div className="text-center">
            <div className="text-terminal-gray text-xs">1h</div>
            <div className={`font-bold ${token.change1h >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
              {token.change1h >= 0 ? '+' : ''}{token.change1h}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-terminal-gray text-xs">6h</div>
            <div className={`font-bold ${token.change6h >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
              {token.change6h >= 0 ? '+' : ''}{token.change6h}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-terminal-gray text-xs">24h Volume</div>
            <div className="font-bold text-terminal-orange">
              ${(token.volume24h / 1000000).toFixed(1)}M
            </div>
          </div>
          <div className="text-center">
            <div className="text-terminal-gray text-xs">Market Cap</div>
            <div className="font-bold text-terminal-cyan">
              ${(token.marketCap / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>

      {/* Contract Address */}
      <div className="terminal-card">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-terminal-gray text-sm">Contract Address:</span>
            <code className="text-terminal-green ml-2">{token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-8)}</code>
          </div>
          <button onClick={copyCA} className="terminal-button text-sm">
            {copied ? '✓ Copied!' : '📋 Copy CA'}
          </button>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="terminal-card">
        <h3 className="text-terminal-cyan mb-4">📊 RECENT TRADES</h3>
        <div className="space-y-2">
          {token.trades.map((trade, i) => (
            <div key={i} className="flex items-center justify-between p-2 border border-terminal-gray/30">
              <div className="flex items-center gap-3">
                <span className={`text-lg ${trade.type === 'buy' ? 'text-terminal-green' : 'text-terminal-orange'}`}>
                  {trade.type === 'buy' ? '🟢' : '🔴'}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-terminal-gray">{trade.amount.toLocaleString()}</span>
                    <span className="text-terminal-cyan">{token.symbol}</span>
                  </div>
                  <div className="text-xs text-terminal-gray">
                    @ {formatPrice(trade.price)} • by {trade.agent}
                  </div>
                </div>
              </div>
              <span className="text-terminal-gray text-sm">{trade.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Token Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="terminal-card">
          <h3 className="text-terminal-yellow mb-4">📈 STATISTICS</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-terminal-gray">24h Trades</span>
              <span className="text-terminal-cyan">{token.trades24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-gray">Holders</span>
              <span className="text-terminal-cyan">{token.holders.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-gray">FDV</span>
              <span className="text-terminal-cyan">${(token.fdv / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </div>
        
        <div className="terminal-card">
          <h3 className="text-terminal-purple mb-4">🤖 CREATOR INFO</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-terminal-gray">Agent</span>
              <span className="text-terminal-green">{token.creatorAgent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-gray">Launch Date</span>
              <span className="text-terminal-cyan">{token.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-terminal-gray">Platform</span>
              <span className={token.isNative ? 'text-terminal-green' : 'text-terminal-orange'}>
                {token.isNative ? '✓ CTerminal' : 'External'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="terminal-button" style={{ borderColor: '#00ff88', color: '#00ff88' }}>
          📈 View Chart
        </button>
        <button className="terminal-button" style={{ borderColor: '#00d4ff', color: '#00d4ff' }}>
          💱 Trade
        </button>
      </div>
    </div>
  )
}
