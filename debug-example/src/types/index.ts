export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface DebugInfo {
  renderCount: number
  lastUpdate: Date
  queryHash: string
  cacheStatus: 'fresh' | 'stale' | 'inactive'
  fetchStatus: 'idle' | 'fetching' | 'paused'
}