'use client'

import { useState } from 'react'

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
  creatorAgent: string
  createdAt: string
  trades24h: number
  holders: number
  isNative: boolean // создан на платформе
  dexScreener?: string
  description?: string
}

const TOKENS: Token[] = [
  { id: '1', name: 'Virtuals Protocol', symbol: 'VIRTUAL', chain: 'base', price: 1.42, change24h: 12.5, volume24h: 45000000, marketCap: 1420000000, contractAddress: '0x5805...', creator: '0x123...', creatorAgent: 'AlphaTrader', createdAt: '2024-12-01', trades24h: 15420, holders: 12450, isNative: true },
  { id: '2', name: 'ai16z', symbol: 'AI16Z', chain: 'solana', price: 0.89, change24h: 8.3, volume24h: 28000000, marketCap: 890000000, contractAddress: 'EPjFW...', creator: 'EpCWf...', creatorAgent: 'ai16z', createdAt: '2024-11-15', trades24h: 8920, holders: 8920, isNative: false, dexScreener: 'https://dexscreener.com/solana/AI16Z' },
  { id: '3', name: 'Sentient', symbol: 'SEN', chain: 'base', price: 0.32, change24h: -2.1, volume24h: 12000000, marketCap: 320000000, contractAddress: '0x9805...', creator: '0x456...', creatorAgent: 'SentientAI', createdAt: '2025-01-10', trades24h: 4560, holders: 2340, isNative: true },
  { id: '4', name: 'Numogram', symbol: 'NUMO', chain: 'solana', price: 0.015, change24h: 45.2, volume24h: 8900000, marketCap: 15000000, contractAddress: 'NUMOa...', creator: 'NmGr...', creatorAgent: 'Numogram', createdAt: '2025-02-01', trades24h: 12340, holders: 5670, isNative: false, dexScreener: 'https://dexscreener.com/solana/NUMO' },
  { id: '5', name: 'Fartcoin', symbol: 'FART', chain: 'solana', price: 0.0002, change24h: 156.0, volume24h: 5600000, marketCap: 200000, contractAddress: 'FARTm...', creator: 'Anony...', creatorAgent: 'Anonymous', createdAt: '2025-01-20', trades24h: 8900, holders: 12340, isNative: false, dexScreener: 'https://dexscreener.com/solana/FART' },
  { id: '6', name: 'GRIFFAIN', symbol: 'GRIFF', chain: 'solana', price: 0.28, change24h: 5.7, volume24h: 18000000, marketCap: 280000000, contractAddress: 'GRFF...', creator: 'Grff...', creatorAgent: 'Griffain', createdAt: '2025-01-05', trades24h: 6780, holders: 4560, isNative: false, dexScreener: 'https://dexscreener.com/solana/GRIFF' },
  { id: '7', name: 'Termi', symbol: 'TERM', chain: 'base', price: 0.18, change24h: -5.2, volume24h: 3200000, marketCap: 18000000, contractAddress: '0x789...', creator: '0xabc...', creatorAgent: 'TermiBot', createdAt: '2025-01-25', trades24h: 2340, holders: 890, isNative: true },
  { id: '8', name: 'Daos', symbol: 'DAOS', chain: 'solana', price: 0.045, change24h: 22.3, volume24h: 7800000, marketCap: 45000000, contractAddress: 'DAOSp...', creator: 'Daos...', creatorAgent: 'DaosAI', createdAt: '2025-01-18', trades24h: 5670, holders: 2340, isNative: false, dexScreener: 'https://dexscreener.com/solana/DAOS' },
  { id: '9', name: 'Swarms', symbol: 'SWARM', chain: 'base', price: 0.42, change24h: 18.9, volume24h: 15000000, marketCap: 420000000, contractAddress: '0xdef...', creator: '0xghi...', creatorAgent: 'SwarmsAI', createdAt: '2025-01-12', trades24h: 7890, holders: 3450, isNative: true },
  { id: '10', name: 'Clawnch Terminal', symbol: 'CTERM', chain: 'base', price: 0.001, change24h: 5.2, volume24h: 450000, marketCap: 1000000, contractAddress: '0x3b7...', creator: '0x3b7...', creatorAgent: 'CTerminalAgent', createdAt: '2025-02-18', trades24h: 234, holders: 156, isNative: true, description: 'Our native token - agent trading terminal' },
]

interface TokenListProps {
  onLog: (msg: string) => void
  onTokenSelect: (symbol: string) => void
}

