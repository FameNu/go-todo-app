'use client'

import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/icon'
import { ModalFrame } from '@/components/dialogs/modal-frame'

const labelClass = 'flex flex-col gap-2 text-[10px] font-semibold text-[#596b63] max-[700px]:text-[9px]'
const fieldClass = 'min-h-10 w-full rounded-lg border border-[#e2e9e5] bg-[#fcfdfc] px-3 py-2 text-[10px] font-normal text-[#34443e] outline-none placeholder:text-[#abb5b0] focus:border-[#86b5a0] focus:ring-2 focus:ring-[#e9f3ed]'

export function CategoryModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (name: string, color: string) => Promise<void> }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#5e9b89')
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    await onSubmit(name.trim(), color)
    setSaving(false)
  }

  return (
    <ModalFrame title='Give work a place.' eyebrow='NEW CATEGORY' onClose={onClose}>
      <form className='mt-5 flex flex-col gap-4 max-[700px]:mt-4 max-[700px]:gap-3' onSubmit={submit}>
        <label className={labelClass}>Category name<input className={fieldClass} autoFocus required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder='e.g. Patient follow-up' /></label>
        <label className={labelClass}>Color <span className='ml-1 text-[7px] font-bold tracking-[1px] text-[#a1aca6]'>FOR YOUR SIDEBAR</span>
          <span className='flex h-10 items-center gap-2 rounded-lg border border-[#e2e9e5] bg-[#fcfdfc] px-3 text-[9px] font-medium text-[#71817a]'><input className='size-5 cursor-pointer border-0 bg-transparent p-0' type='color' value={color} onChange={(event) => setColor(event.target.value)} /><span className='size-3 rounded-full' style={{ backgroundColor: color }} />{color.toUpperCase()}</span>
        </label>
        <div className='mt-1 flex items-center justify-end gap-2 border-t border-transparent pt-2 max-[700px]:pt-1'>
          <button type='button' className='min-h-9 rounded-lg border border-[#e3e9e5] bg-white px-3 text-[10px] font-semibold text-[#75837d] hover:bg-[#f8faf8] hover:text-[#435d51]' onClick={onClose}>Cancel</button>
          <button type='submit' className='inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-green px-3 text-[10px] font-semibold text-white shadow-sm hover:bg-green-dark' disabled={saving}><Icon name='plus' size={16} />{saving ? 'Creating…' : 'Create category'}</button>
        </div>
      </form>
    </ModalFrame>
  )
}
