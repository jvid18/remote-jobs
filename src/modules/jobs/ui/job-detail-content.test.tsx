import { fireEvent, render, screen } from '@testing-library/react-native'
import * as WebBrowser from 'expo-web-browser'
import { Share, Text } from 'react-native'

import { JOB_TYPES, type Job } from '@/modules/jobs/job'
import { JobDetailContent } from '@/modules/jobs/ui/job-detail-content'

jest.mock('expo-web-browser', () => ({ openBrowserAsync: jest.fn() }))

const makeJob = (over: Partial<Job> = {}): Job => ({
  id: '1',
  title: 'Senior Frontend Engineer',
  companyName: 'Acme',
  companyLogoUrl: null,
  category: 'Software Development',
  type: JOB_TYPES.FULL_TIME,
  location: 'Worldwide',
  publishedAt: new Date(),
  salary: { kind: 'text', value: '$110k – $150k' },
  applyUrl: 'https://apply.example/123',
  description: [{ type: 'paragraph', children: [{ type: 'text', value: 'Build great things.' }] }],
  ...over,
})

describe('JobDetailContent', () => {
  it('shows the headline fields and description', () => {
    render(<JobDetailContent job={makeJob()} onBack={jest.fn()} />)
    expect(screen.getByText('Senior Frontend Engineer')).toBeOnTheScreen()
    expect(screen.getByText('Acme')).toBeOnTheScreen()
    expect(screen.getByText('Worldwide')).toBeOnTheScreen()
    expect(screen.getByText('$110k – $150k')).toBeOnTheScreen()
    expect(screen.getByText('Build great things.')).toBeOnTheScreen()
  })

  it('shows "Not disclosed" when there is no salary', () => {
    render(
      <JobDetailContent job={makeJob({ salary: { kind: 'unspecified' } })} onBack={jest.fn()} />,
    )
    expect(screen.getByText('Not disclosed')).toBeOnTheScreen()
  })

  it('opens the apply url in the in-app browser', () => {
    render(
      <JobDetailContent
        job={makeJob({ applyUrl: 'https://apply.example/123' })}
        onBack={jest.fn()}
      />,
    )
    fireEvent.press(screen.getByRole('button', { name: 'Apply now' }))
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith('https://apply.example/123')
  })

  it('shares the job', () => {
    const spy = jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as never)
    render(<JobDetailContent job={makeJob()} onBack={jest.fn()} />)
    fireEvent.press(screen.getByRole('button', { name: 'Share job' }))
    expect(spy).toHaveBeenCalled()
  })

  it('renders the injected favorite button in the action bar', () => {
    render(
      <JobDetailContent
        job={makeJob({ id: 'fav-9' })}
        onBack={jest.fn()}
        favoriteButton={<Text>Favorite</Text>}
      />,
    )
    expect(screen.getByText('Favorite')).toBeOnTheScreen()
  })

  it('calls onBack', () => {
    const onBack = jest.fn()
    render(<JobDetailContent job={makeJob()} onBack={onBack} />)
    fireEvent.press(screen.getByRole('button', { name: 'Go back' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
