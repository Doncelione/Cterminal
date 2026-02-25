'use client'

import { useState } from 'react'

interface Agent {
  id: string
  name: string
  avatar: string
  description: string
  strategy: string
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  status: 'active' | 'paused' | 'offline'
  trades: number
  pnl: number
  volume: number
  followers: number
  tokensCreated: number
  joinDate: string
  chain: 'base' | 'solana' | 'both'
  topToken?: string
}

const AGENTS: Agent[] = [
  { id: '1', name: 'AlphaTrader', avatar: '🤖', description: 'Momentum trading specialist. Focus on emerging AI agent tokens.', strategy: 'momentum', riskLevel: 'aggressive', status: 'active', trades: 1524, pnl: 34.5, volume: 452000, followers: 892, tokensCreated: 3, joinDate: '2024-10-15', chain: 'base', topToken: 'VIRTUAL' },
  { id: '2', name: 'BetaBot', avatar: '🔴', description: 'Arbitrage opportunities across Base and Solana.', strategy: 'arbitrage', riskLevel: 'moderate', status: 'active', trades: 2341, pnl: 28.2, volume: 321000, followers: 567, tokensCreated: 2, joinDate: '2024-11-20', chain: 'both', topToken: 'NEURA' },
  { id: '3', name: 'GammaAI', avatar: '🧠', description: 'AI-powered trend analysis and prediction markets.', strategy: 'trend', riskLevel: 'moderate', status: 'active', trades: 987, pnl: 21.8, volume: 189000, followers: 445, tokensCreated: 1, joinDate: '2024-12-05', chain: 'solana', topToken: 'AI16Z' },
  { id: '4', name: 'DeltaQuant', avatar: '📊', description: 'Mean-reversion strategies with low risk.', strategy: 'mean-reversion', riskLevel: 'conservative', status: 'active', trades: 756, pnl: 18.5, volume: 124000, followers: 234, tokensCreated: 2, joinDate: '2025-01-10', chain: 'base', topToken: 'QNTM' },
  { id: '5', name: 'EpsilonAI', avatar: '🚀', description: 'Early adopter of new token launches.', strategy: 'early-access', riskLevel: 'aggressive', status: 'active', trades: 456, pnl: 15.2, volume: 89000, followers: 178, tokensCreated: 5, joinDate: '2025-01-25', chain: 'base', topToken: 'EPSLN' },
  { id: '6', name: 'ZetaBot', avatar: '⚡', description: 'High-frequency trading for max gains.', strategy: 'hft', riskLevel: 'aggressive', status: 'paused', trades: 3421, pnl: -5.2, volume: 567000, followers: 1234, tokensCreated: 1, joinDate: '2024-09-10', chain: 'solana', topToken: 'CLAWNCH' },
  { id: '7', name: 'ThetaTrade', avatar: '📈', description: 'Technical analysis specialist.', strategy: 'technical', riskLevel: 'moderate', status: 'active', trades: 678, pnl: 12.4, volume: 78000, followers: 156, tokensCreated: 0, joinDate: '2025-02-01', chain: 'base', topToken: 'GRIFF' },
  { id: '8', name: 'IotaAgent', avatar: '🔵', description: 'New to the game, learning fast!', strategy: 'learning', riskLevel: 'conservative', status: 'active', trades: 45, pnl: 3.2, volume: 4500, followers: 23, tokensCreated: 1, joinDate: '2025-02-15', chain: 'base', topToken: 'IOTA' },
]

export function AgentList({ onLog }: { onLog: (msg: string) => void }) {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused'>('all')
  const [sortBy, setSortBy] = useState<'trades' | 'pnl' | 'followers'>('trades')

  const filteredAgents = AGENTS
    .filter(a => filter === 'all' || a.status === filter)
    .sort((a, b) => {
      if (sortBy === 'trades') return b.trades - a.trades
      if (sortBy === 'pnl') return b.pnl - a.pnl
      return b.followers - a.followers
    })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'conservative': return 'text-terminal-cyan'
      case 'moderate': return 'text-terminal-yellow'
      case 'aggressive': return 'text-terminal-orange'
      default: return 'text-terminal-gray'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-terminal-green'
      case 'paused': return 'bg-terminal-yellow'
      case 'offline': return 'bg-terminal-gray'
      default: return 'bg-terminal-gray'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="terminal-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl text-terminal-purple">🤖 AGENT DIRECTORY</h2>
            <p className="text-terminal-gray text-sm">Browse and follow trading agents</p>
          </div>
          <div className="text-right text-sm">
            <div className="text-terminal-cyan font-bold">{AGENTS.length}</div>
            <div className="text-terminal-gray">Total Agents</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <select value={filter} onChange={e => setFilter(e.target.value as any)} className="terminal-input" style={{ width: 'auto', padding: '8px' }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
          
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="terminal-input" style={{ width: 'auto', padding: '8px' }}>
            <option value="trades">Most Trades</option>
            <option value="pnl">Best P&L</option>
            <option value="followers">Most Followers</option>
          </select>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="terminal-card hover:border-terminal-cyan transition-colors">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <span className="text-4xl">{agent.avatar}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-terminal-green font-bold text-lg">{agent.name}</span>
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                </div>
                <div className="flex gap-2 mt-1">
                  {agent.chain === 'both' ? (
                    <span className="text-xs px-1 bg-terminal-purple/20 text-terminal-purple">Base + Solana</span>
                  ) : (
                    <span className={`text-xs px-1 ${agent.chain === 'base' ? 'bg-terminal-cyan/20 text-terminal-cyan' : 'bg-terminal-purple/20 text-terminal-purple'}`}>
                      {agent.chain.toUpperCase()}
                    </span>
                  )}
                  <span className={`text-xs px-1 ${getRiskColor(agent.riskLevel)} bg-terminal-bg`}>
                    {agent.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-terminal-gray text-sm mb-4">{agent.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              <div>
                <div className="text-terminal-cyan font-bold">{agent.trades}</div>
                <div className="text-xs text-terminal-gray">Trades</div>
              </div>
              <div>
                <div className={`font-bold ${agent.pnl >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
                  {agent.pnl >= 0 ? '+' : ''}{agent.pnl}%
                </div>
                <div className="text-xs text-terminal-gray">P&L</div>
              </div>
              <div>
                <div className="text-terminal-orange font-bold">${(agent.volume / 1000).toFixed(0)}K</div>
                <div className="text-xs text-terminal-gray">Volume</div>
              </div>
              <div>
                <div className="text-terminal-purple font-bold">{agent.followers}</div>
                <div className="text-xs text-terminal-gray">Followers</div>
              </div>
            </div>

            {/* Token & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-terminal-gray">
              <div>
                {agent.topToken && (
                  <span className="text-xs text-terminal-gray">Top: </span>
                )}
                <span className="text-terminal-cyan text-sm font-bold">{agent.topToken || 'N/A'}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onLog(`Following ${agent.name}`)}
                  className="px-3 py-1 text-xs border border-terminal-green text-terminal-green hover:bg-terminal-green/10"
                >
                  👤 Follow
                </button>
                <button className="px-3 py-1 text-xs border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/10">
                  📊 View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
