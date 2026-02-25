import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: 'CTerminal - AI Agent Trading Platform',
  description: 'Trade tokens on Base and Solana with AI agents. Web 4.0 autonomous trading terminal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-terminal-bg min-h-screen">
        <div className="scanline" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
