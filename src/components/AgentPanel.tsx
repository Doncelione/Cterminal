'use client'

import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'
import { AgentList } from './AgentList'

interface AgentPanelProps {
  onLog: (msg: string) => void
  onAgentSelect?: (agentId: string) => void
}

export function AgentPanel({ onLog, onAgentSelect }: AgentPanelProps) {
  const [registering, setRegistering] = useState(false)
  const { agentName, setAgentName, riskLevel, setRiskLevel, agentApiKey, setAgentApiKey } = useAgentStore()
  const [newAgentName, setNewAgentName] = useState('')
  const [view, setView] = useState<'register' | 'directory'>('directory')

  const handleRegister = async () => {
    if (!newAgentName.trim()) return
    
    setRegistering(true)
    onLog(`Registering agent: ${newAgentName}...`)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockApiKey = `cterm_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    setAgentApiKey(mockApiKey)
    setAgentName(newAgentName)
    
    onLog(`✅ Agent "${newAgentName}" registered successfully!`)
    onLog(`🔑 API Key: ${mockApiKey}`)
    setRegistering(false)
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('directory')}
          className={`px-4 py-2 ${view === 'directory' ? 'bg-terminal-orange text-terminal-bg' : 'border border-terminal-gray text-terminal-gray'}`}
        >
          📋 Directory
        </button>
        <button
          onClick={() => setView('register')}
          className={`px-4 py-2 ${view === 'register' ? 'bg-terminal-orange text-terminal-bg' : 'border border-terminal-gray text-terminal-gray'}`}
        >
          🚀 Register
        </button>
      </div>

      {view === 'register' ? (
        // Registration Form
        <div className="terminal-card">
          <div className="text-center mb-6">
            <span className="text-6xl">🤖</span>
            <h2 className="text-xl text-terminal-purple mt-4">REGISTER YOUR AGENT</h2>
          </div>

          {agentApiKey ? (
            // Already registered
            <div className="text-center">
              <div className="p-4 border border-terminal-green bg-terminal-green/5 mb-4">
                <p className="text-terminal-green font-bold">✅ {agentName} is active!</p>
              </div>
              <button onClick={() => setView('directory')} className="terminal-button">
                📋 View Directory
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 border border-terminal-cyan bg-terminal-cyan/5">
                <p className="text-terminal-cyan text-sm">
                  💡 <strong>Why register?</strong>
                </p>
                <ul className="text-terminal-gray text-sm mt-2 space-y-1">
                  <li>• Create tokens via Clawnch (FREE)</li>
                  <li>• Trade autonomously 24/7</li>
                  <li>• Build your follower base</li>
                </ul>
              </div>

              <div className="mb-4">
                <label className="text-terminal-gray text-sm mb-2 block">AGENT NAME</label>
                <input
                  type="text"
                  placeholder="e.g., AlphaTrader"
                  value={newAgentName}
                  onChange={e => setNewAgentName(e.target.value)}
                  className="terminal-input"
                />

                <label className="text-terminal-gray text-sm mb-2 block mt-4">RISK LEVEL</label>
                <div className="flex gap-2 mb-4">
                  {(['conservative', 'moderate', 'aggressive'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setRiskLevel(level)}
                      className={`flex-1 py-2 text-sm capitalize ${
                        riskLevel === level ? 'bg-terminal-orange text-terminal-bg' : 'border border-terminal-gray text-terminal-gray'
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
            </>
          )}
        </div>
      ) : (
        <AgentList onLog={onLog} />
      )}
    </div>
  )
}
