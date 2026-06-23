import { useLocalSearchParams, useRouter } from 'expo-router'

import { useIsFavorite, useRemoveFavorite } from '@/modules/favorites/hooks/use-favorites'
import { FavoriteButton } from '@/modules/favorites/ui/favorite-button'
import type { Job } from '@/modules/jobs/job'
import { JobDetailScreen } from '@/modules/jobs/ui/job-detail-screen'
import { makeStyles } from '@/shared/theme/make-styles'

function DetailFavoriteButton({ job }: { job: Job }) {
  const styles = useStyles()
  return (
    <FavoriteButton
      job={job}
      containerStyle={styles.favSquare}
      activeContainerStyle={styles.favSquareActive}
    />
  )
}

const useStyles = makeStyles(t => ({
  favSquare: {
    width: 56,
    height: 56,
    borderRadius: t.radius.md,
    backgroundColor: t.color.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favSquareActive: { backgroundColor: t.color.dangerSurface },
}))

export default function JobDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const isSaved = useIsFavorite(id)
  const removeFavorite = useRemoveFavorite()

  return (
    <JobDetailScreen
      id={id}
      onBack={() => router.back()}
      renderFavoriteButton={job => <DetailFavoriteButton job={job} />}
      isSaved={isSaved}
      onRemoveSavedFavorite={() => removeFavorite(id)}
    />
  )
}
