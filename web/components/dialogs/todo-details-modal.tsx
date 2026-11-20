'use client'

import { useState, type FormEvent } from 'react'
import { Icon } from '@/components/icon'
import { ModalFrame } from '@/components/dialogs/modal-frame'
import { dueLabel } from '@/lib/date'
import type {
  Todo,
  TodoPriority,
  TodoStatus,
  UpdateTodoInput,
} from '@/lib/types'

interface TodoDetailsModalProps {
  todo: Todo
  busy: boolean
  onClose: () => void
  onSave: (input: UpdateTodoInput) => void
  onDelete: () => void
}

const labelClass =
  'flex flex-col gap-2 text-[10px] font-semibold text-[#596b63] max-[700px]:text-[9px]'
const fieldClass =
  'min-h-10 w-full rounded-lg border border-[#e2e9e5] bg-[#fcfdfc] px-3 py-2 text-[10px] font-normal text-[#34443e] outline-none focus:border-[#86b5a0] focus:ring-2 focus:ring-[#e9f3ed]'

export function TodoDetailsModal({
  todo,
  busy,
  onClose,
  onSave,
  onDelete,
}: TodoDetailsModalProps) {
  const [title, setTitle] = useState(todo.title)
  const [status, setStatus] = useState<TodoStatus>(todo.status)
  const [priority, setPriority] = useState<TodoPriority>(todo.priority)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({ title: title.trim(), status, priority })
  }

  return (
    <ModalFrame
      title='Task details'
      eyebrow={todo.category?.name ?? 'CARE TEAM TASK'}
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
          />
        </label>
        {todo.description && (
          <div className='border-l-2 border-[#b6d4c3] bg-linear-to-r from-[#f7faf7] to-transparent py-2 pl-3 text-[#64776d]'>
            <span className='text-[7px] font-bold tracking-[1px] text-[#9aa9a0]'>
              TEAM NOTE
            </span>
            <p className='mt-1 text-xs leading-relaxed'>
              {todo.description}
            </p>
          </div>
        )}
        <div className='grid grid-cols-2 gap-3 max-[372px]:gap-2'>
          <label className={labelClass}>
            Status
            <select
              className={fieldClass}
              value={status}
              onChange={(event) => setStatus(event.target.value as TodoStatus)}
            >
              <option value='pending'>Pending</option>
              <option value='in_progress'>In progress</option>
              <option value='completed'>Completed</option>
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
        <div className='flex flex-wrap gap-x-3 gap-y-2 pt-1 text-[9px] text-[#8a9991]'>
          <span className='inline-flex items-center gap-1'>
            <Icon name='calendar' size={15} />
            Due {dueLabel(todo.due_date)}
          </span>
          <span className='inline-flex items-center gap-1'>
            <Icon name='clock' size={15} />
            Added{' '}
            {new Intl.DateTimeFormat('en', {
              timeZone: 'Asia/Bangkok',
              month: 'short',
              day: 'numeric',
            }).format(new Date(todo.created_at))}
          </span>
        </div>
        {confirmDelete ? (
          <div className='flex flex-wrap items-center gap-3 rounded-lg border border-[#efd9d1] bg-[#fff8f5] p-3 text-[9px] text-[#96695e]'>
            <span className='w-full'>Remove this task from the worklist?</span>
            <button
              type='button'
              className='inline-flex items-center border-0 bg-transparent p-1 text-[9px] font-semibold text-[#558775]'
              onClick={() => setConfirmDelete(false)}
            >
              Keep task
            </button>
            <button
              type='button'
              className='min-h-7 rounded-lg border-0 bg-[#a75f50] px-2 text-[8px] text-white'
              disabled={busy}
              onClick={onDelete}
            >
              Yes, remove
            </button>
          </div>
        ) : (
          <div className='mt-1 flex items-center gap-2 border-t border-[#edf1ee] pt-4 max-[700px]:pt-1'>
            <button
              type='button'
              className='inline-flex items-center gap-1 border-0 bg-transparent p-1 text-[9px] font-semibold text-[#b77868] hover:text-[#934d40]'
              onClick={() => setConfirmDelete(true)}
            >
              <Icon name='trash' size={15} />
              Delete
            </button>
            <span className='flex-1' />
            <button
              type='button'
              className='min-h-9 rounded-lg border border-[#e3e9e5] bg-white px-3 text-[10px] font-semibold text-[#75837d] hover:bg-[#f8faf8]'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='min-h-9 rounded-lg bg-green px-3 text-[10px] font-semibold text-white hover:bg-green-dark'
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </form>
    </ModalFrame>
  )
}
