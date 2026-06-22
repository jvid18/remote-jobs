import { Pressable, Text, View } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'

type StatusAction = {
  label: string
  onPress: () => void
  variant?: 'filled' | 'outline'
}

type StatusViewProps = {
  title: string
  message: string
  action?: StatusAction
  tone?: 'neutral' | 'error'
}

export function StatusView({ title, message, action, tone = 'neutral' }: StatusViewProps) {
  const styles = useStyles()
  return (
    <View style={styles.container} accessibilityRole={tone === 'error' ? 'alert' : 'summary'}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          style={[styles.button, action.variant === 'outline' ? styles.outline : styles.filled]}
        >
          <Text style={action.variant === 'outline' ? styles.outlineLabel : styles.filledLabel}>
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const useStyles = makeStyles(t => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 46,
    paddingHorizontal: t.spacing.xl,
  },
  title: {
    fontSize: t.font.size.h3,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
    marginBottom: t.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: t.font.size.body,
    color: t.color.textMuted,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 250,
    marginBottom: t.spacing.xl,
  },
  button: {
    minHeight: 50,
    paddingHorizontal: 26,
    borderRadius: t.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { backgroundColor: t.color.primary },
  outline: { borderWidth: 1.5, borderColor: t.color.border, backgroundColor: t.color.surface },
  filledLabel: {
    color: t.color.onPrimary,
    fontSize: t.font.size.bodyLg,
    fontWeight: t.font.weight.bold,
  },
  outlineLabel: {
    color: t.color.textPrimary,
    fontSize: t.font.size.bodyLg,
    fontWeight: t.font.weight.bold,
  },
}))
