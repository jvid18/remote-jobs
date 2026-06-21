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

function serializeQuery(query: JobQuery): string {
  return JSON.stringify([query.search ?? '', query.category ?? '', query.type ?? ''])
}

export function useJobs(query: JobQuery): UseJobs {
  const key = env.clientSideFilters ? JOBS_ALL_KEY : ['jobs', serializeQuery(query)]

  const { data, error, isLoading, isValidating, mutate } = useSWR<Job[], ResultError<JobError>>(
    key,
    () => resultFetcher(() => jobCatalog.listJobs(env.clientSideFilters ? {} : query)),
  )

  const jobs = useMemo(
    () => (env.clientSideFilters ? filterJobs(data ?? [], query) : (data ?? [])),
    [data, query],
  )

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
