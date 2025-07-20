#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 启动 TanStack Query 调试示例...\n')

// 检查是否在正确的目录
const packageJsonPath = path.join(__dirname, 'package.json')
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ 错误：请在 debug-example 目录中运行此脚本')
  process.exit(1)
}

// 检查 node_modules 是否存在
const nodeModulesPath = path.join(__dirname, 'node_modules')
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 安装依赖...')
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname })
    console.log('✅ 依赖安装完成\n')
  } catch (error) {
    console.error('❌ 依赖安装失败:', error.message)
    process.exit(1)
  }
}

// 显示调试提示
console.log('🔍 调试提示:')
console.log('1. 应用启动后会自动打开浏览器')
console.log('2. 打开开发者工具 (F12)')
console.log('3. 切换到 Sources 面板')
console.log('4. 找到 packages/react-query/src/useBaseQuery.ts')
console.log('5. 在关键位置设置断点')
console.log('6. 触发查询操作来调试\n')

console.log('💡 可用的调试工具:')
console.log('- 右上角的断点助手 (绿色按钮)')
console.log('- 右下角的调试控制面板')
console.log('- 控制台中的 window.__TANSTACK_QUERY_DEBUG__')
console.log('- 各个示例组件的详细日志\n')

console.log('🌐 启动开发服务器...\n')

try {
  execSync('npm run dev', { stdio: 'inherit', cwd: __dirname })
} catch (error) {
  console.error('❌ 启动失败:', error.message)
  process.exit(1)
}