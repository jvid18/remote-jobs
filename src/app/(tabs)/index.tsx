import { useRouter } from 'expo-router'

import { JobsListScreen } from '@/modules/jobs/ui/jobs-list-screen'

export default function JobsRoute() {
  const router = useRouter()
  // The /jobs/[id] route is created in Phase 3 (Job Detail).
  return (
    <JobsListScreen
      onOpenJob={id =>
        // @ts-expect-error route is added in Phase 3
        router.push(`/jobs/${id}`)
      }
    />
  )
}
