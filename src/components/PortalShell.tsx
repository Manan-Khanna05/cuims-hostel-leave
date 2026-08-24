import { useState } from 'react'
import type { ReactNode } from 'react'
import { PAGE_NOTE } from '../constants/app'
import Footer from './Footer'
import HelpPanel from './HelpPanel'
import QuickLinks from './QuickLinks'
import TopBar from './TopBar'

type Props = {
  title: string
  children: ReactNode
  /** Red note under the blue bar. Pass null to hide, or a node to replace. */
  note?: ReactNode
}

export default function PortalShell({ title, children, note = PAGE_NOTE }: Props) {
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-cu-bg">
      <TopBar />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-10 md:px-5">
        <div className="py-4 md:py-5">
          <QuickLinks />
        </div>

        {/* Section header bar with the help FAB overlapping its right edge */}
        <div className="relative">
          <h1 className="rounded-[10px] bg-cu-bar p-3 text-center text-[18px] font-bold text-white">
            {title}
          </h1>
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            aria-label="Hostel leave help and settings"
            className="absolute right-3 top-1/2 z-20 flex h-[38px] w-[38px] -translate-y-1/2
                       items-center justify-center rounded-full border-2 border-white
                       bg-[#8B1A1A] text-[19px] font-bold leading-none text-white shadow-md
                       transition hover:brightness-110 md:right-4 md:h-[40px] md:w-[40px]"
          >
            ?
          </button>
        </div>

        {note && (
          <p className="mx-auto mt-4 max-w-[640px] text-center text-[15px] font-bold leading-snug text-cu-note md:text-[15px]">
            {note}
          </p>
        )}

        <div className="mt-6">{children}</div>
      </main>

      <Footer />

      {helpOpen && <HelpPanel onClose={() => setHelpOpen(false)} />}
    </div>
  )
}
