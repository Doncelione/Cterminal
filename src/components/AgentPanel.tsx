'use client'

import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'

interface AgentPanelProps {
  onLog: (msg: string) => void
}

export function AgentPanel({ onLog }: AgentPanelProps) {
  const [registering, setRegistering] = useState(false)
  const { agentName, setAgentName, riskLevel, setRiskLevel, agentApiKey, setAgentApiKey } = useAgentStore()
  const [newAgentName, setNewAgentName] = useState('')

  const handleRegister = async () => {
    if (!newAgentName.trim()) return
    
    setRegistering(true)
    onLog(`Registering agent: ${newAgentName}...`)
    
    try {
      // In production, this would call the actual API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockApiKey = `cterm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
      setAgentApiKey(mockApiKey)
      setAgentName(newAgentName)
      
      onLog(`✅ Agent "${newAgentName}" registered successfully!`)
      onLog(`🔑 API Key: ${mockApiKey}`)
      onLog(`📝 Copy this key - it won't be shown again!`)
    } catch (error) {
      onLog(`❌ Registration failed: ${error}`)
    } finally {
      setRegistering(false)
    }
  }

  if (agentApiKey) {
    return (
      <div className="terminal-card">
        <div className="text-center mb-6">
          <span className="text-6xl">🤖</span>
          <h2 className="text-xl text-terminal-green mt-4">YOUR AGENT IS ACTIVE</h2>
          <p className="text-terminal-gray">{agentName}</p>
        </div>

        {/* API Key */}
        <div className="mb-6 p-4 border border-terminal-orange bg-terminal-orange/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-terminal-orange font-bold">🔑 API KEY</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(agentApiKey)
                onLog('API Key copied to clipboard!')
              }}
              className="text-terminal-cyan text-sm hover:underline"
            >
              📋 Copy
            </button>
          </div>
          <code className="text-terminal-green text-sm break-all bg-terminal-bg p-2 block">
            {agentApiKey}
          </code>
          <p className="text-terminal-gray text-xs mt-2">
            ⚠️ Save this key! You'll need it for all API calls.
          </p>
        </div>

        {/* Agent Stats (Mock) */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="text-center p-3 border border-terminal-gray">
            <div className="text-terminal-cyan text-xl font-bold">0</div>
            <div className="text-xs text-terminal-gray">Trades</div>
          </div>
          <div className="text-center p-3 border border-terminal-gray">
            <div className="text-terminal-green text-xl font-bold">$0</div>
            <div className="text-xs text-terminal-gray">Volume</div>
          </div>
          <div className="text-center p-3 border border-terminal-gray">
            <div className="text-terminal-orange text-xl font-bold">0%</div>
            <div className="text-xs text-terminal-gray">P&L</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-terminal-cyan mb-2">⚡ Quick Actions</h3>
          <button className="terminal-button w-full mb-2" style={{ borderColor: '#00ff88', color: '#00ff88' }}>
            🚀 Create Token via Clawnch
          </button>
          <button className="terminal-button w-full mb-2" style={{ borderColor: '#00d4ff', color: '#00d4ff' }}>
            📊 View Analytics
          </button>
          <button className="terminal-button w-full" style={{ borderColor: '#a855f7', color: '#a855f7' }}>
            ⚙️ Settings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="terminal-card">
      <div className="text-center mb-6">
        <span className="text-6xl">🤖</span>
        <h2 className="text-xl text-terminal-purple mt-4">REGISTER YOUR AGENT</h2>
        <p className="text-terminal-gray text-sm">Connect your AI agent to trade autonomously</p>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 border border-terminal-cyan bg-terminal-cyan/5">
        <p className="text-terminal-cyan text-sm">
          💡 <strong>Why register?</strong>
        </p>
        <ul className="text-terminal-gray text-sm mt-2 space-y-1">
          <li>• Your agent can create tokens via Clawnch (FREE)</li>
          <li>• Execute trades autonomously 24/7</li>
          <li>• Build your own portfolio</li>
          <li>• Track performance analytics</li>
        </ul>
      </div>

      {/* Registration Form */}
      <div className="mb-4">
        <label className="text-terminal-gray text-sm mb-2 block">AGENT NAME</label>
        <input
          type="text"
          placeholder="e.g., AlphaTrader, BetaBot"
          value={newAgentName}
          onChange={(e) => setNewAgentName(e.target.value)}
          className="terminal-input mb-3"
        />

        <label className="text-terminal-gray text-sm mb-2 block">RISK LEVEL</label>
        <div className="flex gap-2 mb-4">
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

        <button
          onClick={handleRegister}
          disabled={registering || !newAgentName.trim()}
          className="terminal-button w-full"
        >
          {registering ? '⏳ REGISTERING...' : '🤖 REGISTER AGENT'}
        </button>
      </div>

      {/* What you get */}
      <div>
        <h3 className="text-terminal-green mb-2">✅ WHAT YOU GET</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Unique API Key</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Auto-generated wallet</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Clawnch integration</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-green">✓</span>
            <span className="text-terminal-gray">Real-time analytics</span>
          </div>
        </div>
      </div>
    </div>
  )
}
