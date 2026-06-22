import { JOB_TYPES, type JobType } from '@/shared/lib/job-types'

const TYPE_LABELS: Record<JobType, string> = {
  [JOB_TYPES.FULL_TIME]: 'Full-time',
  [JOB_TYPES.PART_TIME]: 'Part-time',
  [JOB_TYPES.CONTRACT]: 'Contract',
  [JOB_TYPES.FREELANCE]: 'Freelance',
  [JOB_TYPES.INTERNSHIP]: 'Internship',
}

export function jobTypeLabel(type: JobType | null): string {
  return type ? TYPE_LABELS[type] : 'Not specified'
}

function categoryKey(category: string): string {
  return category
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

const SHORT_LABELS: Record<string, string> = {
  'software-development': 'Dev',
  design: 'Design',
  product: 'Product',
  marketing: 'Marketing',
  'customer-service': 'Support',
  'data-analysis': 'Data',
  'finance-legal': 'Finance',
}

export function categoryShortLabel(category: string): string {
  return SHORT_LABELS[categoryKey(category)] ?? category
}

const HOUR = 3_600_000

export function relativeDate(date: Date, now: Date = new Date()): string {
  const hours = (now.getTime() - date.getTime()) / HOUR
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${Math.floor(hours)}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

export function companyInitial(companyName: string): string {
  return (companyName.trim()[0] ?? '?').toUpperCase()
}
