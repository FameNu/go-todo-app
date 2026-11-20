'use client'

import { useEffect, useMemo, useState } from 'react'
import { CategoryModal } from '@/components/dialogs/category-modal'
import { TodoDetailsModal } from '@/components/dialogs/todo-details-modal'
import { TodoModal } from '@/components/dialogs/todo-modal'
import { Icon } from '@/components/icon'
import { DashboardHeader, WelcomeHeader } from '@/components/dashboard/header'
import { OverviewRail } from '@/components/dashboard/overview-rail'
import { Sidebar } from '@/components/dashboard/sidebar'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { TaskList } from '@/components/dashboard/task-list'
import { api } from '@/lib/api'
import { todayKey } from '@/lib/date'
import { viewItems, type TaskCounts, type ViewFilter } from '@/lib/dashboard'
import type {
  Category,
  CreateTodoInput,
  Todo,
  TodoStatus,
  UpdateTodoInput,
} from '@/lib/types'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [view, setView] = useState<ViewFilter>('all')
  const [categoryId, setCategoryId] = useState<number | 'all'>('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<'todo' | 'category' | null>(null)
  const [editing, setEditing] = useState<Todo | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const [now] = useState(() => new Date())

  useEffect(() => {
    let mounted = true

    async function loadDashboard() {
      try {
        const [todoData, categoryData] = await Promise.all([
          api.listTodos(),
          api.listCategories(),
        ])
        if (mounted) {
          setTodos(todoData)
          setCategories(categoryData)
        }
      } catch (cause) {
        if (mounted)
          setError(
            cause instanceof Error
              ? cause.message
              : 'Unable to load clinic tasks.',
          )
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void loadDashboard()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const counts = useMemo<TaskCounts>(
    () => ({
      all: todos.length,
      pending: todos.filter((todo) => todo.status === 'pending').length,
      inProgress: todos.filter((todo) => todo.status === 'in_progress').length,
      completed: todos.filter((todo) => todo.status === 'completed').length,
      dueToday: todos.filter(
        (todo) =>
          todo.due_date && todayKey(new Date(todo.due_date)) === todayKey(),
      ).length,
    }),
    [todos],
  )

  const visibleTodos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return todos
      .filter((todo) => {
        const dueDate = todo.due_date ? todayKey(new Date(todo.due_date)) : null
        const matchesView =
          view === 'all' ||
          (view === 'today' && dueDate === todayKey()) ||
          (view === 'upcoming' &&
            todo.status !== 'completed' &&
            dueDate !== null &&
            dueDate > todayKey()) ||
          (view === 'completed' && todo.status === 'completed')
        const matchesCategory =
          categoryId === 'all' || todo.category_id === categoryId
        const matchesQuery =
          !normalizedQuery ||
          `${todo.title} ${todo.description} ${todo.category?.name ?? ''}`
            .toLowerCase()
            .includes(normalizedQuery)
        return matchesView && matchesCategory && matchesQuery
      })
      .sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1
        if (b.status === 'completed' && a.status !== 'completed') return -1
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      })
  }, [todos, view, categoryId, query])

  const pageTitle =
    viewItems.find((item) => item.id === view)?.label ?? 'All tasks'
  const categoryTitle =
    categoryId === 'all'
      ? ''
      : (categories.find((category) => category.id === categoryId)?.name ?? '')

  async function createTodo(input: CreateTodoInput) {
    try {
      const todo = await api.createTodo(input)
      setTodos((current) => [todo, ...current])
      setModal(null)
      setToast('Task added to your care plan')
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Couldn't create this task.",
      )
    }
  }

  async function createCategory(name: string, color: string) {
    try {
      const category = await api.createCategory({ name, color })
      setCategories((current) =>
        [...current, category].sort((a, b) => a.name.localeCompare(b.name)),
      )
      setCategoryId(category.id)
      setModal(null)
      setToast('Category created')
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Couldn't create this category.",
      )
    }
  }

  async function updateTodo(id: number, input: UpdateTodoInput) {
    setBusyId(id)
    try {
      const updated = await api.updateTodo(id, input)
      setTodos((current) =>
        current.map((todo) => (todo.id === id ? updated : todo)),
      )
      setEditing(null)
      setToast('Task updated')
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Couldn't update this task.",
      )
    } finally {
      setBusyId(null)
    }
  }

  async function toggleTodo(todo: Todo) {
    setBusyId(todo.id)
    try {
      const status: TodoStatus =
        todo.status === 'completed' ? 'pending' : 'completed'
      const updated = await api.updateTodo(todo.id, { status })
      setTodos((current) =>
        current.map((item) => (item.id === todo.id ? updated : item)),
      )
      setToast(
        status === 'completed'
          ? 'Task completed — nice work'
          : 'Task moved back to your list',
      )
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Couldn't update this task.",
      )
    } finally {
      setBusyId(null)
    }
  }

  async function deleteTodo(id: number) {
    setBusyId(id)
    try {
      await api.deleteTodo(id)
      setTodos((current) => current.filter((todo) => todo.id !== id))
      setEditing(null)
      setToast('Task removed')
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Couldn't delete this task.",
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className='flex min-h-screen max-[700px]:block'>
      <Sidebar
        categories={categories}
        todos={todos}
        counts={counts}
        view={view}
        categoryId={categoryId}
        onViewChange={setView}
        onCategoryChange={setCategoryId}
        onAddCategory={() => setModal('category')}
      />
      <section className='min-w-0 flex-1' id='home'>
        <DashboardHeader title={categoryTitle || pageTitle} date={now} />
        <div className='mx-auto max-w-368 px-11 pt-10 pb-6 max-[1180px]:px-8 max-[700px]:px-4 max-[700px]:pt-7 max-[700px]:pb-5 max-[372px]:px-3 min-[1500px]:pt-12'>
          <WelcomeHeader
            title={categoryTitle || 'Good morning, team'}
            onCreateTask={() => setModal('todo')}
          />
          {error && (
            <div
              className='-mt-2 mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#efd4ca] bg-[#fff6f2] px-3 py-3 text-[10px] text-[#9b594c] max-[700px]:mb-3 max-[700px]:text-[9px]'
              role='alert'
            >
              <span>{error}</span>
              <button
                className='grid place-items-center border-0 bg-transparent p-1 text-inherit'
                onClick={() => setError('')}
                aria-label='Dismiss error'
              >
                <Icon name='close' size={16} />
              </button>
            </div>
          )}
          <SummaryCards counts={counts} />
          <div className='grid grid-cols-[minmax(0,1.72fr)_minmax(244px,.78fr)] items-start gap-5 max-[1180px]:gap-4 max-[960px]:grid-cols-1'>
            <TaskList
              todos={visibleTodos}
              totalCount={todos.length}
              categories={categories}
              title={categoryTitle || pageTitle}
              view={view}
              categoryId={categoryId}
              query={query}
              loading={loading}
              busyId={busyId}
              onQueryChange={setQuery}
              onViewChange={setView}
              onCategoryChange={setCategoryId}
              onToggle={(todo) => void toggleTodo(todo)}
              onEdit={setEditing}
              onCreateTask={() => setModal('todo')}
              onCreateCategory={() => setModal('category')}
            />
            <OverviewRail
              todos={todos}
              counts={counts}
              onViewUpcoming={() => {
                setView('upcoming')
                setCategoryId('all')
              }}
              onSelect={setEditing}
            />
          </div>
          <footer className='flex justify-between pt-6 text-[8px] text-[#a0aaa6] max-[700px]:pt-4 max-[700px]:text-[7px] [&_span]:flex [&_span]:items-center [&_span]:gap-2 [&_span:first-child_svg]:text-[#78a28e] max-[700px]:[&_span:last-child]:hidden'>
            <span>
              <Icon name='mark' size={13} /> Thoughtful work, healthier days.
            </span>
            <span>
              Careboard <i className='size-1 rounded-full bg-[#aab4af]' />{' '}
              Clinic workspace
            </span>
          </footer>
        </div>
      </section>

      {modal === 'todo' && (
        <TodoModal
          key='new-todo'
          categories={categories}
          onClose={() => setModal(null)}
          onSubmit={createTodo}
          onCreateCategory={() => setModal('category')}
        />
      )}
      {modal === 'category' && (
        <CategoryModal
          onClose={() => setModal(null)}
          onSubmit={createCategory}
        />
      )}
      {editing && (
        <TodoDetailsModal
          key={editing.id}
          todo={editing}
          busy={busyId === editing.id}
          onClose={() => setEditing(null)}
          onSave={(input) => void updateTodo(editing.id, input)}
          onDelete={() => void deleteTodo(editing.id)}
        />
      )}
      {toast && (
        <div
          className='fixed right-7 bottom-6 z-20 flex min-h-11 items-center gap-2 rounded-xl border border-[#dce9e1] bg-white px-4 py-1 shadow-[0_10px_36px_#203b3521] text-[10px] font-semibold text-[#506b60] max-[700px]:right-3 max-[700px]:bottom-3 max-[700px]:left-3 max-[700px]:min-h-10'
          role='status'
        >
          <span className='grid size-6 place-items-center rounded-lg bg-[#68a489] text-white'>
            <Icon name='check' size={15} />
          </span>
          {toast}
        </div>
      )}
    </main>
  )
}
