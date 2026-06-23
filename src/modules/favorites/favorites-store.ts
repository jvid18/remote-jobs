import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { JobType } from '@/shared/lib/job-types'

// Input accepted by the store; kept inside the module so favorites never
// depends on the jobs module's domain type.
export type FavoriteInput = {
  id: string
  title: string
  companyName: string
  companyLogoUrl: string | null
  category: string
  location: string
  type: JobType | null
  publishedAt: Date
}

export type FavoriteSnapshot = {
  id: string
  title: string
  companyName: string
  companyLogoUrl: string | null
  category: string
  location: string
  type: JobType | null
  publishedAt: string // ISO 8601
}

type FavoritesState = {
  byId: Record<string, FavoriteSnapshot>
  toggle: (job: FavoriteInput) => void
  remove: (id: string) => void
}

function toSnapshot(job: FavoriteInput): FavoriteSnapshot {
  return {
    id: job.id,
    title: job.title,
    companyName: job.companyName,
    companyLogoUrl: job.companyLogoUrl,
    category: job.category,
    location: job.location,
    type: job.type,
    publishedAt: job.publishedAt.toISOString(),
  }
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      byId: {},
      toggle: job => {
        const byId = { ...get().byId }
        if (byId[job.id]) delete byId[job.id]
        else byId[job.id] = toSnapshot(job)
        set({ byId })
      },
      remove: id => {
        const byId = { ...get().byId }
        delete byId[id]
        set({ byId })
      },
    }),
    { name: 'remotejobs:favorites', storage: createJSONStorage(() => AsyncStorage) },
  ),
)
