import { ActivityIndicator, View } from 'react-native'

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
    return (
      <Screen>
        <StatusView
          title="Job not found"
          message="This role is no longer available."
          action={{ label: 'Go back', onPress: onBack, variant: 'outline' }}
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
