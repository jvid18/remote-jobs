export const JOB_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship',
} as const

export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES]
