import { useRouter } from 'expo-router'

import { FavoriteButton } from '@/modules/favorites/ui/favorite-button'
import { JobsListScreen } from '@/modules/jobs/ui/jobs-list-screen'

export default function JobsRoute() {
  const router = useRouter()
  return (
    <JobsListScreen
      onOpenJob={id => router.push(`/jobs/${id}`)}
      renderFavoriteButton={job => <FavoriteButton job={job} />}
    />
  )
}
