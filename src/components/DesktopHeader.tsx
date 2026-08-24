import logo from '/cuims-logo.png'
import {
  BookIcon,
  HomeIcon,
  NotificationIcon,
  SearchIcon,
  SettingsIcon,
} from './icons'

type Card = {
  title: string
  subtitle: string
  active?: boolean
}

const CARDS: Card[] = [
  { title: 'Important Links', subtitle: 'CLICK HERE' },
  { title: 'Student Facilitation', subtitle: 'CLICK TO VIEW' },
  { title: 'Anti Ragging', subtitle: 'READ NOW' },
  { title: 'CU LMS', subtitle: 'CLICK HERE', active: true },
  { title: 'My University Email', subtitle: 'VIEW DETAILS' },
]

const CARD_ICONS = [BookIcon, HomeIcon, NotificationIcon, SearchIcon, SettingsIcon]

/** Desktop CUIMS chrome: logo bar plus the five quick-link cards. */
export default function DesktopHeader() {
  return (
    <div className="hidden md:block">
      <div className="flex items-center border-b border-[#E2E2E8] bg-white px-6 py-3">
        <img
          src={logo}
          alt="CUIMS - Chandigarh University Information Management System"
          className="h-[46px] w-auto"
        />
        <nav className="ml-auto flex items-center gap-5 text-[#4a4a4a]">
          <button type="button" aria-label="Search"><SearchIcon size={22} /></button>
          <button type="button" aria-label="Notifications"><NotificationIcon size={22} /></button>
          <button type="button" aria-label="Library"><BookIcon size={22} /></button>
          <button type="button" aria-label="Home"><HomeIcon size={22} /></button>
          <button type="button" aria-label="Settings"><SettingsIcon size={22} /></button>
          <span className="block h-10 w-10 overflow-hidden rounded-full ring-1 ring-[#E2E2E8]">
            <svg viewBox="0 0 64 64" className="h-full w-full" role="img" aria-label="Profile">
              <rect width="64" height="64" fill="#C9D2DC" />
              <circle cx="32" cy="25" r="12" fill="#8A99A8" />
              <path d="M8 64c0-13.6 10.7-22 24-22s24 8.4 24 22z" fill="#8A99A8" />
            </svg>
          </span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1500px] grid-cols-5 gap-4 px-6 py-5">
        {CARDS.map((card, index) => {
          const Icon = CARD_ICONS[index]
          return (
            <button
              key={card.title}
              type="button"
              className={[
                'flex items-center justify-between gap-3 rounded-lg border px-4 py-4 text-left transition',
                card.active
                  ? 'border-2 border-[#22C55E] bg-[#123B4E]'
                  : 'border-cu-border bg-white hover:border-cu-blue/50',
              ].join(' ')}
            >
              <span className="min-w-0">
                <span
                  className={[
                    'block truncate text-[17px] font-bold leading-tight',
                    card.active ? 'text-white' : 'text-cu-text',
                  ].join(' ')}
                >
                  {card.title}
                </span>
                <span
                  className={[
                    'mt-2 inline-block border-b text-[12px] font-medium tracking-wide',
                    card.active
                      ? 'border-white/60 text-white/90'
                      : 'border-gray-400 text-gray-500',
                  ].join(' ')}
                >
                  {card.subtitle}
                </span>
              </span>
              <span
                className={[
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-md',
                  card.active ? 'text-white' : 'bg-[#E8ECFA] text-cu-blue',
                ].join(' ')}
              >
                <Icon size={card.active ? 28 : 22} />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
