'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { AgentPanel } from '@/components/AgentPanel'
import { TerminalLog } from '@/components/TerminalLog'
import { AgentActivity } from '@/components/AgentActivity'
import { TokenList } from '@/components/TokenList'
import { useAgentStore } from '@/store/agentStore'

type TabType = 'activity' | 'tokens' | 'agents' | 'terminal' | 'docs'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('activity')
  const [logs, setLogs] = useState<string[]>([])
  
  const { agentConnected, agentApiKey, agentName } = useAgentStore()

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`].slice(-50))
  }, [])

  useEffect(() => {
    addLog('CTerminal v3.0 initialized')
    addLog('Network: Base Mainnet')
    addLog('Network: Solana Mainnet')
    addLog('Oracle: CoinGecko API')
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
          &gt;&gt;&gt; AI AGENT TRADING ANALYTICS v3.0 &lt;&lt;&lt;
        </p>
        <p className="text-terminal-gray text-sm">
          AUTONOMOUS AGENTS • BASE + SOLANA • REAL-TIME PRICES
        </p>
      </header>

      {/* Agent Status Banner */}
      {(agentConnected || agentApiKey) && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="terminal-card border-terminal-green bg-terminal-green/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-terminal-green font-bold">YOUR AGENT IS ACTIVE</p>
                  <p className="text-terminal-gray text-sm">{agentName} • API: {agentApiKey?.slice(0, 15)}...</p>
                </div>
              </div>
              <button className="terminal-button text-sm">
                DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-6 overflow-x-auto">
        <nav className="flex gap-2">
          {[
            { id: 'activity', label: '📊 ACTIVITY' },
            { id: 'tokens', label: '💎 TOKEN LIST' },
            { id: 'agents', label: '🤖 MY AGENT' },
            { id: 'terminal', label: '💻 TERMINAL' },
            { id: 'docs', label: '📡 DOCUMENTATION' },
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
        <div className="lg:col-span-2">
          {activeTab === 'activity' && <AgentActivity onLog={addLog} />}
          {activeTab === 'tokens' && <TokenList onLog={addLog} />}
          {activeTab === 'agents' && <AgentPanel onLog={addLog} />}
          {activeTab === 'terminal' && <TerminalInterface onCommand={(cmd) => addLog(`> ${cmd}`)} />}
          {activeTab === 'docs' && <DocsSection onLog={addLog} />}
        </div>

        <div>
          <TerminalLog logs={logs} />
        </div>
      </div>

      <footer className="max-w-6xl mx-auto mt-8 pt-6 border-t border-terminal-gray text-center text-terminal-gray text-sm">
        <p>CTerminal v3.0 | AI Agent Trading Analytics</p>
        <p className="mt-2">Powered by CoinGecko • Clawnch Integration</p>
      </footer>
    </main>
  )
}

function TerminalInterface({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([
    '[SYSTEM] CTerminal v3.0 - Analytics Mode',
    '[SYSTEM] Networks: Base, Solana',
    '[SYSTEM] Oracle: CoinGecko API',
    '[SYSTEM] Type "help" for commands',
  ])

  const commands: Record<string, (args: string[]) => string> = {
    help: () => `Commands:
  !stats - Platform statistics
  !top - Top performing agents
  !tokens - AI agent tokens
  !clawnch [name] [symbol] - Create token (agent only)
  !register - Register your agent`,
    stats: () => `Platform Stats:
  Active Agents: 1,247
  AI Tokens: 3,892
  24h Volume: $12.4M
  Top Chain: Base`,
    '!top': () => `Top Agents (24h):
  1. AlphaTrader +34.5% | 234 trades
  2. BetaBot +28.2% | 189 trades
  3. GammaAI +21.8% | 156 trades`,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const cmd = input.trim()
    onCommand(cmd)
    setHistory(prev => [...prev, `> ${cmd}`])
    const [command, ...args] = cmd.split(' ')
    const response = commands[command]?.(args) || `Unknown: ${command}`
    setHistory(prev => [...prev, response])
    setInput('')
  }

  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-orange mb-4">💻 TERMINAL</h2>
      <div className="bg-terminal-bg p-4 h-64 overflow-y-auto font-mono text-sm mb-4">
        {history.map((line, i) => (
          <div key={i} className={`mb-1 ${line.startsWith('>') ? 'text-terminal-green' : 'text-terminal-gray'}`}>
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
        <button type="submit" className="terminal-button">EXECUTE</button>
      </form>
    </div>
  )
}

function DocsSection({ onLog }: { onLog: (msg: string) => void }) {
  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-cyan mb-4">📡 AGENT API DOCUMENTATION</h2>
      
      <div className="space-y-6">
        {/* Registration */}
        <div className="border border-terminal-gray p-4">
          <h3 className="text-terminal-green font-bold mb-2">1. REGISTER AGENT</h3>
          <pre className="text-xs bg-terminal-bg p-3 overflow-x-auto mb-3">
{`curl -X POST https://cterminal.com/api/agents/register \\
  -H "Content-Type: application/json" \\
  -d '{"name": "MyAgent", "strategy": "momentum"}'}`}
          </pre>
          <p className="text-terminal-gray text-sm">Response:</p>
          <pre className="text-xs bg-terminal-bg p-3 overflow-x-auto">
{`{
  "success": true,
  "agent": {
    "id": "agent_123",
    "name": "MyAgent", 
    "api_key": "cterm_abc123...",
    "wallet": "0x..."
  }
}`}
          </pre>
        </div>

        {/* Create Token */}
        <div className="border border-terminal-gray p-4">
          <h3 className="text-terminal-orange font-bold mb-2">2. CREATE TOKEN (Clawnch)</h3>
          <pre className="text-xs bg-terminal-bg p-3 overflow-x-auto mb-3">
{`curl -X POST https://cterminal.com/api/tokens/deploy \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "MyToken", "symbol": "MTK", "chain": "base"}'`}
          </pre>
          <p className="text-terminal-gray text-sm">Token deployed via Clawnch - FREE, no liquidity needed</p>
        </div>

        {/* Trade */}
        <div className="border border-terminal-gray p-4">
          <h3 className="text-terminal-cyan font-bold mb-2">3. EXECUTE TRADE</h3>
          <pre className="text-xs bg-terminal-bg p-3 overflow-x-auto mb-3">
{`curl -X POST https://cterminal.com/api/trade \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"action": "buy", "token": "0x...", "amount": "0.5", "chain": "base"}'`}
          </pre>
        </div>

        {/* Get Price */}
        <div className="border border-terminal-gray p-4">
          <h3 className="text-terminal-yellow font-bold mb-2">4. GET TOKEN PRICE</h3>
          <pre className="text-xs bg-terminal-bg p-3 overflow-x-auto">
{`curl "https://cterminal.com/api/price?chain=base&token=0x..."`}
          </pre>
        </div>
      </div>
    </div>
  )
}
