import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'react-native'

import type { FavoriteSnapshot } from '@/modules/favorites/favorites-store'
import { useRemoveFavorite } from '@/modules/favorites/hooks/use-favorites'
import { categoryShortLabel, relativeDate } from '@/shared/lib/job-format'
import { getCategoryColor } from '@/shared/theme/category-colors'
import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'
import { CompanyLogo } from '@/shared/ui/company-logo'
import { Tag } from '@/shared/ui/tag'

type FavoriteCardProps = {
  favorite: FavoriteSnapshot
  onPress: () => void
}

export function FavoriteCard({ favorite, onPress }: FavoriteCardProps) {
  const styles = useStyles()
  const theme = useTheme()
  const removeFavorite = useRemoveFavorite()
  const category = getCategoryColor(favorite.category)

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${favorite.title} at ${favorite.companyName}`}
        style={styles.content}
      >
        <CompanyLogo
          uri={favorite.companyLogoUrl}
          companyName={favorite.companyName}
          category={favorite.category}
        />
        <View style={styles.body}>
          <Text style={styles.company} numberOfLines={1}>
            {favorite.companyName}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {favorite.title}
          </Text>
          <View style={styles.metaRow}>
            <Tag label={categoryShortLabel(favorite.category)} bg={category.bg} fg={category.fg} />
            <Text style={styles.date}>{relativeDate(new Date(favorite.publishedAt))}</Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={() => removeFavorite(favorite.id)}
        accessibilityRole="button"
        accessibilityLabel="Remove from favorites"
        accessibilityState={{ selected: true }}
        hitSlop={8}
        style={styles.heart}
      >
        <Ionicons name="heart" size={19} color={theme.color.favorite} />
      </Pressable>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
  },
  content: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 13 },
  body: { flex: 1, minWidth: 0, paddingTop: 1 },
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
    marginBottom: 9,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  date: {
    fontSize: t.font.size.caption,
    fontWeight: t.font.weight.semibold,
    color: t.color.textFaint,
  },
  heart: {
    width: 38,
    height: 38,
    borderRadius: t.radius.md,
    backgroundColor: t.color.dangerSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
