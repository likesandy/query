import type { User } from '@/types'

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
  }
]

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const apiService = {
  // 获取所有用户
  async fetchUsers(): Promise<User[]> {
    console.log('🔄 API: Fetching users...')
    await delay(1000) // 模拟网络延迟
    console.log('✅ API: Users fetched successfully')
    return mockUsers
  },

  // 根据 ID 获取用户
  async fetchUserById(id: string): Promise<User> {
    console.log(`🔄 API: Fetching user with id: ${id}`)
    await delay(800)
    const user = mockUsers.find(u => u.id === id)
    if (!user) {
      console.log(`❌ API: User with id ${id} not found`)
      throw new Error(`User with id ${id} not found`)
    }
    console.log(`✅ API: User ${user.name} fetched successfully`)
    return user
  },

  // 模拟错误请求
  async fetchWithError(): Promise<never> {
    console.log('🔄 API: Attempting request that will fail...')
    await delay(500)
    console.log('❌ API: Request failed with network error')
    throw new Error('Network error: Failed to fetch data')
  },

  // 带自定义延迟的请求
  async fetchWithDelay(delayMs: number): Promise<string> {
    console.log(`🔄 API: Fetching with ${delayMs}ms delay...`)
    await delay(delayMs)
    const message = `Data fetched after ${delayMs}ms delay`
    console.log(`✅ API: ${message}`)
    return message
  },

  // 模拟随机失败的请求
  async fetchWithRandomFailure(): Promise<User[]> {
    console.log('🔄 API: Fetching with random failure chance...')
    await delay(600)
    
    if (Math.random() < 0.3) { // 30% 失败率
      console.log('❌ API: Random failure occurred')
      throw new Error('Random network failure')
    }
    
    console.log('✅ API: Random request succeeded')
    return mockUsers
  }
}