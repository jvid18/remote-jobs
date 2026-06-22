import { Ionicons } from '@expo/vector-icons'
import { Pressable, TextInput, View } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'

type SearchBarProps = {
  value: string
  onChangeText: (text: string) => void
  onClear: () => void
}

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const styles = useStyles()
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={19} color={theme.color.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search title or company"
        placeholderTextColor={theme.color.textMuted}
        accessibilityLabel="Search jobs"
        returnKeyType="search"
        autoCorrect={false}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          style={styles.clear}
        >
          <Ionicons name="close" size={14} color={theme.color.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  )
}

const useStyles = makeStyles(t => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 54,
    paddingHorizontal: 16,
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
    borderRadius: t.radius.lg,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 14.5,
    fontWeight: t.font.weight.medium,
    color: t.color.textPrimary,
  },
  clear: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: t.color.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
