import { fireEvent, render, screen } from '@testing-library/react-native'

import { SearchBar } from '@/modules/jobs/ui/search-bar'

describe('SearchBar', () => {
  it('reports typed text', () => {
    const onChangeText = jest.fn()
    render(<SearchBar value="" onChangeText={onChangeText} onClear={jest.fn()} />)
    fireEvent.changeText(screen.getByLabelText('Search jobs'), 'react')
    expect(onChangeText).toHaveBeenCalledWith('react')
  })

  it('shows a clear control only when there is text', () => {
    const onClear = jest.fn()
    const { rerender } = render(<SearchBar value="" onChangeText={jest.fn()} onClear={onClear} />)
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull()

    rerender(<SearchBar value="react" onChangeText={jest.fn()} onClear={onClear} />)
    fireEvent.press(screen.getByRole('button', { name: 'Clear search' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})
