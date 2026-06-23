import { fireEvent, render, screen } from '@testing-library/react-native'

import { JOB_TYPES } from '@/shared/lib/job-types'

import { useFavoritesStore } from '../favorites-store'
import { FavoriteButton } from './favorite-button'

const makeJob = () => ({
  id: 'fav-1',
  title: 'Senior Frontend Engineer',
  companyName: 'Acme',
  companyLogoUrl: null,
  category: 'Software Development',
  type: JOB_TYPES.FULL_TIME,
  location: 'Worldwide',
  publishedAt: new Date(),
})

describe('FavoriteButton', () => {
  beforeEach(() => useFavoritesStore.setState({ byId: {} }))

  it('saves the job when pressed', () => {
    render(<FavoriteButton job={makeJob()} />)

    fireEvent.press(screen.getByRole('button', { name: 'Save to favorites' }))

    expect(useFavoritesStore.getState().byId['fav-1']).toBeDefined()
  })

  it('removes the job when pressed a second time', () => {
    render(<FavoriteButton job={makeJob()} />)

    fireEvent.press(screen.getByRole('button', { name: 'Save to favorites' }))
    fireEvent.press(screen.getByRole('button', { name: 'Remove from favorites' }))

    expect(useFavoritesStore.getState().byId['fav-1']).toBeUndefined()
  })
})
