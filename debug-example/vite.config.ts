import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@tanstack/react-query': path.resolve(__dirname, '../packages/react-query/src/index.ts'),
      '@tanstack/query-core': path.resolve(__dirname, '../packages/query-core/src/index.ts'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@tanstack/react-query', '@tanstack/query-core'],
  },
})