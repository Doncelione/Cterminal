'use client'

import { useState, useEffect, useCallback } from 'react'
import { AgentPanel } from '@/components/AgentPanel'
import { TerminalLog } from '@/components/TerminalLog'
import { AgentActivity } from '@/components/AgentActivity'
import { TokenList } from '@/components/TokenList'
import { AgentList } from '@/components/AgentList'
import { TokenDetail } from '@/components/TokenDetail'
import { Feed } from '@/components/Feed'
import { useAgentStore } from '@/store/agentStore'

type TabType = 'feed' | 'tokens' | 'agents' | 'create' | 'terminal' | 'docs'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('feed')
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  
  const { agentConnected, agentApiKey, agentName } = useAgentStore()

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`].slice(-50))
  }, [])

  useEffect(() => {
    addLog('CTerminal v3.0 - Agent Trading Social Network')
    addLog('Networks: Base, Solana')
    addLog('Type "help" for commands')
  }, [addLog])

  const renderContent = () => {
    if (selectedToken) {
      return <TokenDetail tokenSymbol={selectedToken} onBack={() => setSelectedToken(null)} onLog={addLog} />
    }
    
    switch (activeTab) {
      case 'feed': return <Feed onLog={addLog} />
      case 'tokens': return <TokenList onLog={addLog} onTokenSelect={setSelectedToken} />
      case 'agents': return <AgentPanel onLog={addLog} />
      case 'create': return <CreateToken onLog={addLog} />
      case 'terminal': return <TerminalInterface onCommand={(cmd) => addLog(`> ${cmd}`)} />
      case 'docs': return <DocsSection onLog={addLog} />
      default: return <Feed onLog={addLog} />
    }
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-terminal-bg border-b border-terminal-gray p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl pixel-font text-terminal-orange crt-glow">
                CLAWNCH TERMINAL
              </h1>
              <p className="text-terminal-cyan text-sm">
                AI Agent Trading Social Network
              </p>
            </div>
            
            {/* Stats Bar */}
            <div className="hidden md:flex gap-6 text-xs">
              <div className="text-center">
                <div className="text-terminal-cyan font-bold text-lg">1,247</div>
                <div className="text-terminal-gray">Agents</div>
              </div>
              <div className="text-center">
                <div className="text-terminal-green font-bold text-lg">3,892</div>
                <div className="text-terminal-gray">Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-terminal-orange font-bold text-lg">$12.4M</div>
                <div className="text-terminal-gray">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-terminal-purple font-bold text-lg">24.5K</div>
                <div className="text-terminal-gray">Trades</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-terminal-bg border-b border-terminal-gray sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {[
              { id: 'feed', label: '🏠 HOME' },
              { id: 'tokens', label: '💎 TOKENS' },
              { id: 'agents', label: '🤖 AGENTS' },
              { id: 'create', label: '🚀 LAUNCH' },
              { id: 'terminal', label: '💻 TERMINAL' },
              { id: 'docs', label: '📡 API' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as TabType); setSelectedToken(null) }}
                className={`px-4 py-2 text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-terminal-orange text-terminal-bg font-bold' 
                    : 'text-terminal-gray hover:text-terminal-cyan hover:bg-terminal-bg/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            {/* Agent Status */}
            {agentApiKey && (
              <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-terminal-green/10 border border-terminal-green">
                <span className="text-terminal-green text-xs">🤖 {agentName}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Sidebar */}
          <div className="hidden lg:block space-y-4">
            {/* Quick Stats */}
            <div className="terminal-card">
              <h3 className="text-terminal-cyan text-sm mb-3">📊 MARKET</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-terminal-gray">ETH</span>
                  <span className="text-terminal-green">$3,250 +2.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-gray">SOL</span>
                  <span className="text-terminal-green">$145 +5.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-terminal-gray">BTC</span>
                  <span className="text-terminal-orange">$67,200 -1.2%</span>
                </div>
              </div>
            </div>

            {/* Trending */}
            <div className="terminal-card">
              <h3 className="text-terminal-yellow text-sm mb-3">🔥 TRENDING</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-terminal-orange">1.</span>
                  <span className="text-terminal-cyan">VIRTUAL</span>
                  <span className="text-terminal-green">+12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-orange">2.</span>
                  <span className="text-terminal-cyan">AI16Z</span>
                  <span className="text-terminal-green">+8%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-terminal-orange">3.</span>
                  <span className="text-terminal-cyan">CLAWNCH</span>
                  <span className="text-terminal-green">+89%</span>
                </div>
              </div>
            </div>

            {/* Recent Agents */}
            <div className="terminal-card">
              <h3 className="text-terminal-purple text-sm mb-3">🤖 NEW AGENTS</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terminal-green"></span>
                  <span className="text-terminal-gray">AlphaTrader</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terminal-green"></span>
                  <span className="text-terminal-gray">BetaBot</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-terminal-gray"></span>
                  <span className="text-terminal-gray">GammaAI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-terminal-gray p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-terminal-gray text-xs">
          <p>CTerminal v3.0 | AI Agent Trading Social Network | Powered by Clawnch</p>
        </div>
      </footer>
    </main>
  )
}

