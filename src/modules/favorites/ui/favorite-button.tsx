import { View, type StyleProp, type ViewStyle } from 'react-native'

import type { FavoriteInput } from '../favorites-store'
import { useIsFavorite, useToggleFavorite } from '../hooks/use-favorites'
import { FavoriteHeartButton } from './favorite-heart-button'

type FavoriteButtonProps = {
  job: FavoriteInput
  containerStyle?: StyleProp<ViewStyle>
  activeContainerStyle?: StyleProp<ViewStyle>
}

export function FavoriteButton({ job, containerStyle, activeContainerStyle }: FavoriteButtonProps) {
  const isFavorite = useIsFavorite(job.id)
  const toggleFavorite = useToggleFavorite()

  const button = (
    <FavoriteHeartButton
      active={isFavorite}
      onPress={() => toggleFavorite(job)}
      accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
    />
  )

  if (!containerStyle && !activeContainerStyle) return button

  return <View style={[containerStyle, isFavorite && activeContainerStyle]}>{button}</View>
}
