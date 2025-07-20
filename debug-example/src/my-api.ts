// Simple API functions for the React Query example

export interface Todo {
  id: number
  title: string
}

// Mock data
const todos: Array<Todo> = [
  { id: 1, title: 'Learn React Query' },
  { id: 2, title: 'Build awesome apps' },
  { id: 3, title: 'Share knowledge' },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getTodos(): Promise<Array<Todo>> {
  // Simulate network delay
  await delay(1000)

  console.log('📡 Fetching todos from API...')
  return [...todos]
}

export async function postTodo(newTodo: {
  id: number
  title: string
}): Promise<Todo> {
  // Simulate network delay
  await delay(500)

  console.log('📡 Posting new todo to API...', newTodo)

  const todo: Todo = {
    id: newTodo.id,
    title: newTodo.title,
  }

  todos.push(todo)
  return todo
}
