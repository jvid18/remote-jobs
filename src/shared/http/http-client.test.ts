import { getJson } from '@/shared/http/http-client'
import { HTTP_ERRORS } from '@/shared/http/http-error'

describe('getJson', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it('returns ok with parsed json on a 2xx response', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ a: 1 }) })

    const result = await getJson<{ a: number }>('https://x')

    expect(result).toEqual({ ok: true, value: { a: 1 } })
  })

  it('returns an http_status error on a non-ok response', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503, json: async () => ({}) })

    const result = await getJson('https://x')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatchObject({ code: HTTP_ERRORS.STATUS, detail: { status: 503 } })
    }
  })

  it('returns an http_network error when fetch throws', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))

    const result = await getJson('https://x')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe(HTTP_ERRORS.NETWORK)
  })

  it('returns an http_parse error when the body is not json', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('bad json')
      },
    })

    const result = await getJson('https://x')

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe(HTTP_ERRORS.PARSE)
  })
})
