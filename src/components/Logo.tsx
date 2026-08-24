import logo from '/cuims-logo.png'

/**
 * CUIMS brand lockup. Heights are fixed and the width is left to the image's
 * own aspect ratio so the mark is never distorted.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={logo}
      alt="CUIMS"
      className={compact ? 'h-[30px] w-auto' : 'h-[42px] w-auto'}
    />
  )
}
