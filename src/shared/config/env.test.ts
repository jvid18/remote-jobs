import { parseApiUrl, parseClientSideFilters } from '@/shared/config/env'

describe('env', () => {
  describe('parseClientSideFilters', () => {
    it('defaults to true when unset', () => {
      expect(parseClientSideFilters(undefined)).toBe(true)
    })

    it('returns false only when explicitly "false"', () => {
      expect(parseClientSideFilters('false')).toBe(false)
    })

    it('returns true for any other value', () => {
      expect(parseClientSideFilters('true')).toBe(true)
      expect(parseClientSideFilters('1')).toBe(true)
    })
  })

  describe('parseApiUrl', () => {
    it('falls back to default when unset', () => {
      expect(parseApiUrl(undefined)).toBe('https://remotive.com/api')
    })

    it('uses provided value', () => {
      expect(parseApiUrl('https://example.com/api')).toBe('https://example.com/api')
    })
  })
})
