import useSWR from 'swr'

import { jobCatalog } from '@/modules/jobs/infra/catalog'
import { JOBS_ALL_KEY } from '@/modules/jobs/infra/jobs-cache'
import type { Job } from '@/modules/jobs/job'
import type { JobError } from '@/modules/jobs/job-errors'
import { type ResultError, resultFetcher } from '@/shared/http/swr-fetcher'

export function useJob(id: string): { job: Job | null; loading: boolean } {
  const { data, isLoading } = useSWR<Job[], ResultError<JobError>>(JOBS_ALL_KEY, () =>
    resultFetcher(() => jobCatalog.listJobs({})),
  )
  const job = (data ?? []).find(candidate => candidate.id === id) ?? null
  return { job, loading: isLoading && !data }
}
