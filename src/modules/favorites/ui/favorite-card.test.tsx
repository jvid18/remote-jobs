import { fireEvent, render, screen } from '@testing-library/react-native'

import type { FavoriteSnapshot } from '@/modules/favorites/favorites-store'
import { useFavoritesStore } from '@/modules/favorites/favorites-store'
import { FavoriteCard } from '@/modules/favorites/ui/favorite-card'

const snapshot: FavoriteSnapshot = {
  id: 'a',
  title: 'Product Designer',
  companyName: 'Spotify',
  companyLogoUrl: null,
  category: 'Design',
  location: 'Europe',
  type: 'full_time',
  publishedAt: new Date('2026-06-01T00:00:00Z').toISOString(),
}

describe('FavoriteCard', () => {
  beforeEach(() => useFavoritesStore.setState({ byId: { a: snapshot } }))

  it('shows the saved job summary', () => {
    render(<FavoriteCard favorite={snapshot} onPress={jest.fn()} />)
    expect(screen.getByText('Product Designer')).toBeOnTheScreen()
    expect(screen.getByText('Spotify')).toBeOnTheScreen()
  })

  it('opens the job on press', () => {
    const onPress = jest.fn()
    render(<FavoriteCard favorite={snapshot} onPress={onPress} />)
    fireEvent.press(screen.getByRole('button', { name: 'Product Designer at Spotify' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('removes the favorite', () => {
    render(<FavoriteCard favorite={snapshot} onPress={jest.fn()} />)
    fireEvent.press(screen.getByRole('button', { name: 'Remove from favorites' }))
    expect(useFavoritesStore.getState().byId.a).toBeUndefined()
  })
})
