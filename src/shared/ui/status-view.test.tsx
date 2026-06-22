import { fireEvent, render, screen } from '@testing-library/react-native'

import { StatusView } from '@/shared/ui/status-view'

describe('StatusView', () => {
  it('renders the title and message', () => {
    render(<StatusView title="No connection" message="Check your network and try again." />)

    expect(screen.getByText('No connection')).toBeOnTheScreen()
    expect(screen.getByText('Check your network and try again.')).toBeOnTheScreen()
  })

  it('renders an action button that fires its handler', () => {
    const onPress = jest.fn()
    render(
      <StatusView
        title="No jobs found"
        message="Adjust your filters."
        action={{ label: 'Clear filters', onPress }}
      />,
    )

    fireEvent.press(screen.getByRole('button', { name: 'Clear filters' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
