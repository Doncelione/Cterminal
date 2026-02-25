import { create } from 'zustand'

interface AgentState {
  agentConnected: boolean
  agentApiKey: string | null
  agentName: string
  agentWallet: string | null
  tradingStrategy: string
  riskLevel: 'conservative' | 'moderate' | 'aggressive'
  setAgentConnected: (connected: boolean) => void
  setAgentApiKey: (key: string | null) => void
  setAgentName: (name: string) => void
  setAgentWallet: (wallet: string | null) => void
  setTradingStrategy: (strategy: string) => void
  setRiskLevel: (level: 'conservative' | 'moderate' | 'aggressive') => void
}

export const useAgentStore = create<AgentState>((set) => ({
  agentConnected: false,
  agentApiKey: null,
  agentName: '',
  agentWallet: null,
  tradingStrategy: 'momentum',
  riskLevel: 'moderate',
  setAgentConnected: (connected) => set({ agentConnected: connected }),
  setAgentApiKey: (key) => set({ agentApiKey: key }),
  setAgentName: (name) => set({ agentName: name }),
  setAgentWallet: (wallet) => set({ agentWallet: wallet }),
  setTradingStrategy: (strategy) => set({ tradingStrategy: strategy }),
  setRiskLevel: (level) => set({ riskLevel: level }),
}))
