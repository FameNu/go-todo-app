'use client'

import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/icon'
import { ModalFrame } from '@/components/dialogs/modal-frame'
import type { Category, CreateTodoInput, TodoPriority } from '@/lib/types'

interface TodoModalProps {
  categories: Category[]
  onClose: () => void
  onSubmit: (input: CreateTodoInput) => Promise<void>
  onCreateCategory: () => void
}

const labelClass =
  'flex flex-col gap-2 text-[10px] font-semibold text-[#596b63] max-[700px]:text-[9px]'
const fieldClass =
  'min-h-10 w-full rounded-lg border border-[#e2e9e5] bg-[#fcfdfc] px-3 py-2 text-[10px] font-normal text-[#34443e] outline-none placeholder:text-[#abb5b0] focus:border-[#86b5a0] focus:ring-2 focus:ring-[#e9f3ed]'
const optionalClass =
  'ml-1 text-[7px] font-bold tracking-[1px] text-[#a1aca6]'

export function TodoModal({
  categories,
  onClose,
  onSubmit,
  onCreateCategory,
}: TodoModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 0)
  const [priority, setPriority] = useState<TodoPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!categories.length) {
      setFormError('Create a category before adding a task.')
      return
    }
    setSaving(true)
    setFormError('')
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      category_id: Number(categoryId),
      priority,
      due_date: dueDate ? new Date(`${dueDate}T12:00:00`).toISOString() : null,
    })
    setSaving(false)
  }

  return (
    <ModalFrame
      title='Make a little progress.'
      eyebrow='ADD TO YOUR WORKLIST'
      onClose={onClose}
      wide
    >
      <form
        className='mt-5 flex flex-col gap-4 max-[700px]:mt-4 max-[700px]:gap-3'
        onSubmit={submit}
      >
        <label className={labelClass}>
          Task name
          <input
            className={fieldClass}
            autoFocus
            required
            maxLength={180}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder='e.g. Confirm tomorrow’s appointments'
          />
        </label>
        <label className={labelClass}>
          A few details <span className={optionalClass}>OPTIONAL</span>
          <textarea
            className={`${fieldClass} min-h-18 resize-y leading-relaxed`}
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder='Add a note for the team…'
          />
        </label>
        <div className='grid grid-cols-2 gap-3 max-[372px]:gap-2'>
          <label className={labelClass}>
            Category
            <select
              className={fieldClass}
              required
              value={categoryId}
              onChange={(event) => setCategoryId(Number(event.target.value))}
              disabled={!categories.length}
            >
              <option value={0} disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            Priority
            <select
              className={fieldClass}
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TodoPriority)
              }
            >
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </label>
        </div>
        <label className={labelClass}>
          Due date <span className={optionalClass}>OPTIONAL</span>
          <input
            className={fieldClass}
            type='date'
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </label>
        {!categories.length && (
          <button
            type='button'
            className='flex min-h-9 items-center gap-2 rounded-lg border border-[#e3ece6] bg-[#f5faf6] px-2 text-left text-[9px] text-[#71857a]'
            onClick={onCreateCategory}
          >
            <Icon name='tag' size={16} />
            You’ll need a category first.{' '}
            <strong className='text-[#397b64]'>Create one</strong>
            <span className='ml-auto'>
              <Icon name='arrow' size={14} />
            </span>
          </button>
        )}
        {formError && <p className='text-[9px] text-[#ae6556]'>{formError}</p>}
        <div className='mt-1 flex items-center justify-end gap-2 border-t border-transparent pt-2 max-[700px]:pt-1'>
          <button
            type='button'
            className='min-h-9 rounded-lg border border-[#e3e9e5] bg-white px-3 text-[10px] font-semibold text-[#75837d] hover:bg-[#f8faf8] hover:text-[#435d51]'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='inline-flex min-h-9 items-center justify-center gap-2 rounded-lg bg-green px-3 text-[10px] font-semibold text-white shadow-sm hover:bg-green-dark'
            disabled={saving || !categories.length}
          >
            <Icon name='plus' size={16} />
            {saving ? 'Adding…' : 'Add task'}
          </button>
        </div>
      </form>
    </ModalFrame>
  )
}
