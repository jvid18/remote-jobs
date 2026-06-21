import useSWR from 'swr'

import { jobCatalog } from '@/modules/jobs/infra/catalog'
import type { Category } from '@/modules/jobs/job'
import type { JobError } from '@/modules/jobs/job-errors'
import { type ResultError, resultFetcher } from '@/shared/http/swr-fetcher'

export function useCategories(): { categories: Category[]; loading: boolean } {
  const { data, isLoading } = useSWR<Category[], ResultError<JobError>>(['categories'], () =>
    resultFetcher(() => jobCatalog.listCategories()),
  )
  return { categories: data ?? [], loading: isLoading }
}
