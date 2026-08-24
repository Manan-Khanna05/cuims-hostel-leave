import { DAY_OUT_END, DAY_OUT_START } from '../constants/app'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

/** "2026-08-25" -> "25 Aug 2026" (the format the portal shows). */
export function formatDisplayDate(iso: string): string {
  if (!iso) return '-'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}`
}

/** Today as an ISO yyyy-mm-dd string in the user's local timezone. */
export function todayISO(): string {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

/** "16:30" -> "04:30 PM" */
export function formatDisplayTime(value: string): string {
  if (!value) return '-'
  const [hRaw, mRaw] = value.split(':')
  const h = Number(hRaw)
  if (Number.isNaN(h)) return value
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${String(hour12).padStart(2, '0')}:${mRaw ?? '00'} ${suffix}`
}

/** "16:30" -> 990 minutes past midnight. Returns null for unusable input. */
export function toMinutes(value: string): number | null {
  if (!value) return null
  const [h, m] = value.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

/**
 * Inclusive day count between two ISO dates.
 * Same date = 1, two consecutive dates = 2.
 */
export function calcTotalDays(fromDate: string, toDate: string): number {
  if (!fromDate || !toDate) return 0
  const from = new Date(`${fromDate}T00:00:00`)
  const to = new Date(`${toDate}T00:00:00`)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0
  const diff = to.getTime() - from.getTime()
  if (diff < 0) return 0
  return Math.floor(diff / 86400000) + 1
}

/** Day Out window, resolved from the configurable constants. */
export const DAY_OUT_WINDOW = {
  start: toMinutes(DAY_OUT_START) ?? 0,
  end: toMinutes(DAY_OUT_END) ?? 24 * 60,
}
