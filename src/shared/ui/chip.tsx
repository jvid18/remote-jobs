import { Pressable, Text } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'

type ChipProps = {
  label: string
  selected?: boolean
  onPress?: () => void
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const styles = useStyles()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.base, selected ? styles.selected : styles.idle]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}>
        {label}
      </Text>
    </Pressable>
  )
}

const useStyles = makeStyles(t => ({
  base: {
    height: 38,
    minWidth: 44,
    paddingHorizontal: 17,
    borderRadius: t.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: t.color.primary, borderColor: t.color.primary },
  idle: { backgroundColor: t.color.surface, borderColor: t.color.border },
  label: { fontSize: 13.5, fontWeight: t.font.weight.bold },
  labelSelected: { color: t.color.onPrimary },
  labelIdle: { color: t.color.textSecondary },
}))
