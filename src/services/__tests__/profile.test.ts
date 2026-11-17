import { describe, it, expect, beforeEach } from 'vitest'
import { getProfile, saveProfile, DEFAULT_PROFILE } from '../../services/profile'
import { PROFILE_KEY, SEED_FLAG } from '../../constants/app'
import type { StudentProfile } from '../../services/profile'

/**
 * Reset localStorage before each test.
 * The seed flag is set to avoid the automatic seeding of leave records,
 * which is unrelated to profile tests.
 */
beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(SEED_FLAG, '1')
})

describe('profile service', () => {
  it('returns the default profile when nothing is stored', () => {
    const profile = getProfile()
    expect(profile).toEqual(DEFAULT_PROFILE)
  })

  it('persists a profile and returns the trimmed values', () => {
    const input: StudentProfile = {
      name: '  New Name  ',
      uid: '  U999  ',
      parentsNo: '1234567890',
      contactNo: '0987654321',
    }

    const saved = saveProfile(input)

    // Values should be trimmed
    expect(saved.name).toBe('New Name')
    expect(saved.uid).toBe('U999')
    expect(saved.parentsNo).toBe('1234567890')
    expect(saved.contactNo).toBe('0987654321')

    // Verify that the raw storage contains the same data
    const raw = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? '{}')
    expect(raw).toMatchObject({
      name: 'New Name',
      uid: 'U999',
      parentsNo: '1234567890',
      contactNo: '0987654321',
    })
  })

  it('updates stored leaves with the new name and uid', () => {
    // First, create a dummy leave record directly in storage
    const dummyLeave = {
      id: 'dummy',
      appliedOn: '2023-03-01',
      name: 'Old Name',
      uid: 'OLDUID',
      leaveType: 'Day Out' as const,
      parentsNo: undefined,
      contactNo: undefined,
      fromDate: '2023-03-01',
      toDate: '2023-03-01',
      fromTime: '10:00',
      toTime: '12:00',
      totalDays: 1,
      purpose: 'Dummy',
      remarks: '',
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    // Store the dummy leave (bypassing the service to keep the test focused)
    localStorage.setItem('cuims_hostel_leaves', JSON.stringify([dummyLeave]))

    // Save a new profile – this should rewrite the name/uid on the stored leave
    saveProfile({
      name: 'New Student',
      uid: 'NEWUID',
      parentsNo: '',
      contactNo: '',
    })

    const storedLeaves = JSON.parse(localStorage.getItem('cuims_hostel_leaves') ?? '[]')
    expect(storedLeaves).toHaveLength(1)
    expect(storedLeaves[0].name).toBe('New Student')
    expect(storedLeaves[0].uid).toBe('NEWUID')
  })
})
