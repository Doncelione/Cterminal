'use client'

import { useState, useEffect } from 'react'

interface TokenMonitorProps {
  onTokenSelect: (token: string) => void
}

// Mock new tokens for demo
const NEW_TOKENS = [
  { name: 'AGI Token', symbol: 'AGI', time: '2m ago', liquidity: '$12K', verified: true },
  { name: 'Neural Net', symbol: 'NNET', time: '5m ago', liquidity: '$8K', verified: true },
  { name: 'AI Agent', symbol: 'AGENT', time: '8m ago', liquidity: '$25K', verified: false },
  { name: 'Web3 Bot', symbol: 'BOT', time: '12m ago', liquidity: '$5K', verified: true },
  { name: 'Machine Learn', symbol: 'ML', time: '15m ago', liquidity: '$18K', verified: false },
]

export function TokenMonitor({ onTokenSelect }: TokenMonitorProps) {
  const [tokens, setTokens] = useState(NEW_TOKENS)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const handleClear = () => {
    setTokens([])
  }

  return (
    <div className="terminal-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-terminal-cyan">🔍 NEW TOKENS MONITOR</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-xs px-2 py-1 border border-terminal-green text-terminal-green hover:bg-terminal-green/10"
          >
            {refreshing ? '...' : 'REFRESH'}
          </button>
          <button
            onClick={handleClear}
            className="text-xs px-2 py-1 border border-terminal-gray text-terminal-gray hover:border-terminal-orange"
          >
            CLEAR
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tokens.length === 0 ? (
          <p className="text-terminal-gray text-center py-4">No new tokens</p>
        ) : (
          tokens.map((token, index) => (
            <div
              key={index}
              onClick={() => onTokenSelect(token.symbol)}
              className="flex items-center justify-between p-2 border border-terminal-gray hover:border-terminal-orange cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="text-terminal-green font-bold">{token.symbol}</span>
                {token.verified && (
                  <span className="text-terminal-cyan text-xs">✓</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-terminal-gray text-xs">{token.time}</div>
                <div className="text-terminal-orange text-xs">{token.liquidity}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-terminal-gray text-center">
        <span className="text-terminal-gray text-xs">
          Active Tokens: {tokens.length}
        </span>
      </div>
    </div>
  )
}
