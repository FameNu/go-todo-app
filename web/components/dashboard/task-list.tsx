import { Icon, type IconName } from '@/components/icon'
import { dueLabel, priorityLabel, todayKey } from '@/lib/date'
import { viewItems, type ViewFilter } from '@/lib/dashboard'
import type { Category, Todo } from '@/lib/types'

interface TaskListProps {
  todos: Todo[]
  totalCount: number
  categories: Category[]
  title: string
  view: ViewFilter
  categoryId: number | 'all'
  query: string
  loading: boolean
  busyId: number | null
  onQueryChange: (query: string) => void
  onViewChange: (view: ViewFilter) => void
  onCategoryChange: (id: number | 'all') => void
  onToggle: (todo: Todo) => void
  onEdit: (todo: Todo) => void
  onCreateTask: () => void
  onCreateCategory: () => void
}

const priorityStyles: Record<string, string> = {
  high: 'text-[#a77867] before:bg-[#d28d72]',
  medium: 'text-[#9c895f] before:bg-[#d2ad69]',
  low: 'text-[#729181] before:bg-[#77a58f]',
}

export function TaskList(props: TaskListProps) {
  const { todos, totalCount, categories, title, view, categoryId, query, loading, busyId, onQueryChange, onViewChange, onCategoryChange, onToggle, onEdit, onCreateTask, onCreateCategory } = props

  return (
    <section className='min-w-0 overflow-hidden rounded-xl border border-[#e8eeea] bg-white shadow-[0_3px_12px_#26473d06]' aria-labelledby='task-list-title'>
      <div className='flex min-h-21 items-center justify-between gap-4 px-5 pt-4 pb-4 max-[700px]:min-h-18 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-2 max-[700px]:px-3 max-[700px]:pt-3 max-[700px]:pb-3'>
        <div>
          <div className='text-[8px] font-bold tracking-[1.5px] text-[#82938c]'>YOUR WORKLIST</div>
          <h2 id='task-list-title' className='mt-1 flex items-center gap-2 font-heading text-lg font-bold tracking-[-.55px] text-[#293a36] max-[700px]:text-[15px]'>{title}<span className='grid h-5 min-w-5 place-items-center rounded-lg bg-[#eef4f0] px-1 font-body text-[9px] font-semibold tracking-normal text-[#6f8c80]'>{todos.length}</span></h2>
        </div>
        <div className='flex items-center gap-2 max-[700px]:w-full'>
          <label className='flex h-9 items-center gap-2 rounded-lg border border-[#e7ece9] bg-white px-2 text-[#98a5a0] focus-within:border-[#86b5a0] focus-within:ring-2 focus-within:ring-[#e9f3ed] max-[700px]:h-8 max-[700px]:flex-1'>
            <Icon name='search' size={17} />
            <input className='min-w-0 w-27 border-0 bg-transparent p-0 text-[10px] text-ink outline-none placeholder:text-[#a2adaa] max-[700px]:w-full max-[700px]:text-[9px]' value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder='Search tasks' aria-label='Search tasks' />
            {query && <button className='grid place-items-center border-0 bg-transparent p-0 text-[#87958f]' onClick={() => onQueryChange('')} aria-label='Clear search'><Icon name='close' size={14} /></button>}
          </label>
          <label className='flex h-9 max-w-43 items-center gap-2 rounded-lg border border-[#e7ece9] bg-white px-2 text-[#83938d] max-[700px]:h-8 max-[700px]:max-w-34 max-[700px]:gap-1 max-[700px]:px-2'>
            <Icon name='tag' size={16} />
            <select className='w-full min-w-0 cursor-pointer border-0 bg-transparent text-[9px] text-[#71817a] outline-none max-[700px]:text-[8px]' aria-label='Filter by category' value={categoryId} onChange={(event) => { onCategoryChange(event.target.value === 'all' ? 'all' : Number(event.target.value)); onViewChange('all') }}>
              <option value='all'>All categories</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className='flex gap-5 overflow-x-auto border-b border-[#edf1ee] px-5 [scrollbar-width:none] max-[700px]:gap-4 max-[700px]:px-3'>
        {viewItems.map((item) => <button key={item.id} role='tab' aria-selected={view === item.id} className={`relative shrink-0 border-0 bg-transparent px-1 pt-0 pb-3 text-[10px] font-medium text-[#9aa6a1] hover:text-[#4e6b60] max-[700px]:pb-3 max-[700px]:text-[9px] ${view === item.id ? 'font-bold text-[#337b67] after:absolute after:right-0 after:bottom-0 after:left-0 after:h-1 after:rounded-t after:bg-[#5e9f88]' : ''}`} onClick={() => { onViewChange(item.id); onCategoryChange('all') }}>{item.label}</button>)}
      </div>

      <div className='min-h-85 max-[960px]:min-h-70'>
        {loading ? <TaskSkeleton /> : todos.length === 0 ? (
          <EmptyState hasTasks={totalCount > 0} hasCategories={categories.length > 0} onAddTask={onCreateTask} onAddCategory={onCreateCategory} />
        ) : todos.map((todo) => <TaskRow key={todo.id} todo={todo} busy={busyId === todo.id} onToggle={() => onToggle(todo)} onEdit={() => onEdit(todo)} />)}
      </div>
      {!loading && todos.length > 0 && <div className='flex min-h-11 items-center justify-between px-5 text-[9px] text-[#9aa5a1] max-[700px]:min-h-10 max-[700px]:px-3 max-[700px]:text-[8px]'><span>Showing <strong className='text-[#6c7e76]'>{todos.length}</strong> of <strong className='text-[#6c7e76]'>{totalCount}</strong> tasks</span><button className='inline-flex items-center gap-1 border-0 bg-transparent p-1 text-[9px] font-semibold text-[#558775] hover:text-[#265f4e]' onClick={() => { onViewChange('all'); onCategoryChange('all'); onQueryChange('') }}>View all <Icon name='arrow' size={15} /></button></div>}
    </section>
  )
}

