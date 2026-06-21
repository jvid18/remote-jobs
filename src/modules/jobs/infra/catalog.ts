import { env } from '@/shared/config/env'

import { createRemotiveCatalog } from './remotive-catalog'

export const jobCatalog = createRemotiveCatalog(env.apiUrl)
