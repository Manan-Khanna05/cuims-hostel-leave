import logo from '/cuims-logo.png'
import {
  BookIcon,
  HomeIcon,
  MenuIcon,
  NotificationIcon,
  SearchIcon,
  SettingsIcon,
} from './icons'

const ACTIONS = [
  { label: 'Search', Icon: SearchIcon },
  { label: 'Notifications', Icon: NotificationIcon },
  { label: 'Library', Icon: BookIcon },
  { label: 'Home', Icon: HomeIcon },
  { label: 'Settings', Icon: SettingsIcon },
]

/**
 * The CUIMS phone header: hamburger, logo, action icons, avatar.
 * Sticky, white, with a hairline bottom border and status-bar safe area.
 */
export default function MobileHeader() {
  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-[#E2E2E8] bg-white md:hidden"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex h-[62px] items-center px-2.5 xs:px-3">
        <button
          type="button"
          aria-label="Open menu"
          className="-ml-0.5 shrink-0 p-1.5 text-[#333] active:opacity-60"
        >
          <MenuIcon size={26} />
        </button>

        <img
          src={logo}
          alt="CUIMS - Chandigarh University Information Management System"
          className="ml-1 h-[34px] w-auto shrink-0 xs:ml-2 xs:h-[38px]"
        />

        {/* Icons hug the right edge; spacing tightens on 360px screens. */}
        <nav className="ml-auto flex items-center gap-[7px] xs:gap-2.5">
          {ACTIONS.map(({ label, Icon }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className="p-0.5 text-[#4a4a4a] active:opacity-60"
            >
              <Icon size={21} />
            </button>
          ))}

          <span className="ml-0.5 block h-[38px] w-[38px] shrink-0 overflow-hidden rounded-full ring-1 ring-[#E2E2E8] xs:ml-1">
            <Avatar />
          </span>
        </nav>
      </div>
    </header>
  )
}

/** Neutral placeholder portrait — no real student photo is bundled. */
function Avatar() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-label="Profile" role="img">
      <rect width="64" height="64" fill="#C9D2DC" />
      <circle cx="32" cy="25" r="12" fill="#8A99A8" />
      <path d="M8 64c0-13.6 10.7-22 24-22s24 8.4 24 22z" fill="#8A99A8" />
    </svg>
  )
}
