import { Ionicons } from '@expo/vector-icons'
import { Pressable, type StyleProp, type ViewStyle } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'

type FavoriteHeartButtonProps = {
  active: boolean
  onPress: () => void
  accessibilityLabel: string
  style?: StyleProp<ViewStyle>
}

export function FavoriteHeartButton({
  active,
  onPress,
  accessibilityLabel,
  style,
}: FavoriteHeartButtonProps) {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
      hitSlop={8}
      style={[styles.button, active && styles.buttonActive, style]}
    >
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={19}
        color={active ? theme.color.favorite : theme.color.textFaint}
      />
    </Pressable>
  )
}

const useStyles = makeStyles(t => ({
  button: {
    width: 38,
    height: 38,
    borderRadius: t.radius.md,
    backgroundColor: t.color.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: { backgroundColor: t.color.dangerSurface },
}))
