import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { JOB_TYPES, type Job } from '@/modules/jobs/job'
import { JobCard } from '@/modules/jobs/ui/job-card'

const makeJob = (over: Partial<Job> = {}): Job => ({
  id: '1',
  title: 'Senior Frontend Engineer',
  companyName: 'Acme',
  companyLogoUrl: null,
  category: 'Software Development',
  type: JOB_TYPES.FULL_TIME,
  location: 'Worldwide',
  publishedAt: new Date(),
  salary: { kind: 'unspecified' },
  applyUrl: 'https://x',
  description: [],
  ...over,
})

describe('JobCard', () => {
  it('shows the core job fields', () => {
    render(<JobCard job={makeJob()} onPress={jest.fn()} />)
    expect(screen.getByText('Senior Frontend Engineer')).toBeOnTheScreen()
    expect(screen.getByText('Acme')).toBeOnTheScreen()
    expect(screen.getByText('Worldwide')).toBeOnTheScreen()
    expect(screen.getByText('Full-time')).toBeOnTheScreen()
  })

  it('opens the job when the card is pressed', () => {
    const onPress = jest.fn()
    render(<JobCard job={makeJob({ title: 'Dev', companyName: 'Acme' })} onPress={onPress} />)
    fireEvent.press(screen.getByRole('button', { name: 'Dev at Acme' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('renders the injected favorite button', () => {
    render(
      <JobCard
        job={makeJob({ id: 'fav-1' })}
        onPress={jest.fn()}
        favoriteButton={<Text>Favorite</Text>}
      />,
    )

    expect(screen.getByText('Favorite')).toBeOnTheScreen()
  })

  it('keeps the relative date visible even with long tags', () => {
    render(
      <JobCard
        job={makeJob({
          category: 'Software Development',
          type: JOB_TYPES.FULL_TIME,
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
        })}
        onPress={jest.fn()}
      />,
    )
    expect(screen.getByText('3 months ago')).toBeOnTheScreen()
  })
})
