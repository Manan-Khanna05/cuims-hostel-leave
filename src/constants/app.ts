/**
 * Single source of truth for the portal's configurable values.
 * Nothing below should be duplicated inline anywhere else in the app.
 */

/* -- Day Out window ---------------------------------------------------- */

export const DAY_OUT_START = '16:30'
export const DAY_OUT_END = '19:00'

/** Helper text shown under the leave-type select when Day Out is picked. */
export const DAY_OUT_NOTE = 'Timing for Day out is 4:30 to 7:00pm'

/* -- Storage ----------------------------------------------------------- */

export const STORAGE_KEY = 'cuims_hostel_leaves'
export const SEED_FLAG = 'cuims_hostel_leaves_seeded'

/* -- Student profile --------------------------------------------------- */

export const STUDENT = {
  name: 'MANAN KHANNA',
  uid: '25BCF10015',
  parentsNo: '8696613100',
  contactNo: '9057294050',
} as const

/* -- Copy shown on the page ------------------------------------------- */

export const PAGE_NOTE =
  '*Note: Once Leave is REJECTED, You Can Reapply The Next Day.'

export const NIGHT_OUT_WARNING =
  'Kindly Update your Father or Mother Contact number at room no:208(Block 01) before applying leave.if given number is not correct'

export const CONFIRM_TEXT =
  'I confirm that I have informed my parents about my night out/day out leave, and I acknowledge that I am fully responsible for myself during this time.'

export const SYSTEM_CANCEL_REMARK =
  'System Cancel the request due to you cannot check out on the apply date'
