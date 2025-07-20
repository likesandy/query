import React, { useState } from 'react'
import { useDebugQuery, logQueryInternals } from '@/hooks/useDebugQuery'
import { apiService } from '@/services/api'
import type { User } from '@/types'

export function DebugQueryExample() {
  console.log('🔄 DebugQueryExample component rendering...')
  
  const [userId, setUserId] = useState('1')

  // 使用调试增强的查询 Hook
  const queryResult = useDebugQuery<User>(
    {
      queryKey: ['user', userId],
      queryFn: () => apiService.fetchUserById(userId),
      enabled: !!userId,
      staleTime: 5000,
    },
    `User-${userId}` // 调试标签
  )

  const { data: user, isLoading, isError, error, refetch, debugInfo } = queryResult

  const handleUserChange = (newUserId: string) => {
    console.log(`👤 Switching to user: ${newUserId}`)
    setUserId(newUserId)
  }

  const handleRefetch = () => {
    console.log('🔄 Debug query manual refetch triggered')
    refetch()
  }

  const handleLogInternals = () => {
    logQueryInternals(queryResult as any, `User-${userId}`)
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            选择用户:
          </label>
          <select 
            value={userId} 
            onChange={(e) => handleUserChange(e.target.value)}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              border: '1px solid #e2e8f0',
              marginRight: '0.5rem'
            }}
          >
            <option value="1">用户 1</option>
            <option value="2">用户 2</option>
            <option value="3">用户 3</option>
            <option value="999">不存在的用户</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button 
            className="btn" 
            onClick={handleRefetch}
            disabled={isLoading}
          >
            {isLoading ? '加载中...' : '重新获取'}
          </button>
          
          <button 
            className="btn" 
            onClick={handleLogInternals}
          >
            输出内部状态
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="data-display">
          <p>🔄 正在加载用户 {userId} 的信息...</p>
        </div>
      )}

      {isError && (
        <div className="data-display" style={{ background: '#fed7d7', color: '#e53e3e' }}>
          <p>❌ 加载用户失败: {(error as Error)?.message}</p>
        </div>
      )}

      {user && (
        <div className="data-display">
          <div className="user-card">
            <img 
              src={user.avatar} 
              alt={user.name}
              className="user-avatar"
            />
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* 调试信息面板 */}
      <div className="data-display" style={{ background: '#f0f9ff', border: '1px solid #0ea5e9' }}>
        <h4 style={{ color: '#0c4a6e', margin: '0 0 1rem 0' }}>🔍 调试信息</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong>渲染统计:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>渲染次数: {debugInfo.renderCount}</li>
              <li>最后更新: {debugInfo.lastUpdate.toLocaleTimeString()}</li>
            </ul>
          </div>
          <div>
            <strong>缓存状态:</strong>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li>查询键: {debugInfo.queryHash}</li>
              <li>缓存状态: 
                <span className={`status-indicator ${
                  debugInfo.cacheStatus === 'fresh' ? 'status-success' : 'status-error'
                }`}>
                  {debugInfo.cacheStatus}
                </span>
              </li>
              <li>获取状态: 
                <span className={`status-indicator ${
                  debugInfo.fetchStatus === 'fetching' ? 'status-loading' : 'status-idle'
                }`}>
                  {debugInfo.fetchStatus}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="debug-panel">
        <strong>🔍 完整调试信息:</strong>
        <pre>{JSON.stringify({
          queryKey: ['user', userId],
          userId,
          debugInfo,
          queryState: {
            status: queryResult.status,
            fetchStatus: queryResult.fetchStatus,
            isLoading,
            isError,
            hasData: !!user,
            dataUpdatedAt: queryResult.dataUpdatedAt ? new Date(queryResult.dataUpdatedAt).toISOString() : null,
            errorMessage: error?.message,
          }
        }, null, 2)}</pre>
      </div>
    </div>
  )
}