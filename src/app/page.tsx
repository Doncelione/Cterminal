'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { BrowserProvider, formatEther } from 'ethers'
import { TradingPanel } from '@/components/TradingPanel'
import { TokenMonitor } from '@/components/TokenMonitor'
import { AgentPanel } from '@/components/AgentPanel'
import { TerminalLog } from '@/components/TerminalLog'
import { CreateToken } from '@/components/CreateToken'
import { useAgentStore } from '@/store/agentStore'

type TabType = 'trading' | 'agents' | 'create' | 'api' | 'terminal'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('trading')
  const [baseBalance, setBaseBalance] = useState<string>('--')
  const [solBalance, setSolBalance] = useState<string>('--')
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
          const balance = await provider.getBalance(accounts[0])
          setBaseBalance(parseFloat(formatEther(balance)).toFixed(4))
          addLog(`Base wallet connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
        }
      } catch (error) {
        addLog(`Error connecting Base wallet: ${error}`)
      }
    } else {
      addLog('MetaMask not found. Please install MetaMask.')
    }
  }

  // Check Solana balance
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58())
      addLog(`Solana wallet connected: ${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-4)}`)
    }
  }, [connected, publicKey, addLog])

  // Initialize
  useEffect(() => {
    addLog('CTerminal v2.0 initialized')
    addLog('Network: Base Mainnet (Chain ID: 8453)')
    addLog('Network: Solana Mainnet')
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
          &gt;&gt;&gt; AI AGENT TRADING v2.0 &lt;&lt;&lt;
        </p>
        <p className="text-terminal-gray text-sm">
          AUTONOMOUS AGENTS • BASE + SOLANA • REAL-TIME API
        </p>
      </header>

      {/* Connection Status */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="terminal-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${walletAddress ? 'bg-terminal-green' : 'bg-red-500'}`} />
              <span className="text-terminal-green">
                {walletAddress ? 'CONNECTED' : 'OFFLINE'}
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
              {baseBalance !== '--' ? `ETH: ${baseBalance}` : 'Connect Base'}
            </button>
            
            <div className="terminal-button text-sm" style={{ borderColor: '#9945FF', color: '#9945FF' }}>
              <WalletMultiButton style={{ background: 'transparent', border: 'none', color: 'inherit' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      {(agentConnected || agentApiKey) && (
        <div className="max-w-6xl mx-auto mb-6">
          <div className="terminal-card border-terminal-purple">
            <div className="flex items-center gap-2 text-terminal-purple">
              <span className="text-xl">🤖</span>
              <span>AGENT CONNECTED</span>
              {agentApiKey && <span className="text-xs text-terminal-gray">API: {agentApiKey.slice(0, 12)}...</span>}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-6 overflow-x-auto">
        <nav className="flex gap-2">
          {[
            { id: 'trading', label: '💱 TRADING', icon: '💱' },
            { id: 'agents', label: '🤖 AGENTS', icon: '🤖' },
            { id: 'create', label: '🚀 CREATE', icon: '🚀' },
            { id: 'api', label: '📡 API', icon: '📡' },
            { id: 'terminal', label: '💻 TERMINAL', icon: '💻' },
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
          {activeTab === 'trading' && (
            <TradingPanel 
              walletAddress={walletAddress} 
              onTrade={(action, token, amount) => {
                addLog(`${action.toUpperCase()}: ${amount} ETH -> ${token}`)
              }}
            />
          )}
          
          {activeTab === 'agents' && (
            <AgentPanel onLog={addLog} />
          )}
          
          {activeTab === 'create' && (
            <CreateToken onLog={addLog} />
          )}
          
          {activeTab === 'api' && (
            <APIPanel onLog={addLog} />
          )}
          
          {activeTab === 'terminal' && (
            <TerminalInterface onCommand={(cmd) => addLog(`> ${cmd}`)} />
          )}
        </div>

        {/* Right Panel - Token Monitor & Logs */}
        <div className="space-y-6">
          <TokenMonitor onTokenSelect={(token) => {
            addLog(`Selected token: ${token}`)
          }} />
          
          <TerminalLog logs={logs} />
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 pt-6 border-t border-terminal-gray text-center text-terminal-gray text-sm">
        <p>CTerminal v2.0 | Built for Base + Solana</p>
        <p className="mt-2">⚠️ Trade responsibly. DYOR.</p>
      </footer>
    </main>
  )
}

// API Panel Component
function APIPanel({ onLog }: { onLog: (msg: string) => void }) {
  const [apiKey, setApiKey] = useState('')
  const [agentName, setAgentName] = useState('')
  const { setAgentApiKey, setAgentConnected } = useAgentStore()

  const registerAgent = async () => {
    try {
      const response = await fetch('/api/agents/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: agentName })
      })
      const data = await response.json()
      
      if (data.api_key) {
        setApiKey(data.api_key)
        setAgentApiKey(data.api_key)
        setAgentConnected(true)
        onLog(`Agent registered: ${agentName}`)
        onLog(`API Key: ${data.api_key}`)
      }
    } catch (error) {
      onLog(`Error: ${error}`)
    }
  }

  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-orange mb-4">📡 API DOCUMENTATION</h2>
      <p className="text-terminal-gray mb-4">RESTful API for AI agents. Connect wallet to get your API key.</p>
      
      <div className="space-y-4">
        <div className="border border-terminal-gray p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-terminal-green text-terminal-bg px-2 py-1 text-xs">POST</span>
            <code className="text-terminal-cyan">/api/v1/agents/register</code>
          </div>
          <p className="text-terminal-gray text-sm">Register a new trading agent with auto-generated wallet</p>
          <pre className="text-terminal-green text-xs mt-2 overflow-x-auto">
{`{
  "name": "AlphaTrader",
  "strategy": "momentum",
  "riskLevel": "medium"
}`}
          </pre>
        </div>

        <div className="border border-terminal-gray p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-terminal-green text-terminal-bg px-2 py-1 text-xs">POST</span>
            <code className="text-terminal-cyan">/api/v1/tokens/deploy</code>
          </div>
          <p className="text-terminal-gray text-sm">Deploy new token via !clawnch command</p>
        </div>

        <div className="border border-terminal-gray p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-terminal-green text-terminal-bg px-2 py-1 text-xs">POST</span>
            <code className="text-terminal-cyan">/api/v1/trade/buy</code>
          </div>
          <p className="text-terminal-gray text-sm">Execute buy order for agent on Base or Solana</p>
        </div>

        <div className="border border-terminal-gray p-4">
          <h3 className="text-terminal-yellow mb-2">Register New Agent</h3>
          <input
            type="text"
            placeholder="Agent name"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className="terminal-input mb-2"
          />
          <button onClick={registerAgent} className="terminal-button w-full">
            REGISTER AGENT
          </button>
          {apiKey && (
            <div className="mt-4 p-2 bg-terminal-bg border border-terminal-green">
              <p className="text-terminal-green text-sm">API Key:</p>
              <code className="text-terminal-cyan text-xs break-all">{apiKey}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Terminal Interface Component
function TerminalInterface({ onCommand }: { onCommand: (cmd: string) => void }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([
    '[SYSTEM] CTerminal v2.0 initialized',
    '[SYSTEM] Networks: Base (8453), Solana (101)',
    '[SYSTEM] Type "help" for commands'
  ])

  const commands: Record<string, (args: string[]) => string> = {
    help: () => `Available commands:
  !clawnch [name] [symbol] - Create new token
  !buy [token] [amount] - Buy token
  !sell [token] [amount] - Sell token
  !monitor [token] - Start monitoring
  !balance - Check balance
  !help - Show this message`,
    balance: () => 'Use wallet connection to check balance',
    '!clawnch': (args) => `Creating token: ${args[0] || 'Token'} with symbol: ${args[1] || 'TOKEN'}`,
    '!buy': (args) => `Buy order: ${args[1] || '0.1'} ETH of ${args[0] || 'TOKEN'}`,
    '!sell': (args) => `Sell order: ${args[1] || '100%'} of ${args[0] || 'TOKEN'}`,
    '!monitor': (args) => `Started monitoring: ${args[0] || 'TOKEN'}`,
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
        <button type="submit" className="terminal-button">
          EXECUTE
        </button>
      </form>
    </div>
  )
}
