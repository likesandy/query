import React, { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function DebugControlPanel() {
  const queryClient = useQueryClient()
  const [isExpanded, setIsExpanded] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [maxLogs] = useState(50)

  // 拦截 console.log 来收集日志
  useEffect(() => {
    const originalLog = console.log
    const originalError = console.error
    
    const logInterceptor = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      
      setLogs(prev => {
        const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]
        return newLogs.slice(-maxLogs) // 保持最新的 50 条日志
      })
      
      originalLog(...args)
    }

    const errorInterceptor = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')
      
      setLogs(prev => {
        const newLogs = [...prev, `[${new Date().toLocaleTimeString()}] ERROR: ${message}`]
        return newLogs.slice(-maxLogs)
      })
      
      originalError(...args)
    }

    console.log = logInterceptor
    console.error = errorInterceptor

    return () => {
      console.log = originalLog
      console.error = originalError
    }
  }, [maxLogs])

  const handleClearLogs = () => {
    setLogs([])
    console.log('🧹 Debug logs cleared')
  }

  const handleExportDebugData = () => {
    if (window.__TANSTACK_QUERY_DEBUG__) {
      window.__TANSTACK_QUERY_DEBUG__.exportData()
    } else {
      console.warn('Debug tools not available')
    }
  }

  const handleShowDebugInstructions = () => {
    if (window.__TANSTACK_QUERY_DEBUG__) {
      window.__TANSTACK_QUERY_DEBUG__.addLogs()
    } else {
      console.warn('Debug tools not available')
    }
  }

  const handleInvalidateAll = () => {
    queryClient.invalidateQueries()
    console.log('♻️ All queries invalidated')
  }

  const handleClearCache = () => {
    queryClient.clear()
    console.log('🗑️ Query cache cleared')
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'white',
      border: '2px solid #4299e1',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      minWidth: isExpanded ? '400px' : '200px',
      maxWidth: isExpanded ? '600px' : '200px',
    }}>
      <div 
        style={{
          padding: '1rem',
          background: '#4299e1',
          color: 'white',
          borderRadius: '10px 10px 0 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <strong>🔧 调试控制面板</strong>
        <span>{isExpanded ? '▼' : '▲'}</span>
      </div>

      {isExpanded && (
        <div style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>快速操作</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button 
                className="btn" 
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                onClick={handleInvalidateAll}
              >
                使所有查询失效
              </button>
              <button 
                className="btn btn-danger" 
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                onClick={handleClearCache}
              >
                清空缓存
              </button>
              <button 
                className="btn" 
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                onClick={handleExportDebugData}
              >
                导出调试数据
              </button>
              <button 
                className="btn" 
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                onClick={handleShowDebugInstructions}
              >
                显示调试指令
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, color: '#2d3748' }}>实时日志 ({logs.length})</h4>
              <button 
                className="btn" 
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
                onClick={handleClearLogs}
              >
                清空
              </button>
            </div>
            <div style={{
              background: '#1a202c',
              color: '#e2e8f0',
              padding: '0.5rem',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontFamily: 'monospace',
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #4a5568',
            }}>
              {logs.length === 0 ? (
                <div style={{ color: '#a0aec0', fontStyle: 'italic' }}>
                  暂无日志...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      marginBottom: '0.25rem',
                      paddingBottom: '0.25rem',
                      borderBottom: index < logs.length - 1 ? '1px solid #2d3748' : 'none'
                    }}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              💡 <strong>调试提示：</strong>
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>在开发者工具中打开 Sources 面板</li>
              <li>找到 packages/react-query/src/useBaseQuery.ts</li>
              <li>在关键位置设置断点进行调试</li>
              <li>使用 window.__TANSTACK_QUERY_DEBUG__ 访问调试工具</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}