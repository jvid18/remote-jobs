import { useLocalSearchParams, useRouter } from 'expo-router'

import { JobDetailScreen } from '@/modules/jobs/ui/job-detail-screen'

export default function JobDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  return <JobDetailScreen id={id} onBack={() => router.back()} />
}
