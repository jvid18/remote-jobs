import type { AppError, DomainResult, ErrorDetail } from '@/shared/result'

// SWR needs a fetcher that throws to drive retry/dedupe. ResultError is the only
// place a domain error becomes an exception — it carries the typed AppError so
// hooks can unwrap it back into a typed UI state.
export class ResultError<E extends AppError<string, ErrorDetail>> extends Error {
  constructor(public readonly appError: E) {
    super(appError.code)
    this.name = 'ResultError'
  }
}

export async function resultFetcher<T, E extends AppError<string, ErrorDetail>>(
  run: () => Promise<DomainResult<T, E>>,
): Promise<T> {
  const result = await run()
  if (!result.ok) throw new ResultError(result.error)
  return result.value
}
