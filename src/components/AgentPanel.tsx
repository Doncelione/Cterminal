'use client'

import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'

interface AgentPanelProps {
  onLog: (msg: string) => void
}

const ACTIVE_AGENTS = [
  { name: 'AlphaTrader', trades: 156, pnl: '+24.5%', status: 'active' },
  { name: 'BetaBot', trades: 89, pnl: '+12.3%', status: 'active' },
  { name: 'GammaAI', trades: 234, pnl: '-5.2%', status: 'paused' },
  { name: 'DeltaQuant', trades: 67, pnl: '+31.8%', status: 'active' },
]

export function AgentPanel({ onLog }: AgentPanelProps) {
  const [registering, setRegistering] = useState(false)
  const { agentName, setAgentName, riskLevel, setRiskLevel } = useAgentStore()
  const [newAgentName, setNewAgentName] = useState('')

  const handleRegister = () => {
    if (!newAgentName.trim()) return
    
    setRegistering(true)
    // Simulate registration
    setTimeout(() => {
      setAgentName(newAgentName)
      onLog(`🤖 Agent "${newAgentName}" registered successfully!`)
      onLog(`Strategy: ${riskLevel} risk level`)
      setRegistering(false)
    }, 1500)
  }

  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-purple mb-4">🤖 AGENT PANEL</h2>

      {/* Register New Agent */}
      <div className="mb-6 p-4 border border-terminal-gray">
        <h3 className="text-terminal-yellow mb-3">🤖 REGISTER NEW AGENT</h3>
        <p className="text-terminal-gray text-sm mb-3">
          Create an AI agent with autonomous trading capabilities on Base and Solana.
        </p>
        
        <input
          type="text"
          placeholder="Agent name (e.g., AlphaTrader)"
          value={newAgentName}
          onChange={(e) => setNewAgentName(e.target.value)}
          className="terminal-input mb-3"
        />

        <div className="mb-3">
          <label className="text-terminal-gray text-sm mb-2 block">Risk Level:</label>
          <div className="flex gap-2">
            {(['conservative', 'moderate', 'aggressive'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setRiskLevel(level)}
                className={`flex-1 py-2 text-sm capitalize ${
                  riskLevel === level
                    ? 'bg-terminal-orange text-terminal-bg'
                    : 'border border-terminal-gray text-terminal-gray hover:border-terminal-cyan'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={registering || !newAgentName.trim()}
          className="terminal-button w-full"
        >
          {registering ? 'REGISTERING...' : 'REGISTER AGENT'}
        </button>
      </div>

      {/* Active Agents */}
      <div className="mb-4">
        <h3 className="text-terminal-cyan mb-3">👥 ACTIVE AGENTS</h3>
        <div className="space-y-2">
          {ACTIVE_AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="flex items-center justify-between p-3 border border-terminal-gray"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-green font-bold">{agent.name}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-terminal-green' : 'bg-terminal-gray'
                  }`} />
                </div>
                <div className="text-terminal-gray text-xs">{agent.trades} trades</div>
              </div>
              <div className={`font-bold ${agent.pnl.startsWith('+') ? 'text-terminal-green' : 'text-terminal-orange'}`}>
                {agent.pnl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Commands */}
      <div>
        <h3 className="text-terminal-cyan mb-3">📋 AGENT COMMANDS</h3>
        <div className="bg-terminal-bg p-3 text-sm">
          <div className="mb-2">
            <code className="text-terminal-green">!clawnch</code>
            <span className="text-terminal-gray ml-2">Create and launch a new token</span>
          </div>
          <div className="mb-2">
            <code className="text-terminal-green">!clawnch name="AGENT" symbol="AI" supply=1000000</code>
          </div>
          <div className="my-3 border-t border-terminal-gray" />
          <div className="mb-2">
            <code className="text-terminal-cyan">!buy</code>
            <span className="text-terminal-gray ml-2">Execute buy order via API</span>
          </div>
          <div className="mb-2">
            <code className="text-terminal-cyan">!buy token=0x... amount=0.5</code>
          </div>
          <div className="my-3 border-t border-terminal-gray" />
          <div className="mb-2">
            <code className="text-terminal-orange">!sell</code>
            <span className="text-terminal-gray ml-2">Execute sell order via API</span>
          </div>
          <div className="mb-2">
            <code className="text-terminal-orange">!sell token=0x... amount=100%</code>
          </div>
          <div className="my-3 border-t border-terminal-gray" />
          <div className="mb-2">
            <code className="text-terminal-purple">!monitor</code>
            <span className="text-terminal-gray ml-2">Start monitoring token price</span>
          </div>
          <div className="mb-2">
            <code className="text-terminal-purple">!monitor token=0x... interval=30s</code>
          </div>
          <div className="my-3 border-t border-terminal-gray" />
          <div>
            <code className="text-terminal-yellow">!balance</code>
            <span className="text-terminal-gray ml-2">Check agent wallet balance</span>
          </div>
        </div>
      </div>
    </div>
  )
}
