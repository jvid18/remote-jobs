import { fireEvent, render, screen } from '@testing-library/react-native'
import { Linking } from 'react-native'

import type { DescriptionAst } from '@/modules/jobs/job-description'
import { DescriptionRenderer } from '@/modules/jobs/ui/description-renderer'

describe('DescriptionRenderer', () => {
  it('renders paragraphs, strong text, and list items', () => {
    const ast: DescriptionAst = [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'About ' },
          { type: 'strong', children: [{ type: 'text', value: 'the role' }] },
        ],
      },
      {
        type: 'list',
        ordered: false,
        items: [{ children: [{ type: 'text', value: 'Ship work' }] }],
      },
    ]
    render(<DescriptionRenderer ast={ast} />)

    expect(screen.getByText(/About/)).toBeOnTheScreen()
    expect(screen.getByText('the role')).toBeOnTheScreen()
    expect(screen.getByText('Ship work')).toBeOnTheScreen()
  })

  it('opens links on press', () => {
    const spy = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never)
    const ast: DescriptionAst = [
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            href: 'https://x.com',
            children: [{ type: 'text', value: 'apply here' }],
          },
        ],
      },
    ]
    render(<DescriptionRenderer ast={ast} />)

    fireEvent.press(screen.getByText('apply here'))
    expect(spy).toHaveBeenCalledWith('https://x.com')
  })
})
