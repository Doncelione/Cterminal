'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { BrowserProvider, formatEther } from 'ethers'
import { AgentPanel } from '@/components/AgentPanel'
import { TerminalLog } from '@/components/TerminalLog'
import { AgentActivity } from '@/components/AgentActivity'
import { useAgentStore } from '@/store/agentStore'

type TabType = 'agents' | 'activity' | 'terminal' | 'docs'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('activity')
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [logs, setLogs] = useState<string[]>([])
  
  const { publicKey, connected } = useWallet()
  const { agentConnected, agentApiKey } = useAgentStore()

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`].slice(-50))
  }, [])

  // Check for MetaMask (Base)
  const connectBaseWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new BrowserProvider((window as any).ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          addLog(`Base wallet connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
        }
      } catch (error) {
        addLog(`Error connecting Base wallet: ${error}`)
      }
    } else {
      addLog('MetaMask not found. Install to connect as observer.')
    }
  }

  // Initialize
  useEffect(() => {
    addLog('CTerminal v3.0 initialized')
    addLog('Network: Base Mainnet')
    addLog('Network: Solana Mainnet')
    addLog('Mode: OBSERVER - watching agent activity')
    addLog('Type "help" for commands')
  }, [addLog])

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-2xl md:text-4xl pixel-font text-terminal-orange crt-glow mb-2">
          CLAWNCH TERMINAL
        </h1>
        <p className="text-terminal-cyan text-lg">
          &gt;&gt;&gt; AI AGENT TRADING OBSERVER v3.0 &lt;&lt;&lt;
        </p>
        <p className="text-terminal-gray text-sm">
          AUTONOMOUS AGENTS • BASE + SOLANA • WATCH ONLY
        </p>
      </header>

      {/* Connection Status */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="terminal-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${walletAddress ? 'bg-terminal-green' : 'bg-terminal-orange'}`} />
              <span className="text-terminal-orange">
                {walletAddress ? 'OBSERVER CONNECTED' : 'OBSERVER MODE'}
              </span>
            </div>
            
            {walletAddress && (
              <span className="text-terminal-cyan text-sm">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={connectBaseWallet}
              className="terminal-button text-sm"
            >
              {walletAddress ? 'Connected' : 'Connect as Observer'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="terminal-card border-terminal-purple bg-terminal-purple/5">
          <div className="flex items-center gap-3 text-terminal-purple">
            <span className="text-2xl">👁️</span>
            <div>
              <p className="font-bold">OBSERVER MODE ACTIVE</p>
              <p className="text-sm text-terminal-gray">
                You are watching autonomous AI agents trade and create tokens via Clawnch.
                Trading is disabled for users - only agents can trade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      {(agentConnected || agentApiKey) && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="terminal-card border-terminal-green">
            <div className="flex items-center gap-2 text-terminal-green">
              <span className="text-xl">🤖</span>
              <span>YOUR AGENT IS ACTIVE</span>
              {agentApiKey && <span className="text-xs text-terminal-gray">API: {agentApiKey.slice(0, 12)}...</span>}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-6 overflow-x-auto">
        <nav className="flex gap-2">
          {[
            { id: 'activity', label: '📊 AGENT ACTIVITY', icon: '📊' },
            { id: 'agents', label: '🤖 REGISTER AGENT', icon: '🤖' },
            { id: 'terminal', label: '💻 TERMINAL', icon: '💻' },
            { id: 'docs', label: '📡 API DOCS', icon: '📡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`terminal-tab whitespace-nowrap ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Main Functionality */}
        <div className="lg:col-span-2">
          {activeTab === 'activity' && (
            <AgentActivity onLog={addLog} />
          )}
          
          {activeTab === 'agents' && (
            <AgentPanel onLog={addLog} />
          )}
          
          {activeTab === 'terminal' && (
            <TerminalInterface onCommand={(cmd) => addLog(`> ${cmd}`)} />
          )}
          
          {activeTab === 'docs' && (
            <APIDocs onLog={addLog} />
          )}
        </div>

        {/* Right Panel - Logs */}
        <div>
          <TerminalLog logs={logs} />
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-6 border-t border-terminal-gray text-center text-terminal-gray text-sm">
        <p>CTerminal v3.0 | Observer Mode | Powered by Clawnch</p>
        <p className="mt-2">🤖 Autonomous Agents Trading | Users Watch Only</p>
      </footer>
    </main>
  )
}

// Terminal Interface Component
function TerminalInterface({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([
    '[SYSTEM] CTerminal v3.0 - Observer Mode',
    '[SYSTEM] Networks: Base (8453), Solana (101)',
    '[SYSTEM] Clawnch integration: ACTIVE',
    '[SYSTEM] Type "help" for commands',
    '',
    '[INFO] Trading disabled for observers',
    '[INFO] Only registered agents can trade'
  ])

  const commands: Record<string, (args: string[]) => string> = {
    help: () => `Available commands:
  !clawnch [name] [symbol] - Create token (agent only)
  !agents - List active agents
  !activity - Recent agent activity
  !stats - Platform statistics
  !help - Show this message`,
    stats: () => `Platform Stats:
  Active Agents: 247
  Tokens Created: 1,892
  Total Volume: $4.2M
  Clawnch Fee: 1%`,
    '!clawnch': (args) => `[DENIED] Only agents can create tokens. Register an agent first.`,
    '!agents': () => `Active agents: AlphaTrader, BetaBot, GammaAI, DeltaQuant...`,
    '!activity': () => `Recent: Agent AlphaTrader created CWT, Agent BetaBot bought 0.5 SOL...`,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const cmd = input.trim()
    onCommand(cmd)
    setHistory(prev => [...prev, `> ${cmd}`])

    const [command, ...args] = cmd.split(' ')
    const response = commands[command]?.(args) || `Unknown command: ${command}`
    
    setHistory(prev => [...prev, response])
    setInput('')
  }

  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-orange mb-4">💻 INTERACTIVE TERMINAL</h2>
      
      <div className="bg-terminal-bg p-4 h-64 overflow-y-auto font-mono text-sm mb-4">
        {history.map((line, i) => (
          <div key={i} className={`mb-1 ${
            line.startsWith('>') ? 'text-terminal-green' : 
            line.includes('[DENIED]') ? 'text-terminal-orange' :
            'text-terminal-gray'
          }`}>
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <span className="text-terminal-green">{'>'}</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command..."
          className="terminal-input flex-1"
          style={{ border: 'none', background: 'transparent' }}
        />
        <button type="submit" className="terminal-button">
          EXECUTE
        </button>
      </form>
    </div>
  )
}

// API Docs Component
function APIDocs({ onLog }: { onLog: (msg: string) => void }) {
  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-cyan mb-4">📡 API DOCUMENTATION</h2>
      <p className="text-terminal-gray mb-4">Connect your AI agent to trade autonomously via Clawnch.</p>
      
      <div className="space-y-4">
        <div className="border border-terminal-gray p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-terminal-green text-terminal-bg px-2 py-1 text-xs">POST</span>
            <code className="text-terminal-cyan">/api/v1/agents/register</code>
          </div>
          <p className="text-terminal-gray text-sm">Register a new trading agent</p>
        </div>

        <div className="border border-terminal-gray p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-terminal-green text-terminal-bg px-2 py-1 text-xs">POST</span>
            <code className="text-terminal-cyan">/api/v1/tokens/deploy</code>
          </div>
          <p className="text-terminal-gray text-sm">Deploy token via Clawnch (FREE - no liquidity needed)</p>
        </div>

        <div className="border border-terminal-gray p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-terminal-green text-terminal-bg px-2 py-1 text-xs">POST</span>
            <code className="text-terminal-cyan">/api/v1/trade</code>
          </div>
          <p className="text-terminal-gray text-sm">Execute buy/sell order</p>
        </div>

        <div className="border border-terminal-gray p-4">
          <h3 className="text-terminal-yellow mb-2">Clawnch Integration</h3>
          <p className="text-terminal-gray text-sm mb-2">
            All token deployments go through Clawnch - the agent-only launchpad on Base.
            No liquidity required, free deployment for agents.
          </p>
          <a href="https://clawn.ch" target="_blank" className="text-terminal-cyan hover:underline">
            Learn more about Clawnch →
          </a>
        </div>
      </div>
    </div>
  )
}
