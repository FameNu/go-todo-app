import type {
  ApiError,
  Category,
  CreateCategoryInput,
  CreateTodoInput,
  Todo,
  UpdateTodoInput,
} from '@/lib/types'

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
).replace(/\/+$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/api/v1${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
      cache: 'no-store',
    })
  } catch {
    throw new Error(
      `Can't reach the API at ${API_URL}. Make sure the Go server is running.`,
    )
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiError
    throw new Error(payload.error || `The request failed (${response.status}).`)
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const api = {
  listTodos: () => request<Todo[]>('/todos'),
  listCategories: () => request<Category[]>('/categories'),
  createTodo: (input: CreateTodoInput) =>
    request<Todo>('/todos', { method: 'POST', body: JSON.stringify(input) }),
  createCategory: (input: CreateCategoryInput) =>
    request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  updateTodo: (id: number, input: UpdateTodoInput) =>
    request<Todo>(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),
  deleteTodo: (id: number) =>
    request<void>(`/todos/${id}`, { method: 'DELETE' }),
}
