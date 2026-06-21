import { JOB_TYPES, type Category, type Job, type JobType } from '@/modules/jobs/job'

import { htmlToAst } from './html-to-ast'

export type RemotiveJobRaw = {
  id?: number | string
  url?: string
  title?: string
  company_name?: string
  company_logo?: string
  category?: string
  job_type?: string
  publication_date?: string
  candidate_required_location?: string
  salary?: string
  description?: string
}

export type RemotiveJobsResponse = { jobs?: RemotiveJobRaw[] }

export type RemotiveCategoryRaw = { id?: number; name?: string; slug?: string }

export type RemotiveCategoriesResponse = { jobs?: RemotiveCategoryRaw[] }

const JOB_TYPE_VALUES = new Set<string>(Object.values(JOB_TYPES))

function normalizeType(raw: string | undefined): JobType | null {
  return raw && JOB_TYPE_VALUES.has(raw) ? (raw as JobType) : null
}

export function toJob(raw: RemotiveJobRaw): Job | null {
  if (raw.id === undefined || raw.id === null) return null
  if (!raw.title || !raw.company_name || !raw.url) return null

  const publishedAt = raw.publication_date ? new Date(raw.publication_date) : null
  if (!publishedAt || Number.isNaN(publishedAt.getTime())) return null

  const salaryText = raw.salary?.trim()

  return {
    id: String(raw.id),
    title: raw.title,
    companyName: raw.company_name,
    companyLogoUrl: raw.company_logo ? raw.company_logo : null,
    category: raw.category?.trim() || 'Other',
    type: normalizeType(raw.job_type),
    location: raw.candidate_required_location?.trim() || 'Worldwide',
    publishedAt,
    salary: salaryText ? { kind: 'text', value: salaryText } : { kind: 'unspecified' },
    applyUrl: raw.url,
    description: htmlToAst(raw.description ?? ''),
  }
}

export function toJobs(raw: RemotiveJobRaw[]): Job[] {
  return raw.map(toJob).filter((job): job is Job => job !== null)
}

export function toCategory(raw: RemotiveCategoryRaw): Category | null {
  if (!raw.name || !raw.slug) return null
  return { slug: raw.slug, name: raw.name }
}

export function toCategories(raw: RemotiveCategoryRaw[]): Category[] {
  return raw.map(toCategory).filter((category): category is Category => category !== null)
}
