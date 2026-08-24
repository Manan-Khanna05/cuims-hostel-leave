import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DAY_OUT_END, DAY_OUT_START } from '../constants/app'
import type { StudentProfile } from '../services/profile'
import { useAppData } from '../store/AppData'
import type { Leave } from '../types/leave'
import { typeLabel } from '../types/leave'
import { formatDisplayDate, formatDisplayTime } from '../utils/date'
import ConfirmDialog from './ConfirmDialog'
import { CloseIcon, EyeIcon, PencilIcon, TrashIcon } from './icons'

type Tab = 'help' | 'profile' | 'records'

/** Slide-up panel behind the section bar's "?" button. */
export default function HelpPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('help')

  // Escape closes the panel, matching the overlay tap.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[1400] flex items-end justify-center bg-black/50 md:items-center md:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hostel Leave Help"
    >
      <motion.div
        className="flex max-h-[88vh] w-full max-w-xl flex-col rounded-t-2xl bg-white shadow-2xl safe-bottom md:max-h-[85vh] md:rounded-lg"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-[20px] font-bold text-cu-text">Hostel Leave Help</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-[#666] active:opacity-60"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <div className="mt-4 flex gap-1 border-b border-cu-table px-5">
          {(
            [
              ['help', 'Help'],
              ['profile', 'Profile'],
              ['records', 'Records'],
            ] as [Tab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={[
                '-mb-px border-b-2 px-3 py-2.5 text-[15px] font-bold transition',
                tab === id ? 'border-cu-bar text-cu-accent' : 'border-transparent text-[#777]',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {tab === 'help' && <HelpTab />}
          {tab === 'profile' && <ProfileTab />}
          {tab === 'records' && <RecordsTab onClose={onClose} />}
        </div>

        <div className="border-t border-cu-table px-5 py-4">
          <button type="button" className="cu-btn w-full" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* -- Help -------------------------------------------------------------- */

function HelpTab() {
  return (
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
        <dd className="text-[#5a5a5a]">View your previous requests and remarks.</dd>
      </div>
      <div>
        <dt className="font-bold text-cu-text">Profile &amp; Records</dt>
        <dd className="text-[#5a5a5a]">
          Use the tabs above to change the student name or to view, edit and delete
          individual leave records.
        </dd>
      </div>
    </dl>
  )
}

/* -- Profile ----------------------------------------------------------- */

function ProfileTab() {
  const { profile, saveProfile, leaves } = useAppData()
  const [draft, setDraft] = useState<StudentProfile>(profile)
  const [saved, setSaved] = useState(false)

  useEffect(() => setDraft(profile), [profile])

  function set<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function submit() {
    saveProfile(draft)
    setSaved(true)
  }

  const digits = (value: string) => value.replace(/\D/g, '').slice(0, 10)

  return (
    <div>
      <p className="mb-5 text-[14px] leading-relaxed text-[#5a5a5a]">
        Changing the name or UID rewrites every row in Previous Leave, so the whole
        history shows the same student.
      </p>

      <label htmlFor="pfName" className="cu-label mb-2">
        Name
      </label>
      <input
        id="pfName"
        value={draft.name}
        onChange={(event) => set('name', event.target.value.toUpperCase())}
        placeholder="MANAN KHANNA"
        className="cu-input mb-5"
      />

      <label htmlFor="pfUid" className="cu-label mb-2">
        UID
      </label>
      <input
        id="pfUid"
        value={draft.uid}
        onChange={(event) => set('uid', event.target.value.toUpperCase())}
        placeholder="25BCF10015"
        className="cu-input mb-5"
      />

      <label htmlFor="pfParents" className="cu-label mb-2">
        Parents No.
      </label>
      <input
        id="pfParents"
        type="tel"
        inputMode="numeric"
        value={draft.parentsNo}
        onChange={(event) => set('parentsNo', digits(event.target.value))}
        className="cu-input mb-5"
      />

      <label htmlFor="pfContact" className="cu-label mb-2">
        Contact No.
      </label>
      <input
        id="pfContact"
        type="tel"
        inputMode="numeric"
        value={draft.contactNo}
        onChange={(event) => set('contactNo', digits(event.target.value))}
        className="cu-input mb-5"
      />

      <button type="button" className="cu-btn w-full" onClick={submit}>
        Save Profile
      </button>

      {saved && (
        <p className="mt-3 text-center text-[14px] font-bold text-[#2E7D32]">
          Saved — {leaves.length} leave {leaves.length === 1 ? 'record' : 'records'} updated.
        </p>
      )}
    </div>
  )
}

/* -- Records ----------------------------------------------------------- */

function RecordsTab({ onClose }: { onClose: () => void }) {
  const { leaves, removeLeave } = useAppData()
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<Leave | null>(null)

  function go(path: string) {
    onClose()
    navigate(path)
  }

  if (leaves.length === 0) {
    return <p className="py-6 text-center text-[15px] text-[#777]">No leave records.</p>
  }

  return (
    <>
      <p className="mb-4 text-[14px] leading-relaxed text-[#5a5a5a]">
        View, edit or delete a leave record.
      </p>

      <ul className="divide-y divide-cu-table">
        {leaves.map((leave) => (
          <li key={leave.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold text-cu-text">
                {formatDisplayDate(leave.appliedOn)} · {typeLabel(leave.leaveType)}
              </p>
              <p className="truncate text-[13px] text-[#777]">
                {leave.purpose} — <span className="text-cu-accent">{leave.remarks}</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                title="View"
                aria-label={`View leave applied on ${formatDisplayDate(leave.appliedOn)}`}
                onClick={() => go(`/leave/details/${leave.id}`)}
                className="rounded p-2 text-cu-accent transition hover:bg-cu-accent/10"
              >
                <EyeIcon size={19} />
              </button>
              <button
                type="button"
                title="Edit"
                aria-label={`Edit leave applied on ${formatDisplayDate(leave.appliedOn)}`}
                onClick={() => go(`/leave/edit/${leave.id}`)}
                className="rounded p-2 text-cu-dark transition hover:bg-cu-dark/10"
              >
                <PencilIcon size={19} />
              </button>
              <button
                type="button"
                title="Delete"
                aria-label={`Delete leave applied on ${formatDisplayDate(leave.appliedOn)}`}
                onClick={() => setPendingDelete(leave)}
                className="rounded p-2 text-cu-red transition hover:bg-cu-red/10"
              >
                <TrashIcon size={19} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this leave?"
        message={
          pendingDelete
            ? `The ${typeLabel(pendingDelete.leaveType)} applied on ${formatDisplayDate(
                pendingDelete.appliedOn,
              )} will be permanently removed.`
            : ''
        }
        onConfirm={() => {
          if (pendingDelete) removeLeave(pendingDelete.id)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}
