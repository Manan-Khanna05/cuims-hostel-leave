import { motion } from 'framer-motion'
import { AlertIcon } from './icons'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: Props) {
  return (
    open && (
        <motion.div
          className="fixed inset-0 z-[1600] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            className="w-full max-w-[400px] rounded-[5px] bg-white p-[17px] pb-7 text-center font-sa shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="mx-auto my-5 flex h-20 w-20 items-center justify-center rounded-full border-4"
              style={{ borderColor: '#F8BB86', color: '#F8BB86' }}
            >
              <AlertIcon size={38} />
            </div>
            <h2
              className="my-[25px] text-[26px] font-semibold leading-[28px]"
              style={{ color: '#575757' }}
            >
              {title}
            </h2>
            <p className="text-[16px] font-light" style={{ color: '#797979' }}>
              {message}
            </p>
            <div className="mt-[26px] flex justify-center gap-3">
              <button type="button" className="cu-btn" onClick={onConfirm}>
                {confirmLabel}
              </button>
              <button type="button" className="cu-btn-neutral" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
    )
  )
}
