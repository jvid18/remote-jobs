import { render, screen, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'

import { useFavoritesStore } from '@/modules/favorites/favorites-store'
import { JobDetailScreen } from '@/modules/jobs/ui/job-detail-screen'

jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }))

const wrapper = ({ children }: { children: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
)

const rawJob = (over: Record<string, unknown>) => ({
  id: 5,
  url: 'https://x',
  title: 'Senior Backend Engineer',
  company_name: 'Globex',
  category: 'Software Development',
  job_type: 'full_time',
  publication_date: '2026-06-01T00:00:00',
  candidate_required_location: 'Europe',
  description: '<p>Join us</p>',
  ...over,
})

function mockJobs(jobs: Record<string, unknown>[]) {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, status: 200, json: async () => ({ jobs }) }),
  ) as unknown as typeof fetch
}

describe('JobDetailScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useFavoritesStore.setState({ byId: {} })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('loads the job from the catalog and shows it', async () => {
    mockJobs([rawJob({ id: 5 })])
    render(<JobDetailScreen id="5" onBack={jest.fn()} />, { wrapper })

    await waitFor(() => expect(screen.getByText('Senior Backend Engineer')).toBeOnTheScreen())
    expect(screen.getByText('Join us')).toBeOnTheScreen()
  })

  it('shows a not-found state when the job is missing', async () => {
    mockJobs([])
    render(<JobDetailScreen id="404" onBack={jest.fn()} />, { wrapper })

    await waitFor(() => expect(screen.getByText('Job no longer available')).toBeOnTheScreen())
    expect(screen.getByText('Go back')).toBeOnTheScreen()
  })

  it('offers to remove a saved job that is no longer available', async () => {
    mockJobs([])
    useFavoritesStore.setState({
      byId: {
        404: {
          id: '404',
          title: 'Gone Role',
          companyName: 'Globex',
          companyLogoUrl: null,
          category: 'Software Development',
          location: 'Europe',
          type: 'full_time',
          publishedAt: '2026-06-01T00:00:00.000Z',
        },
      },
    })
    render(<JobDetailScreen id="404" onBack={jest.fn()} />, { wrapper })

    await waitFor(() => expect(screen.getByText('Remove from favorites')).toBeOnTheScreen())
  })
})
