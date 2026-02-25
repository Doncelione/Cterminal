import { NextRequest, NextResponse } from 'next/server'

const COINGECKO_API = 'https://api.coingecko.com/api/v3'

const TOKEN_IDS: Record<string, string> = {
  'VIRTUAL': 'virtual-protocol',
  'AI16Z': 'ai16z',
  'SEN': 'sentient',
  'NUMO': 'numogram',
  'FART': 'fartcoin',
  'GRIFF': 'griffain',
  'TERM': 'termi',
  'DAOS': 'daos',
  'SWARM': 'swarms',
  'CLAWNCH': 'clawnch',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')?.toUpperCase()
    
    if (symbol && TOKEN_IDS[symbol]) {
      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=${TOKEN_IDS[symbol]}&vs_currencies=usd&include_24hr_change=true`
      )
      const data = await response.json()
      const tokenData = data[TOKEN_IDS[symbol]]
      
      return NextResponse.json({
        symbol,
        price: tokenData?.usd || 0,
        change24h: tokenData?.usd_24h_change || 0
      })
    }
    
    const ids = Object.values(TOKEN_IDS).join(',')
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
    )
    const data = await response.json()
    
    const prices: Record<string, any> = {}
    for (const [symbol, id] of Object.entries(TOKEN_IDS)) {
      if (data[id]) {
        prices[symbol] = {
          price: data[id].usd || 0,
          change24h: data[id].usd_24h_change || 0,
          volume24h: data[id].usd_24h_vol || 0,
          marketCap: data[id].usd_market_cap || 0
        }
      }
    }
    
    return NextResponse.json(prices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 })
  }
}
