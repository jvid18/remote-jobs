import { act, renderHook } from '@testing-library/react-native'

import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'

describe('useDebouncedValue', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('returns the latest value only after the delay elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })
    expect(result.current).toBe('a')

    rerender({ value: 'ab' })
    expect(result.current).toBe('a') // not yet

    act(() => jest.advanceTimersByTime(300))
    expect(result.current).toBe('ab')
  })
})
