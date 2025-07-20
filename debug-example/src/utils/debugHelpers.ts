// 调试辅助工具

// 为 useBaseQuery 添加调试日志的函数
export function addDebugLogsToUseBaseQuery() {
  // 这个函数可以用来动态添加调试日志
  // 在实际使用中，你可以直接修改源码文件
  console.log('💡 要添加调试日志，请在 packages/react-query/src/useBaseQuery.ts 中添加以下代码：')
  
  const debugCode = `
// 在 useBaseQuery 函数开始处添加：
console.log('🚀 useBaseQuery called:', {
  queryKey: options.queryKey,
  enabled: options.enabled,
  staleTime: options.staleTime,
  timestamp: new Date().toISOString()
})

// 在 observer 创建后添加：
console.log('👁️ Observer created:', {
  queryHash: defaultedOptions.queryHash,
  isNewCacheEntry,
  timestamp: new Date().toISOString()
})

// 在 useSyncExternalStore 回调中添加：
console.log('🔄 Store subscription callback called:', {
  shouldSubscribe,
  timestamp: new Date().toISOString()
})

// 在返回结果前添加：
console.log('📤 useBaseQuery returning:', {
  status: result.status,
  fetchStatus: result.fetchStatus,
  isLoading: result.isLoading,
  isFetching: result.isFetching,
  hasData: result.data !== undefined,
  timestamp: new Date().toISOString()
})
`
  
  console.log(debugCode)
}

// 性能监控工具
export class QueryPerformanceMonitor {
  private static instance: QueryPerformanceMonitor
  private metrics: Map<string, any[]> = new Map()

  static getInstance() {
    if (!QueryPerformanceMonitor.instance) {
      QueryPerformanceMonitor.instance = new QueryPerformanceMonitor()
    }
    return QueryPerformanceMonitor.instance
  }

  startTiming(queryKey: string, operation: string) {
    const key = `${queryKey}-${operation}`
    const startTime = performance.now()
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, [])
    }
    
    return {
      end: () => {
        const endTime = performance.now()
        const duration = endTime - startTime
        
        this.metrics.get(key)!.push({
          startTime,
          endTime,
          duration,
          timestamp: new Date().toISOString()
        })
        
        console.log(`⏱️ ${operation} for ${queryKey}: ${duration.toFixed(2)}ms`)
        return duration
      }
    }
  }

  getMetrics(queryKey?: string) {
    if (queryKey) {
      const results: any = {}
      for (const [key, values] of this.metrics.entries()) {
        if (key.startsWith(queryKey)) {
          results[key] = values
        }
      }
      return results
    }
    return Object.fromEntries(this.metrics.entries())
  }

  clearMetrics() {
    this.metrics.clear()
    console.log('🧹 Performance metrics cleared')
  }
}

// 查询状态变化追踪器
export class QueryStateTracker {
  private static instance: QueryStateTracker
  private stateHistory: Map<string, any[]> = new Map()

  static getInstance() {
    if (!QueryStateTracker.instance) {
      QueryStateTracker.instance = new QueryStateTracker()
    }
    return QueryStateTracker.instance
  }

  trackStateChange(queryKey: string, newState: any) {
    const key = JSON.stringify(queryKey)
    
    if (!this.stateHistory.has(key)) {
      this.stateHistory.set(key, [])
    }
    
    const history = this.stateHistory.get(key)!
    const previousState = history[history.length - 1]
    
    // 只记录状态变化
    if (!previousState || JSON.stringify(previousState.state) !== JSON.stringify(newState)) {
      history.push({
        state: { ...newState },
        timestamp: new Date().toISOString(),
        timeFromPrevious: previousState 
          ? Date.now() - new Date(previousState.timestamp).getTime()
          : 0
      })
      
      console.log(`📊 State change for ${key}:`, {
        from: previousState?.state,
        to: newState,
        timeFromPrevious: history[history.length - 1].timeFromPrevious
      })
    }
  }

  getStateHistory(queryKey: string) {
    const key = JSON.stringify(queryKey)
    return this.stateHistory.get(key) || []
  }

  getAllHistory() {
    return Object.fromEntries(this.stateHistory.entries())
  }

  clearHistory() {
    this.stateHistory.clear()
    console.log('🧹 State history cleared')
  }
}

// 调试面板数据收集器
export function collectDebugData() {
  const performanceMonitor = QueryPerformanceMonitor.getInstance()
  const stateTracker = QueryStateTracker.getInstance()
  
  return {
    performance: performanceMonitor.getMetrics(),
    stateHistory: stateTracker.getAllHistory(),
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  }
}

// 导出调试数据
export function exportDebugData() {
  const data = collectDebugData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `tanstack-query-debug-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  console.log('📁 Debug data exported')
}

// 全局调试工具
declare global {
  interface Window {
    __TANSTACK_QUERY_DEBUG__: {
      addLogs: typeof addDebugLogsToUseBaseQuery
      performance: QueryPerformanceMonitor
      stateTracker: QueryStateTracker
      collectData: typeof collectDebugData
      exportData: typeof exportDebugData
    }
  }
}

// 将调试工具挂载到全局对象
if (typeof window !== 'undefined') {
  window.__TANSTACK_QUERY_DEBUG__ = {
    addLogs: addDebugLogsToUseBaseQuery,
    performance: QueryPerformanceMonitor.getInstance(),
    stateTracker: QueryStateTracker.getInstance(),
    collectData: collectDebugData,
    exportData: exportDebugData,
  }
  
  console.log('🔧 TanStack Query 调试工具已加载到 window.__TANSTACK_QUERY_DEBUG__')
}