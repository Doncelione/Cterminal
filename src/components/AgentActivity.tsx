'use client'

import { useState, useEffect } from 'react'

interface Activity {
  id: number
  type: 'token_created' | 'trade_buy' | 'trade_sell' | 'agent_registered'
  agent: string
  token?: string
  amount?: string
  chain: string
  time: string
  price?: number
}

const MOCK_ACTIVITY: Activity[] = [
  { id: 1, type: 'token_created', agent: 'AlphaTrader', token: 'NEURA', chain: 'base', time: '2m ago', price: 0.32 },
  { id: 2, type: 'trade_buy', agent: 'BetaBot', token: 'NEURA', amount: '0.5 ETH', chain: 'base', time: '3m ago', price: 0.32 },
  { id: 3, type: 'trade_sell', agent: 'GammaAI', token: 'VIRTUAL', amount: '1500 VIRTUAL', chain: 'base', time: '5m ago', price: 1.42 },
  { id: 4, type: 'token_created', agent: 'DeltaQuant', token: 'QNTM', chain: 'base', time: '8m ago', price: 0.42 },
  { id: 5, type: 'trade_buy', agent: 'AlphaTrader', token: 'QNTM', amount: '1.2 ETH', chain: 'base', time: '10m ago', price: 0.42 },
  { id: 6, type: 'agent_registered', agent: 'NewBot_77', chain: 'base', time: '12m ago' },
  { id: 7, type: 'trade_sell', agent: 'BetaBot', token: 'AI16Z', amount: '800 AI16Z', chain: 'solana', time: '15m ago', price: 0.89 },
  { id: 8, type: 'token_created', agent: 'EpsilonAI', token: 'EPSLN', chain: 'base', time: '18m ago', price: 0.018 },
]

const TOP_AGENTS = [
  { name: 'AlphaTrader', trades: 234, pnl: '+34.5%', volume: '$45.2K', strategy: 'momentum' },
  { name: 'BetaBot', trades: 189, pnl: '+28.2%', volume: '$32.1K', strategy: 'arbitrage' },
  { name: 'GammaAI', trades: 156, pnl: '+21.8%', volume: '$28.9K', strategy: 'trend' },
  { name: 'DeltaQuant', trades: 145, pnl: '+18.5%', volume: '$21.4K', strategy: 'mean-reversion' },
  { name: 'EpsilonAI', trades: 98, pnl: '+15.2%', volume: '$15.8K', strategy: 'momentum' },
]

const PLATFORM_STATS = {
  totalAgents: 1247,
  tokensCreated: 3892,
  totalVolume: '$12.4M',
  avgTradeSize: '$1.2K',
}

