import { getJson } from '@/shared/http/http-client'
import type { HttpError } from '@/shared/http/http-error'
import { appError, err, ok } from '@/shared/result'

import type { JobCatalog, JobQuery } from '../job-catalog'
import { JOB_ERRORS, type JobError } from '../job-errors'
import {
  toCategories,
  toJobs,
  type RemotiveCategoriesResponse,
  type RemotiveJobsResponse,
} from './remotive-adapter'

function toJobError(error: HttpError): JobError {
  if (error.code === 'http_network') return appError(JOB_ERRORS.NETWORK, {}, error)
  return appError(JOB_ERRORS.BAD_RESPONSE, {}, error)
}

function buildJobsUrl(baseUrl: string, query: JobQuery): string {
  const params: string[] = []
  if (query.search?.trim()) params.push(`search=${encodeURIComponent(query.search.trim())}`)
  if (query.category?.trim()) params.push(`category=${encodeURIComponent(query.category.trim())}`)
  return `${baseUrl}/remote-jobs${params.length ? `?${params.join('&')}` : ''}`
}

export function createRemotiveCatalog(baseUrl: string): JobCatalog {
  return {
    async listJobs(query) {
      const result = await getJson<RemotiveJobsResponse>(buildJobsUrl(baseUrl, query))
      if (!result.ok) return err(toJobError(result.error))
      if (!Array.isArray(result.value.jobs)) return err(appError(JOB_ERRORS.BAD_RESPONSE, {}))
      return ok(toJobs(result.value.jobs))
    },

    async listCategories() {
      const result = await getJson<RemotiveCategoriesResponse>(`${baseUrl}/remote-jobs/categories`)
      if (!result.ok) return err(toJobError(result.error))
      if (!Array.isArray(result.value.jobs)) return err(appError(JOB_ERRORS.BAD_RESPONSE, {}))
      return ok(toCategories(result.value.jobs))
    },
  }
}
