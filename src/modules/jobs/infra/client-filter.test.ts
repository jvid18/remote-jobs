import { filterJobs } from '@/modules/jobs/infra/client-filter'
import { JOB_TYPES, type Job } from '@/modules/jobs/job'

const job = (over: Partial<Job>): Job => ({
  id: '1',
  title: 'Frontend Engineer',
  companyName: 'Acme',
  companyLogoUrl: null,
  category: 'Software Development',
  type: JOB_TYPES.FULL_TIME,
  location: 'Worldwide',
  publishedAt: new Date('2026-06-01'),
  salary: { kind: 'unspecified' },
  applyUrl: 'https://x',
  description: [],
  ...over,
})

const jobs: Job[] = [
  job({
    id: '1',
    title: 'Frontend Engineer',
    companyName: 'Acme',
    category: 'Software Development',
    type: JOB_TYPES.FULL_TIME,
  }),
  job({
    id: '2',
    title: 'Product Designer',
    companyName: 'Spotify',
    category: 'Design',
    type: JOB_TYPES.CONTRACT,
  }),
  job({
    id: '3',
    title: 'Data Analyst',
    companyName: 'Acme',
    category: 'Data Analysis',
    type: JOB_TYPES.FULL_TIME,
  }),
]

describe('filterJobs', () => {
  it('returns all jobs for an empty query', () => {
    expect(filterJobs(jobs, {})).toHaveLength(3)
  })

  it('matches search against title and company (case-insensitive)', () => {
    expect(filterJobs(jobs, { search: 'acme' }).map(j => j.id)).toEqual(['1', '3'])
    expect(filterJobs(jobs, { search: 'designer' }).map(j => j.id)).toEqual(['2'])
  })

  it('filters by category name', () => {
    expect(filterJobs(jobs, { category: 'Design' }).map(j => j.id)).toEqual(['2'])
  })

  it('filters by job type', () => {
    expect(filterJobs(jobs, { type: JOB_TYPES.CONTRACT }).map(j => j.id)).toEqual(['2'])
  })

  it('combines filters', () => {
    expect(filterJobs(jobs, { search: 'acme', type: JOB_TYPES.FULL_TIME }).map(j => j.id)).toEqual([
      '1',
      '3',
    ])
  })
})
