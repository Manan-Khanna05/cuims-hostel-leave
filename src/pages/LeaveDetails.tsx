import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LeaveForm from '../components/LeaveForm'
import PortalShell from '../components/PortalShell'
import { ArrowLeftIcon, PrinterIcon } from '../components/icons'
import * as store from '../services/storage'
import type { LeaveFormValues } from '../types/leave'
import { typeLabel } from '../types/leave'
import { formatDisplayDate, formatDisplayTime } from '../utils/date'

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="cu-field">
      <span className="cu-label mb-2.5 md:mb-2">{label}</span>
      <input readOnly value={value} className="cu-input cu-input-readonly" />
    </div>
  )
}

export default function LeaveDetails() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const leave = useMemo(() => store.getLeaveById(id), [id])

  const values: LeaveFormValues | null = useMemo(() => {
    if (!leave) return null
    return {
      leaveType: leave.leaveType,
      parentsNo: leave.parentsNo ?? '',
      contactNo: leave.contactNo ?? '',
      fromDate: leave.fromDate,
      toDate: leave.toDate,
      fromTime: leave.fromTime,
      toTime: leave.toTime,
      totalDays: leave.totalDays,
      purpose: leave.purpose,
      confirmed: true,
    }
  }, [leave])

  if (!leave || !values) {
    return (
      <PortalShell title="Hostel Leave Details" note={null}>
        <div className="py-16 text-center">
          <p className="text-[17px] font-bold text-cu-text">Leave record not found.</p>
          <p className="mt-2 text-[15px] text-[#666]">
            It may have been deleted from this browser.
          </p>
          <Link to="/leave" className="cu-btn mt-6">
            Back
          </Link>
        </div>
      </PortalShell>
    )
  }

  return (
    <PortalShell
      title="Hostel Leave Details"
      note="*This is a read-only copy of your submitted leave. Use Edit to change it."
    >
      <LeaveForm
        mode="view"
        initialValues={values}
        extraRows={
          <div className="md:grid md:grid-cols-2 md:gap-x-8">
            <ReadonlyField label="Applied On:" value={formatDisplayDate(leave.appliedOn)} />
            <ReadonlyField label="Type:" value={typeLabel(leave.leaveType)} />
            <ReadonlyField label="Name:" value={leave.name} />
            <ReadonlyField label="UID:" value={leave.uid} />
            <ReadonlyField
              label="Time From (12h):"
              value={formatDisplayTime(leave.fromTime)}
            />
            <ReadonlyField
              label="Time To (12h):"
              value={formatDisplayTime(leave.toTime)}
            />
            <ReadonlyField label="Status:" value={leave.status} />
            <div className="cu-field">
              <span className="cu-label mb-2.5 md:mb-2">Remarks:</span>
              <textarea
                readOnly
                rows={2}
                value={leave.remarks}
                className="cu-textarea cu-input-readonly font-medium text-cu-accent"
              />
            </div>
          </div>
        }
        actionsSlot={
          <>
            <button
              type="button"
              className="cu-btn-neutral"
              onClick={() => navigate('/leave')}
            >
              <ArrowLeftIcon size={17} /> Back
            </button>
            <button type="button" className="cu-btn" onClick={() => window.print()}>
              <PrinterIcon size={17} /> Print
            </button>
          </>
        }
      />
    </PortalShell>
  )
}
