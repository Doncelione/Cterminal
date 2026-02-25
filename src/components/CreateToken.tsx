'use client'

import { useState } from 'react'
import { useAgentStore } from '@/store/agentStore'

interface CreateTokenProps {
  onLog: (msg: string) => void
}

export function CreateToken({ onLog }: CreateTokenProps) {
  const [tokenName, setTokenName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [supply, setSupply] = useState('1000000')
  const [isDeploying, setIsDeploying] = useState(false)
  const { agentApiKey } = useAgentStore()

  const handleDeploy = async () => {
    if (!tokenName || !symbol || !supply) {
      onLog('ERROR: Please fill in all fields')
      return
    }

    setIsDeploying(true)
    onLog(`🚀 Starting deployment: ${tokenName} (${symbol})`)

    try {
      // In production, this would call the smart contract
      // For now, simulate deployment
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      onLog(`✅ Token deployed successfully!`)
      onLog(`📝 Name: ${tokenName}`)
      onLog(`💎 Symbol: ${symbol}`)
      onLog(`📊 Supply: ${supply}`)
      onLog(`🔗 Contract: 0x${Math.random().toString(16).slice(2, 42)}`)
      
      alert(`Token ${tokenName} (${symbol}) deployed successfully!`)
      
      // Reset form
      setTokenName('')
      setSymbol('')
      setSupply('1000000')
    } catch (error) {
      onLog(`❌ Deployment failed: ${error}`)
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="terminal-card">
      <h2 className="text-xl text-terminal-green mb-4">🚀 CREATE TOKEN VIA !CLAWNCH</h2>
      <p className="text-terminal-gray mb-6">
        Deploy your token directly through the CTerminal on Base or Solana.
      </p>

      {/* Token Configuration */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-terminal-gray text-sm mb-2 block">TOKEN NAME</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            placeholder="e.g., ClawTerminal"
            className="terminal-input"
          />
        </div>

        <div>
          <label className="text-terminal-gray text-sm mb-2 block">SYMBOL</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="e.g., CWT"
            className="terminal-input"
            maxLength={10}
          />
        </div>

        <div>
          <label className="text-terminal-gray text-sm mb-2 block">TOTAL SUPPLY</label>
          <input
            type="number"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            placeholder="1000000"
            className="terminal-input"
          />
        </div>
      </div>

      {/* Fee Configuration */}
      <div className="mb-6 p-4 border border-terminal-gray">
        <h3 className="text-terminal-yellow mb-3">🔗 FEE CONFIGURATION</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-terminal-gray">Deploy Fee:</span>
            <span className="text-terminal-orange">0.01 ETH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-gray">Trading Fee:</span>
            <span className="text-terminal-cyan">1% (0.5% creator, 0.5% pool)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-terminal-gray">Fee Wallet:</span>
            <span className="text-terminal-green text-xs">0x3b7...E5d7</span>
          </div>
        </div>
      </div>

      {/* Deploy Button */}
      <button
        onClick={handleDeploy}
        disabled={isDeploying || !tokenName || !symbol}
        className="terminal-button w-full"
        style={{ borderColor: '#00ff88', color: '#00ff88' }}
      >
        {isDeploying ? 'DEPLOYING...' : '🚀 DEPLOY TOKEN'}
      </button>

      {/* Alternative: Via Terminal */}
      <div className="mt-6 pt-4 border-t border-terminal-gray">
        <p className="text-terminal-gray text-sm mb-2">
          Or use terminal command:
        </p>
        <code className="text-terminal-green text-sm bg-terminal-bg p-2 block">
          !clawnch name="{tokenName || 'Token'}" symbol="{symbol || 'TOKEN'}" supply={supply}
        </code>
      </div>

      {!agentApiKey && (
        <div className="mt-4 p-3 border border-terminal-yellow bg-terminal-yellow/10 text-terminal-yellow text-center text-sm">
          ⚠️ Connect agent API to enable auto-deployment
        </div>
      )}
    </div>
  )
}
