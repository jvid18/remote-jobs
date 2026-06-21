import { JOB_TYPES } from '@/modules/jobs/job'
import {
  categoryShortLabel,
  companyInitial,
  jobTypeLabel,
  relativeDate,
} from '@/modules/jobs/ui/job-presentation'

describe('jobTypeLabel', () => {
  it('humanizes a known type', () => {
    expect(jobTypeLabel(JOB_TYPES.FULL_TIME)).toBe('Full-time')
  })
  it('falls back for a null type', () => {
    expect(jobTypeLabel(null)).toBe('Not specified')
  })
})

describe('categoryShortLabel', () => {
  it('shortens known categories', () => {
    expect(categoryShortLabel('Software Development')).toBe('Dev')
    expect(categoryShortLabel('Customer Service')).toBe('Support')
  })
  it('returns the original for unknown categories', () => {
    expect(categoryShortLabel('Astrophysics')).toBe('Astrophysics')
  })
})

describe('relativeDate', () => {
  const now = new Date('2026-06-21T12:00:00Z')
  it('reports just now under an hour', () => {
    expect(relativeDate(new Date('2026-06-21T11:30:00Z'), now)).toBe('Just now')
  })
  it('reports hours under a day', () => {
    expect(relativeDate(new Date('2026-06-21T09:00:00Z'), now)).toBe('3h ago')
  })
  it('reports days under a week', () => {
    expect(relativeDate(new Date('2026-06-18T12:00:00Z'), now)).toBe('3 days ago')
  })
  it('reports weeks beyond seven days', () => {
    expect(relativeDate(new Date('2026-06-07T12:00:00Z'), now)).toBe('2 weeks ago')
  })
})

describe('companyInitial', () => {
  it('uppercases the first letter', () => {
    expect(companyInitial('acme')).toBe('A')
  })
  it('falls back for an empty name', () => {
    expect(companyInitial('   ')).toBe('?')
  })
})
