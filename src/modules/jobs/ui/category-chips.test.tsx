import { fireEvent, render, screen } from '@testing-library/react-native'

import type { Category } from '@/modules/jobs/job'
import { CategoryChips } from '@/modules/jobs/ui/category-chips'

const categories: Category[] = [
  { slug: 'software-dev', name: 'Software Development' },
  { slug: 'design', name: 'Design' },
]

describe('CategoryChips', () => {
  it('selects a category by name', () => {
    const onSelect = jest.fn()
    render(<CategoryChips categories={categories} selected={null} onSelect={onSelect} />)
    fireEvent.press(screen.getByRole('button', { name: 'Design' }))
    expect(onSelect).toHaveBeenCalledWith('Design')
  })

  it('clears the selection via the All chip', () => {
    const onSelect = jest.fn()
    render(<CategoryChips categories={categories} selected="Design" onSelect={onSelect} />)
    fireEvent.press(screen.getByRole('button', { name: 'All' }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
