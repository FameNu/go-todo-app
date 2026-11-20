import type { IconName } from '@/components/icon'

export type ViewFilter = 'all' | 'today' | 'upcoming' | 'completed'

export const viewItems: { id: ViewFilter; label: string; icon: IconName }[] = [
  { id: 'all', label: 'All tasks', icon: 'clipboard' },
  { id: 'today', label: 'Today', icon: 'calendar' },
  { id: 'upcoming', label: 'Upcoming', icon: 'clock' },
  { id: 'completed', label: 'Completed', icon: 'check' },
]

export interface TaskCounts {
  all: number
  pending: number
  inProgress: number
  completed: number
  dueToday: number
}
