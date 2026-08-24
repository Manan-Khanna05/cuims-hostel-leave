import { useMemo, useState } from 'react'
import LeaveForm, { EMPTY_FORM } from '../components/LeaveForm'
import PortalShell from '../components/PortalShell'
import PreviousLeave from '../components/PreviousLeave'
import RemarksEditor from '../components/RemarksEditor'
import SuccessModal from '../components/SuccessModal'
import { useAppData } from '../store/AppData'
import type { Leave, LeaveFormValues, LeaveType } from '../types/leave'
import { todayISO } from '../utils/date'

export default function LeaveApply() {
  const { profile, leaves, addLeave, updateRemarks } = useAppData()
  const [formKey, setFormKey] = useState(0)
  const [pending, setPending] = useState<LeaveFormValues | null>(null)
  const [editingRemarks, setEditingRemarks] = useState<Leave | null>(null)

  // A fresh object identity on reset makes LeaveForm re-hydrate to blank.
  const initialValues = useMemo(() => ({ ...EMPTY_FORM }), [formKey])

  /** Submit only stages the leave — it is written when OK is pressed. */
  function handleSubmit(values: LeaveFormValues) {
    setPending(values)
  }

  function handleOk() {
    if (!pending) return
    const isNight = pending.leaveType === 'NightOut/Leave'
    addLeave({
      appliedOn: todayISO(),
      name: profile.name,
      uid: profile.uid,
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

      <PreviousLeave leaves={leaves} onEditRemarks={setEditingRemarks} />

      <RemarksEditor
        leave={editingRemarks}
        onSave={(id, remarks, status) => {
          updateRemarks(id, remarks, status)
          setEditingRemarks(null)
        }}
        onClose={() => setEditingRemarks(null)}
      />

      <SuccessModal open={pending !== null} onOk={handleOk} />
    </PortalShell>
  )
}
