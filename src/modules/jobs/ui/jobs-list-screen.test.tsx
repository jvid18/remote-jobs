import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import { useFavoritesStore } from '@/modules/favorites/favorites-store'
import { JobsListScreen } from '@/modules/jobs/ui/jobs-list-screen'

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig
    value={{
      provider: () => new Map(),
      dedupingInterval: 0,
      loadingTimeout: 0,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }}
  >
    {children}
  </SWRConfig>
)

const rawJob = (over: Record<string, unknown>) => ({
  id: 1,
  url: 'https://x',
  title: 'Frontend Engineer',
  company_name: 'Acme',
  category: 'Software Development',
  job_type: 'full_time',
  publication_date: '2026-06-01T00:00:00',
  candidate_required_location: 'Worldwide',
  description: '<p>Hi</p>',
  ...over,
})

const jsonOk = (body: unknown) => Promise.resolve({ ok: true, status: 200, json: async () => body })

function mockApi(jobs: Record<string, unknown>[]) {
  const fetchMock = jest.fn((url: string) =>
    url.includes('/categories')
      ? jsonOk({ jobs: [{ id: 1, name: 'Software Development', slug: 'software-dev' }] })
      : jsonOk({ jobs }),
  )
  global.fetch = fetchMock as unknown as typeof fetch
  return fetchMock
}

describe('JobsListScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useFavoritesStore.setState({ byId: {} })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('shows skeletons while loading, then the jobs', async () => {
    mockApi([rawJob({ id: 1 })])
    render(<JobsListScreen onOpenJob={jest.fn()} />, { wrapper })

    expect(
      screen.getAllByTestId('job-skeleton', { includeHiddenElements: true }).length,
    ).toBeGreaterThan(0)
    await waitFor(() => expect(screen.getByText('Frontend Engineer')).toBeOnTheScreen())
  })

  it('filters the list as the user types in search', async () => {
    mockApi([
      rawJob({ id: 1, title: 'Frontend Engineer', company_name: 'Acme' }),
      rawJob({ id: 2, title: 'Backend Engineer', company_name: 'Globex' }),
    ])
    render(<JobsListScreen onOpenJob={jest.fn()} />, { wrapper })

    await waitFor(() => expect(screen.getByText('Frontend Engineer')).toBeOnTheScreen())

    fireEvent.changeText(screen.getByLabelText('Search jobs'), 'globex')

    await waitFor(() => expect(screen.queryByText('Frontend Engineer')).toBeNull())
    expect(screen.getByText('Backend Engineer')).toBeOnTheScreen()
  })

  it('saves a job to favorites from the list', async () => {
    mockApi([rawJob({ id: 7, title: 'Frontend Engineer' })])
    render(<JobsListScreen onOpenJob={jest.fn()} />, { wrapper })

    await waitFor(() => expect(screen.getByText('Frontend Engineer')).toBeOnTheScreen())
    fireEvent.press(screen.getByRole('button', { name: 'Save to favorites' }))

    expect(useFavoritesStore.getState().byId['7']).toBeDefined()
  })

  it('opens a job when its card is pressed', async () => {
    const onOpenJob = jest.fn()
    mockApi([rawJob({ id: 9, title: 'Frontend Engineer', company_name: 'Acme' })])
    render(<JobsListScreen onOpenJob={onOpenJob} />, { wrapper })

    await waitFor(() => expect(screen.getByText('Frontend Engineer')).toBeOnTheScreen())
    fireEvent.press(screen.getByRole('button', { name: 'Frontend Engineer at Acme' }))

    expect(onOpenJob).toHaveBeenCalledWith('9')
  })

  it('shows an empty state when nothing matches', async () => {
    mockApi([rawJob({ id: 1, title: 'Frontend Engineer' })])
    render(<JobsListScreen onOpenJob={jest.fn()} />, { wrapper })

    await waitFor(() => expect(screen.getByText('Frontend Engineer')).toBeOnTheScreen())
    fireEvent.changeText(screen.getByLabelText('Search jobs'), 'zzzznotamatch')

    await waitFor(() => expect(screen.getByText('No jobs found')).toBeOnTheScreen())
  })

  it('shows an error state and recovers on retry', async () => {
    const fetchMock = jest.fn<Promise<unknown>, [string]>(() =>
      Promise.reject(new Error('offline')),
    )
    global.fetch = fetchMock as unknown as typeof fetch
    render(<JobsListScreen onOpenJob={jest.fn()} />, { wrapper })

    await waitFor(() => expect(screen.getByText('No connection')).toBeOnTheScreen())

    fetchMock.mockImplementation((url: string) =>
      url.includes('/categories') ? jsonOk({ jobs: [] }) : jsonOk({ jobs: [rawJob({ id: 1 })] }),
    )
    fireEvent.press(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => expect(screen.getByText('Frontend Engineer')).toBeOnTheScreen())
  })
})
