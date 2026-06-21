import type { AppError, NoDetail } from '@/shared/result'

export const JOB_ERRORS = {
  NETWORK: 'job_network',
  BAD_RESPONSE: 'job_bad_response',
  NOT_FOUND: 'job_not_found',
} as const

type JobErrorMap = {
  [JOB_ERRORS.NETWORK]: NoDetail
  [JOB_ERRORS.BAD_RESPONSE]: NoDetail
  [JOB_ERRORS.NOT_FOUND]: { id: string }
}

export type JobError = {
  [K in keyof JobErrorMap]: AppError<K, JobErrorMap[K]>
}[keyof JobErrorMap]
