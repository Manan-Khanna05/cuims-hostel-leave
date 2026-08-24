import { motion } from 'framer-motion'

type Props = {
  open: boolean
  title?: string
  message?: string
  onOk: () => void
}

/**
 * Recreates the portal's SweetAlert success popup. Sizes, colours and weights
 * are taken from the sweet-alert.css the real CUIMS page loads.
 */
export default function SuccessModal({
  open,
  title = 'Success!',
  message = 'Your Leave successfully generated.',
  onOk,
}: Props) {
  return (
    open && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="w-full max-w-[478px] rounded-[5px] bg-white p-[17px] pb-7 text-center font-sa shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* 80px ring with a 4px #A5DC86 border, per sweet-alert.css */}
            <motion.div
              className="relative mx-auto my-5 h-20 w-20 rounded-full border-4"
              style={{ borderColor: '#A5DC86' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 240, damping: 17 }}
            >
              <span
                className="absolute -inset-1 rounded-full border-4"
                style={{ borderColor: 'rgba(165,220,134,0.2)' }}
              />
              <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full">
                <motion.path
                  d="M18 41 L32 55 L61 26"
                  fill="none"
                  stroke="#A5DC86"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
                />
              </svg>
            </motion.div>

            <motion.h2
              className="my-[25px] text-[30px] font-semibold leading-[30px]"
              style={{ color: '#575757' }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.28 }}
            >
              {title}
            </motion.h2>

            <motion.p
              className="text-[16px] font-light leading-normal"
              style={{ color: '#797979' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.84, duration: 0.28 }}
            >
              {message}
            </motion.p>

            <motion.button
              type="button"
              onClick={onOk}
              autoFocus
              className="mt-[26px] rounded-[5px] px-8 py-2.5 text-[17px] font-medium text-white transition hover:brightness-95"
              style={{ backgroundColor: '#AEDEF4' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.98, duration: 0.22 }}
            >
              OK
            </motion.button>
          </motion.div>
        </motion.div>
    )
  )
}