function TaskRow({ todo, busy, onToggle, onEdit }: { todo: Todo; busy: boolean; onToggle: () => void; onEdit: () => void }) {
  const isComplete = todo.status === 'completed'
  const dueIsPast = Boolean(todo.due_date && !isComplete && todayKey(new Date(todo.due_date)) < todayKey())
  const priorityClass = priorityStyles[todo.priority]
  return (
    <article className={`group flex min-h-20 items-center gap-3 border-b border-[#f0f3f1] px-5 py-3 transition-colors hover:bg-[#fbfcfb] max-[700px]:min-h-18 max-[700px]:gap-2 max-[700px]:px-3 max-[700px]:py-3 ${isComplete ? '[&_.task-title]:text-[#9aa7a1] [&_.task-title]:line-through [&_.task-title]:decoration-[#b7c5bf] [&_.task-meta]:opacity-70' : ''}`}>
      <button className={`grid size-5 min-w-5 place-items-center rounded-lg border-[1.5px] p-0 transition-colors max-[700px]:size-5 max-[700px]:min-w-5 ${isComplete ? 'border-[#5d9e86] bg-[#5d9e86] text-white' : 'border-[#d3ddd8] bg-white text-white hover:border-[#6da48e]'}`} aria-label={isComplete ? 'Mark task incomplete' : 'Mark task complete'} disabled={busy} onClick={onToggle}>{isComplete && <Icon name='check' size={15} />}</button>
      <button className='flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-1 border-0 bg-transparent p-0 text-left' onClick={onEdit}>
        <span className='flex min-w-0 flex-wrap items-center gap-2 max-[700px]:gap-1'><strong className='task-title overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#34443f] max-[700px]:max-w-[min(54vw,276px)] max-[700px]:text-[10px]'>{todo.title}</strong>{todo.status === 'in_progress' && <span className='rounded bg-[#edf2f8] px-2 py-1 text-[8px] font-semibold text-[#617fa6]'>In progress</span>}</span>
        {todo.description && <span className='max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-[#9aa5a1] max-[700px]:text-[8px]'>{todo.description}</span>}
        <span className='task-meta flex items-center gap-3 text-[9px] text-[#9ba7a2] max-[700px]:gap-2 max-[700px]:text-[8px] max-[372px]:gap-2'>
          <span className='inline-flex max-w-38 items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap max-[700px]:max-w-26 max-[372px]:max-w-20'><i className='size-2 shrink-0 rounded-full' style={{ backgroundColor: todo.category?.color ?? '#7c9c92' }} />{todo.category?.name ?? 'Uncategorized'}</span>
          <span className={`inline-flex items-center gap-1 whitespace-nowrap max-[700px]:gap-1 [&_svg]:text-[#9aa7a1] max-[700px]:[&_svg]:hidden ${dueIsPast ? 'text-[#c17b6b] [&_svg]:text-[#c17b6b]' : ''}`}><Icon name='calendar' size={13} />{dueLabel(todo.due_date)}{dueIsPast && <em className='text-[8px] not-italic text-[#b46f5f]'>Overdue</em>}</span>
        </span>
      </button>
      <span className={`relative inline-flex min-w-14 items-center justify-end gap-1 text-[9px] before:size-1 before:rounded-full before:content-[''] max-[700px]:min-w-2 max-[700px]:text-[0px] max-[700px]:before:size-2 ${priorityClass}`} title={`${priorityLabel(todo.priority)} priority`}>{priorityLabel(todo.priority)}</span>
      <button className='grid size-7 shrink-0 place-items-center rounded-lg bg-transparent text-[#81918d] opacity-0 transition-colors hover:bg-[#edf3f0] hover:text-green-dark focus-visible:opacity-100 group-hover:opacity-100 max-[700px]:hidden' aria-label={`Edit ${todo.title}`} onClick={onEdit}><Icon name='edit' size={16} /></button>
    </article>
  )
}

