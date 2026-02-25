'use client'

import { useState, useEffect } from 'react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

interface TradingPanelProps {
  walletAddress: string
  onTrade: (action: string, token: string, amount: string) => void
}

// Mock tokens for demo
const MOCK_TOKENS = [
  { address: '0x...', name: 'ETH', symbol: 'ETH', price: '3250.00' },
  { address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed', name: 'Dai', symbol: 'DAI', price: '1.00' },
  { address: '0x833589fcd6ebe541f13201dbdef7f807a1d6e7e9', name: 'USDC', symbol: 'USDC', price: '1.00' },
  { address: '0x...', name: 'ClawTerminal', symbol: 'CWT', price: '0.00' },
]

const SOL_TOKENS = [
  { address: 'EPjFWdd5AufqSSBc8Asw7Tw6RDwrsvG9v1FRdYw5E3p', name: 'USD Coin', symbol: 'USDC', price: '1.00' },
  { address: 'So11111111111111111111111111111111111111112', name: 'Wrapped SOL', symbol: 'SOL', price: '145.00' },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtkqjberbSOWd91pbT2', name: 'Jupiter', symbol: 'JUP', price: '0.85' },
]

export function TradingPanel({ walletAddress, onTrade }: TradingPanelProps) {
  const [activeChain, setActiveChain] = useState<'base' | 'solana'>('base')
  const [selectedToken, setSelectedToken] = useState(MOCK_TOKENS[0])
  const [buyAmount, setBuyAmount] = useState('0.1')
  const [isLoading, setIsLoading] = useState(false)
  const { setVisible } = useWalletModal()

  const tokens = activeChain === 'base' ? MOCK_TOKENS : SOL_TOKENS

  const handleBuy = async () => {
    if (!walletAddress) {
      if (activeChain === 'base') {
        alert('Please connect Base wallet (MetaMask)')
      } else {
        setVisible(true)
      }
      return
    }

    setIsLoading(true)
    try {
      // In real implementation, this would call the smart contract
      await new Promise(resolve => setTimeout(resolve, 1500))
      onTrade('BUY', selectedToken.symbol, buyAmount)
      alert(`Buy order executed: ${buyAmount} ETH -> ${selectedToken.symbol}`)
    } catch (error) {
      console.error('Trade error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSell = async () => {
    if (!walletAddress) {
      if (activeChain === 'base') {
        alert('Please connect Base wallet (MetaMask)')
      } else {
        setVisible(true)
      }
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      onTrade('SELL', selectedToken.symbol, buyAmount)
      alert(`Sell order executed: ${selectedToken.symbol} -> ${buyAmount} ETH`)
    } catch (error) {
      console.error('Trade error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="terminal-card">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl text-terminal-orange">💱 TRADING</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveChain('base')}
            className={`px-3 py-1 text-sm ${activeChain === 'base' ? 'bg-terminal-orange text-terminal-bg' : 'border border-terminal-gray text-terminal-gray'}`}
          >
            BASE
          </button>
          <button
            onClick={() => setActiveChain('solana')}
            className={`px-3 py-1 text-sm ${activeChain === 'solana' ? 'bg-terminal-purple text-white' : 'border border-terminal-gray text-terminal-gray'}`}
          >
            SOLANA
          </button>
        </div>
      </div>

      {/* Token Selection */}
      <div className="mb-6">
        <label className="text-terminal-gray text-sm mb-2 block">SELECT TOKEN</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tokens.map((token) => (
            <button
              key={token.address}
              onClick={() => setSelectedToken(token)}
              className={`p-3 border text-left transition-all ${
                selectedToken.symbol === token.symbol
                  ? 'border-terminal-orange bg-terminal-orange/10'
                  : 'border-terminal-gray hover:border-terminal-cyan'
              }`}
            >
              <div className="text-terminal-green font-bold">{token.symbol}</div>
              <div className="text-terminal-gray text-xs">{token.name}</div>
              <div className="text-terminal-cyan text-sm">${token.price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Buy */}
      <div className="mb-6">
        <label className="text-terminal-gray text-sm mb-2 block">⚡ QUICK BUY</label>
        <div className="flex gap-2 mb-3">
          {['0.1', '0.5', '1.0', '5.0'].map((amount) => (
            <button
              key={amount}
              onClick={() => setBuyAmount(amount)}
              className={`flex-1 py-2 border ${
                buyAmount === amount
                  ? 'border-terminal-green bg-terminal-green/10 text-terminal-green'
                  : 'border-terminal-gray text-terminal-gray hover:border-terminal-cyan'
              }`}
            >
              {amount} ETH
            </button>
          ))}
          <button
            onClick={() => setBuyAmount('MAX')}
            className="px-4 border border-terminal-yellow text-terminal-yellow hover:bg-terminal-yellow/10"
          >
            MAX
          </button>
        </div>

        <input
          type="number"
          value={buyAmount}
          onChange={(e) => setBuyAmount(e.target.value)}
          placeholder="Enter amount"
          className="terminal-input mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={handleBuy}
            disabled={isLoading || !walletAddress}
            className="terminal-button flex-1"
            style={{ borderColor: '#00ff88', color: '#00ff88' }}
          >
            {isLoading ? 'PROCESSING...' : '🟢 BUY'}
          </button>
          <button
            onClick={handleSell}
            disabled={isLoading || !walletAddress}
            className="terminal-button flex-1"
            style={{ borderColor: '#ff6b35', color: '#ff6b35' }}
          >
            {isLoading ? 'PROCESSING...' : '🔴 SELL'}
          </button>
        </div>
      </div>

      {!walletAddress && (
        <div className="mt-4 p-3 border border-terminal-yellow bg-terminal-yellow/10 text-terminal-yellow text-center">
          ⚠️ CONNECT WALLET TO TRADE
        </div>
      )}
    </div>
  )
}
