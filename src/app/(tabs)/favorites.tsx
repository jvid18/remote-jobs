import { useRouter } from 'expo-router'

import { FavoritesScreen } from '@/modules/favorites/ui/favorites-screen'

export default function FavoritesRoute() {
  const router = useRouter()
  return (
    <FavoritesScreen
      onOpenJob={id => router.push(`/jobs/${id}`)}
      onBrowse={() => router.navigate('/')}
    />
  )
}