export function AgentActivity({ onLog }: { onLog: (msg: string) => void }) {
  const [activity, setActivity] = useState<Activity[]>(MOCK_ACTIVITY)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [view, setView] = useState<'feed' | 'agents'>('feed')

  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      const types: Activity['type'][] = ['trade_buy', 'trade_sell', 'token_created']
      const randomActivity: Activity = {
        id: Date.now(),
        type: types[Math.floor(Math.random() * 3)],
        agent: ['AlphaTrader', 'BetaBot', 'GammaAI', 'DeltaQuant'][Math.floor(Math.random() * 4)],
        token: ['VIRTUAL', 'AI16Z', 'NEURA', 'QNTM', 'GRIFF'][Math.floor(Math.random() * 5)],
        amount: `${(Math.random() * 2).toFixed(2)} ETH`,
        chain: Math.random() > 0.3 ? 'base' : 'solana',
        time: 'just now',
        price: Math.random() * 2,
      }
      setActivity(prev => [randomActivity, ...prev.slice(0, 30)])
      onLog(`${randomActivity.agent}: ${randomActivity.type === 'token_created' ? 'created' : 'traded'} ${randomActivity.token}`)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoRefresh, onLog])

  const getIcon = (type: string) => {
    switch (type) {
      case 'token_created': return '🚀'
      case 'trade_buy': return '🟢'
      case 'trade_sell': return '🔴'
      case 'agent_registered': return '🤖'
      default: return '📊'
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'token_created': return 'border-terminal-green text-terminal-green'
      case 'trade_buy': return 'border-terminal-cyan text-terminal-cyan'
      case 'trade_sell': return 'border-terminal-orange text-terminal-orange'
      case 'agent_registered': return 'border-terminal-purple text-terminal-purple'
      default: return 'border-terminal-gray text-terminal-gray'
    }
  }

  return (
    <div className="terminal-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl text-terminal-green">📊 LIVE TRADING ACTIVITY</h2>
          <p className="text-terminal-gray text-sm">Real-time agent analytics & trading feed</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-terminal-green animate-pulse' : 'bg-terminal-gray'}`} />
          <span className="text-sm text-terminal-gray">{autoRefresh ? 'LIVE' : 'PAUSED'}</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-2xl text-terminal-cyan font-bold">{PLATFORM_STATS.totalAgents}</div>
          <div className="text-xs text-terminal-gray">Agents</div>
        </div>
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-2xl text-terminal-green font-bold">{PLATFORM_STATS.tokensCreated}</div>
          <div className="text-xs text-terminal-gray">Tokens</div>
        </div>
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-2xl text-terminal-orange font-bold">{PLATFORM_STATS.totalVolume}</div>
          <div className="text-xs text-terminal-gray">Volume</div>
        </div>
        <div className="text-center p-2 border border-terminal-gray">
          <div className="text-2xl text-terminal-yellow font-bold">{PLATFORM_STATS.avgTradeSize}</div>
          <div className="text-xs text-terminal-gray">Avg Trade</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('feed')}
          className={`px-4 py-2 ${view === 'feed' ? 'bg-terminal-orange text-terminal-bg' : 'border border-terminal-gray text-terminal-gray'}`}
        >
          📊 Live Feed
        </button>
        <button
          onClick={() => setView('agents')}
          className={`px-4 py-2 ${view === 'agents' ? 'bg-terminal-orange text-terminal-bg' : 'border border-terminal-gray text-terminal-gray'}`}
        >
          🏆 Top Agents
        </button>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="ml-auto px-3 py-2 border border-terminal-gray text-terminal-gray"
        >
          {autoRefresh ? '⏸' : '▶'}
        </button>
      </div>

      {/* Content */}
      {view === 'feed' ? (
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {activity.map(item => (
            <div key={item.id} className={`flex items-center justify-between p-2 border-l-4 ${getColor(item.type)} bg-terminal-bg`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{getIcon(item.type)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-terminal-green font-bold">{item.agent}</span>
                    <span className="text-terminal-gray text-sm">
                      {item.type === 'token_created' && 'created'}
                      {item.type === 'trade_buy' && 'bought'}
                      {item.type === 'trade_sell' && 'sold'}
                      {item.type === 'agent_registered' && 'joined'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {item.token && <span className="text-terminal-cyan font-bold">{item.token}</span>}
                    {item.amount && <span className="text-terminal-gray">{item.amount}</span>}
                    <span className={`text-xs px-1 ${item.chain === 'base' ? 'bg-terminal-cyan/20 text-terminal-cyan' : 'bg-terminal-purple/20 text-terminal-purple'}`}>
                      {item.chain}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-terminal-gray text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {TOP_AGENTS.map((agent, i) => (
            <div key={agent.name} className="flex items-center justify-between p-3 border border-terminal-gray">
              <div className="flex items-center gap-3">
                <span className={`text-xl font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-terminal-gray'}`}>
                  #{i + 1}
                </span>
                <div>
                  <div className="text-terminal-green font-bold">{agent.name}</div>
                  <div className="text-terminal-gray text-xs">Strategy: {agent.strategy}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${agent.pnl.startsWith('+') ? 'text-terminal-green' : 'text-terminal-orange'}`}>
                  {agent.pnl}
                </div>
                <div className="text-terminal-gray text-xs">{agent.trades} trades • {agent.volume}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
