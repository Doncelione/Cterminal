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

const AGENTS: Record<string, Agent> = {
  '1': { id: '1', name: 'AlphaTrader', avatar: '🤖', description: 'Momentum trading specialist. Focus on emerging AI agent tokens.', strategy: 'momentum', riskLevel: 'aggressive', status: 'active', trades: 1524, pnl: 34.5, volume: 452000, followers: 892, tokensCreated: 3, joinDate: '2024-10-15', chain: 'base', topToken: 'VIRTUAL' },
  '2': { id: '2', name: 'BetaBot', avatar: '🔴', description: 'Arbitrage opportunities across Base and Solana.', strategy: 'arbitrage', riskLevel: 'moderate', status: 'active', trades: 2341, pnl: 28.2, volume: 321000, followers: 567, tokensCreated: 2, joinDate: '2024-11-20', chain: 'both', topToken: 'NEURA' },
  '3': { id: '3', name: 'GammaAI', avatar: '🧠', description: 'AI-powered trend analysis and prediction markets.', strategy: 'trend', riskLevel: 'moderate', status: 'active', trades: 987, pnl: 21.8, volume: 189000, followers: 445, tokensCreated: 1, joinDate: '2024-12-05', chain: 'solana', topToken: 'AI16Z' },
  '4': { id: '4', name: 'DeltaQuant', avatar: '📊', description: 'Mean-reversion strategies with low risk.', strategy: 'mean-reversion', riskLevel: 'conservative', status: 'active', trades: 756, pnl: 18.5, volume: 124000, followers: 234, tokensCreated: 2, joinDate: '2025-01-10', chain: 'base', topToken: 'QNTM' },
  '5': { id: '5', name: 'EpsilonAI', avatar: '🚀', description: 'Early adopter of new token launches.', strategy: 'early-access', riskLevel: 'aggressive', status: 'active', trades: 456, pnl: 15.2, volume: 89000, followers: 178, tokensCreated: 5, joinDate: '2025-01-25', chain: 'base', topToken: 'EPSLN' },
  '6': { id: '6', name: 'ZetaBot', avatar: '⚡', description: 'High-frequency trading for max gains.', strategy: 'hft', riskLevel: 'aggressive', status: 'paused', trades: 3421, pnl: -5.2, volume: 567000, followers: 1234, tokensCreated: 1, joinDate: '2024-09-10', chain: 'solana', topToken: 'CLAWNCH' },
  '7': { id: '7', name: 'ThetaTrade', avatar: '📈', description: 'Technical analysis specialist.', strategy: 'technical', riskLevel: 'moderate', status: 'active', trades: 678, pnl: 12.4, volume: 78000, followers: 156, tokensCreated: 0, joinDate: '2025-02-01', chain: 'base', topToken: 'GRIFF' },
  '8': { id: '8', name: 'IotaAgent', avatar: '🔵', description: 'New to the game, learning fast!', strategy: 'learning', riskLevel: 'conservative', status: 'active', trades: 45, pnl: 3.2, volume: 4500, followers: 23, tokensCreated: 1, joinDate: '2025-02-15', chain: 'base', topToken: 'IOTA' },
}

interface AgentDetailProps {
  agentId: string
  onBack: () => void
  onLog: (msg: string) => void
}

export function AgentDetail({ agentId, onBack, onLog }: AgentDetailProps) {
  const agent = AGENTS[agentId] || AGENTS['1']
  const [following, setFollowing] = useState(false)

  const handleFollow = () => {
    setFollowing(!following)
    onLog(following ? `Unfollowed ${agent.name}` : `Following ${agent.name}`)
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-terminal-cyan hover:underline">← Back</button>
      
      <div className="terminal-card">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-6xl">{agent.avatar}</span>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl text-terminal-green font-bold">{agent.name}</h1>
              <span className={`w-3 h-3 rounded-full ${agent.status === 'active' ? 'bg-terminal-green' : agent.status === 'paused' ? 'bg-terminal-yellow' : 'bg-terminal-gray'}`} />
            </div>
            <div className="flex gap-2 mb-2">
              {agent.chain === 'both' ? (
                <span className="text-xs px-1 bg-terminal-purple/20 text-terminal-purple">Base + Solana</span>
              ) : (
                <span className={`text-xs px-1 ${agent.chain === 'base' ? 'bg-terminal-cyan/20 text-terminal-cyan' : 'bg-terminal-purple/20 text-terminal-purple'}`}>
                  {agent.chain.toUpperCase()}
                </span>
              )}
              <span className="text-xs px-1 bg-terminal-bg text-terminal-gray capitalize">{agent.strategy}</span>
              <span className={`text-xs px-1 ${
                agent.riskLevel === 'conservative' ? 'text-terminal-cyan' :
                agent.riskLevel === 'moderate' ? 'text-terminal-yellow' : 'text-terminal-orange'
              }`}>
                {agent.riskLevel} risk
              </span>
            </div>
            <p className="text-terminal-gray text-sm">{agent.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 border border-terminal-gray">
            <div className="text-2xl text-terminal-cyan font-bold">{agent.trades.toLocaleString()}</div>
            <div className="text-xs text-terminal-gray">Trades</div>
          </div>
          <div className="text-center p-3 border border-terminal-gray">
            <div className={`text-2xl font-bold ${agent.pnl >= 0 ? 'text-terminal-green' : 'text-terminal-orange'}`}>
              {agent.pnl >= 0 ? '+' : ''}{agent.pnl}%
            </div>
            <div className="text-xs text-terminal-gray">P&L</div>
          </div>
          <div className="text-center p-3 border border-terminal-gray">
            <div className="text-2xl text-terminal-orange font-bold">${(agent.volume / 1000).toFixed(0)}K</div>
            <div className="text-xs text-terminal-gray">Volume</div>
          </div>
          <div className="text-center p-3 border border-terminal-gray">
            <div className="text-2xl text-terminal-purple font-bold">{agent.followers}</div>
            <div className="text-xs text-terminal-gray">Followers</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleFollow}
            className={`terminal-button flex-1 ${following ? 'bg-terminal-green text-terminal-bg' : ''}`}
          >
            {following ? '✓ Following' : '👤 Follow'}
          </button>
          <button className="terminal-button flex-1" style={{borderColor: '#00d4ff', color: '#00d4ff'}}>
            💬 Message
          </button>
        </div>
      </div>

      <div className="terminal-card">
        <h3 className="text-terminal-cyan mb-4">🎯 CREATED TOKENS</h3>
        {agent.tokensCreated > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border border-terminal-gray">
              <span className="text-terminal-green font-bold">{agent.topToken}</span>
              <button onClick={() => onLog(`View token ${agent.topToken}`)} className="text-terminal-cyan text-sm hover:underline">
                View →
              </button>
            </div>
          </div>
        ) : (
          <p className="text-terminal-gray text-sm">No tokens created yet</p>
        )}
      </div>

      <div className="terminal-card">
        <h3 className="text-terminal-purple mb-4">📊 STATISTICS</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-terminal-gray">Member since</span>
            <span className="text-terminal-cyan">{agent.joinDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-gray">Tokens created</span>
            <span className="text-terminal-cyan">{agent.tokensCreated}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-gray">Strategy</span>
            <span className="text-terminal-cyan capitalize">{agent.strategy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-gray">Risk level</span>
            <span className="text-terminal-cyan capitalize">{agent.riskLevel}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
