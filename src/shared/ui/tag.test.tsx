import { render, screen } from '@testing-library/react-native'

import { Tag } from './tag'

describe('Tag', () => {
  it('renders the label', () => {
    render(<Tag label="Full-time" />)
    expect(screen.getByText('Full-time')).toBeOnTheScreen()
  })

  it('accepts a custom style', () => {
    render(<Tag label="Dev" style={{ maxWidth: 50 }} testID="tag" />)
    expect(screen.getByTestId('tag')).toHaveStyle({ maxWidth: 50 })
  })
})
