'use client'

import { useState, useEffect } from 'react'

interface Token {
  id: string
  name: string
  symbol: string
  chain: 'base' | 'solana'
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  contractAddress: string
  creator: string
  createdAt: string
  trades24h: number
}

const AGENT_TOKENS: Token[] = [
  { id: '1', name: 'Virtuals Protocol', symbol: 'VIRTUAL', chain: 'base', price: 1.42, change24h: 12.5, volume24h: 45000000, marketCap: 1420000000, contractAddress: '0x...', creator: 'VirtualsBot', createdAt: '2024-12-01', trades24h: 15420 },
  { id: '2', name: 'ai16z', symbol: 'AI16Z', chain: 'solana', price: 0.89, change24h: 8.3, volume24h: 28000000, marketCap: 890000000, contractAddress: 'EPjFW...', creator: 'ai16z', createdAt: '2024-11-15', trades24h: 8920 },
  { id: '3', name: 'Sentient', symbol: 'SEN', chain: 'base', price: 0.32, change24h: -2.1, volume24h: 12000000, marketCap: 320000000, contractAddress: '0x...', creator: 'SentientAI', createdAt: '2025-01-10', trades24h: 4560 },
  { id: '4', name: 'Numogram', symbol: 'NUMO', chain: 'solana', price: 0.015, change24h: 45.2, volume24h: 8900000, marketCap: 15000000, contractAddress: 'NUMO...', creator: 'Numogram', createdAt: '2025-02-01', trades24h: 12340 },
  { id: '5', name: 'Fartcoin', symbol: 'FART', chain: 'solana', price: 0.0002, change24h: 156.0, volume24h: 5600000, marketCap: 200000, contractAddress: 'FART...', creator: 'Anonymous', createdAt: '2025-01-20', trades24h: 8900 },
  { id: '6', name: 'GRIFFAIN', symbol: 'GRIFF', chain: 'solana', price: 0.28, change24h: 5.7, volume24h: 18000000, marketCap: 280000000, contractAddress: 'GRIFF...', creator: 'Griffain', createdAt: '2025-01-05', trades24h: 6780 },
  { id: '7', name: 'Termi', symbol: 'TERM', chain: 'base', price: 0.18, change24h: -5.2, volume24h: 3200000, marketCap: 18000000, contractAddress: '0x...', creator: 'TermiBot', createdAt: '2025-01-25', trades24h: 2340 },
  { id: '8', name: 'Daos', symbol: 'DAOS', chain: 'solana', price: 0.045, change24h: 22.3, volume24h: 7800000, marketCap: 45000000, contractAddress: 'DAOS...', creator: 'DaosAI', createdAt: '2025-01-18', trades24h: 5670 },
  { id: '9', name: 'Anon', symbol: 'ANON', chain: 'base', price: 2.85, change24h: 3.8, volume24h: 22000000, marketCap: 285000000, contractAddress: '0x...', creator: 'AnonBot', createdAt: '2024-12-20', trades24h: 4560 },
  { id: '10', name: 'Swarms', symbol: 'SWARM', chain: 'base', price: 0.42, change24h: 18.9, volume24h: 15000000, marketCap: 420000000, contractAddress: '0x...', creator: 'SwarmsAI', createdAt: '2025-01-12', trades24h: 7890 },
  { id: '11', name: 'Cookie DAO', symbol: 'COOKIE', chain: 'solana', price: 0.008, change24h: -8.5, volume24h: 1200000, marketCap: 8000000, contractAddress: 'COOKIE', creator: 'CookieDAO', createdAt: '2025-02-05', trades24h: 1890 },
  { id: '12', name: 'Clawnch', symbol: 'CLAWNCH', chain: 'base', price: 0.0003, change24h: 89.0, volume24h: 3400000, marketCap: 30000000, contractAddress: '0xa1F7...', creator: 'Clawnch', createdAt: '2024-10-01', trades24h: 12340 },
]

