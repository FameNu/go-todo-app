import { Icon } from '@/components/icon'
import { dateLabel } from '@/lib/date'

export function DashboardHeader({ title, date }: { title: string; date: Date }) {
  return (
    <header className='flex h-18 items-center justify-between border-b border-[#e9eeeb] bg-[#f8f9f7] px-11 max-[1180px]:px-8 max-[700px]:h-13 max-[700px]:px-4 max-[372px]:px-3'>
      <div className='flex items-center gap-3 text-[11px] text-[#98a39f] max-[700px]:gap-2 max-[700px]:text-[9px]'><span>Workspace</span><span className='text-[#ccd4d0]'>/</span><strong className='font-semibold text-[#53635f]'>{title}</strong></div>
      <div className='flex items-center gap-4 max-[700px]:gap-2'>
        <div className='flex h-9 items-center gap-2 rounded-lg border border-[#e7ece9] bg-white px-3 text-[10px] text-[#667672] max-[700px]:border-0 max-[700px]:bg-transparent max-[700px]:px-1 max-[700px]:text-[9px]'><Icon name='calendar' size={16} /><span>{dateLabel(date)}</span></div>
        <button className='relative grid size-9 place-items-center rounded-lg bg-transparent text-[#798985] hover:bg-[#edf3f0] hover:text-green-dark max-[700px]:size-8' aria-label='Notifications'><Icon name='bell' size={18} /><i className='absolute top-2 right-2 size-1 rounded-full border border-[#f8f9f7] bg-[#da9b69]' /></button>
        <span className='grid size-8 place-items-center rounded-full bg-[#e5ece8] font-heading text-[8px] font-bold text-[#547268] max-[700px]:size-7'>CT</span>
      </div>
    </header>
  )
}

export function WelcomeHeader({ title, onCreateTask }: { title: string; onCreateTask: () => void }) {
  return (
    <section className='mb-7 flex items-end justify-between gap-5 max-[700px]:mb-5 max-[700px]:items-start'>
      <div>
        <div className='mb-3 flex items-center gap-2 text-[9px] font-bold tracking-[1.45px] text-[#82938c] max-[700px]:mb-2 max-[700px]:text-[7px] max-[700px]:tracking-[1.1px]'><span className='size-2 rounded-full bg-[#76ab94] shadow-[0_0_0_3px_#e1eee7] max-[700px]:size-1' /> YOUR CLINIC, IN GOOD HANDS</div>
        <h1 className='font-heading text-[clamp(26px,3.1vw,35px)] leading-[1.16] font-bold tracking-[-1.6px] text-[#253632] max-[700px]:text-[25px] max-[700px]:tracking-[-1.1px] max-[372px]:text-[22px]'>{title}<span className='text-[#67a28c]'>.</span></h1>
        <p className='mt-2 text-xs text-[#82908c] max-[700px]:max-w-55 max-[700px]:text-[10px] max-[700px]:leading-relaxed'>A clear view of what needs care today.</p>
      </div>
      <button className='mb-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-green px-4 text-[11px] font-semibold text-white shadow-[0_3px_7px_#2878651c] transition hover:-translate-y-px hover:bg-green-dark hover:shadow-[0_5px_12px_#28786524] max-[700px]:h-9 max-[700px]:min-h-9 max-[700px]:px-3 max-[700px]:text-[9px] max-[700px]:whitespace-nowrap max-[372px]:size-9 max-[372px]:p-0' onClick={onCreateTask}><Icon name='plus' size={18} /><span className='max-[372px]:hidden'>New task</span></button>
    </section>
  )
}
