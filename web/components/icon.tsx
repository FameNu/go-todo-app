import type { ReactNode } from 'react'

export type IconName =
  | 'mark'
  | 'grid'
  | 'clipboard'
  | 'calendar'
  | 'plus'
  | 'search'
  | 'bell'
  | 'chevron'
  | 'arrow'
  | 'check'
  | 'clock'
  | 'tag'
  | 'close'
  | 'trash'
  | 'edit'
  | 'pulse'
  | 'spark'
  | 'dots'

type IconProps = {
  name: IconName
  size?: number
}

const glyphs: Record<IconName, ReactNode> = {
  mark: (
    <>
      <path d='M12 3v18M3 12h18' />
      <path d='M7 7h10v10H7z' />
    </>
  ),
  grid: (
    <>
      <rect x='3' y='3' width='7' height='7' rx='2' />
      <rect x='14' y='3' width='7' height='7' rx='2' />
      <rect x='3' y='14' width='7' height='7' rx='2' />
      <rect x='14' y='14' width='7' height='7' rx='2' />
    </>
  ),
  clipboard: (
    <>
      <rect x='5' y='4' width='14' height='17' rx='2' />
      <path d='M9 4.5h6M9 10h6M9 14h6M9 18h3' />
    </>
  ),
  calendar: (
    <>
      <rect x='3' y='5' width='18' height='16' rx='2' />
      <path d='M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01' />
    </>
  ),
  plus: <path d='M12 5v14M5 12h14' />,
  search: (
    <>
      <circle cx='10.8' cy='10.8' r='6.8' />
      <path d='m16 16 4.5 4.5' />
    </>
  ),
  bell: (
    <>
      <path d='M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9' />
      <path d='M10 21h4' />
    </>
  ),
  chevron: <path d='m8 10 4 4 4-4' />,
  arrow: (
    <>
      <path d='M5 12h14' />
      <path d='m13 6 6 6-6 6' />
    </>
  ),
  check: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='m8 12 2.5 2.5L16 9' />
    </>
  ),
  clock: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v5l3 2' />
    </>
  ),
  tag: (
    <>
      <path d='M20.6 13.4 13 21l-10-10V3h8z' />
      <circle cx='7.5' cy='7.5' r='1' />
    </>
  ),
  close: <path d='m6 6 12 12M18 6 6 18' />,
  trash: <path d='M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3' />,
  edit: <path d='m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z' />,
  pulse: (
    <>
      <path d='M3 12h4l3-8 4 16 3-8h4' />
      <path d='M21 5v14' />
    </>
  ),
  spark: (
    <>
      <path d='m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z' />
      <path d='m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z' />
    </>
  ),
  dots: (
    <>
      <circle cx='5' cy='12' r='1' />
      <circle cx='12' cy='12' r='1' />
      <circle cx='19' cy='12' r='1' />
    </>
  ),
}

export function Icon({ name, size = 18 }: IconProps) {
  return (
    <svg
      aria-hidden='true'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      {glyphs[name]}
    </svg>
  )
}
