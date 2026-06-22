import { Component, type ReactNode } from 'react'

import { Screen } from '@/shared/ui/screen'
import { StatusView } from '@/shared/ui/status-view'

type ErrorBoundaryProps = { children: ReactNode }
type ErrorBoundaryState = { hasError: boolean }

// Last-resort guard for render-time exceptions (e.g. a malformed description AST).
// Without it a single throw blanks the whole app; here the user gets a recoverable
// screen. Domain/network failures are handled upstream via DomainResult, so this
// only catches the unexpected.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  private reset = () => this.setState({ hasError: false })

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <Screen>
        <StatusView
          tone="error"
          title="Something went wrong"
          message="The app hit an unexpected error. Try again."
          action={{ label: 'Try again', onPress: this.reset }}
        />
      </Screen>
    )
  }
}
