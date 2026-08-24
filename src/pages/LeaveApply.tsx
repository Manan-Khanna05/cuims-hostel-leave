import { useCallback, useEffect, useMemo, useState } from 'react'
import LeaveForm, { EMPTY_FORM } from '../components/LeaveForm'
import PortalShell from '../components/PortalShell'
import PreviousLeave from '../components/PreviousLeave'
import SuccessModal from '../components/SuccessModal'
import { STUDENT } from '../constants/app'
import * as store from '../services/storage'
import type { Leave, LeaveFormValues, LeaveStatus, LeaveType } from '../types/leave'
import { todayISO } from '../utils/date'

export default function LeaveApply() {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [formKey, setFormKey] = useState(0)
  const [pending, setPending] = useState<LeaveFormValues | null>(null)

  const refresh = useCallback(() => setLeaves(store.getLeaves()), [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // A fresh object identity on reset makes LeaveForm re-hydrate to blank.
  const initialValues = useMemo(() => ({ ...EMPTY_FORM }), [formKey])

  /** Submit only stages the leave — it is written when OK is pressed. */
  function handleSubmit(values: LeaveFormValues) {
    setPending(values)
  }

  function handleOk() {
    if (!pending) return
    const isNight = pending.leaveType === 'NightOut/Leave'
    store.addLeave({
      appliedOn: todayISO(),
      name: STUDENT.name,
      uid: STUDENT.uid,
      leaveType: pending.leaveType as LeaveType,
      parentsNo: isNight ? pending.parentsNo : undefined,
      contactNo: isNight ? pending.contactNo : undefined,
      fromDate: pending.fromDate,
      toDate: pending.toDate,
      fromTime: pending.fromTime,
      toTime: pending.toTime,
      totalDays: pending.totalDays,
      purpose: pending.purpose.trim(),
      remarks: 'Pending',
      status: 'Pending',
    })
    setPending(null)
    setFormKey((key) => key + 1)
    refresh()
  }

  function handleUpdateRemarks(id: string, remarks: string, status: LeaveStatus) {
    store.updateLeave(id, { remarks, status })
    refresh()
  }

  function handleDelete(id: string) {
    store.deleteLeave(id)
    refresh()
  }

  return (
    <PortalShell title="Hostel Leave Apply">
      <LeaveForm
        key={formKey}
        mode="create"
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => setFormKey((key) => key + 1)}
      />

      <PreviousLeave
        leaves={leaves}
        onUpdateRemarks={handleUpdateRemarks}
        onDelete={handleDelete}
      />

      <SuccessModal open={pending !== null} onOk={handleOk} />
    </PortalShell>
  )
}
