import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'

import type { FavoriteSnapshot } from '@/modules/favorites/favorites-store'
import { useFavoritesStore } from '@/modules/favorites/favorites-store'
import { FavoritesScreen } from '@/modules/favorites/ui/favorites-screen'

const snapshot = (over: Partial<FavoriteSnapshot> = {}): FavoriteSnapshot => ({
  id: '1',
  title: 'Product Designer',
  companyName: 'Spotify',
  companyLogoUrl: null,
  category: 'Design',
  location: 'Europe',
  type: 'full_time',
  publishedAt: new Date().toISOString(),
  ...over,
})

describe('FavoritesScreen', () => {
  beforeEach(() => useFavoritesStore.setState({ byId: {} }))

  it('shows the empty state and lets the user browse jobs', () => {
    const onBrowse = jest.fn()
    render(<FavoritesScreen onOpenJob={jest.fn()} onBrowse={onBrowse} />)

    expect(screen.getByText('No favorites yet')).toBeOnTheScreen()
    fireEvent.press(screen.getByRole('button', { name: 'Browse jobs' }))
    expect(onBrowse).toHaveBeenCalledTimes(1)
  })

  it('lists saved jobs and opens one', () => {
    useFavoritesStore.setState({ byId: { 1: snapshot({ id: '1', title: 'Product Designer' }) } })
    const onOpenJob = jest.fn()
    render(<FavoritesScreen onOpenJob={onOpenJob} onBrowse={jest.fn()} />)

    fireEvent.press(screen.getByRole('button', { name: 'Product Designer at Spotify' }))
    expect(onOpenJob).toHaveBeenCalledWith('1')
  })

  it('removes a job and falls back to the empty state', async () => {
    useFavoritesStore.setState({ byId: { 1: snapshot({ id: '1' }) } })
    render(<FavoritesScreen onOpenJob={jest.fn()} onBrowse={jest.fn()} />)

    fireEvent.press(screen.getByRole('button', { name: 'Remove from favorites' }))
    await waitFor(() => expect(screen.getByText('No favorites yet')).toBeOnTheScreen())
  })
})
