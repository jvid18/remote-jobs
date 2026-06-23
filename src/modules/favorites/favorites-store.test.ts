import { JOB_TYPES } from '@/shared/lib/job-types'

import { type FavoriteInput, useFavoritesStore } from './favorites-store'

const makeJob = (over: Partial<FavoriteInput> & Record<string, unknown> = {}): FavoriteInput => ({
  id: '1',
  title: 'Frontend Engineer',
  companyName: 'Acme',
  companyLogoUrl: null,
  category: 'Software Development',
  type: JOB_TYPES.FULL_TIME,
  location: 'Worldwide',
  publishedAt: new Date('2026-06-01T00:00:00Z'),
  ...over,
})

describe('favorites store', () => {
  beforeEach(() => useFavoritesStore.setState({ byId: {} }))

  it('adds a snapshot on first toggle', () => {
    useFavoritesStore.getState().toggle(makeJob({ id: 'a' }))
    expect(useFavoritesStore.getState().byId.a).toMatchObject({
      id: 'a',
      title: 'Frontend Engineer',
      publishedAt: '2026-06-01T00:00:00.000Z',
    })
  })

  it('removes on a second toggle', () => {
    const job = makeJob({ id: 'a' })
    useFavoritesStore.getState().toggle(job)
    useFavoritesStore.getState().toggle(job)
    expect(useFavoritesStore.getState().byId.a).toBeUndefined()
  })

  it('remove deletes by id', () => {
    useFavoritesStore.getState().toggle(makeJob({ id: 'a' }))
    useFavoritesStore.getState().remove('a')
    expect(useFavoritesStore.getState().byId.a).toBeUndefined()
  })

  it('persists only snapshot fields (no description AST)', () => {
    useFavoritesStore.getState().toggle(makeJob({ id: 'a' }))
    expect(useFavoritesStore.getState().byId.a).not.toHaveProperty('description')
  })
})
