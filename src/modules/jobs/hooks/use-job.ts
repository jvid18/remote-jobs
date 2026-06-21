import useSWR from 'swr'

import { jobCatalog } from '@/modules/jobs/infra/catalog'
import type { Job } from '@/modules/jobs/job'
import type { JobError } from '@/modules/jobs/job-errors'
import { type ResultError, resultFetcher } from '@/shared/http/swr-fetcher'

const JOBS_ALL_KEY = ['jobs', 'all']

// Reuses the cached full list (shared key with useJobs on the client-filter path).
// No per-id endpoint exists, so a cold cache refetches all and finds by id.
export function useJob(id: string): { job: Job | null; loading: boolean } {
  const { data, isLoading } = useSWR<Job[], ResultError<JobError>>(JOBS_ALL_KEY, () =>
    resultFetcher(() => jobCatalog.listJobs({})),
  )
  const job = (data ?? []).find(candidate => candidate.id === id) ?? null
  return { job, loading: isLoading && !data }
}
