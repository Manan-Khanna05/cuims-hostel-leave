import type { ReactNode } from 'react'
import type { Leave } from '../types/leave'
import { typeLabel } from '../types/leave'
import { formatDisplayDate } from '../utils/date'

type Props = {
  leaves: Leave[]
  /** Tapping a remark opens the editor. Omitted on read-only surfaces. */
  onEditRemarks?: (leave: Leave) => void
}

/**
 * The Previous Leave list exactly as the portal shows it — no Action column.
 * View / Edit / Delete live in the help (?) panel instead.
 */
export default function PreviousLeave({ leaves, onEditRemarks }: Props) {
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
              <MobileLeaveCard key={leave.id} leave={leave} onEditRemarks={onEditRemarks} />
            ))}
          </div>

          {/* Tablet and up: the real table */}
          <DesktopLeaveTable leaves={leaves} onEditRemarks={onEditRemarks} />
        </>
      )}
    </section>
  )
}

/* -- mobile ------------------------------------------------------------ */

function Row({ label, children }: { label: string; children: ReactNode }) {
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
}: {
  leave: Leave
  onEditRemarks?: (leave: Leave) => void
}) {
  return (
    <article className="mb-4 overflow-hidden rounded-[3px] border border-[#E4E4EA] bg-white">
      <Row label="APPLIED ON">{formatDisplayDate(leave.appliedOn)}</Row>
      <Row label="NAME">
        {leave.name}({leave.uid})
      </Row>
      <Row label="TYPE">{typeLabel(leave.leaveType)}</Row>
      <Row label="PURPOSE">{leave.purpose}</Row>
      <Row label="REMARKS">
        <Remark leave={leave} onEditRemarks={onEditRemarks} />
      </Row>
    </article>
  )
}

/* -- desktop ----------------------------------------------------------- */

function DesktopLeaveTable({
  leaves,
  onEditRemarks,
}: {
  leaves: Leave[]
  onEditRemarks?: (leave: Leave) => void
}) {
  return (
    <div className="cu-scroll mt-5 hidden w-full overflow-x-auto md:block">
      <table className="w-full min-w-[760px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="bg-[#EDEDED]">
            {['Applied on', 'Name', 'Type', 'Purpose', 'Remarks'].map((head) => (
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
                <Remark leave={leave} onEditRemarks={onEditRemarks} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* -- shared ------------------------------------------------------------ */

/** Blue remark text; tappable when an editor handler is supplied. */
function Remark({
  leave,
  onEditRemarks,
}: {
  leave: Leave
  onEditRemarks?: (leave: Leave) => void
}) {
  if (!onEditRemarks) {
    return <span className="text-cu-remarks">{leave.remarks}</span>
  }
  return (
    <button
      type="button"
      onClick={() => onEditRemarks(leave)}
      title="Click to edit remark"
      className="text-left text-cu-remarks hover:underline"
    >
      {leave.remarks}
    </button>
  )
}
