import { Icon, type IconName } from '@/components/icon'
import type { TaskCounts } from '@/lib/dashboard'

const cards: { label: string; key: keyof TaskCounts; detail: string; icon: IconName; tone: string }[] = [
  { label: 'All tasks', key: 'all', detail: 'Across your clinic', icon: 'clipboard', tone: 'teal' },
  { label: 'In progress', key: 'inProgress', detail: 'Being taken care of', icon: 'pulse', tone: 'blue' },
  { label: 'To do', key: 'pending', detail: 'Ready when you are', icon: 'clock', tone: 'amber' },
  { label: 'Completed', key: 'completed', detail: 'Great work, team', icon: 'check', tone: 'violet' },
]

const toneStyles: Record<string, string> = {
  teal: 'bg-[#e9f3ee] text-[#3b8a70]',
  blue: 'bg-[#edf2f9] text-[#698bb7]',
  amber: 'bg-[#fbf3e8] text-[#c49555]',
  violet: 'bg-[#f2eef8] text-[#907db4]',
}

export function SummaryCards({ counts }: { counts: TaskCounts }) {
  return (
    <section className='mb-6 grid grid-cols-4 gap-3 max-[1180px]:gap-2 max-[700px]:mb-4 max-[700px]:grid-cols-2 max-[700px]:gap-2' aria-label='Task summary'>
      {cards.map((card) => (
        <article className='relative flex min-h-26 items-start gap-3 overflow-hidden rounded-xl border border-[#e9eeeb] bg-white p-4 shadow-[0_3px_10px_#274c4005] min-[1500px]:min-h-28 max-[1180px]:gap-2 max-[1180px]:py-4 max-[1180px]:px-3 max-[1180px]:[&_.summary-mini]:hidden max-[700px]:min-h-20 max-[700px]:gap-2 max-[700px]:rounded-xl max-[700px]:p-3 max-[372px]:gap-2 max-[372px]:px-2' key={card.key}>
          <span className={`grid size-9 min-w-9 place-items-center rounded-xl max-[700px]:size-7 max-[700px]:min-w-7 max-[700px]:rounded-lg ${toneStyles[card.tone]}`}><Icon name={card.icon} size={16} /></span>
          <div className='flex flex-col items-start gap-1'>
            <span className='text-[10px] font-medium text-[#74827e] max-[700px]:text-[8px]'>{card.label}</span>
            <strong className='font-heading text-[23px] leading-[1.12] font-bold tracking-[-.7px] text-[#273a35] max-[700px]:text-[19px]'>{counts[card.key]}</strong>
            <small className='mt-1 text-[9px] text-[#9aa5a1] max-[700px]:mt-1 max-[700px]:text-[7px] max-[372px]:text-[6px]'>{card.detail}</small>
          </div>
          <span className={`summary-mini absolute top-4 right-3 grid size-7 place-items-center rounded-lg opacity-75 ${toneStyles[card.tone]}`}><Icon name={card.icon} size={15} /></span>
        </article>
      ))}
    </section>
  )
}
