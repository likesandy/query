import React, { useState } from 'react'

interface BreakpointInfo {
  file: string
  line: number
  description: string
  code: string
}

const BREAKPOINT_SUGGESTIONS: BreakpointInfo[] = [
  {
    file: 'useBaseQuery.ts',
    line: 47,
    description: '获取 QueryClient 实例',
    code: 'const client = useQueryClient(queryClient)'
  },
  {
    file: 'useBaseQuery.ts',
    line: 67,
    description: 'Observer 实例创建',
    code: 'const [observer] = React.useState(...)'
  },
  {
    file: 'useBaseQuery.ts',
    line: 72,
    description: '获取乐观结果',
    code: 'const result = observer.getOptimisticResult(defaultedOptions)'
  },
  {
    file: 'useBaseQuery.ts',
    line: 75,
    description: '外部存储同步',
    code: 'React.useSyncExternalStore(...)'
  },
  {
    file: 'useBaseQuery.ts',
    line: 95,
    description: '选项更新效果',
    code: 'React.useEffect(() => { observer.setOptions(defaultedOptions) })'
  },
  {
    file: 'useBaseQuery.ts',
    line: 98,
    description: 'Suspense 处理',
    code: 'if (shouldSuspend(defaultedOptions, result)) {'
  },
  {
    file: 'useBaseQuery.ts',
    line: 103,
    description: '错误边界处理',
    code: 'if (getHasError({...})) {'
  },
  {
    file: 'useBaseQuery.ts',
    line: 140,
    description: '结果追踪和返回',
    code: 'return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result'
  }
]

export function BreakpointHelper() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<BreakpointInfo | null>(null)

  const handleBreakpointClick = (breakpoint: BreakpointInfo) => {
    setSelectedBreakpoint(breakpoint)
    
    // 复制到剪贴板
    const instructions = `
在开发者工具中设置断点：
1. 打开 Sources 面板
2. 找到 packages/react-query/src/${breakpoint.file}
3. 在第 ${breakpoint.line} 行设置断点
4. 代码: ${breakpoint.code}
5. 描述: ${breakpoint.description}
`
    
    navigator.clipboard.writeText(instructions).then(() => {
      console.log('📋 断点信息已复制到剪贴板')
    }).catch(() => {
      console.log('📋 断点信息:', instructions)
    })
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#48bb78',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          zIndex: 999,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
      >
        🎯 断点助手
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #48bb78',
      borderRadius: '12px',
      padding: '1rem',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflowY: 'auto',
      zIndex: 999,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: 0, color: '#2d3748' }}>🎯 断点建议</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: '#718096'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#4a5568' }}>
          点击下面的断点建议来复制设置指令：
        </p>
        
        {BREAKPOINT_SUGGESTIONS.map((breakpoint, index) => (
          <div
            key={index}
            onClick={() => handleBreakpointClick(breakpoint)}
            style={{
              padding: '0.75rem',
              margin: '0.5rem 0',
              background: selectedBreakpoint === breakpoint ? '#e6fffa' : '#f7fafc',
              border: `1px solid ${selectedBreakpoint === breakpoint ? '#38b2ac' : '#e2e8f0'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.25rem'
            }}>
              <strong style={{ color: '#2d3748', fontSize: '0.9rem' }}>
                第 {breakpoint.line} 行
              </strong>
              <span style={{ 
                background: '#4299e1', 
                color: 'white', 
                padding: '0.1rem 0.4rem',
                borderRadius: '3px',
                fontSize: '0.7rem'
              }}>
                {breakpoint.file}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#4a5568', marginBottom: '0.25rem' }}>
              {breakpoint.description}
            </div>
            <code style={{ 
              fontSize: '0.7rem', 
              background: '#edf2f7', 
              padding: '0.2rem 0.4rem',
              borderRadius: '3px',
              color: '#2d3748',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {breakpoint.code}
            </code>
          </div>
        ))}
      </div>

      <div style={{ 
        background: '#fef5e7', 
        border: '1px solid #f6ad55',
        borderRadius: '6px',
        padding: '0.75rem',
        fontSize: '0.8rem'
      }}>
        <strong style={{ color: '#c05621' }}>💡 使用提示：</strong>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', color: '#c05621' }}>
          <li>点击断点建议会复制设置指令</li>
          <li>在开发者工具 Sources 面板中找到对应文件</li>
          <li>设置断点后触发查询操作</li>
          <li>观察变量值和执行流程</li>
        </ul>
      </div>
    </div>
  )
}