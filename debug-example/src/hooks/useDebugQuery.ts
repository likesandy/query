import { useRef, useEffect } from 'react'
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import type { DebugInfo } from '@/types'

export interface DebugQueryResult<TData, TError = Error> {
  // 继承 UseQueryResult 的所有属性
  data: TData | undefined
  error: TError | null
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
  status: 'pending' | 'error' | 'success'
  fetchStatus: 'fetching' | 'paused' | 'idle'
  isFetching: boolean
  isPending: boolean
  isStale: boolean
  refetch: () => void
  dataUpdatedAt: number
  errorUpdatedAt: number
  failureCount: number
  failureReason: TError | null
  // 添加调试信息
  debugInfo: DebugInfo
}

export function useDebugQuery<TData = unknown, TError = Error>(
  options: UseQueryOptions<TData, TError>,
  debugName?: string
): DebugQueryResult<TData, TError> {
  const renderCountRef = useRef(0)
  const lastUpdateRef = useRef<Date>(new Date())
  
  // 增加渲染计数
  renderCountRef.current += 1
  
  console.log(`🔍 [${debugName || 'DebugQuery'}] Render #${renderCountRef.current}`, {
    queryKey: options.queryKey,
    enabled: options.enabled,
    timestamp: new Date().toISOString(),
  })

  // 调用原始的 useQuery
  const queryResult = useQuery(options)

  // 更新最后更新时间
  useEffect(() => {
    if (queryResult.dataUpdatedAt > 0) {
      lastUpdateRef.current = new Date(queryResult.dataUpdatedAt)
    }
  }, [queryResult.dataUpdatedAt])

  // 记录状态变化
  useEffect(() => {
    console.log(`📊 [${debugName || 'DebugQuery'}] State changed:`, {
      status: queryResult.status,
      fetchStatus: queryResult.fetchStatus,
      isLoading: queryResult.isLoading,
      isFetching: queryResult.isFetching,
      isError: queryResult.isError,
      isSuccess: queryResult.isSuccess,
      error: queryResult.error ? String(queryResult.error) : undefined,
      dataUpdatedAt: queryResult.dataUpdatedAt,
      errorUpdatedAt: queryResult.errorUpdatedAt,
    })
  }, [
    queryResult.status,
    queryResult.fetchStatus,
    queryResult.isLoading,
    queryResult.isFetching,
    queryResult.isError,
    queryResult.isSuccess,
    queryResult.error,
    queryResult.dataUpdatedAt,
    queryResult.errorUpdatedAt,
    debugName,
  ])

  // 记录数据变化
  useEffect(() => {
    if (queryResult.data !== undefined) {
      console.log(`💾 [${debugName || 'DebugQuery'}] Data updated:`, {
        data: queryResult.data,
        dataUpdatedAt: new Date(queryResult.dataUpdatedAt).toISOString(),
      })
    }
  }, [queryResult.data, queryResult.dataUpdatedAt, debugName])

  // 记录错误
  useEffect(() => {
    if (queryResult.error) {
      console.error(`❌ [${debugName || 'DebugQuery'}] Error occurred:`, {
        error: queryResult.error,
        errorUpdatedAt: new Date(queryResult.errorUpdatedAt).toISOString(),
        failureCount: queryResult.failureCount,
        failureReason: queryResult.failureReason,
      })
    }
  }, [queryResult.error, queryResult.errorUpdatedAt, queryResult.failureCount, queryResult.failureReason, debugName])

  // 构建调试信息
  const debugInfo: DebugInfo = {
    renderCount: renderCountRef.current,
    lastUpdate: lastUpdateRef.current,
    queryHash: JSON.stringify(options.queryKey),
    cacheStatus: queryResult.isStale ? 'stale' : 'fresh',
    fetchStatus: queryResult.fetchStatus as 'idle' | 'fetching' | 'paused',
  }

  // 返回增强的查询结果
  return {
    ...queryResult,
    debugInfo,
  } as DebugQueryResult<TData, TError>
}

// 用于调试 useBaseQuery 内部状态的工具函数
export function logQueryInternals(queryResult: UseQueryResult<any, any>, label: string = 'Query') {
  console.group(`🔍 ${label} Internals`)
  
  console.log('📊 Status Information:', {
    status: queryResult.status,
    fetchStatus: queryResult.fetchStatus,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isPending: queryResult.isPending,
    isError: queryResult.isError,
    isSuccess: queryResult.isSuccess,
    isStale: queryResult.isStale,
  })

  console.log('⏰ Timing Information:', {
    dataUpdatedAt: queryResult.dataUpdatedAt ? new Date(queryResult.dataUpdatedAt).toISOString() : null,
    errorUpdatedAt: queryResult.errorUpdatedAt ? new Date(queryResult.errorUpdatedAt).toISOString() : null,
  })

  console.log('🔄 Retry Information:', {
    failureCount: queryResult.failureCount,
    failureReason: queryResult.failureReason?.message,
  })

  if (queryResult.data !== undefined) {
    console.log('💾 Data:', queryResult.data)
  }

  if (queryResult.error) {
    console.error('❌ Error:', queryResult.error)
  }

  console.groupEnd()
}