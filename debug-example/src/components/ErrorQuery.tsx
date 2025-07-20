import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api'

export function ErrorQuery() {
  console.log('🔄 ErrorQuery component rendering...')
  
  const [queryType, setQueryType] = useState<'error' | 'random'>('error')

  // 错误查询示例
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    failureCount,
    failureReason,
  } = useQuery({
    queryKey: ['error-demo', queryType],
    queryFn: queryType === 'error' ? apiService.fetchWithError : apiService.fetchWithRandomFailure,
    retry: 2, // 重试2次
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 指数退避
    throwOnError: false, // 不抛出错误到 Error Boundary
  })

  console.log('❌ ErrorQuery state:', {
    isLoading,
    isError,
    isFetching,
    failureCount,
    failureReason: failureReason?.message,
    queryType,
  })

  const handleRefetch = () => {
    console.log('🔄 Error query manual refetch triggered')
    refetch()
  }

  const handleQueryTypeChange = (type: 'error' | 'random') => {
    console.log(`🔄 Switching query type to: ${type}`)
    setQueryType(type)
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ marginRight: '1rem' }}>
            <input
              type="radio"
              checked={queryType === 'error'}
              onChange={() => handleQueryTypeChange('error')}
            />
            必定失败
          </label>
          <label>
            <input
              type="radio"
              checked={queryType === 'random'}
              onChange={() => handleQueryTypeChange('random')}
            />
            随机失败 (30%)
          </label>
        </div>

        <button 
          className="btn btn-danger" 
          onClick={handleRefetch}
          disabled={isFetching}
        >
          {isFetching ? '重试中...' : '触发请求'}
        </button>
        
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          <div>状态: 
            <span className={`status-indicator ${
              isLoading ? 'status-loading' : 
              isError ? 'status-error' : 
              'status-success'
            }`}>
              {isLoading ? 'Loading' : isError ? 'Error' : 'Success'}
            </span>
          </div>
          <div>失败次数: {failureCount}</div>
          {failureReason && (
            <div>失败原因: {failureReason.message}</div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="data-display">
          <p>🔄 正在尝试请求...</p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            💡 观察重试机制和错误处理逻辑
          </p>
        </div>
      )}

      {isError && (
        <div className="data-display" style={{ background: '#fed7d7', color: '#e53e3e' }}>
          <h4>❌ 请求失败</h4>
          <p><strong>错误信息:</strong> {(error as Error)?.message}</p>
          <p><strong>失败次数:</strong> {failureCount}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            💡 TanStack Query 会自动重试失败的请求。你可以在开发者工具中观察重试过程。
          </p>
        </div>
      )}

      {data && (
        <div className="data-display" style={{ background: '#c6f6d5', color: '#38a169' }}>
          <h4>✅ 请求成功!</h4>
          <p>这个随机失败的请求成功了！</p>
          {Array.isArray(data) ? (
            <p>获取到 {data.length} 个用户</p>
          ) : (
            <p>数据: {JSON.stringify(data)}</p>
          )}
        </div>
      )}

      <div className="debug-panel">
        <strong>🔍 错误处理调试信息:</strong>
        <pre>{JSON.stringify({
          queryKey: ['error-demo', queryType],
          queryType,
          isLoading,
          isError,
          isFetching,
          failureCount,
          failureReason: failureReason?.message,
          errorMessage: error?.message,
          retryConfig: {
            retry: 2,
            retryDelay: 'exponential backoff'
          }
        }, null, 2)}</pre>
      </div>
    </div>
  )
}