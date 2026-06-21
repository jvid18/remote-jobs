import type { Job } from '@/modules/jobs/job'
import type { JobQuery } from '@/modules/jobs/job-catalog'

export function filterJobs(jobs: Job[], query: JobQuery): Job[] {
  const search = query.search?.trim().toLowerCase() ?? ''
  return jobs.filter(job => {
    if (Boolean(query.category) && job.category !== query.category) return false
    if (Boolean(query.type) && job.type !== query.type) return false
    if (Boolean(search) && !`${job.title} ${job.companyName}`.toLowerCase().includes(search))
      return false
    return true
  })
}
