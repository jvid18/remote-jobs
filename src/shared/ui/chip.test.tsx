import { fireEvent, render, screen } from '@testing-library/react-native'

import { Chip } from '@/shared/ui/chip'

describe('Chip', () => {
  it('exposes its selected state to assistive tech and fires onPress', () => {
    const onPress = jest.fn()
    render(<Chip label="Design" selected onPress={onPress} />)

    const chip = screen.getByRole('button', { name: 'Design' })
    expect(chip).toBeSelected()

    fireEvent.press(chip)
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
