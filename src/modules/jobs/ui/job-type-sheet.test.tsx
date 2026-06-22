import { fireEvent, render, screen } from '@testing-library/react-native'

import { JOB_TYPES } from '@/modules/jobs/job'
import { JobTypeSheet } from '@/modules/jobs/ui/job-type-sheet'

describe('JobTypeSheet', () => {
  it('selects a job type', () => {
    const onSelect = jest.fn()
    render(<JobTypeSheet selected={null} onSelect={onSelect} />)
    fireEvent.press(screen.getByRole('button', { name: 'Contract' }))
    expect(onSelect).toHaveBeenCalledWith(JOB_TYPES.CONTRACT)
  })

  it('resets the selection', () => {
    const onSelect = jest.fn()
    render(<JobTypeSheet selected={JOB_TYPES.CONTRACT} onSelect={onSelect} />)
    fireEvent.press(screen.getByRole('button', { name: 'Reset' }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
