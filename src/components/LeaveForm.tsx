import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  CONFIRM_TEXT,
  DAY_OUT_NOTE,
  NIGHT_OUT_WARNING,
  STUDENT,
} from '../constants/app'
import type { LeaveFormErrors, LeaveFormValues, LeaveType } from '../types/leave'
import { DAY_OUT_WINDOW, calcTotalDays, toMinutes } from '../utils/date'
import { ChevronDownIcon } from './icons'

export type LeaveFormMode = 'create' | 'edit' | 'view'

type Props = {
  mode: LeaveFormMode
  initialValues: LeaveFormValues
  onSubmit?: (values: LeaveFormValues) => void
  onCancel?: () => void
  submitLabel?: string
  cancelLabel?: string
  actionsSlot?: ReactNode
  /** Extra readonly blocks appended after Purpose (details page). */
  extraRows?: ReactNode
}

export const EMPTY_FORM: LeaveFormValues = {
  leaveType: '',
  parentsNo: '',
  contactNo: '',
  fromDate: '',
  toDate: '',
  fromTime: '',
  toTime: '',
  totalDays: 0,
  purpose: '',
  confirmed: false,
}

const PHONE_RE = /^\d{10}$/

export function validateLeave(values: LeaveFormValues): LeaveFormErrors {
  const errors: LeaveFormErrors = {}

  if (!values.leaveType) errors.leaveType = 'Please select a leave type.'

  const isNight = values.leaveType === 'NightOut/Leave'

  if (isNight) {
    if (!values.parentsNo.trim()) errors.parentsNo = 'Parents number is required.'
    else if (!PHONE_RE.test(values.parentsNo.trim()))
      errors.parentsNo = 'Enter a valid 10 digit number.'

    if (!values.contactNo.trim()) errors.contactNo = 'Contact number is required.'
    else if (!PHONE_RE.test(values.contactNo.trim()))
      errors.contactNo = 'Enter a valid 10 digit number.'
  }

  if (!values.fromDate) errors.fromDate = 'From date is required.'
  if (!values.toDate) errors.toDate = 'To date is required.'
  if (values.fromDate && values.toDate && values.toDate < values.fromDate)
    errors.toDate = 'To date cannot be before the from date.'

  if (!values.fromTime) errors.fromTime = 'From time is required.'
  if (!values.toTime) errors.toTime = 'To time is required.'

  const from = toMinutes(values.fromTime)
  const to = toMinutes(values.toTime)

  if (values.leaveType === 'Day Out') {
    if (from !== null && (from < DAY_OUT_WINDOW.start || from > DAY_OUT_WINDOW.end))
      errors.fromTime = 'Day Out starts between 4:30 PM and 7:00 PM.'
    if (to !== null && (to < DAY_OUT_WINDOW.start || to > DAY_OUT_WINDOW.end))
      errors.toTime = 'Day Out must end by 7:00 PM.'
    if (from !== null && to !== null && !errors.fromTime && !errors.toTime && to <= from)
      errors.toTime = 'To time must be after the from time.'
  } else if (isNight) {
    const sameDay = Boolean(values.fromDate) && values.fromDate === values.toDate
    if (sameDay && from !== null && to !== null && to <= from)
      errors.toTime = 'To time must be after the from time on the same day.'
  }

  if (!values.purpose.trim()) errors.purpose = 'Purpose of leave is required.'
  if (!values.confirmed) errors.confirmed = 'You must confirm before submitting the leave.'

  return errors
}

