import { ActivityIndicator, View } from 'react-native'

import { useIsFavorite, useRemoveFavorite } from '@/modules/favorites/hooks/use-favorites'
import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'
import { Screen } from '@/shared/ui/screen'
import { StatusView } from '@/shared/ui/status-view'

import { useJob } from '../hooks/use-job'
import { JobDetailContent } from './job-detail-content'

type JobDetailScreenProps = {
  id: string
  onBack: () => void
}

export function JobDetailScreen({ id, onBack }: JobDetailScreenProps) {
  const styles = useStyles()
  const theme = useTheme()
  const { job, loading } = useJob(id)
  const isSaved = useIsFavorite(id)
  const removeFavorite = useRemoveFavorite()

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={theme.color.primary} />
        </View>
      </Screen>
    )
  }

  if (!job) {
    // A saved job that has dropped off Remotive's list still has a snapshot, but
    // no live data to render. Offer to clean it up instead of a dead end.
    const removeAndLeave = () => {
      removeFavorite(id)
      onBack()
    }
    return (
      <Screen>
        <StatusView
          title="Job no longer available"
          message={
            isSaved
              ? 'This saved role has been taken down by the employer.'
              : 'This role is no longer available.'
          }
          action={
            isSaved
              ? { label: 'Remove from favorites', onPress: removeAndLeave, variant: 'outline' }
              : { label: 'Go back', onPress: onBack, variant: 'outline' }
          }
        />
      </Screen>
    )
  }

  return (
    <Screen>
      <JobDetailContent job={job} onBack={onBack} />
    </Screen>
  )
}

const useStyles = makeStyles(() => ({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
}))