function EmptyState({ hasTasks, hasCategories, onAddTask, onAddCategory }: { hasTasks: boolean; hasCategories: boolean; onAddTask: () => void; onAddCategory: () => void }) {
  const icon: IconName = hasTasks ? 'search' : 'clipboard'
  return (
    <div className='flex min-h-85 flex-col items-center justify-center px-5 py-9 text-center max-[700px]:min-h-68 max-[700px]:px-4 max-[700px]:py-7'>
      <span className='relative mb-3 grid h-17 w-19 place-items-center'><span className='grid size-14 rotate-[-6deg] place-items-center rounded-[20px] bg-[#edf5f0] text-[#61937e]'><Icon name={icon} size={27} /></span><i className='absolute top-0 right-2 text-[13px] not-italic text-[#b9cfae]'>✳</i><i className='absolute bottom-1 left-2 text-[10px] not-italic text-[#d1b880]'>✳</i></span>
      <h3 className='font-heading text-[15px] font-bold tracking-[-.3px] text-[#3b5048]'>{hasTasks ? 'Nothing in this view' : 'A little clarity starts here'}</h3>
      <p className='mt-2 max-w-73 text-[10px] leading-relaxed text-[#98a39f] max-[700px]:text-[9px]'>{hasTasks ? 'Try another view or search term to find the task you need.' : 'Add your first task and give your care team a clear next step.'}</p>
      {!hasTasks && <button className='mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg bg-green px-3 text-[10px] font-semibold text-white hover:bg-green-dark' onClick={hasCategories ? onAddTask : onAddCategory}><Icon name='plus' size={17} />{hasCategories ? 'Create your first task' : 'Create a category'}</button>}
    </div>
  )
}

function TaskSkeleton() {
  return <div className='px-5 py-1' aria-label='Loading tasks'>{[0, 1, 2, 3].map((item) => <div className='flex min-h-20 items-center gap-3 border-b border-[#f0f3f1]' key={item}><i className='size-5 rounded-lg border border-[#e5ebe7]' /><div className='flex flex-1 flex-col gap-2'><b className='h-2 w-[36%] animate-pulse rounded bg-[#f0f3f1]' /><span className='h-2 w-1/4 animate-pulse rounded bg-[#f0f3f1]' /></div><em className='h-2 w-10 animate-pulse rounded bg-[#f0f3f1]' /></div>)}</div>
}
