import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

import { useIsFavorite, useToggleFavorite } from '@/modules/favorites/hooks/use-favorites'
import { FavoriteHeartButton } from '@/modules/favorites/ui/favorite-heart-button'
import { categoryShortLabel, jobTypeLabel, relativeDate } from '@/shared/lib/job-format'
import { getCategoryColor } from '@/shared/theme/category-colors'
import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'
import { CompanyLogo } from '@/shared/ui/company-logo'
import { Tag } from '@/shared/ui/tag'

import type { Job } from '../job'

type JobCardProps = {
  job: Job
  onPress: () => void
}

export function JobCard({ job, onPress }: JobCardProps) {
  const styles = useStyles()
  const theme = useTheme()
  const isFavorite = useIsFavorite(job.id)
  const toggleFavorite = useToggleFavorite()
  const category = getCategoryColor(job.category)

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${job.title} at ${job.companyName}`}
        style={styles.content}
      >
        <View style={styles.headerRow}>
          <CompanyLogo
            uri={job.companyLogoUrl}
            companyName={job.companyName}
            category={job.category}
          />
          <View style={styles.titleColumn}>
            <Text style={styles.company} numberOfLines={1}>
              {job.companyName}
            </Text>
            <Text style={styles.title} numberOfLines={2}>
              {job.title}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={theme.color.textFaint} />
          <Text style={styles.location} numberOfLines={1}>
            {job.location}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Tag label={categoryShortLabel(job.category)} bg={category.bg} fg={category.fg} />
          <Tag label={jobTypeLabel(job.type)} />
          <Text style={styles.date}>{relativeDate(job.publishedAt)}</Text>
        </View>
      </Pressable>

      <FavoriteHeartButton
        active={isFavorite}
        onPress={() => toggleFavorite(job)}
        accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        style={styles.heart}
      />
    </View>
  )
}

const useStyles = makeStyles(t => ({
  card: {
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.borderSubtle,
    borderRadius: t.radius.xl,
    padding: 18,
    marginBottom: 14,
  },
  content: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 13, paddingRight: 62 },
  titleColumn: { flex: 1, minWidth: 0, paddingTop: 1 },
  company: {
    fontSize: t.font.size.footnote,
    fontWeight: t.font.weight.semibold,
    color: t.color.textMuted,
    marginBottom: 3,
  },
  title: {
    fontSize: t.font.size.bodyLg,
    fontWeight: t.font.weight.bold,
    color: t.color.textPrimary,
    lineHeight: 21,
  },
  heart: { position: 'absolute', top: 18, right: 18 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 13 },
  location: {
    fontSize: t.font.size.footnote,
    fontWeight: t.font.weight.medium,
    color: t.color.textMuted,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  date: {
    marginLeft: 'auto',
    fontSize: t.font.size.caption,
    fontWeight: t.font.weight.semibold,
    color: t.color.textFaint,
  },
}))
