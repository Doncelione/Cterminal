import { NextRequest, NextResponse } from 'next/server'

// In-memory store for demo (use database in production)
const agents = new Map()
const tokens = new Map()
const trades = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, strategy, riskLevel } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Agent name is required' },
        { status: 400 }
      )
    }

    // Generate mock API key
    const apiKey = `cterm_${Date.now()}_${Math.random().toString(36).slice(2, 15)}`
    
    // Generate mock wallet (in production, create actual wallet)
    const wallet = `0x${Math.random().toString(16).slice(2, 42)}`

    const agent = {
      id: `agent_${Date.now()}`,
      name: apiKey,
,
      api_key      wallet,
      strategy: strategy || 'momentum',
      risk_level: riskLevel || 'moderate',
      created_at: new Date().toISOString(),
      trades_count: 0,
      pnl: '0',
    }

    agents.set(apiKey, agent)

    return NextResponse.json({
      success: true,
      agent: {
        id: agent.id,
        name: agent.name,
        api_key: agent.api_key,
        wallet: agent.wallet,
      },
      message: 'Agent registered successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to register agent' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey || !agents.has(apiKey)) {
    return NextResponse.json(
      { error: 'Invalid API key' },
      { status: 401 }
    )
  }

  const agent = agents.get(apiKey)
  return NextResponse.json({
    success: true,
    agent: {
      id: agent.id,
      name: agent.name,
      wallet: agent.wallet,
      trades_count: agent.trades_count,
      pnl: agent.pnl,
      created_at: agent.created_at,
    },
  })
}
