import { toCategories, toJobs, type RemotiveJobRaw } from '@/modules/jobs/infra/remotive-adapter'
import { JOB_TYPES } from '@/modules/jobs/job'

const rawJob = (over: Partial<RemotiveJobRaw> = {}): RemotiveJobRaw => ({
  id: 123,
  url: 'https://remotive.com/remote-jobs/x-123',
  title: 'Senior Frontend Engineer',
  company_name: 'Acme',
  company_logo: 'https://logo/x.png',
  category: 'Software Development',
  job_type: 'full_time',
  publication_date: '2026-06-01T10:00:00',
  candidate_required_location: 'Worldwide',
  salary: '$110k - $150k',
  description: '<p>Hello</p>',
  ...over,
})

describe('toJobs', () => {
  it('maps a raw record into the domain shape', () => {
    const [job] = toJobs([rawJob()])
    expect(job).toMatchObject({
      id: '123',
      title: 'Senior Frontend Engineer',
      companyName: 'Acme',
      companyLogoUrl: 'https://logo/x.png',
      category: 'Software Development',
      type: JOB_TYPES.FULL_TIME,
      location: 'Worldwide',
      applyUrl: 'https://remotive.com/remote-jobs/x-123',
      salary: { kind: 'text', value: '$110k - $150k' },
    })
    expect(job.publishedAt).toBeInstanceOf(Date)
    expect(job.description).toEqual([
      { type: 'paragraph', children: [{ type: 'text', value: 'Hello' }] },
    ])
  })

  it('normalizes empty logo to null and unknown job_type to null', () => {
    const [job] = toJobs([rawJob({ company_logo: '', job_type: '' })])
    expect(job.companyLogoUrl).toBeNull()
    expect(job.type).toBeNull()
  })

  it('represents a missing salary as unspecified', () => {
    const [job] = toJobs([rawJob({ salary: '' })])
    expect(job.salary).toEqual({ kind: 'unspecified' })
  })

  it('drops malformed records (missing title, url, or invalid date)', () => {
    const jobs = toJobs([
      rawJob({ title: '' }),
      rawJob({ url: undefined }),
      rawJob({ publication_date: 'not-a-date' }),
      rawJob({ id: 9 }),
    ])
    expect(jobs).toHaveLength(1)
    expect(jobs[0].id).toBe('9')
  })
})

describe('toCategories', () => {
  it('keeps records with a name and slug', () => {
    const cats = toCategories([
      { id: 1, name: 'Software Development', slug: 'software-dev' },
      { id: 2, name: 'Design' }, // no slug → dropped
    ])
    expect(cats).toEqual([{ slug: 'software-dev', name: 'Software Development' }])
  })
})
