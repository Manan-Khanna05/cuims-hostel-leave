/**
 * Hand-tuned inline SVG icons matching the CUIMS header.
 * All use a 24x24 box and inherit `currentColor` so callers control size/colour.
 */
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2.2} {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="20.5" y2="20.5" />
    </Svg>
  )
}

export function NotificationIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M18 8.5a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16s-2-1.5-2-6.5" />
      <path d="M10.3 19a2 2 0 0 0 3.4 0" />
    </Svg>
  )
}

/** Open book — the "library" entry in the CUIMS header. */
export function BookIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 6.2v13" />
      <path d="M3.5 4.6h5.2c1.5 0 3.3.7 3.3 1.6v13c0-.8-1.5-1.4-3.3-1.4H3.5z" />
      <path d="M20.5 4.6h-5.2c-1.5 0-3.3.7-3.3 1.6v13c0-.8 1.5-1.4 3.3-1.4h5.2z" />
    </Svg>
  )
}

/** The rounded pentagon "home" glyph used in the header. */
export function HomeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 10.6a2 2 0 0 1 .75-1.56l6-4.8a2 2 0 0 1 2.5 0l6 4.8A2 2 0 0 1 20 10.6V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </Svg>
  )
}

export function SettingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a1.9 1.9 0 1 1-2.69 2.69l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47V21a1.9 1.9 0 0 1-3.8 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a1.9 1.9 0 1 1-2.69-2.69l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-.97H3a1.9 1.9 0 0 1 0-3.8h.1a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a1.9 1.9 0 1 1 2.69-2.69l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 .97-1.47V3a1.9 1.9 0 0 1 3.8 0v.1a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a1.9 1.9 0 1 1 2.69 2.69l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47.97H21a1.9 1.9 0 0 1 0 3.8h-.1a1.6 1.6 0 0 0-1.47.97z" />
    </Svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <polyline points="6 9.5 12 15.5 18 9.5" />
    </Svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <polyline points="12 7 12 12 15.5 14" />
    </Svg>
  )
}

export function HelpIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2.4} {...props}>
      <path d="M9.2 9.2a2.9 2.9 0 1 1 3.9 2.73c-.75.28-1.1.94-1.1 1.72v.6" />
      <line x1="12" y1="17.6" x2="12" y2="17.7" />
    </Svg>
  )
}

export function EyeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.9" />
    </Svg>
  )
}

export function PencilIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 20h4.2L19.4 8.8a2 2 0 0 0 0-2.83l-1.37-1.37a2 2 0 0 0-2.83 0L4 15.8z" />
      <line x1="14.5" y1="6.5" x2="17.5" y2="9.5" />
    </Svg>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <polyline points="3.5 6.2 20.5 6.2" />
      <path d="M8.5 6.2V4.8a1.6 1.6 0 0 1 1.6-1.6h3.8a1.6 1.6 0 0 1 1.6 1.6v1.4" />
      <path d="M18.2 6.2 17.4 19a1.8 1.8 0 0 1-1.8 1.7H8.4A1.8 1.8 0 0 1 6.6 19L5.8 6.2" />
      <line x1="10.3" y1="10" x2="10.3" y2="17" />
      <line x1="13.7" y1="10" x2="13.7" y2="17" />
    </Svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2} {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Svg>
  )
}

export function PrinterIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <polyline points="6.5 9 6.5 3.5 17.5 3.5 17.5 9" />
      <path d="M6.5 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5" />
      <rect x="6.5" y="14" width="11" height="6.5" rx="1" />
    </Svg>
  )
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2} {...props}>
      <line x1="20" y1="12" x2="4" y2="12" />
      <polyline points="10 6 4 12 10 18" />
    </Svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Svg strokeWidth={2.4} {...props}>
      <polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />
    </Svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <path d="M10.3 3.9 2.4 17.4A2 2 0 0 0 4.1 20.4h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <line x1="12" y1="9" x2="12" y2="13.4" />
      <line x1="12" y1="16.8" x2="12" y2="16.9" />
    </Svg>
  )
}
