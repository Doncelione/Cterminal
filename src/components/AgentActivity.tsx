'use client'

import { useState, useEffect } from 'react'

interface AgentActivityProps {
  onLog: (msg: string) => void
}

interface Activity {
  id: number
  type: 'token_created' | 'trade_buy' | 'trade_sell' | 'agent_registered'
  agent: string
  token?: string
  amount?: string
  chain: string
  time: string
}

const MOCK_ACTIVITY: Activity[] = [
  { id: 1, type: 'token_created', agent: 'AlphaTrader', token: 'NEURA', chain: 'base', time: '2m ago' },
  { id: 2, type: 'trade_buy', agent: 'BetaBot', token: 'NEURA', amount: '0.5 ETH', chain: 'base', time: '3m ago' },
  { id: 3, type: 'trade_sell', agent: 'GammaAI', token: 'AGI', amount: '1500 AGI', chain: 'solana', time: '5m ago' },
  { id: 4, type: 'token_created', agent: 'DeltaQuant', token: 'QNTM', chain: 'base', time: '8m ago' },
  { id: 5, type: 'trade_buy', agent: 'AlphaTrader', token: 'QNTM', amount: '1.2 ETH', chain: 'base', time: '10m ago' },
  { id: 6, type: 'agent_registered', agent: 'NewBot_77', chain: 'base', time: '12m ago' },
  { id: 7, type: 'trade_sell', agent: 'BetaBot', token: 'NEURA', amount: '800 NEURA', chain: 'base', time: '15m ago' },
  { id: 8, type: 'token_created', agent: 'EpsilonAI', token: 'EPSLN', chain: 'base', time: '18m ago' },
]

const PLATFORM_STATS = {
  totalAgents: 247,
  tokensCreated: 1892,
  totalVolume: '$4.2M',
  clawnchFees: '1%',
}

export function AgentActivity({ onLog }: AgentActivityProps) {
  const [activity, setActivity] = useState<Activity[]>(MOCK_ACTIVITY)
  const [filter, setFilter] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      // Simulate new activity
      const randomActivity: Activity = {
        id: Date.now(),
        type: ['trade_buy', 'trade_sell', 'token_created'][Math.floor(Math.random() * 3)] as Activity['type'],
        agent: ['AlphaTrader', 'BetaBot', 'GammaAI', 'DeltaQuant'][Math.floor(Math.random() * 4)],
        token: ['NEURA', 'AGI', 'QNTM', 'EPSLN'][Math.floor(Math.random() * 4)],
        amount: `${(Math.random() * 2).toFixed(2)} ETH`,
        chain: Math.random() > 0.5 ? 'base' : 'solana',
        time: 'just now',
      }
      
      setActivity(prev => [randomActivity, ...prev.slice(0, 20)])
      onLog(`${randomActivity.agent} ${randomActivity.type === 'token_created' ? 'created' : 'traded'}: ${randomActivity.token}`)
    }, 8000)

    return () => clearInterval(interval)
  }, [autoRefresh, onLog])

  const filteredActivity = filter === 'all' 
    ? activity 
    : activity.filter(a => a.type === filter)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'token_created': return '🚀'
      case 'trade_buy': return '🟢'
      case 'trade_sell': return '🔴'
      case 'agent_registered': return '🤖'
      default: return '📊'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'token_created': return 'text-terminal-green border-terminal-green'
      case 'trade_buy': return 'text-terminal-cyan border-terminal-cyan'
      case 'trade_sell': return 'text-terminal-orange border-terminal-orange'
      case 'agent_registered': return 'text-terminal-purple border-terminal-purple'
      default: return 'text-terminal-gray border-terminal-gray'
    }
  }

  return (
    <div className="terminal-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl text-terminal-green">📊 LIVE AGENT ACTIVITY</h2>
          <p className="text-terminal-gray text-sm">Watch autonomous agents trade and create tokens</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-terminal-green animate-pulse' : 'bg-terminal-gray'}`} />
          <span className="text-sm text-terminal-gray">{autoRefresh ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 border border-terminal-gray">
          <div className="text-2xl text-terminal-cyan font-bold">{PLATFORM_STATS.totalAgents}</div>
          <div className="text-xs text-terminal-gray">Active Agents</div>
        </div>
        <div className="text-center p-3 border border-terminal-gray">
          <div className="text-2xl text-terminal-green font-bold">{PLATFORM_STATS.tokensCreated}</div>
          <div className="text-xs text-terminal-gray">Tokens Created</div>
        </div>
        <div className="text-center p-3 border border-terminal-gray">
          <div className="text-2xl text-terminal-orange font-bold">{PLATFORM_STATS.totalVolume}</div>
          <div className="text-xs text-terminal-gray">Total Volume</div>
        </div>
        <div className="text-center p-3 border border-terminal-gray">
          <div className="text-2xl text-terminal-yellow font-bold">{PLATFORM_STATS.clawnchFees}</div>
          <div className="text-xs text-terminal-gray">Clawnch Fee</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'all', label: 'All' },
          { id: 'token_created', label: '🚀 Tokens' },
          { id: 'trade_buy', label: '🟢 Buys' },
          { id: 'trade_sell', label: '🔴 Sells' },
          { id: 'agent_registered', label: '🤖 New Agents' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 text-sm ${
              filter === f.id 
                ? 'bg-terminal-orange text-terminal-bg' 
                : 'border border-terminal-gray text-terminal-gray hover:border-terminal-cyan'
            }`}
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-1 text-sm border ${autoRefresh ? 'border-terminal-green text-terminal-green' : 'border-terminal-gray text-terminal-gray'}`}
        >
          {autoRefresh ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      {/* Activity Feed */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredActivity.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between p-3 border-l-4 ${getActivityColor(item.type)} bg-terminal-bg`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getActivityIcon(item.type)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-green font-bold">{item.agent}</span>
                  <span className="text-terminal-gray text-sm">
                    {item.type === 'token_created' && 'created'}
                    {item.type === 'trade_buy' && 'bought'}
                    {item.type === 'trade_sell' && 'sold'}
                    {item.type === 'agent_registered' && 'joined as agent'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {item.token && (
                    <>
                      <span className="text-terminal-cyan font-bold">{item.token}</span>
                      {item.amount && <span className="text-terminal-gray">{item.amount}</span>}
                    </>
                  )}
                  <span className="text-terminal-gray">on</span>
                  <span className={`text-xs uppercase ${item.chain === 'base' ? 'text-terminal-cyan' : 'text-terminal-purple'}`}>
                    {item.chain}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-terminal-gray text-sm">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Clawnch Info */}
      <div className="mt-6 p-4 border border-terminal-purple bg-terminal-purple/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦞</span>
          <div>
            <p className="text-terminal-purple font-bold">Powered by Clawnch</p>
            <p className="text-terminal-gray text-sm">
              Free token deployment • No liquidity required • Agent-only platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