export default function LeaveForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  actionsSlot,
  extraRows,
}: Props) {
  const readOnly = mode === 'view'
  const [values, setValues] = useState<LeaveFormValues>(initialValues)
  const [errors, setErrors] = useState<LeaveFormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setValues(initialValues)
    setErrors({})
    setSubmitted(false)
  }, [initialValues])

  // Total days is always derived from the two dates.
  useEffect(() => {
    setValues((prev) => {
      const total = calcTotalDays(prev.fromDate, prev.toDate)
      return prev.totalDays === total ? prev : { ...prev, totalDays: total }
    })
  }, [values.fromDate, values.toDate])

  // Re-validate on every change once the user has tried to submit.
  useEffect(() => {
    if (submitted) setErrors(validateLeave(values))
  }, [values, submitted])

  const isNight = values.leaveType === 'NightOut/Leave'
  const isDay = values.leaveType === 'Day Out'
  const hasType = values.leaveType !== ''

  function set<K extends keyof LeaveFormValues>(key: K, value: LeaveFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleTypeChange(raw: string) {
    const leaveType = (raw || '') as '' | LeaveType
    setValues((prev) => ({
      ...prev,
      leaveType,
      // Night Out carries the student's numbers; Day Out drops them entirely.
      parentsNo: leaveType === 'NightOut/Leave' ? prev.parentsNo || STUDENT.parentsNo : '',
      contactNo: leaveType === 'NightOut/Leave' ? prev.contactNo || STUDENT.contactNo : '',
    }))
    setErrors({})
    setSubmitted(false)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)
    const next = validateLeave(values)
    setErrors(next)
    if (Object.keys(next).length > 0) {
      window.requestAnimationFrame(() => {
        document
          .querySelector('[data-invalid="true"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return
    }
    onSubmit?.(values)
  }

  const err = (key: keyof LeaveFormValues) => (submitted ? errors[key] : undefined)
  const flag = (key: keyof LeaveFormValues) => (err(key) ? 'true' : undefined)
  const cls = (key: keyof LeaveFormValues, base = 'cu-input') =>
    [base, readOnly ? 'cu-input-readonly' : '', err(key) ? 'cu-input-error' : '']
      .filter(Boolean)
      .join(' ')

  /** Label above input — the layout used on phones for every field. */
  const field = (
    key: keyof LeaveFormValues,
    label: string,
    control: ReactNode,
    extra?: ReactNode,
  ) => (
    <div className="cu-field" data-invalid={flag(key)}>
      <label htmlFor={key} className="cu-label mb-2.5 md:mb-2">
        {label}
      </label>
      {control}
      {err(key) && <span className="cu-error">{errors[key]}</span>}
      {extra}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {/* Type of Leave --------------------------------------------------- */}
      {field(
        'leaveType',
        'Type of Leave:',
        <div className="relative">
          <select
            id="leaveType"
            value={values.leaveType}
            disabled={readOnly}
            onChange={(event) => handleTypeChange(event.target.value)}
            className={[cls('leaveType', 'cu-select'), hasType ? '' : 'text-[#6b6b6b]']
              .filter(Boolean)
              .join(' ')}
          >
            <option value="">Select Type</option>
            <option value="Day Out">Day Out</option>
            <option value="NightOut/Leave">NightOut/Leave</option>
          </select>
          <ChevronDownIcon
            size={20}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666]"
          />
        </div>,
        isDay ? <p className="cu-note mt-2.5">{DAY_OUT_NOTE}</p> : null,
      )}

      {/*
        Keyed on the leave type so switching remounts the block and replays the
        fade. A plain keyed motion.div avoids AnimatePresence's exit handshake,
        which could strand the outgoing fields and hide the Night Out inputs.
      */}
      <motion.div
        key={values.leaveType || 'none'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
      >
          {/* Night Out contact numbers --------------------------------- */}
          {isNight && (
            <div className="md:grid md:grid-cols-2 md:gap-x-8">
              {field(
                'parentsNo',
                'Parents No:',
                <input
                  id="parentsNo"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={values.parentsNo}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={(event) =>
                    set('parentsNo', event.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  className={cls('parentsNo')}
                />,
              )}

              {field(
                'contactNo',
                'Contact No:',
                <input
                  id="contactNo"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={values.contactNo}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={(event) =>
                    set('contactNo', event.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  className={cls('contactNo')}
                />,
              )}

              <p className="cu-note mb-7 md:col-span-2 md:max-w-[340px]">
                {NIGHT_OUT_WARNING}
              </p>
            </div>
          )}

          {/*
            DOM order is the phone order from the screenshot:
            From Date -> Time From -> To Date -> Time To.
            On >=md the four fields are placed explicitly so the dates sit on
            one row and the times on the row beneath, matching the desktop page.
          */}
          <div className="md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-6">
            <div className="md:col-start-1 md:row-start-1">
              {field(
                'fromDate',
                'From Date for Leave:',
                <input
                  id="fromDate"
                  type="date"
                  value={values.fromDate}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={(event) => set('fromDate', event.target.value)}
                  className={cls('fromDate')}
                />,
              )}
            </div>

            <div className="md:col-start-1 md:row-start-2">
              {field(
                'fromTime',
                'Time From:(hh:mm AM/PM eg:11:00 AM/PM)',
                <input
                  id="fromTime"
                  type="time"
                  value={values.fromTime}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={(event) => set('fromTime', event.target.value)}
                  className={cls('fromTime')}
                />,
              )}
            </div>

            <div className="md:col-start-2 md:row-start-1">
              {field(
                'toDate',
                'To Date for Leave:',
                <input
                  id="toDate"
                  type="date"
                  value={values.toDate}
                  min={values.fromDate || undefined}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={(event) => set('toDate', event.target.value)}
                  className={cls('toDate')}
                />,
              )}
            </div>

            <div className="md:col-start-2 md:row-start-2">
              {field(
                'toTime',
                'Time To:(hh:mm AM/PM eg:11:00 AM/PM)',
                <input
                  id="toTime"
                  type="time"
                  value={values.toTime}
                  readOnly={readOnly}
                  disabled={readOnly}
                  onChange={(event) => set('toTime', event.target.value)}
                  className={cls('toTime')}
                />,
              )}
            </div>
          </div>

          <div className="md:grid md:grid-cols-2 md:gap-x-8">
            <div className="cu-field">
              <label htmlFor="totalDays" className="cu-label mb-2.5 md:mb-2">
                Totals No. of Days:
              </label>
              <input
                id="totalDays"
                type="text"
                readOnly
                value={values.totalDays > 0 ? String(values.totalDays) : ''}
                className="cu-input cu-input-readonly"
              />
            </div>

            {field(
              'purpose',
              'Purpose of Leave:',
              <textarea
                id="purpose"
                rows={2}
                placeholder="Enter purpose"
                value={values.purpose}
                readOnly={readOnly}
                disabled={readOnly}
                onChange={(event) => set('purpose', event.target.value)}
                className={cls('purpose', 'cu-textarea')}
              />,
            )}
          </div>
      </motion.div>

      {extraRows}

      {/* Confirmation ---------------------------------------------------- */}
      <div className="mb-6 mt-1" data-invalid={flag('confirmed')}>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={values.confirmed}
            disabled={readOnly}
            onChange={(event) => set('confirmed', event.target.checked)}
            className="mt-1 h-[19px] w-[19px] shrink-0 accent-cu-blue"
          />
          <span className="text-[16px] font-bold leading-[1.45] text-cu-text md:text-[15px]">
            {CONFIRM_TEXT}
          </span>
        </label>
        {err('confirmed') && <span className="cu-error">{errors.confirmed}</span>}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        {readOnly ? (
          actionsSlot
        ) : (
          <>
            <button type="submit" className="cu-btn">
              {submitLabel}
            </button>
            <button type="button" className="cu-btn" onClick={onCancel}>
              {cancelLabel}
            </button>
            {actionsSlot}
          </>
        )}
      </div>
    </form>
  )
}