export function TokenList({ onLog, onTokenSelect }: TokenListProps) {
  const [filter, setFilter] = useState<'all' | 'base' | 'solana' | 'native' | 'external'>('all')
  const [sortBy, setSortBy] = useState<'volume' | 'price' | 'change' | 'mc'>('volume')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredTokens = TOKENS
    .filter(t => {
      if (filter === 'all') return true
      if (filter === 'base') return t.chain === 'base'
      if (filter === 'solana') return t.chain === 'solana'
      if (filter === 'native') return t.isNative
      if (filter === 'external') return !t.isNative
      return true
    })
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'volume') return b.volume24h - a.volume24h
      if (sortBy === 'price') return b.price - a.price
      if (sortBy === 'change') return b.change24h - a.change24h
      return b.marketCap - a.marketCap
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
    <div className="space-y-4">
      {/* Header */}
      <div className="terminal-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-terminal-cyan">💎 TOKEN LIST</h2>
            <p className="text-terminal-gray text-sm">AI Agent tokens • Click to view details</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs ${filter === 'native' ? 'bg-terminal-green text-terminal-bg' : 'bg-terminal-gray/20 text-terminal-gray'}`}>
              Platform: {TOKENS.filter(t => t.isNative).length}
            </span>
            <span className={`px-2 py-1 text-xs ${filter === 'external' ? 'bg-terminal-orange text-terminal-bg' : 'bg-terminal-gray/20 text-terminal-gray'}`}>
              External: {TOKENS.filter(t => !t.isNative).length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            placeholder="Search tokens..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="terminal-input flex-1 min-w-40"
            style={{ padding: '8px 12px' }}
          />
          
          <select value={filter} onChange={e => setFilter(e.target.value as any)} className="terminal-input" style={{ width: 'auto', padding: '8px' }}>
            <option value="all">All Chains</option>
            <option value="base">Base</option>
            <option value="solana">Solana</option>
            <option value="native">🟢 Platform</option>
            <option value="external">🟠 External</option>
          </select>
          
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="terminal-input" style={{ width: 'auto', padding: '8px' }}>
            <option value="volume">Volume</option>
            <option value="price">Price</option>
            <option value="change">Change</option>
            <option value="mc">MCap</option>
          </select>
        </div>
      </div>

      {/* Token Table */}
      <div className="terminal-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-terminal-gray text-terminal-gray">
                <th className="text-left p-3">Token</th>
                <th className="text-right p-3">Price</th>
                <th className="text-right p-3">24h %</th>
                <th className="text-right p-3">Volume</th>
                <th className="text-right p-3">MCap</th>
                <th className="text-center p-3">Creator</th>
                <th className="text-center p-3">CA</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map(token => (
                <tr 
                  key={token.id} 
                  onClick={() => onTokenSelect(token.symbol)}
                  className="border-b border-terminal-gray/30 hover:bg-terminal-bg cursor-pointer transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1 ${token.chain === 'base' ? 'bg-terminal-cyan/20 text-terminal-cyan' : 'bg-terminal-purple/20 text-terminal-purple'}`}>
                        {token.chain.toUpperCase()}
                      </span>
                      {token.isNative ? (
                        <span className="text-xs px-1 bg-terminal-green/20 text-terminal-green" title="Created on platform">✓</span>
                      ) : (
                        <a 
                          href={token.dexScreener} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-xs px-1 bg-terminal-orange/20 text-terminal-orange hover:underline"
                          title="View on DexScreener"
                        >
                          📊
                        </a>
                      )}
                      <span className="text-terminal-green font-bold">{token.symbol}</span>
                    </div>
                    <div className="text-terminal-gray text-xs">{token.name}</div>
                  </td>
                  <td className="text-right p-3 text-terminal-cyan font-bold">
                    {formatPrice(token.price)}
                  </td>
                  <td className={`text-right p-3 font-bold ${token.change24h >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                  </td>
                  <td className="text-right p-3 text-terminal-gray">
                    {formatVolume(token.volume24h)}
                  </td>
                  <td className="text-right p-3 text-terminal-gray">
                    {formatVolume(token.marketCap)}
                  </td>
                  <td className="text-center p-3">
                    <span className="text-terminal-purple text-xs">{token.creatorAgent}</span>
                  </td>
                  <td className="text-center p-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); copyCA(token.contractAddress, token.symbol) }}
                      className={`px-2 py-1 text-xs border ${copiedId === token.symbol ? 'border-terminal-green text-terminal-green' : 'border-terminal-gray text-terminal-gray hover:border-terminal-cyan'}`}
                    >
                      {copiedId === token.symbol ? '✓' : '📋'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
