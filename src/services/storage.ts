import type { Leave, LeaveStatus } from '../types/leave'
import { SEED_FLAG, STORAGE_KEY, STUDENT, SYSTEM_CANCEL_REMARK } from '../constants/app'

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `lv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function read(): Leave[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Leave[]) : []
  } catch {
    return []
  }
}

function write(leaves: Leave[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves))
  } catch {
    /* storage unavailable — the in-memory list still reflects the change */
  }
}

/** Newest applications first, matching the portal's ordering. */
function sortLeaves(leaves: Leave[]): Leave[] {
  return [...leaves].sort((a, b) => {
    const byApplied = b.appliedOn.localeCompare(a.appliedOn)
    return byApplied !== 0 ? byApplied : b.createdAt.localeCompare(a.createdAt)
  })
}

export function saveLeaves(leaves: Leave[]): void {
  write(leaves)
}

export function getLeaves(): Leave[] {
  ensureSeeded()
  return sortLeaves(read())
}

export function getLeaveById(id: string): Leave | undefined {
  return getLeaves().find((leave) => leave.id === id)
}

export function addLeave(leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>): Leave {
  ensureSeeded()
  const now = new Date().toISOString()
  const record: Leave = { ...leave, id: createId(), createdAt: now, updatedAt: now }
  write([record, ...read()])
  return record
}

export function updateLeave(id: string, patch: Partial<Leave>): Leave | undefined {
  ensureSeeded()
  const leaves = read()
  const index = leaves.findIndex((leave) => leave.id === id)
  if (index === -1) return undefined
  const updated: Leave = {
    ...leaves[index],
    ...patch,
    id: leaves[index].id,
    createdAt: leaves[index].createdAt,
    updatedAt: new Date().toISOString(),
  }
  leaves[index] = updated
  write(leaves)
  return updated
}

export function deleteLeave(id: string): void {
  ensureSeeded()
  write(read().filter((leave) => leave.id !== id))
}

/* -- seed data --------------------------------------------------------- */

type Seed = {
  appliedOn: string
  leaveType: Leave['leaveType']
  purpose: string
  remarks: string
  status: LeaveStatus
  fromTime: string
  toTime: string
}

const SEEDS: Seed[] = [
  { appliedOn: '2026-08-25', leaveType: 'NightOut/Leave', purpose: 'hlo', remarks: 'Cancelled', status: 'Cancelled', fromTime: '18:00', toTime: '09:00' },
  { appliedOn: '2026-08-24', leaveType: 'Day Out', purpose: 'Work', remarks: 'Approved', status: 'Approved', fromTime: '16:30', toTime: '19:00' },
  { appliedOn: '2026-08-22', leaveType: 'NightOut/Leave', purpose: 'Work', remarks: SYSTEM_CANCEL_REMARK, status: 'Cancelled', fromTime: '18:00', toTime: '09:00' },
  { appliedOn: '2026-08-20', leaveType: 'NightOut/Leave', purpose: 'Work', remarks: SYSTEM_CANCEL_REMARK, status: 'Cancelled', fromTime: '19:00', toTime: '10:00' },
  { appliedOn: '2026-08-19', leaveType: 'Day Out', purpose: 'Shopping', remarks: SYSTEM_CANCEL_REMARK, status: 'Cancelled', fromTime: '16:30', toTime: '19:00' },
  { appliedOn: '2026-08-14', leaveType: 'Day Out', purpose: 'Shopping', remarks: 'Approved', status: 'Approved', fromTime: '16:30', toTime: '18:30' },
  { appliedOn: '2026-08-12', leaveType: 'Day Out', purpose: 'Shopping', remarks: 'Approved', status: 'Approved', fromTime: '17:00', toTime: '19:00' },
  { appliedOn: '2026-08-07', leaveType: 'NightOut/Leave', purpose: 'Shopping', remarks: 'Approved', status: 'Approved', fromTime: '17:30', toTime: '11:00' },
  { appliedOn: '2026-08-06', leaveType: 'Day Out', purpose: 'Shopping', remarks: 'Approved', status: 'Approved', fromTime: '16:30', toTime: '19:00' },
  { appliedOn: '2026-08-05', leaveType: 'Day Out', purpose: 'Shopping', remarks: 'Approved', status: 'Approved', fromTime: '16:45', toTime: '19:00' },
  { appliedOn: '2026-07-30', leaveType: 'Day Out', purpose: 'Shopping', remarks: 'Approved', status: 'Approved', fromTime: '16:30', toTime: '18:00' },
]

function nextDay(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  date.setDate(date.getDate() + 1)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function buildSeedLeaves(): Leave[] {
  return SEEDS.map((seed, index) => {
    const isNight = seed.leaveType === 'NightOut/Leave'
    // Anchored to the start of the applied date so that a leave submitted
    // today always sorts above a sample record carrying the same date.
    const stamp = new Date(
      `${seed.appliedOn}T00:00:${String(index).padStart(2, '0')}`,
    ).toISOString()
    return {
      id: `seed_${seed.appliedOn}_${index}`,
      appliedOn: seed.appliedOn,
      name: STUDENT.name,
      uid: STUDENT.uid,
      leaveType: seed.leaveType,
      parentsNo: isNight ? STUDENT.parentsNo : undefined,
      contactNo: isNight ? STUDENT.contactNo : undefined,
      fromDate: seed.appliedOn,
      toDate: isNight ? nextDay(seed.appliedOn) : seed.appliedOn,
      fromTime: seed.fromTime,
      toTime: seed.toTime,
      totalDays: isNight ? 2 : 1,
      purpose: seed.purpose,
      remarks: seed.remarks,
      status: seed.status,
      createdAt: stamp,
      updatedAt: stamp,
    }
  })
}

/**
 * Seeds sample records on first run only. The flag lives under its own key so
 * that deleting every row does not bring the samples back on the next load.
 */
function ensureSeeded(): void {
  try {
    if (localStorage.getItem(SEED_FLAG)) return
    if (read().length === 0) write(buildSeedLeaves())
    localStorage.setItem(SEED_FLAG, '1')
  } catch {
    /* ignore */
  }
}
