import { ResultError, resultFetcher } from '@/shared/http/swr-fetcher'
import { appError, err, ok } from '@/shared/result'

describe('resultFetcher', () => {
  it('resolves the value when the result is ok', async () => {
    await expect(resultFetcher(async () => ok(42))).resolves.toBe(42)
  })

  it('throws a ResultError carrying the typed error when the result is err', async () => {
    const error = appError('boom', { n: 1 })

    await expect(resultFetcher(async () => err(error))).rejects.toBeInstanceOf(ResultError)

    try {
      await resultFetcher(async () => err(error))
      throw new Error('expected resultFetcher to throw')
    } catch (caught) {
      expect((caught as ResultError<typeof error>).appError).toEqual(error)
    }
  })
})
