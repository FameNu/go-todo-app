import type { Category, Todo } from '@/lib/types'
import { Icon } from '@/components/icon'
import { todayKey } from '@/lib/date'
import { viewItems, type TaskCounts, type ViewFilter } from '@/lib/dashboard'

interface SidebarProps {
  categories: Category[]
  todos: Todo[]
  counts: TaskCounts
  view: ViewFilter
  categoryId: number | 'all'
  onViewChange: (view: ViewFilter) => void
  onCategoryChange: (id: number | 'all') => void
  onAddCategory: () => void
}

export function Sidebar({ categories, todos, counts, view, categoryId, onViewChange, onCategoryChange, onAddCategory }: SidebarProps) {
  const upcomingCount = todos.filter((todo) => todo.status !== 'completed' && todo.due_date && todayKey(new Date(todo.due_date)) > todayKey()).length

  return (
    <aside className='sticky top-0 flex h-screen min-h-screen w-63 min-w-63 flex-col overflow-y-auto bg-nav px-4 pt-7 pb-4 text-[#dce8e3] max-[700px]:static max-[700px]:h-auto max-[700px]:min-h-0 max-[700px]:w-full max-[700px]:min-w-0 max-[700px]:overflow-visible max-[700px]:px-4 max-[700px]:pt-3 max-[700px]:pb-2'>
      <a className='mb-12 flex items-center gap-3 px-3 text-white no-underline max-[700px]:mb-3 max-[700px]:px-0' href='#home' aria-label='Careboard home'>
        <span className='grid size-9 place-items-center rounded-xl bg-[#3e7567] text-[#e0f2eb] shadow-[inset_0_0_0_1px_#ffffff1c] max-[700px]:size-8'><Icon name='mark' size={22} /></span>
        <span className='flex flex-col gap-1'><strong className='font-heading text-[17px] font-extrabold tracking-[-.8px] max-[700px]:text-[15px]'>careboard</strong><small className='text-[8px] font-semibold tracking-[1.5px] text-[#92aaa1] max-[700px]:text-[7px]'>CLINIC WORKSPACE</small></span>
      </a>

      <div className='pb-3 pl-3 text-[9px] font-bold tracking-[1.5px] text-[#819a90] max-[700px]:hidden'>WORKSPACE</div>
      <nav className='flex flex-col gap-1 max-[700px]:flex-row max-[700px]:gap-1 max-[700px]:overflow-x-auto max-[700px]:[scrollbar-width:none]' aria-label='Task views'>
        {viewItems.map((item) => (
          <button key={item.id} className={`flex min-h-10 w-full items-center gap-3 rounded-lg border-0 bg-transparent px-3 text-left text-xs text-[#b7c9c2] transition-colors hover:bg-white/5 hover:text-white max-[700px]:min-h-9 max-[700px]:w-auto max-[700px]:min-w-max max-[700px]:gap-2 max-[700px]:px-3 max-[700px]:text-[9px] ${view === item.id && categoryId === 'all' ? 'bg-white/[.08] text-white shadow-[inset_2px_0_#92c7b3]' : ''}`} onClick={() => { onViewChange(item.id); onCategoryChange('all') }}>
            <Icon name={item.icon} size={18} /><span>{item.label}</span>
            <span className='ml-auto text-[10px] font-semibold text-[#87a198] max-[700px]:text-[8px]'>{item.id === 'all' ? counts.all : item.id === 'today' ? counts.dueToday : item.id === 'completed' ? counts.completed : upcomingCount}</span>
          </button>
        ))}
      </nav>

      <div className='mb-3 mt-9 flex items-center justify-between pl-3 pr-2 max-[700px]:hidden'>
        <span className='text-[9px] font-bold tracking-[1.5px] text-[#819a90]'>CATEGORIES</span>
        <button className='grid size-7 place-items-center rounded-lg bg-transparent text-[#92aaa1] transition-colors hover:bg-white/10 hover:text-white' aria-label='Add category' onClick={onAddCategory}><Icon name='plus' size={16} /></button>
      </div>
      <div className='flex flex-col gap-1 max-[700px]:flex-row max-[700px]:gap-2 max-[700px]:overflow-x-auto max-[700px]:pt-2 max-[700px]:[scrollbar-width:none]'>
        <button className={`flex min-h-9 w-full items-center gap-3 rounded-lg border-0 bg-transparent px-3 text-left text-[11px] text-[#b7c9c2] hover:bg-white/5 hover:text-white max-[700px]:min-h-7 max-[700px]:w-auto max-[700px]:min-w-max max-[700px]:gap-2 max-[700px]:border max-[700px]:border-white/10 max-[700px]:px-2 max-[700px]:text-[9px] ${categoryId === 'all' && view === 'all' ? 'bg-white/[.07] text-white' : ''}`} onClick={() => { onCategoryChange('all'); onViewChange('all') }}>
          <span className='grid size-5 min-w-5 place-items-center rounded-full bg-[#668f80] text-[#e8f2ed] max-[700px]:size-4 max-[700px]:min-w-4'><Icon name='grid' size={13} /></span><span>Every category</span><span className='ml-auto text-[10px] text-[#759087] max-[700px]:hidden'>{counts.all}</span>
        </button>
        {categories.map((category) => (
          <button key={category.id} className={`flex min-h-9 w-full items-center gap-3 rounded-lg border-0 bg-transparent px-3 text-left text-[11px] text-[#b7c9c2] hover:bg-white/5 hover:text-white max-[700px]:min-h-7 max-[700px]:w-auto max-[700px]:min-w-max max-[700px]:gap-2 max-[700px]:border max-[700px]:border-white/10 max-[700px]:px-2 max-[700px]:text-[9px] ${categoryId === category.id ? 'bg-white/[.07] text-white' : ''}`} onClick={() => { onCategoryChange(category.id); onViewChange('all') }}>
            <span className='size-2 min-w-2 rounded-full shadow-[0_0_0_3px_#ffffff0b] max-[700px]:size-2 max-[700px]:min-w-2' style={{ backgroundColor: category.color }} />
            <span className='overflow-hidden text-ellipsis whitespace-nowrap'>{category.name}</span>
            <span className='ml-auto text-[10px] text-[#759087] max-[700px]:hidden'>{todos.filter((todo) => todo.category_id === category.id).length}</span>
          </button>
        ))}
        {categories.length === 0 && <p className='px-3 text-[10px] leading-relaxed text-[#819a90] max-[700px]:px-0 max-[700px]:pt-1 max-[700px]:text-[9px]'>Add a category to organize your team’s work.</p>}
      </div>

      <div className='min-h-11 flex-1 max-[700px]:hidden' />
      <div className='mb-4 flex min-h-18 items-start gap-2 rounded-xl border border-white/10 bg-white/[.03] px-3 py-3 text-[#afc5ba] max-[700px]:hidden'>
        <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-[#3c665a] text-[#d2e9de]'><Icon name='pulse' size={17} /></span>
        <div className='flex flex-col gap-1 pt-1'><strong className='text-[10px] text-[#e9f1ed]'>Care, in sync.</strong><span className='text-[9px] leading-snug text-[#91aaa0]'>A little structure makes room for better care.</span></div>
        <Icon name='spark' size={17} />
      </div>
      <div className='flex min-h-12 items-center gap-2 border-t border-white/10 px-1 pt-2 max-[700px]:hidden'>
        <span className='grid size-8 shrink-0 place-items-center rounded-full bg-[#b1d2c3] font-heading text-[9px] font-bold text-[#274c40]'>CT</span>
        <span className='flex flex-col gap-1'><strong className='text-[10px] text-[#e1ebe6]'>Clinic team</strong><small className='text-[9px] text-[#89a196]'>Care workspace</small></span>
        <button className='ml-auto grid size-9 place-items-center rounded-lg bg-transparent text-[#a1b5ad] hover:bg-white/10 hover:text-white' aria-label='Workspace menu'><Icon name='dots' size={18} /></button>
      </div>
    </aside>
  )
}
