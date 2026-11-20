import type { ReactNode } from 'react'
import { Icon } from '@/components/icon'

export function ModalFrame({ title, eyebrow, onClose, children, wide = false }: { title: string; eyebrow: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className='fixed inset-0 z-30 grid place-items-center bg-[#1d312d]/45 p-5 backdrop-blur-[4px] max-[700px]:items-end max-[700px]:p-3' onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={`max-h-[calc(100vh-40px)] w-full overflow-y-auto rounded-2xl border border-[#e9efeb] bg-white px-6 pt-6 pb-6 shadow-[0_20px_70px_#16342b35] max-[700px]:max-h-[calc(100vh-24px)] max-[700px]:rounded-t-2xl max-[700px]:rounded-b-xl max-[700px]:px-5 max-[700px]:pt-5 max-[700px]:pb-5 ${wide ? 'max-w-130' : 'max-w-110'}`} role='dialog' aria-modal='true' aria-labelledby='modal-title'>
        <div className='mb-4 flex items-center justify-between'>
          <span className='grid size-8 place-items-center rounded-xl bg-[#e9f3ed] text-[#4a8a72]'><Icon name='mark' size={18} /></span>
          <button className='grid size-9 place-items-center rounded-lg bg-[#f4f6f4] text-[#81918d] hover:bg-[#edf3f0] hover:text-green-dark' onClick={onClose} aria-label='Close dialog'><Icon name='close' size={19} /></button>
        </div>
        <span className='text-[8px] font-bold tracking-[1.5px] text-[#80938a]'>{eyebrow}</span>
        <h2 id='modal-title' className='mt-2 font-heading text-xl font-bold tracking-[-.65px] text-[#2c4038] max-[700px]:text-lg'>{title}</h2>
        {children}
      </section>
    </div>
  )
}
