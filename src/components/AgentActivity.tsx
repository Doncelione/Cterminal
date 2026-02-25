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
  from?: string
}

export function AgentActivity({ onLog }: { onLog: (msg: string) => void }) {
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivity(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    const interval = setInterval(() => {
      fetch('/api/activity')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setActivity(data)
          }
        })
        .catch(() => {})
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="terminal-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-terminal-orange">📊 ACTIVITY</h2>
        <span className="text-xs text-terminal-gray">{loading ? '...' : `${activity.length} events`}</span>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-terminal-gray text-center py-4">Loading real-time activity...</div>
        ) : activity.length === 0 ? (
          <div className="text-terminal-gray text-center py-4">No recent activity</div>
        ) : (
          activity.map(item => (
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
              {item.amount && <span className="text-terminal-gray text-xs">{item.amount}</span>}
              <span className="ml-auto text-terminal-gray text-xs">{item.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
