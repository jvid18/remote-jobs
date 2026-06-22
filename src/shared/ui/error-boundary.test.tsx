import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { ErrorBoundary } from '@/shared/ui/error-boundary'

function Boom({ crash }: { crash: boolean }): React.JSX.Element {
  if (crash) throw new Error('boom')
  return <Text>Recovered</Text>
}

describe('ErrorBoundary', () => {
  // React logs the caught error to console.error; silence it for a clean run.
  let spy: jest.SpyInstance
  beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => spy.mockRestore())

  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <Boom crash={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Recovered')).toBeOnTheScreen()
  })

  it('renders a recoverable fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom crash />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Something went wrong')).toBeOnTheScreen()
    expect(screen.getByText('Try again')).toBeOnTheScreen()
  })

  it('retries rendering after the fallback action is pressed', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <Boom crash />
      </ErrorBoundary>,
    )
    // Stop throwing, then reset: the boundary should re-render its children.
    rerender(
      <ErrorBoundary>
        <Boom crash={false} />
      </ErrorBoundary>,
    )
    fireEvent.press(screen.getByText('Try again'))
    expect(screen.getByText('Recovered')).toBeOnTheScreen()
  })
})
