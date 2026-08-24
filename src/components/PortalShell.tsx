import type { ReactNode } from 'react'
import { PAGE_NOTE } from '../constants/app'
import DesktopHeader from './DesktopHeader'
import Footer from './Footer'
import HelpButton from './HelpButton'
import MobileHeader from './MobileHeader'

type Props = {
  title: string
  children: ReactNode
  /** Red note under the blue bar. Pass null to hide, or a node to replace. */
  note?: ReactNode
}

export default function PortalShell({ title, children, note = PAGE_NOTE }: Props) {
  return (
    <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden bg-cu-bg">
      <MobileHeader />
      <DesktopHeader />

      <main className="mx-auto w-full max-w-[1500px] flex-1 px-[18px] pb-10 md:px-6">
        <h1 className="mt-5 rounded-[6px] bg-cu-blue px-4 py-3.5 text-center text-[26px] font-bold leading-tight text-white md:mt-2 md:text-[21px]">
          {title}
        </h1>

        {note && (
          <p className="mx-auto mt-5 max-w-[640px] text-center text-[19px] font-normal leading-[1.35] text-cu-red md:mt-5 md:text-[15px] md:font-bold">
            {note}
          </p>
        )}

        <div className="mt-7 md:mt-6">{children}</div>
      </main>

      <Footer />
      <HelpButton />
    </div>
  )
}
