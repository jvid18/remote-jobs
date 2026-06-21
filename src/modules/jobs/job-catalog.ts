import type { DomainResult } from '@/shared/result'

import type { Category, Job, JobType } from './job'
import type { JobError } from './job-errors'

export type JobQuery = {
  search?: string
  category?: string // category display name (Remotive accepts name or slug)
  type?: JobType
}

export type JobCatalog = {
  listJobs(query: JobQuery): Promise<DomainResult<Job[], JobError>>
  listCategories(): Promise<DomainResult<Category[], JobError>>
}
