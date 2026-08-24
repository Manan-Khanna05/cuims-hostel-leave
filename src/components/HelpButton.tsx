import { useState } from 'react'
import { motion } from 'framer-motion'
import { DAY_OUT_END, DAY_OUT_START } from '../constants/app'
import { formatDisplayTime } from '../utils/date'
import { CloseIcon } from './icons'

export default function HelpButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Hostel leave help"
        className="fixed right-4 z-40 flex h-[58px] w-[58px] items-center justify-center
                   rounded-full border-2 border-white bg-[#6E1A1A] text-[30px] font-bold
                   leading-none text-white shadow-lg active:brightness-110
                   md:right-5 md:h-[52px] md:w-[52px] md:text-[26px]"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 18px)' }}
      >
        ?
      </button>

      {open && <HelpModal onClose={() => setOpen(false)} />}
    </>
  )
}

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 md:items-center md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hostel Leave Help"
    >
      <motion.div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl safe-bottom md:rounded-lg"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-cu-text">Hostel Leave Help</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close help"
            className="rounded p-1 text-[#666] active:opacity-60"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <dl className="space-y-4 text-[15px] leading-relaxed">
          <div>
            <dt className="font-bold text-cu-text">Day Out</dt>
            <dd className="text-[#5a5a5a]">
              {formatDisplayTime(DAY_OUT_START)} – {formatDisplayTime(DAY_OUT_END)}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-cu-text">Night Out</dt>
            <dd className="text-[#5a5a5a]">Fill parent and contact details.</dd>
          </div>
          <div>
            <dt className="font-bold text-cu-text">Previous Leave</dt>
            <dd className="text-[#5a5a5a]">
              View your previous requests and remarks.
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex justify-center">
          <button type="button" className="cu-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
