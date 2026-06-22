import type { JobType } from '@/shared/lib/job-types'

import type { DescriptionAst } from './job-description'

export { JOB_TYPES, type JobType } from '@/shared/lib/job-types'

export type Salary = { kind: 'unspecified' } | { kind: 'text'; value: string }

export type Job = {
  id: string
  title: string
  companyName: string
  companyLogoUrl: string | null
  category: string
  type: JobType | null
  location: string
  publishedAt: Date
  salary: Salary
  applyUrl: string
  description: DescriptionAst
}

export type Category = { slug: string; name: string }
