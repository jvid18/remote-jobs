import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { Pressable, ScrollView, Share, Text, View } from 'react-native'

import { useIsFavorite, useToggleFavorite } from '@/modules/favorites/hooks/use-favorites'
import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'

import type { Job } from '../job'
import { CompanyLogo } from './company-logo'
import { DescriptionRenderer } from './description-renderer'
import { JobMetaCards } from './job-meta-cards'
import { relativeDate } from './job-presentation'

type IconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  onPress: () => void
  tint?: string
}

function IconButton({ icon, label, onPress, tint }: IconButtonProps) {
  const styles = useStyles()
  const theme = useTheme()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={styles.iconButton}
    >
      <Ionicons name={icon} size={20} color={tint ?? theme.color.textPrimary} />
    </Pressable>
  )
}

export function JobDetailContent({ job, onBack }: { job: Job; onBack: () => void }) {
  const styles = useStyles()
  const theme = useTheme()
  const isFavorite = useIsFavorite(job.id)
  const toggleFavorite = useToggleFavorite()

  const onApply = () => {
    void WebBrowser.openBrowserAsync(job.applyUrl)
  }
  const onShare = () => {
    void Share.share({
      message: `${job.title} at ${job.companyName}\n${job.applyUrl}`,
      url: job.applyUrl,
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <IconButton icon="arrow-back" label="Go back" onPress={onBack} />
        <IconButton icon="share-outline" label="Share job" onPress={onShare} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <CompanyLogo
            uri={job.companyLogoUrl}
            companyName={job.companyName}
            category={job.category}
            size={84}
          />
          <Text style={styles.title}>{job.title}</Text>
          <View style={styles.companyRow}>
            <Text style={styles.company}>{job.companyName}</Text>
            <View style={styles.dot} />
            <Text style={styles.location}>{job.location}</Text>
          </View>
        </View>

        <JobMetaCards job={job} />

        <View style={styles.postedRow}>
          <Ionicons name="time-outline" size={15} color={theme.color.textFaint} />
          <Text style={styles.posted}>Posted {relativeDate(job.publishedAt)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Job Description</Text>
        <DescriptionRenderer ast={job.description} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          onPress={() => toggleFavorite(job)}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          accessibilityState={{ selected: isFavorite }}
          style={styles.favSquare}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={23}
            color={isFavorite ? theme.color.favorite : theme.color.textFaint}
          />
        </Pressable>
        <Pressable
          onPress={onApply}
          accessibilityRole="button"
          accessibilityLabel="Apply now"
          style={styles.applyButton}
        >
          <Text style={styles.applyLabel}>Apply Now</Text>
          <Ionicons name="arrow-forward" size={18} color={theme.color.onPrimary} />
        </Pressable>
      </View>
    </View>
  )
}

const useStyles = makeStyles(t => ({
  container: { flex: 1, backgroundColor: t.color.surface },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.spacing.xl,
    paddingVertical: 6,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: t.radius.md,
    backgroundColor: t.color.surfaceMuted,
    borderWidth: 1,
    borderColor: t.color.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: t.spacing.xl, paddingBottom: 26 },
  hero: { alignItems: 'center', paddingTop: 18 },
  title: {
    fontSize: t.font.size.h2,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 7,
  },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  company: {
    fontSize: t.font.size.body,
    fontWeight: t.font.weight.bold,
    color: t.color.textSecondary,
  },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: t.color.textFaint },
  location: {
    fontSize: t.font.size.body,
    fontWeight: t.font.weight.medium,
    color: t.color.textMuted,
  },
  postedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 20,
  },
  posted: {
    fontSize: t.font.size.footnote,
    fontWeight: t.font.weight.semibold,
    color: t.color.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
    marginBottom: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: t.spacing.xl,
    paddingTop: 14,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: t.color.borderSubtle,
    backgroundColor: t.color.surface,
  },
  favSquare: {
    width: 56,
    height: 56,
    borderRadius: t.radius.lg,
    borderWidth: 1.5,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: t.radius.lg,
    backgroundColor: t.color.primary,
  },
  applyLabel: {
    color: t.color.onPrimary,
    fontSize: t.font.size.bodyLg,
    fontWeight: t.font.weight.extrabold,
  },
}))
