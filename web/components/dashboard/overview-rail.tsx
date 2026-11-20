import { Icon } from '@/components/icon'
import type { TaskCounts } from '@/lib/dashboard'
import type { Todo } from '@/lib/types'

export function OverviewRail({ todos, counts, onViewUpcoming, onSelect }: { todos: Todo[]; counts: TaskCounts; onViewUpcoming: () => void; onSelect: (todo: Todo) => void }) {
  const progress = counts.all ? Math.round((counts.completed / counts.all) * 100) : 0
  const upcoming = todos.filter((todo) => todo.due_date && todo.status !== 'completed').sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()).slice(0, 3)

  return (
    <aside className='flex min-w-0 flex-col gap-5 max-[960px]:grid max-[960px]:grid-cols-2 max-[960px]:items-start max-[700px]:grid-cols-1 max-[700px]:gap-4'>
      <section className='relative overflow-hidden rounded-xl bg-[#2d5549] px-5 pt-5 pb-4 text-[#e5f0ea] shadow-[0_5px_14px_#24453b17] max-[960px]:row-span-2 max-[700px]:row-auto'>
        <span aria-hidden className='pointer-events-none absolute -top-24 -right-20 size-45 rounded-full border border-white/10 shadow-[0_0_0_20px_#ffffff06,0_0_0_40px_#ffffff04]' />
        <div className='relative z-10 flex items-center gap-2'>
          <span className='grid size-7 place-items-center rounded-lg bg-white/10 text-[#c4e4d4]'><Icon name='spark' size={17} /></span>
          <span className='text-[8px] font-bold tracking-[1.4px] text-[#b7d2c5]'>DAILY OVERVIEW</span>
          <span className='ml-auto inline-flex items-center gap-1 text-[7px] font-bold tracking-[1px] text-[#b5d5c5]'><i className='size-1 rounded-full bg-[#99d2b2] shadow-[0_0_0_3px_#9ad5b21c]' />LIVE</span>
        </div>
        <h3 className='relative z-10 mt-4 font-heading text-xl leading-[1.3] font-bold tracking-[-.65px] text-[#f0f7f2] max-[700px]:text-lg'>A good day<br />starts <em className='text-[#a6d3bc] not-italic'>organized.</em></h3>
        <p className='mt-2 max-w-53 text-[10px] leading-relaxed text-[#bdd0c7] max-[700px]:max-w-65'>Every detail handled is more time for the people who matter.</p>
        <div className='my-4 h-1 bg-white/10' />
        <div className='flex items-center justify-between text-[9px] text-[#c4d7ce]'><span>Today’s progress</span><strong className='font-heading text-[13px] font-bold text-[#e6f3ea]'>{progress}%</strong></div>
        <div className='mt-2 h-1 overflow-hidden rounded-full bg-white/10'><span className='block h-full rounded-full bg-[#8bc6a9] transition-[width] duration-300' style={{ width: `${progress}%` }} /></div>
        <div className='mt-2 flex items-center justify-between text-[8px] text-[#a9c3b7]'><span>{counts.completed} of {counts.all} tasks complete</span><span className='grid size-5 place-items-center rounded-lg border border-white/20 text-[#d8ede0]'><Icon name='check' size={13} /></span></div>
      </section>

      <section className='px-1 py-0 max-[960px]:px-1 max-[960px]:py-1 max-[700px]:px-1 max-[700px]:py-1'>
        <div className='mb-3 flex items-end justify-between gap-2'>
          <div><span className='text-[8px] font-bold tracking-[1.5px] text-[#82938c]'>COMING UP</span><h3 className='mt-1 font-heading text-sm font-bold tracking-[-.3px] text-[#34453f] max-[700px]:text-[13px]'>Next on your list</h3></div>
          <button className='inline-flex items-center gap-1 border-0 bg-transparent p-1 text-[8px] font-semibold text-[#558775] hover:text-[#265f4e]' onClick={onViewUpcoming}>See all <Icon name='arrow' size={14} /></button>
        </div>
        <UpcomingList todos={upcoming} onSelect={onSelect} />
      </section>

      <section className='flex items-start gap-3 rounded-xl border border-[#e6ece8] bg-[#fbfcfb] p-3 max-[960px]:self-end max-[700px]:hidden'>
        <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-[#ebf2ed] text-[#7b9b89]'><Icon name='pulse' size={17} /></span>
        <div><strong className='mb-1 mt-1 block text-[9px] font-semibold text-[#63736c]'>Small steps, better days.</strong><p className='text-[8px] leading-relaxed text-[#9aa6a1]'>Keep your team’s next actions visible and easy to pick up.</p></div>
      </section>
    </aside>
  )
}

function UpcomingList({ todos, onSelect }: { todos: Todo[]; onSelect: (todo: Todo) => void }) {
  if (!todos.length) return (
    <div className='flex items-center gap-3 rounded-xl border border-dashed border-[#dfe7e2] px-3 py-3 text-[9px] leading-relaxed text-[#6f8078]'>
      <span className='grid size-7 shrink-0 place-items-center rounded-lg bg-[#e9f1ed] text-[#68917d]'><Icon name='calendar' size={17} /></span>
      <span>Nothing scheduled yet.<br /><small className='text-[8px] text-[#9aa6a1]'>Your next due task will show up here.</small></span>
    </div>
  )
  return (
    <div className='flex flex-col'>
      {todos.map((todo) => {
        const dueDate = new Date(todo.due_date!)
        const date = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Bangkok', day: '2-digit' }).format(dueDate)
        const month = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Bangkok', month: 'short' }).format(dueDate)
        return (
          <button key={todo.id} className='flex min-h-15 w-full items-center gap-3 border-0 border-b border-[#e7ece9] bg-transparent px-1 py-2 text-left hover:[&_.upcoming-title]:text-green' onClick={() => onSelect(todo)}>
            <span className='flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-[#e5ebe7] bg-white'><strong className='font-heading text-[13px] leading-none font-bold text-[#527267]'>{date}</strong><small className='text-[7px] uppercase text-[#95a19c]'>{month}</small></span>
            <span className='flex min-w-0 flex-1 flex-col gap-1'><strong className='upcoming-title overflow-hidden text-ellipsis whitespace-nowrap text-[9px] font-semibold text-[#52615c]'>{todo.title}</strong><small className='flex items-center gap-1 text-[8px] text-[#9aa6a1]'><i className='size-2 rounded-full' style={{ backgroundColor: todo.category?.color ?? '#7c9c92' }} />{todo.category?.name ?? 'Uncategorized'}</small></span>
            <span className='rotate-[-90deg] text-[#a0aaa5]'><Icon name='chevron' size={16} /></span>
          </button>
        )
      })}
    </div>
  )
}
