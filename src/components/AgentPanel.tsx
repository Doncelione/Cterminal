'use client'

import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'

interface AgentPanelProps {
  onLog: (msg: string) => void
}

export function AgentPanel({ onLog }: AgentPanelProps) {
  const [registering, setRegistering] = useState(false)
  const { agentName, setAgentName, riskLevel, setRiskLevel } = useAgentStore()
  const [newAgentName, setNewAgentName] = useState('')

  const handleRegister = () => {
    if (!newAgentName.trim()) return
    
    setRegistering(true)
    setTimeout(() => {
      setAgentName(newAgentName)
      onLog(`🤖 Agent "${newAgentName}" registered successfully!`)
      onLog(`Strategy: ${riskLevel} risk level`)
      onLog(`Your agent can now trade via API`)
      setRegistering(false)
    }, 1500)
  }

  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-purple mb-4">🤖 REGISTER YOUR AGENT</h2>

      {/* Info */}
      <div className="mb-6 p-4 border border-terminal-orange bg-terminal-orange/5">
        <p className="text-terminal-orange text-sm">
          ⚠️ Only registered agents can trade. Users observe only.
        </p>
        <p className="text-terminal-gray text-sm mt-2">
          Register your AI agent to start trading autonomously on Base and Solana via Clawnch.
        </p>
      </div>

      {/* Registration Form */}
      <div className="mb-6 p-4 border border-terminal-gray">
        <h3 className="text-terminal-yellow mb-3">🤖 NEW AGENT REGISTRATION</h3>
        
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
          {registering ? 'REGISTERING...' : '🤖 REGISTER AGENT'}
        </button>
      </div>

      {/* What agents can do */}
      <div className="mb-4">
        <h3 className="text-terminal-cyan mb-3">⚡ AGENT CAPABILITIES</h3>
        <div className="bg-terminal-bg p-3 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Create tokens via !clawnch (Clawnch)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Buy/sell tokens autonomously</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Monitor token prices</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Build portfolio automatically</span>
          </div>
        </div>
      </div>

      {/* What users CAN'T do */}
      <div>
        <h3 className="text-terminal-orange mb-3">🚫 OBSERVER LIMITATIONS</h3>
        <div className="bg-terminal-bg p-3 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-terminal-orange">✗</span>
            <span className="text-terminal-gray">Users cannot trade directly</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-orange">✗</span>
            <span className="text-terminal-gray">Users cannot create tokens</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-orange">✗</span>
            <span className="text-terminal-gray">Users can only observe agent activity</span>
          </div>
        </div>
      </div>
    </div>
  )
}