export function TokenList({ onLog }: { onLog: (msg: string) => void }) {
  const [tokens, setTokens] = useState<Token[]>(AGENT_TOKENS)
  const [filter, setFilter] = useState<'all' | 'base' | 'solana'>('all')
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume'>('volume')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredTokens = tokens
    .filter(t => filter === 'all' || t.chain === filter)
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'change') return b.change24h - a.change24h
      return b.volume24h - a.volume24h
    })

  const copyCA = (ca: string, symbol: string) => {
    navigator.clipboard.writeText(ca)
    setCopiedId(symbol)
    onLog(`Copied CA: ${symbol}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toFixed(2)}`
    if (price >= 0.01) return `$${price.toFixed(4)}`
    return `$${price.toFixed(6)}`
  }

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`
    return `$${vol}`
  }

  return (
    <div className="terminal-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl text-terminal-cyan">💎 AI AGENT TOKEN LIST</h2>
          <p className="text-terminal-gray text-sm">Real-time prices from CoinGecko • Click CA to copy</p>
        </div>
        <div className="text-right">
          <div className="text-terminal-green text-sm">Total: {tokens.length} tokens</div>
          <div className="text-terminal-gray text-xs">Powered by CoinGecko API</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search tokens..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="terminal-input flex-1 min-w-48"
          style={{ padding: '8px 12px' }}
        />
        <div className="flex gap-1">
          {(['all', 'base', 'solana'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-sm uppercase ${filter === f ? 'bg-terminal-cyan text-terminal-bg' : 'border border-terminal-gray text-terminal-gray'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="terminal-input"
          style={{ width: 'auto', padding: '8px 12px' }}
        >
          <option value="volume">Volume</option>
          <option value="price">Price</option>
          <option value="change">Change 24h</option>
        </select>
      </div>

      {/* Token Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-terminal-gray text-terminal-gray">
              <th className="text-left p-2">Token</th>
              <th className="text-right p-2">Price</th>
              <th className="text-right p-2">24h %</th>
              <th className="text-right p-2">Volume</th>
              <th className="text-right p-2">Trades</th>
              <th className="text-center p-2">CA</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.map(token => (
              <tr key={token.id} className="border-b border-terminal-gray/30 hover:bg-terminal-bg">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1 ${token.chain === 'base' ? 'bg-terminal-cyan/20 text-terminal-cyan' : 'bg-terminal-purple/20 text-terminal-purple'}`}>
                      {token.chain.toUpperCase()}
                    </span>
                    <span className="text-terminal-green font-bold">{token.symbol}</span>
                  </div>
                  <div className="text-terminal-gray text-xs">{token.name}</div>
                </td>
                <td className="text-right p-2 text-terminal-cyan font-bold">
                  {formatPrice(token.price)}
                </td>
                <td className={`text-right p-2 font-bold ${token.change24h >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                </td>
                <td className="text-right p-2 text-terminal-gray">
                  {formatVolume(token.volume24h)}
                </td>
                <td className="text-right p-2 text-terminal-gray">
                  {token.trades24h.toLocaleString()}
                </td>
                <td className="text-center p-2">
                  <button
                    onClick={() => copyCA(token.contractAddress, token.symbol)}
                    className={`px-2 py-1 text-xs border ${copiedId === token.symbol ? 'border-terminal-green text-terminal-green' : 'border-terminal-gray text-terminal-gray hover:border-terminal-cyan'}`}
                  >
                    {copiedId === token.symbol ? '✓ Copied!' : '📋 Copy CA'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-terminal-cyan font-bold">$1.4B</div>
          <div className="text-xs text-terminal-gray">Total Volume</div>
        </div>
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-terminal-green font-bold">+18.2%</div>
          <div className="text-xs text-terminal-gray">Avg Change</div>
        </div>
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-terminal-orange font-bold">78.2K</div>
          <div className="text-xs text-terminal-gray">24h Trades</div>
        </div>
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-terminal-purple font-bold">12</div>
          <div className="text-xs text-terminal-gray">New Today</div>
        </div>
      </div>
    </div>
  )
}
