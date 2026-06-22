import { Text, View } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'

type TagProps = {
  label: string
  bg?: string
  fg?: string
}

export function Tag({ label, bg, fg }: TagProps) {
  const styles = useStyles()
  return (
    <View style={[styles.base, bg ? { backgroundColor: bg } : styles.defaultBg]}>
      <Text style={[styles.label, fg ? { color: fg } : styles.defaultFg]}>{label}</Text>
    </View>
  )
}

const useStyles = makeStyles(t => ({
  base: {
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: t.radius.sm,
  },
  defaultBg: { backgroundColor: t.color.surfaceMuted },
  label: { fontSize: 11.5, fontWeight: t.font.weight.bold },
  defaultFg: { color: t.color.textMuted },
}))
