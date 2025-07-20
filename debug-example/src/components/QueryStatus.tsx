import React, { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

interface QueryInfo {
  queryKey: string
  status: string
  fetchStatus: string
  dataUpdatedAt: number
  errorUpdatedAt: number
  isStale: boolean
  observerCount: number
}

export function QueryStatus() {
  console.log('🔄 QueryStatus component rendering...')
  
  const queryClient = useQueryClient()
  const [queries, setQueries] = useState<QueryInfo[]>([])
  const [autoRefresh, setAutoRefresh] = useState(true)

  const updateQueries = () => {
    const queryCache = queryClient.getQueryCache()
    const allQueries = queryCache.getAll()
    
    const queryInfos: QueryInfo[] = allQueries.map(query => ({
      queryKey: JSON.stringify(query.queryKey),
      status: query.state.status,
      fetchStatus: query.state.fetchStatus,
      dataUpdatedAt: query.state.dataUpdatedAt,
      errorUpdatedAt: query.state.errorUpdatedAt,
      isStale: query.isStale(),
      observerCount: query.getObserversCount(),
    }))

    setQueries(queryInfos)
    console.log('📊 Query cache updated:', queryInfos)
  }

  useEffect(() => {
    // 初始加载
    updateQueries()

    // 订阅查询缓存变化
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      if (autoRefresh) {
        updateQueries()
      }
    })

    return unsubscribe
  }, [queryClient, autoRefresh])

  useEffect(() => {
    if (!autoRefresh) return

    // 定时刷新
    const interval = setInterval(updateQueries, 1000)
    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleClearCache = () => {
    console.log('🗑️ Clearing all query cache')
    queryClient.clear()
    updateQueries()
  }

  const handleInvalidateAll = () => {
    console.log('♻️ Invalidating all queries')
    queryClient.invalidateQueries()
  }

  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh triggered')
    updateQueries()
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn" onClick={handleManualRefresh}>
          刷新状态
        </button>
        
        <button className="btn btn-danger" onClick={handleClearCache}>
          清空缓存
        </button>
        
        <button className="btn" onClick={handleInvalidateAll}>
          使所有查询失效
        </button>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          自动刷新
        </label>
      </div>

      <div className="data-display">
        <h4>📊 当前查询缓存状态 ({queries.length} 个查询)</h4>
        
        {queries.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            暂无活跃查询。触发上面的查询示例来查看状态变化。
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.9rem'
            }}>
              <thead>
                <tr style={{ background: '#f7fafc' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    查询键
                  </th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    状态
                  </th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    获取状态
                  </th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    数据状态
                  </th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    观察者
                  </th>
                  <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    最后更新
                  </th>
                </tr>
              </thead>
              <tbody>
                {queries.map((query, index) => (
                  <tr key={index}>
                    <td style={{ 
                      padding: '0.5rem', 
                      border: '1px solid #e2e8f0',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {query.queryKey}
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <span className={`status-indicator ${
                        query.status === 'pending' ? 'status-loading' :
                        query.status === 'error' ? 'status-error' :
                        query.status === 'success' ? 'status-success' :
                        'status-idle'
                      }`}>
                        {query.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <span className={`status-indicator ${
                        query.fetchStatus === 'fetching' ? 'status-loading' : 'status-idle'
                      }`}>
                        {query.fetchStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0' }}>
                      <span className={`status-indicator ${
                        query.isStale ? 'status-error' : 'status-success'
                      }`}>
                        {query.isStale ? 'stale' : 'fresh'}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      {query.observerCount}
                    </td>
                    <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                      {query.dataUpdatedAt > 0 
                        ? new Date(query.dataUpdatedAt).toLocaleTimeString()
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="debug-panel">
        <strong>🔍 查询缓存详细信息:</strong>
        <pre>{JSON.stringify({
          totalQueries: queries.length,
          cacheSize: queryClient.getQueryCache().getAll().length,
          autoRefresh,
          timestamp: new Date().toISOString(),
          queries: queries.map(q => ({
            key: q.queryKey,
            status: q.status,
            fetchStatus: q.fetchStatus,
            isStale: q.isStale,
            observers: q.observerCount,
          }))
        }, null, 2)}</pre>
      </div>

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: '#e6fffa', 
        borderRadius: '6px',
        fontSize: '0.9rem'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#234e52' }}>💡 调试提示</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#234e52' }}>
          <li>观察查询状态的变化：pending → success/error</li>
          <li>注意 fetchStatus 和 status 的区别</li>
          <li>查看数据何时变为 stale（过期）状态</li>
          <li>观察者计数显示有多少组件在使用该查询</li>
          <li>在浏览器开发者工具中设置断点来调试 useBaseQuery</li>
        </ul>
      </div>
    </div>
  )
}