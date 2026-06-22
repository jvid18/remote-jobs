import useSWR from 'swr'

import { jobCatalog } from '@/modules/jobs/infra/catalog'
import { JOBS_ALL_KEY } from '@/modules/jobs/infra/jobs-cache'
import type { Job } from '@/modules/jobs/job'
import type { JobError } from '@/modules/jobs/job-errors'
import { type ResultError, resultFetcher } from '@/shared/http/swr-fetcher'

export type JobState =
  | { status: 'loading' }
  | { status: 'error'; error: JobError; retry: () => void }
  | { status: 'not-found' }
  | { status: 'ready'; job: Job }

export function useJob(id: string): JobState {
  const { data, error, isLoading, mutate } = useSWR<Job[], ResultError<JobError>>(
    JOBS_ALL_KEY,
    () => resultFetcher(() => jobCatalog.listJobs({})),
  )

  if (error) return { status: 'error', error: error.appError, retry: () => void mutate() }
  if (isLoading && !data) return { status: 'loading' }

  const job = (data ?? []).find(candidate => candidate.id === id) ?? null
  if (!job) return { status: 'not-found' }

  return { status: 'ready', job }
}
