import { useAppData } from '../store/AppData'
import Logo from './Logo'
import {
  BookIcon,
  CloudIcon,
  MenuIcon,
  NotificationIcon,
  SearchIcon,
  SettingsIcon,
} from './icons'

const ACTIONS = [
  { label: 'Notifications', Icon: NotificationIcon },
  { label: 'Library', Icon: BookIcon },
  { label: 'Documents', Icon: CloudIcon },
  { label: 'Settings', Icon: SettingsIcon },
]

/** Sticky white portal topbar. Every control here is cosmetic and inert. */
export default function TopBar() {
  const { profile } = useAppData()

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-[#E9E9EF] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex h-[64px] max-w-[1600px] items-center gap-2 px-2.5 md:h-[70px] md:gap-5 md:px-5">
        <button
          type="button"
          aria-label="Open menu"
          onClick={(event) => event.preventDefault()}
          className="shrink-0 p-1 text-[#4a4a4a] active:opacity-60 md:p-1.5"
        >
          <MenuIcon size={22} className="md:h-6 md:w-6" />
        </button>

        <a href="#" onClick={(event) => event.preventDefault()} className="shrink-0">
          <span className="md:hidden">
            <Logo compact />
          </span>
          <span className="hidden md:block">
            <Logo />
          </span>
        </a>

        {/* Centre: pill search — cosmetic only */}
        <div className="mx-auto hidden w-full max-w-[420px] lg:block">
          <div className="relative">
            <input
              type="text"
              readOnly
              placeholder="Search &amp; Bookmark your page"
              aria-label="Search and bookmark your page"
              className="h-[40px] w-full rounded-full border border-transparent bg-[#F2F2F2]
                         pl-5 pr-11 text-[13px] text-cu-text outline-none
                         placeholder:text-[#9a9a9a] focus:border-[#dcdce4]"
            />
            <SearchIcon
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
            />
          </div>
        </div>

        <nav className="ml-auto flex shrink-0 items-center gap-0.5 md:gap-1.5">
          {ACTIONS.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={(event) => event.preventDefault()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#5a5a5a]
                         transition hover:bg-[#F2F2F6] active:opacity-60 md:h-10 md:w-10"
            >
              <Icon size={18} className="md:h-[19px] md:w-[19px]" />
            </button>
          ))}

          <span className="mx-1 hidden h-8 w-px bg-[#E4E4EA] md:block md:mx-2" />

          {/* Profile block: bold blue name over a gray id line, avatar at the end */}
          <span className="hidden text-right leading-tight md:block">
            <span className="block max-w-[170px] truncate text-[13px] font-bold text-cu-accent">
              {profile.name}
            </span>
            <span className="block text-[11px] text-[#8a8a8a]">{profile.uid}</span>
          </span>

          <span className="ml-0.5 block h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-[#E4E4EA] md:ml-1 md:h-10 md:w-10">
            <Avatar />
          </span>
        </nav>
      </div>
    </header>
  )
}

/** Generic placeholder portrait — no real photo is bundled. */
function Avatar() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" role="img" aria-label="Profile">
      <rect width="64" height="64" fill="#C9D2DC" />
      <circle cx="32" cy="25" r="12" fill="#8A99A8" />
      <path d="M8 64c0-13.6 10.7-22 24-22s24 8.4 24 22z" fill="#8A99A8" />
    </svg>
  )
}
