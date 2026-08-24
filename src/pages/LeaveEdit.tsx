import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LeaveForm from '../components/LeaveForm'
import PortalShell from '../components/PortalShell'
import { STATUS_OPTIONS } from '../types/leave'
import type { LeaveFormValues, LeaveStatus, LeaveType } from '../types/leave'
import { REMARK_PRESETS, statusFromRemarks } from '../components/RemarksEditor'
import * as store from '../services/storage'

export default function LeaveEdit() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  // Bumped by Cancel so the form re-hydrates from the saved record.
  const [resetKey, setResetKey] = useState(0)

  const leave = useMemo(() => store.getLeaveById(id), [id])

  const [remarks, setRemarks] = useState(leave?.remarks ?? '')
  const [status, setStatus] = useState<LeaveStatus>(leave?.status ?? 'Pending')

  const initialValues: LeaveFormValues | null = useMemo(() => {
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
    // resetKey re-creates the object so the form restores its saved values.
  }, [leave, resetKey])

  if (!leave || !initialValues) {
    return (
      <PortalShell title="Edit Hostel Leave" note={null}>
        <div className="py-16 text-center">
          <p className="text-[17px] font-bold text-cu-text">Leave record not found.</p>
          <Link to="/leave" className="cu-btn mt-6">
            Back
          </Link>
        </div>
      </PortalShell>
    )
  }

  function handleSave(values: LeaveFormValues) {
    const isNight = values.leaveType === 'NightOut/Leave'
    store.updateLeave(id, {
      leaveType: values.leaveType as LeaveType,
      parentsNo: isNight ? values.parentsNo : undefined,
      contactNo: isNight ? values.contactNo : undefined,
      fromDate: values.fromDate,
      toDate: values.toDate,
      fromTime: values.fromTime,
      toTime: values.toTime,
      totalDays: values.totalDays,
      purpose: values.purpose.trim(),
      remarks: remarks.trim() || 'Pending',
      status,
    })
    navigate(`/leave/details/${id}`)
  }

  function handleCancel() {
    setRemarks(leave!.remarks)
    setStatus(leave!.status)
    setResetKey((key) => key + 1)
  }

  const presetValue = (REMARK_PRESETS as readonly string[]).includes(remarks) ? remarks : ''

  return (
    <PortalShell title="Edit Hostel Leave">
      <LeaveForm
        mode="edit"
        initialValues={initialValues}
        submitLabel="Save"
        onSubmit={handleSave}
        onCancel={handleCancel}
        extraRows={
          <div className="md:grid md:grid-cols-2 md:gap-x-8">
            <div className="cu-field">
              <label htmlFor="editStatus" className="cu-label mb-2.5 md:mb-2">
                Status:
              </label>
              <select
                id="editStatus"
                value={status}
                onChange={(event) => setStatus(event.target.value as LeaveStatus)}
                className="cu-input"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="cu-field">
              <label htmlFor="editRemarks" className="cu-label mb-2.5 md:mb-2">
                Remarks:
              </label>
              <select
                value={presetValue}
                onChange={(event) => {
                  if (!event.target.value) return
                  setRemarks(event.target.value)
                  setStatus(statusFromRemarks(event.target.value))
                }}
                className="cu-input mb-3"
                aria-label="Choose a preset remark"
              >
                <option value="">Custom remark…</option>
                {REMARK_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
              <textarea
                id="editRemarks"
                rows={2}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Enter remark"
                className="cu-textarea"
              />
            </div>
          </div>
        }
        actionsSlot={
          <Link to={`/leave/details/${id}`} className="cu-btn-neutral">
            Back
          </Link>
        }
      />
    </PortalShell>
  )
}
