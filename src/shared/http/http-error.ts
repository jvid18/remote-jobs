import type { AppError, NoDetail } from '@/shared/result'

export const HTTP_ERRORS = {
  NETWORK: 'http_network',
  STATUS: 'http_status',
  PARSE: 'http_parse',
} as const

type HttpErrorMap = {
  [HTTP_ERRORS.NETWORK]: NoDetail
  [HTTP_ERRORS.STATUS]: { status: number }
  [HTTP_ERRORS.PARSE]: NoDetail
}

export type HttpError = {
  [K in keyof HttpErrorMap]: AppError<K, HttpErrorMap[K]>
}[keyof HttpErrorMap]
