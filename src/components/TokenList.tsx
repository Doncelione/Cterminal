'use client'

import { useState, useEffect } from 'react'

interface Token {
  id: string
  name: string
  symbol: string
  coingeckoId: string
  chain: 'base' | 'solana'
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  contractAddress: string
  creator: string
  creatorAgent: string
  creatorAgentId?: string
  createdAt: string
  trades24h: number
  holders: number
  isNative: boolean
  dexScreener?: string
  description?: string
}

const STATIC_TOKENS: Token[] = [
  { id: '0', name: 'Clawnch Terminal', symbol: 'CT', coingeckoId: '', chain: 'solana', price: 0, change24h: 0, volume24h: 0, marketCap: 0, contractAddress: '3rYdrvmLDN2FwqR2XqwVhYE7MAJ9PrH9LYr7AQHT4kKx', creator: '9pkbh...', creatorAgent: 'CTerminal', creatorAgentId: '0', createdAt: '2025-02-25', trades24h: 0, holders: 0, isNative: true, description: 'Official CTerminal manager bot token', dexScreener: 'https://pump.fun/coin/3rYdrvmLDN2FwqR2XqwVhYE7MAJ9PrH9LYr7AQHT4kKx' },
  { id: '1', name: 'Virtuals Protocol', symbol: 'VIRTUAL', coingeckoId: 'virtual-protocol', chain: 'base', price: 0, change24h: 0, volume24h: 0, marketCap: 0, contractAddress: '0x5805eda6a2546d53e40c3c72cde586a6f2a53b7e', creator: '0x123...', creatorAgent: 'AlphaTrader', creatorAgentId: '1', createdAt: '2024-12-01', trades24h: 15420, holders: 12450, isNative: true },
  { id: '2', name: 'ai16z', symbol: 'AI16Z', coingeckoId: 'ai16z', chain: 'solana', price: 0, change24h: 0, volume24h: 0, marketCap: 0, contractAddress: 'EPjFW...', creator: 'EpCWf...', creatorAgent: 'ai16z', creatorAgentId: '2', createdAt: '2024-11-15', trades24h: 8920, holders: 8920, isNative: false, dexScreener: 'https://dexscreener.com/solana/ai16z' },
  { id: '10', name: 'Clawnch', symbol: 'CLAWNCH', coingeckoId: 'clawnch', chain: 'base', price: 0, change24h: 0, volume24h: 0, marketCap: 0, contractAddress: '0xa1F7...', creator: '0xa1F7...', creatorAgent: 'Clawnch', creatorAgentId: '10', createdAt: '2024-10-01', trades24h: 12340, holders: 8900, isNative: false, dexScreener: 'https://dexscreener.com/base/clawnch' },
]

interface TokenListProps {
  onLog: (msg: string) => void
  onTokenSelect: (symbol: string) => void
  onAgentSelect: (agentId: string) => void
}

export function TokenList({ onLog, onTokenSelect, onAgentSelect }: TokenListProps) {
  const [tokens, setTokens] = useState<Token[]>(STATIC_TOKENS as Token[])
  const [filter, setFilter] = useState<'all' | 'base' | 'solana' | 'native' | 'external'>('all')
  const [sortBy, setSortBy] = useState<'volume' | 'price' | 'change' | 'mc'>('volume')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch('/api/prices')
        const prices = await res.json()
        
        setTokens(prev => prev.map(t => {
          if (prices[t.symbol]) {
            return {
              ...t,
              price: prices[t.symbol].price,
              change24h: prices[t.symbol].change24h,
              volume24h: prices[t.symbol].volume24h,
              marketCap: prices[t.symbol].marketCap
            }
          }
          return t
        }))
      } catch (e) {
        console.error('Failed to fetch prices:', e)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPrices()
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredTokens = tokens
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
    if (price >= 0.0001) return `$${price.toFixed(6)}`
    return `$${price.toFixed(8)}`
  }

  const formatVolume = (vol: number) => {
    if (vol >= 1000000000) return `$${(vol / 1000000000).toFixed(1)}B`
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`
    if (vol >= 1000) return `$${(vol / 1000).toFixed(1)}K`
    return `$${vol}`
  }

  return (
    <div className="space-y-4">
      <div className="terminal-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-terminal-cyan">💎 TOKEN LIST</h2>
            <p className="text-terminal-gray text-sm">Real-time prices from CoinGecko • Click to view</p>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-terminal-yellow text-xs">Loading...</span>
            ) : (
              <span className="text-terminal-green text-xs">✓ Live</span>
            )}
          </div>
        </div>

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
            <option value="all">All</option>
            <option value="base">Base</option>
            <option value="solana">Solana</option>
            <option value="native">✓ Platform</option>
            <option value="external">📊 External</option>
          </select>
          
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="terminal-input" style={{ width: 'auto', padding: '8px' }}>
            <option value="volume">Volume</option>
            <option value="price">Price</option>
            <option value="change">Change</option>
            <option value="mc">MCap</option>
          </select>
        </div>
      </div>

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
                    {loading ? '...' : formatPrice(token.price)}
                  </td>
                  <td className={`text-right p-3 font-bold ${token.change24h >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
                    {loading ? '...' : `${token.change24h >= 0 ? '+' : ''}${token.change24h.toFixed(1)}%`}
                  </td>
                  <td className="text-right p-3 text-terminal-gray">
                    {loading ? '...' : formatVolume(token.volume24h)}
                  </td>
                  <td className="text-right p-3 text-terminal-gray">
                    {loading ? '...' : formatVolume(token.marketCap)}
                  </td>
                  <td className="text-center p-3">
                    {token.creatorAgentId ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); onAgentSelect(token.creatorAgentId!) }}
                        className="text-terminal-purple text-xs hover:underline"
                      >
                        {token.creatorAgent}
                      </button>
                    ) : (
                      <span className="text-terminal-gray text-xs">{token.creatorAgent}</span>
                    )}
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
