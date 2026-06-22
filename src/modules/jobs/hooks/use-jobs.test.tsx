import { renderHook, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import { useJobs } from '@/modules/jobs/hooks/use-jobs'

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

describe('useJobs', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('reaches a ready state with the fetched jobs', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ jobs: [rawJob({ id: 1 })] }),
    })

    const { result } = renderHook(() => useJobs({}), { wrapper })

    await waitFor(() => expect(result.current.status).toBe('ready'))
    if (result.current.status === 'ready') expect(result.current.jobs).toHaveLength(1)
  })

  it('applies the client-side search filter over the cached list', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jobs: [
          rawJob({ id: 1, title: 'Frontend Engineer' }),
          rawJob({ id: 2, title: 'Backend Engineer', company_name: 'Globex' }),
        ],
      }),
    })

    const { result } = renderHook(() => useJobs({ search: 'globex' }), { wrapper })

    await waitFor(() => expect(result.current.status).toBe('ready'))
    if (result.current.status === 'ready') {
      expect(result.current.jobs.map(j => j.id)).toEqual(['2'])
    }
  })

  it('applies the client-side type filter over the cached list', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        jobs: [rawJob({ id: 1, job_type: 'full_time' }), rawJob({ id: 2, job_type: 'contract' })],
      }),
    })

    const { result } = renderHook(() => useJobs({ type: 'contract' }), { wrapper })

    await waitFor(() => expect(result.current.status).toBe('ready'))
    if (result.current.status === 'ready') {
      expect(result.current.jobs.map(j => j.id)).toEqual(['2'])
    }
  })

  it('surfaces a typed error state when the request fails', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))

    const { result } = renderHook(() => useJobs({}), { wrapper })

    await waitFor(() => expect(result.current.status).toBe('error'))
    if (result.current.status === 'error') expect(result.current.error.code).toBe('job_network')
  })

  it('reaches an empty state when no jobs match', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ jobs: [rawJob({ id: 1 })] }),
    })

    const { result } = renderHook(() => useJobs({ search: 'nothingmatches' }), { wrapper })

    await waitFor(() => expect(result.current.status).toBe('empty'))
  })
})
