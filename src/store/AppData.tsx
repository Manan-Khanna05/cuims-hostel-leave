import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as profileStore from '../services/profile'
import type { StudentProfile } from '../services/profile'
import * as store from '../services/storage'
import type { Leave, LeaveStatus } from '../types/leave'

type AppData = {
  profile: StudentProfile
  saveProfile: (next: StudentProfile) => void
  leaves: Leave[]
  refresh: () => void
  addLeave: (leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRemarks: (id: string, remarks: string, status: LeaveStatus) => void
  removeLeave: (id: string) => void
}

const Ctx = createContext<AppData | null>(null)

/**
 * Shares the leave list and student profile across the tree. The help panel
 * lives in the page shell but mutates data the Previous Leave list renders,
 * so both sides need to read from one place.
 */
export function AppDataProvider({ children }: { children: ReactNode }) {
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [profile, setProfile] = useState<StudentProfile>(profileStore.DEFAULT_PROFILE)

  const refresh = useCallback(() => setLeaves(store.getLeaves()), [])

  useEffect(() => {
    setProfile(profileStore.getProfile())
    refresh()
  }, [refresh])

  const saveProfile = useCallback(
    (next: StudentProfile) => {
      // Rewrites the identity on every stored leave, then re-reads the list.
      setProfile(profileStore.saveProfile(next))
      refresh()
    },
    [refresh],
  )

  const addLeave = useCallback<AppData['addLeave']>(
    (leave) => {
      store.addLeave(leave)
      refresh()
    },
    [refresh],
  )

  const updateRemarks = useCallback<AppData['updateRemarks']>(
    (id, remarks, status) => {
      store.updateLeave(id, { remarks, status })
      refresh()
    },
    [refresh],
  )

  const removeLeave = useCallback<AppData['removeLeave']>(
    (id) => {
      store.deleteLeave(id)
      refresh()
    },
    [refresh],
  )

  const value = useMemo(
    () => ({ profile, saveProfile, leaves, refresh, addLeave, updateRemarks, removeLeave }),
    [profile, saveProfile, leaves, refresh, addLeave, updateRemarks, removeLeave],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppData(): AppData {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
