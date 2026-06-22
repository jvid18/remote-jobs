import { renderHook, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import { useJobs } from '@/modules/jobs/hooks/use-jobs'

// Server-mode: API resolves search/category, but `type` is unsupported upstream
// so it must still be filtered client-side without driving the request.
jest.mock('@/shared/config/env', () => ({
  env: { apiUrl: 'https://remotive.com/api', clientSideFilters: false },
}))

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
)

const rawJob = (over: Record<string, unknown>) => ({
  id: 1,
  url: 'https://x',
  title: 'Frontend Engineer',
  company_name: 'Acme',
  publication_date: '2026-06-01T00:00:00',
  description: '<p>Hi</p>',
  ...over,
})

describe('useJobs (server-side filters)', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jobs: [rawJob({ id: 1, job_type: 'full_time' }), rawJob({ id: 2, job_type: 'contract' })],
      }),
    })
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('still filters by type client-side', async () => {
    const { result } = renderHook(() => useJobs({ type: 'contract' }), { wrapper })

    await waitFor(() => expect(result.current.status).toBe('ready'))
    if (result.current.status === 'ready') {
      expect(result.current.jobs.map(j => j.id)).toEqual(['2'])
    }
  })

  it('does not send type to the API nor refetch when only type changes', async () => {
    const { rerender, result } = renderHook(
      (props: { type?: 'contract' | 'full_time' }) => useJobs(props),
      {
        wrapper,
        initialProps: {},
      },
    )

    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).not.toContain('type')

    rerender({ type: 'contract' })
    await waitFor(() => expect(result.current.status).toBe('ready'))

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
