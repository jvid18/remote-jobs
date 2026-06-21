import { renderHook, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import { useCategories } from '@/modules/jobs/hooks/use-categories'

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
)

describe('useCategories', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('exposes the mapped categories once loaded', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ jobs: [{ id: 1, name: 'Design', slug: 'design' }] }),
    })

    const { result } = renderHook(() => useCategories(), { wrapper })

    await waitFor(() => expect(result.current.categories).toHaveLength(1))
    expect(result.current.categories[0]).toEqual({ slug: 'design', name: 'Design' })
  })
})
