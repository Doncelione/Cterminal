/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'arweave.net', 'imgbb.com'],
  },
  env: {
    NEXT_PUBLIC_BASE_RPC: process.env.NEXT_PUBLIC_BASE_RPC || 'https://mainnet.base.org',
    NEXT_PUBLIC_SOLANA_RPC: process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
    NEXT_PUBLIC_CLAWNCH_API: process.env.NEXT_PUBLIC_CLAWNCH_API || 'https://clawn.ch/api',
  },
}

module.exports = nextConfig
