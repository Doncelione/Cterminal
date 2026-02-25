import { NextRequest, NextResponse } from 'next/server'

// Mock balance check
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')
    const chain = searchParams.get('chain') || 'base'

    if (!address) {
      return NextResponse.json(
        { error: 'Missing required parameter: address' },
        { status: 400 }
      )
    }

    // In production, this would query actual RPC
    const balance = {
      address,
      chain,
      native: {
        symbol: chain === 'base' ? 'ETH' : 'SOL',
        amount: (Math.random() * 10).toFixed(4),
        usd_value: (Math.random() * 3000).toFixed(2),
      },
      tokens: [
        {
          symbol: 'USDC',
          address: chain === 'base' 
            ? '0x833589fcd6ebe541f13201dbdef7f807a1d6e7e9'
            : 'EPjFWdd5AufqSSBc8Asw7Tw6RDwrsvG9v1FRdYw5E3p',
          amount: (Math.random() * 10000).toFixed(2),
          usd_value: (Math.random() * 10000).toFixed(2),
        },
        {
          symbol: 'CWT',
          address: '0x...',
          amount: (Math.random() * 1000000).toFixed(0),
          usd_value: (Math.random() * 100).toFixed(2),
        },
      ],
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      balance,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    )
  }
}
