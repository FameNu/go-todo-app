export function todayKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Bangkok',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function dueLabel(value: string | null) {
  if (!value) return 'No due date'
  const due = new Date(value)
  if (todayKey(due) === todayKey()) return 'Today'
  if (todayKey(due) === todayKey(new Date(Date.now() + 86_400_000)))
    return 'Tomorrow'
  return new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Bangkok',
    month: 'short',
    day: 'numeric',
  }).format(due)
}

export function priorityLabel(priority: string) {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}
