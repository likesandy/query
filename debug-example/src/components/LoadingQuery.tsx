import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api'

export function LoadingQuery() {
  console.log('🔄 LoadingQuery component rendering...')
  
  const [delay, setDelay] = useState(2000)
  const [enabled, setEnabled] = useState(false)

  // 带延迟的查询示例
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isPending,
    isInitialLoading,
    fetchStatus,
    status,
  } = useQuery({
    queryKey: ['delayed-fetch', delay],
    queryFn: () => apiService.fetchWithDelay(delay),
    enabled, // 只有当 enabled 为 true 时才执行查询
    refetchOnWindowFocus: false,
    staleTime: 10000, // 10秒内数据被认为是新鲜的
  })

  console.log('⏳ LoadingQuery state:', {
    isLoading,
    isPending,
    isInitialLoading,
    isFetching,
    fetchStatus,
    status,
    enabled,
    delay,
  })

  const handleStartQuery = () => {
    console.log(`🚀 Starting query with ${delay}ms delay`)
    setEnabled(true)
  }

  const handleStopQuery = () => {
    console.log('⏹️ Stopping query')
    setEnabled(false)
  }

  const handleRefetch = () => {
    console.log('🔄 Loading query manual refetch triggered')
    refetch()
  }

  const handleDelayChange = (newDelay: number) => {
    console.log(`⏱️ Changing delay to ${newDelay}ms`)
    setDelay(newDelay)
    setEnabled(false) // 重置查询状态
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            延迟时间: {delay}ms
          </label>
          <input
            type="range"
            min="500"
            max="5000"
            step="500"
            value={delay}
            onChange={(e) => handleDelayChange(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#666' }}>
            <span>500ms</span>
            <span>5000ms</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            className="btn" 
            onClick={handleStartQuery}
            disabled={enabled && isFetching}
          >
            {enabled && isFetching ? '加载中...' : '开始查询'}
          </button>
          
          <button 
            className="btn" 
            onClick={handleRefetch}
            disabled={!enabled || isFetching}
          >
            重新获取
          </button>
          
          <button 
            className="btn" 
            onClick={handleStopQuery}
            disabled={!enabled}
          >
            停止查询
          </button>
        </div>
        
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          <div>查询状态: 
            <span className={`status-indicator ${
              isPending ? 'status-loading' : 
              isError ? 'status-error' : 
              data ? 'status-success' : 'status-idle'
            }`}>
              {status}
            </span>
          </div>
          <div>获取状态: 
            <span className={`status-indicator ${
              fetchStatus === 'fetching' ? 'status-loading' : 'status-idle'
            }`}>
              {fetchStatus}
            </span>
          </div>
          <div>查询启用: {enabled ? '是' : '否'}</div>
        </div>
      </div>

      {isPending && enabled && (
        <div className="data-display">
          <p>⏳ 正在加载数据，预计需要 {delay}ms...</p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: '#e2e8f0', 
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '1rem'
          }}>
            <div style={{
              width: '30%',
              height: '100%',
              background: '#4299e1',
              animation: 'loading 1.5s ease-in-out infinite'
            }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
            💡 观察 isLoading, isPending, isFetching 等状态的区别
          </p>
        </div>
      )}

      {isError && (
        <div className="data-display" style={{ background: '#fed7d7', color: '#e53e3e' }}>
          <p>❌ 加载失败: {(error as Error)?.message}</p>
        </div>
      )}

      {data && (
        <div className="data-display" style={{ background: '#c6f6d5', color: '#38a169' }}>
          <h4>✅ 加载完成!</h4>
          <p>{data}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            💡 数据已缓存，在 staleTime (10秒) 内重新获取会直接返回缓存数据
          </p>
        </div>
      )}

      <div className="debug-panel">
        <strong>🔍 加载状态调试信息:</strong>
        <pre>{JSON.stringify({
          queryKey: ['delayed-fetch', delay],
          delay,
          enabled,
          status,
          fetchStatus,
          isLoading,
          isPending,
          isInitialLoading,
          isFetching,
          isError,
          hasData: !!data,
          staleTime: 10000,
        }, null, 2)}</pre>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}