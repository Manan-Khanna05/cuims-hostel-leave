import { useState } from 'react'
import { motion } from 'framer-motion'
import { SYSTEM_CANCEL_REMARK } from '../constants/app'
import type { Leave, LeaveStatus } from '../types/leave'
import { STATUS_OPTIONS } from '../types/leave'
import { CloseIcon } from './icons'

export const REMARK_PRESETS = [
  'Approved',
  'Cancelled',
  'Rejected',
  'Pending',
  SYSTEM_CANCEL_REMARK,
] as const

/** Keeps the stored status in step with a chosen preset remark. */
export function statusFromRemarks(remarks: string): LeaveStatus {
  const value = remarks.trim().toLowerCase()
  if (value === 'approved') return 'Approved'
  if (value === 'rejected') return 'Rejected'
  if (value === 'pending') return 'Pending'
  if (value === 'cancelled' || value.startsWith('system cancel')) return 'Cancelled'
  return 'Pending'
}

type Props = {
  leave: Leave | null
  onSave: (id: string, remarks: string, status: LeaveStatus) => void
  onClose: () => void
}

/**
 * Remark/status editor shown as a sheet on phones and a dialog on desktop.
 *
 * Deliberately mounts/unmounts without an exit animation. AnimatePresence did
 * not reliably complete the exit for this nested custom child, which stranded a
 * transparent full-screen overlay that swallowed every subsequent tap.
 */
export default function RemarksEditor({ leave, onSave, onClose }: Props) {
  if (!leave) return null
  return <Panel key={leave.id} leave={leave} onSave={onSave} onClose={onClose} />
}

function Panel({
  leave,
  onSave,
  onClose,
}: {
  leave: Leave
  onSave: Props['onSave']
  onClose: () => void
}) {
  const [remarks, setRemarks] = useState(leave.remarks)
  const [status, setStatus] = useState<LeaveStatus>(leave.status)

  function pickPreset(value: string) {
    if (!value) return
    setRemarks(value)
    setStatus(statusFromRemarks(value))
  }

  function save() {
    onSave(leave.id, remarks.trim() || 'Pending', status)
  }

  const presetValue = (REMARK_PRESETS as readonly string[]).includes(remarks)
    ? remarks
    : ''

  return (
    <motion.div
      className="fixed inset-0 z-[1500] flex items-end justify-center bg-black/45 md:items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Edit remarks"
    >
      <motion.div
        className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl safe-bottom md:rounded-lg"
        initial={{ y: '100%', opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[19px] font-bold text-cu-text">Edit Remarks</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-[#666] active:opacity-60"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <label htmlFor="remarkStatus" className="cu-label mb-2">
          Status
        </label>
        <select
          id="remarkStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value as LeaveStatus)}
          className="cu-input mb-5"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <label htmlFor="remarkPreset" className="cu-label mb-2">
          Remark
        </label>
        <select
          id="remarkPreset"
          value={presetValue}
          onChange={(event) => pickPreset(event.target.value)}
          className="cu-input mb-3"
        >
          <option value="">Custom remark…</option>
          {REMARK_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
        </select>

        <textarea
          rows={3}
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
          placeholder="Enter remark"
          className="cu-textarea mb-5"
        />

        <div className="flex justify-center gap-3">
          <button type="button" className="cu-btn" onClick={save}>
            Save
          </button>
          <button type="button" className="cu-btn-neutral" onClick={onClose}>
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
