import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Leave, LeaveStatus } from '../types/leave'
import { typeLabel } from '../types/leave'
import { formatDisplayDate } from '../utils/date'
import ConfirmDialog from './ConfirmDialog'
import RemarksEditor from './RemarksEditor'
import { EyeIcon, PencilIcon, TrashIcon } from './icons'

type Props = {
  leaves: Leave[]
  onUpdateRemarks: (id: string, remarks: string, status: LeaveStatus) => void
  onDelete: (id: string) => void
}

export default function PreviousLeave({ leaves, onUpdateRemarks, onDelete }: Props) {
  const [editing, setEditing] = useState<Leave | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Leave | null>(null)

  function handleSaveRemarks(id: string, remarks: string, status: LeaveStatus) {
    onUpdateRemarks(id, remarks, status)
    setEditing(null)
  }

  return (
    <section className="mt-8 md:mt-10">
      <h2 className="text-[38px] font-normal leading-tight text-cu-text md:text-[40px]">
        Previous Leave
      </h2>
      <div className="mt-4 border-t border-[#E4E4EA]" />

      {leaves.length === 0 ? (
        <p className="mt-8 text-center text-[15px] text-[#777]">
          No leave applications yet.
        </p>
      ) : (
        <>
          {/* Phones: stacked label/value records */}
          <div className="mt-5 md:hidden">
            {leaves.map((leave) => (
              <MobileLeaveCard
                key={leave.id}
                leave={leave}
                onEditRemarks={() => setEditing(leave)}
                onDelete={() => setPendingDelete(leave)}
              />
            ))}
          </div>

          {/* Tablet and up: the real table */}
          <DesktopLeaveTable
            leaves={leaves}
            onEditRemarks={setEditing}
            onDelete={setPendingDelete}
          />
        </>
      )}

      <RemarksEditor
        leave={editing}
        onSave={handleSaveRemarks}
        onClose={() => setEditing(null)}
      />

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
          if (pendingDelete) onDelete(pendingDelete.id)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  )
}

/* -- mobile ------------------------------------------------------------ */

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#E4E4EA] px-3.5 py-3.5 last:border-b-0">
      <span className="text-[15px] font-bold text-cu-text">{label}:-</span>
      <span className="text-[15px] text-cu-text">{children}</span>
    </div>
  )
}

function MobileLeaveCard({
  leave,
  onEditRemarks,
  onDelete,
}: {
  leave: Leave
  onEditRemarks: () => void
  onDelete: () => void
}) {
  const navigate = useNavigate()

  return (
    <article className="mb-4 overflow-hidden rounded-[3px] border border-[#E4E4EA] bg-white">
      <Row label="APPLIED ON">{formatDisplayDate(leave.appliedOn)}</Row>
      <Row label="NAME">
        {leave.name}({leave.uid})
      </Row>
      <Row label="TYPE">{typeLabel(leave.leaveType)}</Row>
      <Row label="PURPOSE">{leave.purpose}</Row>
      <Row label="REMARKS">
        <button
          type="button"
          onClick={onEditRemarks}
          className="text-left text-cu-remarks underline-offset-2 active:underline"
        >
          {leave.remarks}
        </button>
      </Row>
      <div className="flex items-center gap-1 px-3.5 py-3">
        <span className="text-[15px] font-bold text-cu-text">ACTION:-</span>
        <ActionButtons
          leave={leave}
          onDelete={onDelete}
          onView={() => navigate(`/leave/details/${leave.id}`)}
          onEdit={() => navigate(`/leave/edit/${leave.id}`)}
        />
      </div>
    </article>
  )
}

/* -- desktop ----------------------------------------------------------- */

function DesktopLeaveTable({
  leaves,
  onEditRemarks,
  onDelete,
}: {
  leaves: Leave[]
  onEditRemarks: (leave: Leave) => void
  onDelete: (leave: Leave) => void
}) {
  const navigate = useNavigate()

  return (
    <div className="cu-scroll mt-5 hidden w-full overflow-x-auto md:block">
      <table className="w-full min-w-[860px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="bg-[#EDEDED]">
            {['Applied on', 'Name', 'Type', 'Purpose', 'Remarks', 'Action'].map((head) => (
              <th
                key={head}
                className="border border-cu-border px-3 py-3 font-bold text-cu-text"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="bg-white align-middle">
              <td className="whitespace-nowrap border border-cu-border px-3 py-3">
                {formatDisplayDate(leave.appliedOn)}
              </td>
              <td className="border border-cu-border px-3 py-3">
                {leave.name}({leave.uid})
              </td>
              <td className="whitespace-nowrap border border-cu-border px-3 py-3">
                {typeLabel(leave.leaveType)}
              </td>
              <td className="border border-cu-border px-3 py-3">{leave.purpose}</td>
              <td className="border border-cu-border px-3 py-3">
                <button
                  type="button"
                  onClick={() => onEditRemarks(leave)}
                  title="Click to edit remark"
                  className="text-left text-cu-remarks hover:underline"
                >
                  {leave.remarks}
                </button>
              </td>
              <td className="border border-cu-border px-3 py-3">
                <ActionButtons
                  leave={leave}
                  onDelete={() => onDelete(leave)}
                  onView={() => navigate(`/leave/details/${leave.id}`)}
                  onEdit={() => navigate(`/leave/edit/${leave.id}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* -- shared ------------------------------------------------------------ */

function ActionButtons({
  leave,
  onView,
  onEdit,
  onDelete,
}: {
  leave: Leave
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const applied = formatDisplayDate(leave.appliedOn)
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        title="View"
        aria-label={`View leave applied on ${applied}`}
        onClick={onView}
        className="rounded p-2 text-cu-blue transition hover:bg-cu-blue/10 md:p-1.5"
      >
        <EyeIcon size={19} />
      </button>
      <button
        type="button"
        title="Edit"
        aria-label={`Edit leave applied on ${applied}`}
        onClick={onEdit}
        className="rounded p-2 text-cu-dark transition hover:bg-cu-dark/10 md:p-1.5"
      >
        <PencilIcon size={19} />
      </button>
      <button
        type="button"
        title="Delete"
        aria-label={`Delete leave applied on ${applied}`}
        onClick={onDelete}
        className="rounded p-2 text-cu-red transition hover:bg-cu-red/10 md:p-1.5"
      >
        <TrashIcon size={19} />
      </button>
    </div>
  )
}
