import { useEffect, useMemo, useRef } from 'react'
import { AccessibilityInfo, Animated, View } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'

const PLACEHOLDERS = [0, 1, 2, 3]

export function JobsSkeleton() {
  const styles = useStyles()
  const opacity = useMemo(() => new Animated.Value(0.5), [])
  const animation = useRef<Animated.CompositeAnimation | null>(null)

  useEffect(() => {
    let cancelled = false
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (cancelled || reduced) return
      animation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.5, duration: 600, useNativeDriver: true }),
        ]),
      )
      animation.current.start()
    })
    return () => {
      cancelled = true
      animation.current?.stop()
    }
  }, [opacity])

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {PLACEHOLDERS.map(key => (
        <Animated.View key={key} testID="job-skeleton" style={[styles.card, { opacity }]}>
          <View style={styles.row}>
            <View style={styles.logo} />
            <View style={styles.lines}>
              <View style={styles.lineWide} />
              <View style={styles.lineNarrow} />
            </View>
          </View>
        </Animated.View>
      ))}
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  logo: { width: 48, height: 48, borderRadius: 14, backgroundColor: t.color.surfaceMuted },
  lines: { flex: 1, gap: 9 },
  lineWide: { height: 11, width: '55%', borderRadius: 6, backgroundColor: t.color.surfaceMuted },
  lineNarrow: { height: 10, width: '35%', borderRadius: 6, backgroundColor: t.color.surfaceMuted },
}))
