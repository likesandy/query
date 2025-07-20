# TanStack Query Debug Example

这是一个专门用于调试和理解 `useBaseQuery` 内部工作机制的示例项目。

## 🎯 项目目标

- 提供一个可运行的环境来调试 TanStack Query 源码
- 展示不同查询场景下的行为
- 帮助开发者理解 `useBaseQuery` 的执行流程
- 提供丰富的调试信息和日志

## 🚀 快速开始

### 1. 安装依赖

```bash
cd debug-example
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

这将启动开发服务器并自动打开浏览器访问 `http://localhost:3000`。

## 🔍 调试指南

### 设置断点

1. 打开浏览器开发者工具 (F12)
2. 切换到 "Sources" 标签页
3. 在左侧文件树中找到 `packages/react-query/src/useBaseQuery.ts`
4. 在关键位置设置断点：
   - 第 47 行：`const client = useQueryClient(queryClient)`
   - 第 67 行：`const [observer] = React.useState(...)`
   - 第 72 行：`const result = observer.getOptimisticResult(defaultedOptions)`
   - 第 95 行：`React.useEffect(() => { observer.setOptions(defaultedOptions) })`

### 关键调试点

#### 1. Observer 创建
```typescript
const [observer] = React.useState(
  () => new Observer<...>(client, defaultedOptions)
)
```
- 观察 Observer 实例的创建过程
- 查看传入的 options 如何被处理

#### 2. 外部存储同步
```typescript
React.useSyncExternalStore(
  React.useCallback((onStoreChange) => {
    // 订阅逻辑
  }, [observer, shouldSubscribe]),
  () => observer.getCurrentResult(),
  () => observer.getCurrentResult(),
)
```
- 观察订阅机制的工作原理
- 查看状态变化如何触发组件重渲染

#### 3. Suspense 处理
```typescript
if (shouldSuspend(defaultedOptions, result)) {
  throw fetchOptimistic(defaultedOptions, observer, errorResetBoundary)
}
```
- 观察 Suspense 模式下的行为
- 查看 Promise 如何被抛出

## 📊 示例组件说明

### 1. BasicQuery - 基础查询示例
- 展示最基本的数据获取流程
- 观察查询状态变化：loading → success/error
- 查看缓存机制和数据新鲜度

**调试重点：**
- `useBaseQuery` 的完整执行流程
- Observer 的创建和订阅
- 结果的乐观更新

### 2. ErrorQuery - 错误处理示例
- 展示错误处理和重试机制
- 观察失败计数和重试逻辑
- 查看错误边界的工作原理

**调试重点：**
- 错误状态的处理
- 重试机制的实现
- `ensurePreventErrorBoundaryRetry` 的作用

### 3. LoadingQuery - 加载状态示例
- 展示不同加载状态的区别
- 观察 `isLoading` vs `isPending` vs `isFetching`
- 查看查询启用/禁用的控制

**调试重点：**
- 各种状态标志的含义
- `enabled` 选项的影响
- `fetchStatus` 和 `status` 的区别

### 4. DebugQueryExample - 调试增强示例
- 使用自定义的 `useDebugQuery` Hook
- 提供详细的渲染统计和状态追踪
- 展示调试信息的收集和展示

**调试重点：**
- Hook 的组合和增强
- 渲染次数统计
- 状态变化的监听

### 5. QueryStatus - 查询状态监控
- 实时显示所有查询的状态
- 观察查询缓存的变化
- 提供缓存管理操作

**调试重点：**
- 查询缓存的管理
- 多个查询的协调
- 缓存失效和清理

## 🛠️ 调试技巧

### 1. 控制台日志
项目中添加了大量的 `console.log` 语句，帮助追踪执行流程：

- `🔄` - 组件渲染和函数调用
- `📊` - 状态变化
- `💾` - 数据更新
- `❌` - 错误信息
- `🔍` - 调试信息

### 2. 网络面板
在开发者工具的 "Network" 标签页中观察：
- API 请求的发送时机
- 请求的重试行为
- 响应数据的处理

### 3. React DevTools
安装 React DevTools 扩展来观察：
- 组件的重渲染
- Props 和 State 的变化
- 组件树的结构

### 4. 性能分析
使用 React DevTools Profiler 来分析：
- 组件渲染性能
- 重渲染的原因
- 优化机会

## 📝 常见调试场景

### 场景 1：查询不执行
**可能原因：**
- `enabled: false`
- 查询键为空或无效
- QueryClient 未正确配置

**调试步骤：**
1. 检查 `enabled` 选项
2. 验证 `queryKey` 的值
3. 确认 `queryFn` 是否正确

### 场景 2：数据不更新
**可能原因：**
- 数据仍在 `staleTime` 内
- 查询被禁用
- 缓存策略问题

**调试步骤：**
1. 检查 `staleTime` 设置
2. 观察 `isStale` 状态
3. 手动调用 `invalidateQueries`

### 场景 3：无限重渲染
**可能原因：**
- 查询键不稳定
- 依赖项变化过于频繁
- 选项对象重新创建

**调试步骤：**
1. 使用 React DevTools Profiler
2. 检查查询键的稳定性
3. 使用 `useMemo` 稳定选项对象

## 🔧 项目结构

```
debug-example/
├── src/
│   ├── components/          # 示例组件
│   │   ├── BasicQuery.tsx
│   │   ├── ErrorQuery.tsx
│   │   ├── LoadingQuery.tsx
│   │   ├── DebugQueryExample.tsx
│   │   ├── QueryStatus.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/              # 自定义 Hooks
│   │   └── useDebugQuery.ts
│   ├── services/           # API 服务
│   │   └── api.ts
│   ├── types/              # 类型定义
│   │   └── index.ts
│   ├── App.tsx             # 主应用
│   ├── App.css             # 样式
│   └── main.tsx            # 入口文件
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── package.json            # 项目配置
```

## 💡 进阶调试

### 1. 修改源码
你可以直接修改 `packages/react-query/src/useBaseQuery.ts` 来添加更多调试信息：

```typescript
// 在 useBaseQuery 中添加
console.log('🔍 useBaseQuery called with:', {
  queryKey: options.queryKey,
  enabled: options.enabled,
  staleTime: options.staleTime,
})
```

### 2. 自定义 Observer
创建自定义的 QueryObserver 来观察内部行为：

```typescript
class DebugQueryObserver extends QueryObserver {
  subscribe(listener) {
    console.log('🔍 Observer subscribing')
    return super.subscribe(listener)
  }
  
  updateResult() {
    console.log('🔍 Observer updating result')
    return super.updateResult()
  }
}
```

### 3. 监听缓存事件
添加全局缓存监听器：

```typescript
queryClient.getQueryCache().subscribe((event) => {
  console.log('🔍 Cache event:', event)
})
```

## 🤝 贡献

如果你发现了有趣的调试场景或改进建议，欢迎提交 PR 或 Issue！

## 📚 相关资源

- [TanStack Query 官方文档](https://tanstack.com/query/latest)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools 调试指南](https://developer.chrome.com/docs/devtools/)