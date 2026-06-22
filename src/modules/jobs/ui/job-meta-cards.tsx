import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

import { categoryShortLabel, jobTypeLabel } from '@/shared/lib/job-format'
import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'

import type { Job } from '../job'

type MetaCardProps = {
  icon: keyof typeof Ionicons.glyphMap
  tint: string
  tintBg: string
  label: string
  value: string
}

function MetaCard({ icon, tint, tintBg, label, value }: MetaCardProps) {
  const styles = useStyles()
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: tintBg }]}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  )
}

export function JobMetaCards({ job }: { job: Job }) {
  const styles = useStyles()
  const theme = useTheme()
  const salary = job.salary.kind === 'text' ? job.salary.value : 'Not disclosed'

  return (
    <View style={styles.row}>
      <MetaCard
        icon="cash-outline"
        tint={theme.color.success}
        tintBg={theme.color.successSurface}
        label="Salary"
        value={salary}
      />
      <MetaCard
        icon="time-outline"
        tint={theme.color.info}
        tintBg={theme.color.infoSurface}
        label="Job Type"
        value={jobTypeLabel(job.type)}
      />
      <MetaCard
        icon="briefcase-outline"
        tint="#B07A26"
        tintBg="#FBEFD9"
        label="Category"
        value={categoryShortLabel(job.category)}
      />
    </View>
  )
}

const useStyles = makeStyles(t => ({
  row: { flexDirection: 'row', gap: 11, marginTop: 24, marginBottom: 8 },
  card: {
    flex: 1,
    backgroundColor: t.color.surfaceMuted,
    borderRadius: t.radius.lg,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 9,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10.5,
    fontWeight: t.font.weight.semibold,
    color: t.color.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  value: {
    fontSize: t.font.size.footnote,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
    textAlign: 'center',
  },
}))
