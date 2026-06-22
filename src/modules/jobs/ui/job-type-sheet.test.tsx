import { fireEvent, render, screen } from '@testing-library/react-native'

import { JOB_TYPES } from '@/modules/jobs/job'
import { JobTypeSheet } from '@/modules/jobs/ui/job-type-sheet'

describe('JobTypeSheet', () => {
  it('selects a job type', () => {
    const onSelect = jest.fn()
    render(<JobTypeSheet visible selected={null} onSelect={onSelect} onClose={jest.fn()} />)
    fireEvent.press(screen.getByRole('button', { name: 'Contract' }))
    expect(onSelect).toHaveBeenCalledWith(JOB_TYPES.CONTRACT)
  })

  it('resets the selection', () => {
    const onSelect = jest.fn()
    render(
      <JobTypeSheet
        visible
        selected={JOB_TYPES.CONTRACT}
        onSelect={onSelect}
        onClose={jest.fn()}
      />,
    )
    fireEvent.press(screen.getByRole('button', { name: 'Reset' }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
