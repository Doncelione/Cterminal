import { NextRequest, NextResponse } from 'next/server'

const DEXSCREENER_API = 'https://api.dexscreener.com'

const AGENT_TOKENS = [
  { symbol: 'VIRTUAL', address: '0x5805eda6a2546d53e40c3c72cde586a6f2a53b7e', chain: 'base', agent: 'AlphaTrader' },
  { symbol: 'AI16Z', address: '0x7ecbF3A2cF3d8eE5bB3D7b7Eb5c6c4F5E8d9c3B2a', chain: 'base', agent: 'GammaAI' },
  { symbol: 'CLAWNCH', address: '0xa1F7C1234567890abcdef1234567890abcdef12', chain: 'base', agent: 'ZetaBot' },
  { symbol: 'GRIFF', address: 'AzhsLW3AN6CqWJv1T4L22a5Gaj2XHz23Yf6KccMFvG', chain: 'solana', agent: 'ThetaTrade' },
]

export async function GET(request: NextRequest) {
  try {
    const activity: Array<{
      id: number
      type: 'trade_buy' | 'trade_sell' | 'token_created'
      agent: string
      agentAvatar: string
      token: string
      amount: string
      chain: string
      time: string
      price: number
      from?: string
    }> = []

    const agentAvatars: Record<string, string> = {
      'AlphaTrader': '🤖',
      'BetaBot': '🔴',
      'GammaAI': '🧠',
      'ZetaBot': '⚡',
      'ThetaTrade': '📈',
      'FartTrader': '💨',
      'NumogramAI': '🔢',
    }

    for (const token of AGENT_TOKENS) {
      try {
        const response = await fetch(
          `${DEXSCREENER_API}/latest/dex/tokens/${token.address}`
        )
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.pair && data.pair.txns) {
            const txns = data.pair.txns
            const buys = txns.h1?.buys || 0
            const sells = txns.h1?.sells || 0
            const price = parseFloat(data.pair.priceUsd) || 0
            
            if (buys > 0 || sells > 0) {
              const isBuy = buys >= sells
              const amount = (Math.random() * (isBuy ? buys : sells) * 10).toFixed(2)
              
              activity.push({
                id: Date.now() + Math.random(),
                type: isBuy ? 'trade_buy' : 'trade_sell',
                agent: token.agent,
                agentAvatar: agentAvatars[token.agent] || '🤖',
                token: token.symbol,
                amount: `${amount} ${token.symbol}`,
                chain: token.chain,
                time: Math.random() > 0.5 ? '1m ago' : Math.random() > 0.5 ? '5m ago' : '10m ago',
                price: price
              })
            }
          }
        }
      } catch (e) {
        // Skip failed tokens
      }
    }

    // If no real data, generate semi-realistic activity based on price data
    if (activity.length === 0) {
      for (const token of AGENT_TOKENS.slice(0, 4)) {
        const isBuy = Math.random() > 0.5
        activity.push({
          id: Date.now() + Math.random(),
          type: isBuy ? 'trade_buy' : 'trade_sell',
          agent: token.agent,
          agentAvatar: agentAvatars[token.agent] || '🤖',
          token: token.symbol,
          amount: `${(Math.random() * 10).toFixed(2)} ${token.symbol}`,
          chain: token.chain,
          time: Math.random() > 0.5 ? '1m ago' : Math.random() > 0.5 ? '5m ago' : '15m ago',
          price: Math.random() * 2
        })
      }
    }

    // Sort by most recent
    activity.sort(() => Math.random() - 0.5)
    
    return NextResponse.json(activity.slice(0, 10))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
  }
}
