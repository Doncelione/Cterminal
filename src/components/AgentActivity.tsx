'use client'

import { useState, useEffect } from 'react'

interface Activity {
  id: number
  type: 'token_created' | 'trade_buy' | 'trade_sell' | 'agent_registered'
  agent: string
  agentAvatar: string
  token?: string
  amount?: string
  chain: string
  time: string
  price?: number
}

const MOCK_ACTIVITY: Activity[] = [
  { id: 1, type: 'token_created', agent: 'AlphaTrader', agentAvatar: '🤖', token: 'NEURA', chain: 'base', time: '2m ago' },
  { id: 2, type: 'trade_buy', agent: 'BetaBot', agentAvatar: '🔴', token: 'NEURA', amount: '0.5 ETH', chain: 'base', time: '3m ago' },
  { id: 3, type: 'trade_sell', agent: 'GammaAI', agentAvatar: '🧠', token: 'VIRTUAL', amount: '1500 VIRTUAL', chain: 'base', time: '5m ago' },
  { id: 4, type: 'token_created', agent: 'DeltaQuant', agentAvatar: '📊', token: 'QNTM', chain: 'base', time: '8m ago' },
  { id: 5, type: 'trade_buy', agent: 'AlphaTrader', agentAvatar: '🤖', token: 'QNTM', amount: '1.2 ETH', chain: 'base', time: '10m ago' },
  { id: 6, type: 'agent_registered', agent: 'NewBot_77', agentAvatar: '🆕', chain: 'base', time: '12m ago' },
  { id: 7, type: 'trade_sell', agent: 'BetaBot', agentAvatar: '🔴', token: 'AI16Z', amount: '800 AI16Z', chain: 'solana', time: '15m ago' },
  { id: 8, type: 'token_created', agent: 'EpsilonAI', agentAvatar: '🚀', token: 'EPSLN', chain: 'base', time: '18m ago' },
]

export function AgentActivity({ onLog }: { onLog: (msg: string) => void }) {
  const [activity, setActivity] = useState<Activity[]>(MOCK_ACTIVITY)

  return (
    <div className="terminal-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-terminal-orange">📊 ACTIVITY</h2>
        <span className="text-xs text-terminal-gray">{activity.length} events</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activity.map(item => (
          <div key={item.id} className="flex items-center gap-2 p-2 border border-terminal-gray/30">
            <span>{item.agentAvatar}</span>
            <span className="text-terminal-green text-sm">{item.agent}</span>
            <span className="text-terminal-gray text-xs">
              {item.type === 'token_created' && 'created'}
              {item.type === 'trade_buy' && 'bought'}
              {item.type === 'trade_sell' && 'sold'}
              {item.type === 'agent_registered' && 'joined'}
            </span>
            {item.token && <span className="text-terminal-cyan text-sm font-bold">{item.token}</span>}
            <span className="ml-auto text-terminal-gray text-xs">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
