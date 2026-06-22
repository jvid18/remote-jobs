import { useMemo } from 'react'
import useSWR from 'swr'

import { jobCatalog } from '@/modules/jobs/infra/catalog'
import { filterJobs } from '@/modules/jobs/infra/client-filter'
import type { Job } from '@/modules/jobs/job'
import type { JobQuery } from '@/modules/jobs/job-catalog'
import type { JobError } from '@/modules/jobs/job-errors'
import { env } from '@/shared/config/env'
import { type ResultError, resultFetcher } from '@/shared/http/swr-fetcher'

const JOBS_ALL_KEY = ['jobs', 'all']

export type JobsState =
  | { status: 'loading' }
  | { status: 'error'; error: JobError; retry: () => void }
  | { status: 'empty' }
  | { status: 'ready'; jobs: Job[] }

export type UseJobs = JobsState & { refreshing: boolean; refresh: () => void }

// `type` is omitted: the Remotive API exposes the param but it currently does
// not work, so type is always filtered client-side (see clientQuery below). It
// must not drive the SWR key — it changes nothing about the request.
function serializeServerQuery(query: JobQuery): string {
  return JSON.stringify([query.search ?? '', query.category ?? ''])
}

export function useJobs(query: JobQuery): UseJobs {
  // What the server resolves vs what we filter locally. In client mode the server
  // gets nothing and every field is filtered in memory; in server mode the API
  // handles search/category and only `type` stays client-side.
  const serverQuery: JobQuery = env.clientSideFilters
    ? {}
    : { search: query.search, category: query.category }

  const key = env.clientSideFilters ? JOBS_ALL_KEY : ['jobs', serializeServerQuery(serverQuery)]

  const { data, error, isLoading, isValidating, mutate } = useSWR<Job[], ResultError<JobError>>(
    key,
    () => resultFetcher(() => jobCatalog.listJobs(serverQuery)),
  )

  const jobs = useMemo(() => {
    const clientQuery: JobQuery = env.clientSideFilters ? query : { type: query.type }
    return filterJobs(data ?? [], clientQuery)
  }, [data, query])

  const refresh = () => {
    void mutate()
  }

  if (error)
    return {
      status: 'error',
      error: error.appError,
      retry: refresh,
      refreshing: false,
      refresh,
    }
  if (isLoading && !data) return { status: 'loading', refreshing: false, refresh }
  if (jobs.length === 0) return { status: 'empty', refreshing: isValidating, refresh }

  return { status: 'ready', jobs, refreshing: isValidating, refresh }
}
