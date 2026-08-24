import { PROFILE_KEY, STUDENT } from '../constants/app'
import type { Leave } from '../types/leave'
import { getLeaves, saveLeaves } from './storage'

export interface StudentProfile {
  name: string
  uid: string
  parentsNo: string
  contactNo: string
}

export const DEFAULT_PROFILE: StudentProfile = {
  name: STUDENT.name,
  uid: STUDENT.uid,
  parentsNo: STUDENT.parentsNo,
  contactNo: STUDENT.contactNo,
}

export function getProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...DEFAULT_PROFILE }
    const parsed = JSON.parse(raw) as Partial<StudentProfile>
    // Merge so a partially-written profile still yields every field.
    return { ...DEFAULT_PROFILE, ...parsed }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

/**
 * Persists the profile and rewrites the identity carried on every stored
 * leave, so the Previous Leave list shows one consistent student throughout.
 */
export function saveProfile(profile: StudentProfile): StudentProfile {
  const next: StudentProfile = {
    name: profile.name.trim() || DEFAULT_PROFILE.name,
    uid: profile.uid.trim() || DEFAULT_PROFILE.uid,
    parentsNo: profile.parentsNo.trim(),
    contactNo: profile.contactNo.trim(),
  }

  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — the in-memory value is still returned */
  }

  const relabelled: Leave[] = getLeaves().map((leave) => ({
    ...leave,
    name: next.name,
    uid: next.uid,
  }))
  saveLeaves(relabelled)

  return next
}
