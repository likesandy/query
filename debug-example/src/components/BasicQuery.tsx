import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import type { User } from '@/types'

export function BasicQuery() {
  console.log('🔄 BasicQuery component rendering...')

  // 基础查询 - 这里会调用 useBaseQuery
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
    isStale,
  } = useQuery({
    queryKey: ['users'],
    queryFn: apiService.fetchUsers,
    staleTime: 30000, // 30秒内数据被认为是新鲜的
  })

  console.log('📊 BasicQuery state:', {
    isLoading,
    isError,
    isFetching,
    dataUpdatedAt: new Date(dataUpdatedAt),
    isStale,
    usersCount: users?.length,
  })

  const handleRefetch = () => {
    console.log('🔄 Manual refetch triggered')
    refetch()
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button 
          className="btn" 
          onClick={handleRefetch}
          disabled={isFetching}
        >
          {isFetching ? '刷新中...' : '刷新数据'}
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
          {dataUpdatedAt > 0 && (
            <div>最后更新: {new Date(dataUpdatedAt).toLocaleTimeString()}</div>
          )}
          <div>数据状态: {isStale ? '已过期' : '新鲜'}</div>
        </div>
      </div>

      {isLoading && (
        <div className="data-display">
          <p>🔄 正在加载用户数据...</p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            💡 在开发者工具中查看 useBaseQuery 的执行过程
          </p>
        </div>
      )}

      {isError && (
        <div className="data-display" style={{ background: '#fed7d7', color: '#e53e3e' }}>
          <p>❌ 加载失败: {(error as Error)?.message}</p>
        </div>
      )}

      {users && (
        <div className="data-display">
          <h4>👥 用户列表 ({users.length} 个用户)</h4>
          {users.map((user: User) => (
            <div key={user.id} className="user-card">
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
          ))}
        </div>
      )}

      <div className="debug-panel">
        <strong>🔍 调试信息:</strong>
        <pre>{JSON.stringify({
          queryKey: ['users'],
          isLoading,
          isError,
          isFetching,
          isStale,
          dataUpdatedAt: dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null,
          errorMessage: error?.message,
        }, null, 2)}</pre>
      </div>
    </div>
  )
}