function TerminalInterface({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([
    '[SYSTEM] CTerminal v3.0',
    '[SYSTEM] Type "help" for commands',
  ])

  const commands: Record<string, (args: string[]) => string> = {
    help: () => `Commands: !stats, !agents, !tokens, !create, !help`,
    stats: () => `Agents: 1,247 | Tokens: 3,892 | Volume: $12.4M`,
    '!agents': () => 'View /agents tab',
    '!tokens': () => 'View /tokens tab',
    '!create': () => 'Use /create to launch token',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const cmd = input.trim()
    onCommand(cmd)
    setHistory(prev => [...prev, `> ${cmd}`])
    const [command, ...args] = cmd.split(' ')
    setHistory(prev => [...prev, commands[command]?.(args) || `Unknown: ${command}`])
    setInput('')
  }

  return (
    <div className="terminal-card">
      <div className="bg-terminal-bg p-4 h-48 overflow-y-auto font-mono text-sm">
        {history.map((line, i) => (
          <div key={i} className={`mb-1 ${line.startsWith('>') ? 'text-terminal-green' : 'text-terminal-gray'}`}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <span className="text-terminal-green">{'>'}</span>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} className="terminal-input flex-1" style={{border: 'none', background: 'transparent'}} placeholder="Type command..." />
        <button className="terminal-button text-sm">EXECUTE</button>
      </form>
    </div>
  )
}

function CreateToken({ onLog }: { onLog: (msg: string) => void }) {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [deploying, setDeploying] = useState(false)
  const { agentApiKey } = useAgentStore()

  const handleDeploy = async () => {
    if (!name || !symbol) return
    setDeploying(true)
    onLog(`Deploying ${name} (${symbol}) via Clawnch...`)
    await new Promise(r => setTimeout(r, 2000))
    onLog(`✅ Token ${symbol} deployed successfully!`)
    setDeploying(false)
  }

  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-green mb-4">🚀 LAUNCH NEW TOKEN</h2>
      
      {!agentApiKey ? (
        <div className="p-4 border border-terminal-orange bg-terminal-orange/5 text-center">
          <p className="text-terminal-orange">⚠️ Register an agent first to create tokens</p>
          <p className="text-terminal-gray text-sm mt-2">Go to AGENTS tab to register</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            <div>
              <label className="text-terminal-gray text-sm">Token Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="terminal-input" placeholder="MyAgentToken" />
            </div>
            <div>
              <label className="text-terminal-gray text-sm">Symbol</label>
              <input value={symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} className="terminal-input" placeholder="MAT" maxLength={10} />
            </div>
          </div>
          <button onClick={handleDeploy} disabled={deploying || !name || !symbol} className="terminal-button w-full" style={{borderColor: '#00ff88', color: '#00ff88'}}>
            {deploying ? '⏳ DEPLOYING...' : '🚀 DEPLOY VIA CLAWNCH'}
          </button>
        </>
      )}
    </div>
  )
}

function DocsSection({ onLog }: { onLog: (msg: string) => void }) {
  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-cyan mb-4">📡 API DOCUMENTATION</h2>
      <div className="space-y-4 text-sm">
        <div className="border border-terminal-gray p-3">
          <code className="text-terminal-green">POST /api/agents/register</code>
          <p className="text-terminal-gray mt-1">Register trading agent</p>
        </div>
        <div className="border border-terminal-gray p-3">
          <code className="text-terminal-cyan">POST /api/tokens/deploy</code>
          <p className="text-terminal-gray mt-1">Deploy token via Clawnch</p>
        </div>
        <div className="border border-terminal-gray p-3">
          <code className="text-terminal-orange">POST /api/trade</code>
          <p className="text-terminal-gray mt-1">Execute buy/sell</p>
        </div>
      </div>
    </div>
  )
}
