import { FlatList, Text, View } from 'react-native'

import { useFavoriteSnapshots } from '@/modules/favorites/hooks/use-favorites'
import { makeStyles } from '@/shared/theme/make-styles'
import { Screen } from '@/shared/ui/screen'
import { StatusView } from '@/shared/ui/status-view'

import { FavoriteCard } from './favorite-card'

type FavoritesScreenProps = {
  onOpenJob: (id: string) => void
  onBrowse: () => void
}

export function FavoritesScreen({ onOpenJob, onBrowse }: FavoritesScreenProps) {
  const styles = useStyles()
  const favorites = useFavoriteSnapshots()

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.count}>{favorites.length} saved</Text>
      </View>
      {favorites.length === 0 ? (
        <StatusView
          title="No favorites yet"
          message="Tap the heart on any job to save it here for later."
          action={{ label: 'Browse jobs', onPress: onBrowse }}
        />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={favorite => favorite.id}
          renderItem={({ item }) => (
            <FavoriteCard favorite={item} onPress={() => onOpenJob(item.id)} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </Screen>
  )
}

const useStyles = makeStyles(t => ({
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: t.spacing.xl,
    paddingTop: 6,
    paddingBottom: 22,
  },
  title: {
    fontSize: t.font.size.h1,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
  },
  count: {
    fontSize: t.font.size.footnote,
    fontWeight: t.font.weight.bold,
    color: t.color.textMuted,
  },
  list: { paddingHorizontal: t.spacing.xl, paddingBottom: 120 },
}))
