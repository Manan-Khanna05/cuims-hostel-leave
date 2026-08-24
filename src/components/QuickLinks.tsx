import type { LucideLikeIcon } from './icons'
import {
  BookIcon,
  CloudIcon,
  HomeIcon,
  NotificationIcon,
  SearchIcon,
  SettingsIcon,
} from './icons'

type Card = {
  title: string
  cta: string
  Icon: LucideLikeIcon
  chip: string
  stroke: string
  featured?: boolean
}

const CARDS: Card[] = [
  { title: 'Important Links', cta: 'CLICK HERE', Icon: BookIcon, chip: 'bg-chip-blue', stroke: 'text-cu-accent' },
  { title: 'Student Facilitation', cta: 'CLICK TO VIEW', Icon: NotificationIcon, chip: 'bg-chip-purple', stroke: 'text-[#A431C4]' },
  { title: 'Anti Ragging', cta: 'READ NOW', Icon: HomeIcon, chip: 'bg-chip-lavender', stroke: 'text-cu-accent' },
  { title: 'LMS Portal', cta: 'CLICK HERE', Icon: CloudIcon, chip: '', stroke: 'text-white', featured: true },
  { title: 'University Email', cta: 'VIEW DETAILS', Icon: SearchIcon, chip: 'bg-chip-blue', stroke: 'text-cu-accent' },
  { title: 'Fee Payment', cta: 'PAY NOW', Icon: SettingsIcon, chip: 'bg-chip-lavender', stroke: 'text-cu-accent' },
]

/**
 * Dashboard quick links: six equal columns on desktop, two per row on phones.
 * Every card is inert — this is presentation only.
 */
export default function QuickLinks() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
      {CARDS.map(({ title, cta, Icon, chip, stroke, featured }) => (
        <a
          key={title}
          href="#"
          onClick={(event) => event.preventDefault()}
          className={[
            'relative block rounded-[10px] p-5 shadow-card transition',
            featured
              ? 'border-[1.6px] border-cu-green bg-cu-featured'
              : 'border border-transparent bg-white hover:border-[#e3e3ec]',
          ].join(' ')}
        >
          {/* Icon chip pinned to the card's top-right corner */}
          <span
            className={[
              'absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[6px]',
              featured ? '' : chip,
              stroke,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Icon size={20} />
          </span>

          <span
            className={[
              'block max-w-[calc(100%-3rem)] text-[15px] font-bold leading-snug',
              featured ? 'text-white' : 'text-cu-accent',
            ].join(' ')}
          >
            {title}
          </span>

          <span
            className={[
              'mt-3 inline-block text-[11px] font-medium uppercase tracking-wide underline underline-offset-2',
              featured ? 'text-white/85' : 'text-[#8a8a8a]',
            ].join(' ')}
          >
            {cta}
          </span>
        </a>
      ))}
    </div>
  )
}
