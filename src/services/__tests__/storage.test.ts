import { describe, it, expect, beforeEach } from 'vitest'
import {
  addLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  saveLeaves,
} from '../../services/storage'
import type { Leave, LeaveStatus, LeaveType } from '../../types/leave'
import { STORAGE_KEY, SEED_FLAG } from '../../constants/app'

/**
 * Helper to reset localStorage before each test.
 * We also set the seed‑flag so that `ensureSeeded()` does not inject
 * the sample records – the tests need a clean slate.
 */
beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(SEED_FLAG, '1')
})

function makeLeave(overrides?: Partial<Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>>): Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> {
  const base: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> = {
    appliedOn: '2023-01-01',
    name: 'Student A',
    uid: 'U001',
    leaveType: 'Day Out' as LeaveType,
    parentsNo: undefined,
    contactNo: undefined,
    fromDate: '2023-01-01',
    toDate: '2023-01-01',
    fromTime: '10:00',
    toTime: '12:00',
    totalDays: 1,
    purpose: 'Test purpose',
    remarks: '',
    status: 'Pending' as LeaveStatus,
  }
  return { ...base, ...overrides }
}

describe('storage service', () => {
  it('adds a leave and retrieves it', () => {
    const leave = makeLeave()
    const added = addLeave(leave)

    expect(added.id).toBeDefined()
    expect(added.createdAt).toBeDefined()
    expect(added.updatedAt).toBeDefined()

    const all = getLeaves()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe(added.id)
  })

  it('returns leaves sorted newest‑first by appliedOn then createdAt', () => {
    // two leaves with different appliedOn dates
    const older = makeLeave({ appliedOn: '2023-01-01' })
    const newer = makeLeave({ appliedOn: '2023-02-01' })
    addLeave(older)
    addLeave(newer)

    const sorted = getLeaves()
    expect(sorted).toHaveLength(2)
    expect(sorted[0].appliedOn).toBe('2023-02-01')
    expect(sorted[1].appliedOn).toBe('2023-01-01')
  })

  it('updates a leave and changes updatedAt', () => {
    const leave = makeLeave()
    const added = addLeave(leave)

    const beforeUpdate = added.updatedAt
    const patched = updateLeave(added.id, { purpose: 'Updated purpose' })
    expect(patched).toBeDefined()
    expect(patched?.purpose).toBe('Updated purpose')
    expect(patched?.updatedAt).not.toBe(beforeUpdate)

    const fetched = getLeaveById(added.id)
    expect(fetched?.purpose).toBe('Updated purpose')
  })

  it('deletes a leave', () => {
    const a = addLeave(makeLeave({ appliedOn: '2023-01-01' }))
    const b = addLeave(makeLeave({ appliedOn: '2023-02-01' }))

    deleteLeave(a.id)

    const remaining = getLeaves()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe(b.id)
  })

  it('saves and reads raw leaves array without seeding', () => {
    const custom: Leave = {
      ...makeLeave(),
      id: 'custom-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveLeaves([custom])

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Leave[]
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('custom-id')
  })
})
