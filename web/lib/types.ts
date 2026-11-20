export type TodoStatus = 'pending' | 'in_progress' | 'completed'
export type TodoPriority = 'low' | 'medium' | 'high'

export interface Category {
  id: number
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface Todo {
  id: number
  title: string
  description: string
  status: TodoStatus
  priority: TodoPriority
  due_date: string | null
  category_id: number
  category: Category
  created_at: string
  updated_at: string
}

export interface CreateTodoInput {
  title: string
  description: string
  category_id: number
  priority: TodoPriority
  due_date: string | null
}

export interface CreateCategoryInput {
  name: string
  color: string
}

export interface UpdateTodoInput {
  title?: string
  status?: TodoStatus
  priority?: TodoPriority
}

export interface ApiError {
  error?: string
}
