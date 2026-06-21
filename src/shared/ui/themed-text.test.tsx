import { render, screen } from '@testing-library/react-native'

import { ThemedText } from '@/shared/ui/themed-text'

describe('test infrastructure', () => {
  it('renders text content through RNTL', () => {
    render(<ThemedText>Hello RemoteJobs</ThemedText>)

    expect(screen.getByText('Hello RemoteJobs')).toBeOnTheScreen()
  })
})
