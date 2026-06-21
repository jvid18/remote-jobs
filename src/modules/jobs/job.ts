import type { DescriptionAst } from './job-description'

export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship',
} as const

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES]

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
