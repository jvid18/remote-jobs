import { useShallow } from 'zustand/react/shallow'

import { type FavoriteSnapshot, useFavoritesStore } from '../favorites-store'

export function useIsFavorite(id: string): boolean {
  return useFavoritesStore(state => id in state.byId)
}

export function useFavoriteCount(): number {
  return useFavoritesStore(state => Object.keys(state.byId).length)
}

export function useFavoriteSnapshots(): FavoriteSnapshot[] {
  return useFavoritesStore(useShallow(state => Object.values(state.byId)))
}

export function useToggleFavorite() {
  return useFavoritesStore(state => state.toggle)
}

export function useRemoveFavorite() {
  return useFavoritesStore(state => state.remove)
}
