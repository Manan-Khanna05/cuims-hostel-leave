export type LeaveType = 'Day Out' | 'NightOut/Leave'

export type LeaveStatus = 'Approved' | 'Cancelled' | 'Rejected' | 'Pending'

export interface Leave {
  id: string
  appliedOn: string
  name: string
  uid: string

  leaveType: LeaveType

  parentsNo?: string
  contactNo?: string

  fromDate: string
  toDate: string

  fromTime: string
  toTime: string

  totalDays: number

  purpose: string

  remarks: string

  status: LeaveStatus

  createdAt: string
  updatedAt: string
}

/** Values held by the form while the user is filling it in. */
export interface LeaveFormValues {
  leaveType: '' | LeaveType
  parentsNo: string
  contactNo: string
  fromDate: string
  toDate: string
  fromTime: string
  toTime: string
  totalDays: number
  purpose: string
  confirmed: boolean
}

export type LeaveFormErrors = Partial<Record<keyof LeaveFormValues, string>>

export const STATUS_OPTIONS: LeaveStatus[] = [
  'Approved',
  'Cancelled',
  'Rejected',
  'Pending',
]

/** Label shown in the Previous Leave list for each stored type. */
export function typeLabel(type: LeaveType): string {
  return type === 'NightOut/Leave' ? 'Night Out Leave' : 'Day Out'
}
