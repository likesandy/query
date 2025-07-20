# 🔍 useBaseQuery 调试完整指南

## 快速开始

### 1. 启动项目
```bash
cd debug-example
npm run debug
```

这将自动安装依赖并启动开发服务器。

### 2. 打开调试工具
- 浏览器会自动打开 `http://localhost:3000`
- 按 F12 打开开发者工具
- 切换到 "Sources" 面板

## 🎯 关键断点位置

### useBaseQuery.ts 中的重要断点：

#### 1. 初始化阶段 (第 47 行)
```typescript
const client = useQueryClient(queryClient)
```
**观察点：**
- QueryClient 实例的获取
- 默认选项的合并过程

#### 2. Observer 创建 (第 67 行)
```typescript
const [observer] = React.useState(
  () => new Observer<...>(client, defaultedOptions)
)
```
**观察点：**
- Observer 实例的创建时机
- 传入的选项参数
- 缓存条目的检查

#### 3. 乐观结果获取 (第 72 行)
```typescript
const result = observer.getOptimisticResult(defaultedOptions)
```
**观察点：**
- 乐观结果的计算过程
- 初始状态的设置

#### 4. 外部存储同步 (第 75 行)
```typescript
React.useSyncExternalStore(
  React.useCallback((onStoreChange) => {
    // 订阅逻辑
  }, [observer, shouldSubscribe]),
  () => observer.getCurrentResult(),
  () => observer.getCurrentResult(),
)
```
**观察点：**
- 订阅机制的建立
- 状态变化的监听
- 重渲染的触发时机

#### 5. 选项更新 (第 95 行)
```typescript
React.useEffect(() => {
  observer.setOptions(defaultedOptions)
}, [defaultedOptions, observer])
```
**观察点：**
- 选项变化的处理
- Observer 的更新过程

#### 6. Suspense 处理 (第 98 行)
```typescript
if (shouldSuspend(defaultedOptions, result)) {
  throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
}
```
**观察点：**
- Suspense 条件的判断
- Promise 的抛出时机

#### 7. 错误边界处理 (第 103 行)
```typescript
if (getHasError({...})) {
  throw result.error
}
```
**观察点：**
- 错误条件的判断
- 错误的抛出逻辑

## 🧪 调试场景

### 场景 1: 基础查询流程
1. 打开 "基础查询示例"
2. 在 useBaseQuery 第 47 行设置断点
3. 点击 "刷新数据" 按钮
4. 逐步执行，观察：
   - QueryClient 的获取
   - Observer 的创建
   - 订阅的建立
   - 结果的返回

### 场景 2: 错误处理机制
1. 打开 "错误处理示例"
2. 选择 "必定失败" 选项
3. 在错误处理相关断点设置断点
4. 触发请求，观察：
   - 错误的捕获
   - 重试机制的执行
   - 错误状态的更新

### 场景 3: 加载状态变化
1. 打开 "加载状态示例"
2. 设置较长的延迟时间
3. 在状态相关断点设置断点
4. 观察：
   - isLoading vs isPending vs isFetching 的区别
   - 状态转换的时机
   - 缓存的影响

### 场景 4: 缓存机制
1. 触发相同的查询多次
2. 观察缓存的命中和失效
3. 使用 "查询状态监控" 查看缓存状态
4. 理解 staleTime 和 cacheTime 的作用

## 🛠️ 调试工具使用

### 1. 断点助手 (右上角绿色按钮)
- 提供预设的断点建议
- 点击可复制设置指令
- 包含详细的代码位置和说明

### 2. 调试控制面板 (右下角)
- 实时日志收集
- 快速缓存操作
- 调试数据导出
- 全局调试工具访问

### 3. 控制台调试工具
```javascript
// 访问全局调试工具
window.__TANSTACK_QUERY_DEBUG__

// 性能监控
window.__TANSTACK_QUERY_DEBUG__.performance.getMetrics()

// 状态追踪
window.__TANSTACK_QUERY_DEBUG__.stateTracker.getAllHistory()

// 导出调试数据
window.__TANSTACK_QUERY_DEBUG__.exportData()
```

## 📊 理解关键概念

### 状态类型区别
- **status**: 查询的整体状态 (pending, success, error)
- **fetchStatus**: 获取操作的状态 (idle, fetching, paused)
- **isLoading**: 首次加载且没有数据
- **isPending**: 查询处于待处理状态
- **isFetching**: 正在进行网络请求

### 缓存机制
- **staleTime**: 数据被认为新鲜的时间
- **cacheTime**: 数据在缓存中保留的时间
- **isStale**: 数据是否已过期

### Observer 模式
- Observer 负责管理查询状态
- 通过订阅机制通知组件更新
- 支持多个组件共享同一个查询

## 🔧 高级调试技巧

### 1. 修改源码添加日志
在 `packages/react-query/src/useBaseQuery.ts` 中添加：
```typescript
console.log('🚀 useBaseQuery called:', {
  queryKey: options.queryKey,
  enabled: options.enabled,
  timestamp: new Date().toISOString()
})
```

### 2. 使用 React DevTools
- 安装 React DevTools 扩展
- 观察组件的重渲染
- 查看 Props 和 State 的变化

### 3. 网络面板调试
- 观察实际的 HTTP 请求
- 查看请求的时机和频率
- 分析重试和缓存行为

### 4. 性能分析
- 使用 React DevTools Profiler
- 分析渲染性能
- 识别不必要的重渲染

## 🚨 常见问题排查

### 问题 1: 查询不执行
**检查点：**
- `enabled` 选项是否为 true
- `queryKey` 是否有效
- `queryFn` 是否正确定义

### 问题 2: 数据不更新
**检查点：**
- 数据是否在 `staleTime` 内
- 是否需要手动 invalidate
- 查询键是否发生变化

### 问题 3: 无限重渲染
**检查点：**
- 查询键的稳定性
- 选项对象的重新创建
- 依赖项的变化频率

## 📚 进一步学习

- [TanStack Query 官方文档](https://tanstack.com/query/latest)
- [React DevTools 使用指南](https://react.dev/learn/react-developer-tools)
- [浏览器调试技巧](https://developer.chrome.com/docs/devtools/)

## 💡 贡献和反馈

如果你发现了新的调试技巧或遇到了有趣的问题，欢迎分享！这个调试示例项目旨在帮助所有开发者更好地理解 TanStack Query 的内部工作机制。