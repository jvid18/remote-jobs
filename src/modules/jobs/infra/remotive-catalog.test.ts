import { createRemotiveCatalog } from '@/modules/jobs/infra/remotive-catalog'
import { JOB_ERRORS } from '@/modules/jobs/job-errors'

const okResponse = (body: unknown) => ({ ok: true, status: 200, json: async () => body })

describe('createRemotiveCatalog', () => {
  const fetchMock = jest.fn()
  const catalog = createRemotiveCatalog('https://api.test')

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('requests the bare list endpoint when the query is empty', async () => {
    fetchMock.mockResolvedValue(okResponse({ jobs: [] }))
    await catalog.listJobs({})
    expect(fetchMock).toHaveBeenCalledWith('https://api.test/remote-jobs')
  })

  it('appends search and category params when present', async () => {
    fetchMock.mockResolvedValue(okResponse({ jobs: [] }))
    await catalog.listJobs({ search: 'front end', category: 'Software Development' })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.test/remote-jobs?search=front%20end&category=Software%20Development',
    )
  })

  it('returns mapped jobs on success', async () => {
    fetchMock.mockResolvedValue(
      okResponse({
        jobs: [
          {
            id: 1,
            url: 'https://x',
            title: 'Dev',
            company_name: 'Acme',
            publication_date: '2026-06-01T00:00:00',
            description: '<p>Hi</p>',
          },
        ],
      }),
    )
    const result = await catalog.listJobs({})
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value[0]).toMatchObject({ id: '1', title: 'Dev' })
  })

  it('maps a network failure to a job_network error', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    const result = await catalog.listJobs({})
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe(JOB_ERRORS.NETWORK)
  })

  it('maps a malformed body to a job_bad_response error', async () => {
    fetchMock.mockResolvedValue(okResponse({ nope: true }))
    const result = await catalog.listJobs({})
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe(JOB_ERRORS.BAD_RESPONSE)
  })

  it('lists categories from the categories endpoint', async () => {
    fetchMock.mockResolvedValue(okResponse({ jobs: [{ id: 1, name: 'Design', slug: 'design' }] }))
    const result = await catalog.listCategories()
    expect(fetchMock).toHaveBeenCalledWith('https://api.test/remote-jobs/categories')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toEqual([{ slug: 'design', name: 'Design' }])
  })
})
