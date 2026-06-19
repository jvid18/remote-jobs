type Ok<T> = { ok: true; value: T }
type Err<E> = { ok: false; error: E }
export type Result<T, E> = Ok<T> | Err<E>

export type NoDetail = Record<string, never>
export type ErrorDetail = Record<string, unknown>

export type AppError<C extends string, D extends ErrorDetail = NoDetail> = {
  code: C
  detail: D
  cause?: unknown
}

export type DomainResult<T, E extends AppError<string, ErrorDetail>> = Result<T, E>

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value })
export const err = <E>(error: E): Err<E> => ({ ok: false, error })
export const appError = <C extends string, D extends ErrorDetail>(
  code: C,
  detail: D,
  cause?: unknown,
): AppError<C, D> => ({ code, detail, cause })
