import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { forwardRef, type MutableRefObject, useCallback, useRef } from 'react'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'
import { Chip } from '@/shared/ui/chip'

import { JOB_TYPES, type JobType } from '../job'
import { jobTypeLabel } from './job-presentation'

const TYPES: JobType[] = [
  JOB_TYPES.FULL_TIME,
  JOB_TYPES.CONTRACT,
  JOB_TYPES.PART_TIME,
  JOB_TYPES.FREELANCE,
  JOB_TYPES.INTERNSHIP,
]

type JobTypeSheetProps = {
  selected: JobType | null
  onSelect: (type: JobType | null) => void
}

// Imperative: the parent opens it with `ref.current?.present()`. Selection stays in the
// parent (via onSelect); the sheet just closes on swipe, backdrop tap, or "Done".
export const JobTypeSheet = forwardRef<BottomSheetModal, JobTypeSheetProps>(function JobTypeSheet(
  { selected, onSelect },
  ref,
) {
  const styles = useStyles()
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  // Keep an internal handle so the "Done" button can dismiss while still forwarding
  // the same instance to the parent's ref.
  const innerRef = useRef<BottomSheetModal | null>(null)
  const setRefs = useCallback(
    (node: BottomSheetModal | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as MutableRefObject<BottomSheetModal | null>).current = node
    },
    [ref],
  )

  // Backdrop fades in over the sheet (opacity), it does not slide with it.
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    [],
  )

  return (
    <BottomSheetModal
      ref={setRefs}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: theme.color.border }}
      backgroundStyle={styles.background}
    >
      <BottomSheetView style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Job type</Text>
          <Pressable onPress={() => onSelect(null)} accessibilityRole="button">
            <Text style={styles.reset}>Reset</Text>
          </Pressable>
        </View>
        <View style={styles.chips}>
          <Chip label="All types" selected={selected === null} onPress={() => onSelect(null)} />
          {TYPES.map(type => (
            <Chip
              key={type}
              label={jobTypeLabel(type)}
              selected={selected === type}
              onPress={() => onSelect(type)}
            />
          ))}
        </View>
        <Pressable
          onPress={() => innerRef.current?.dismiss()}
          accessibilityRole="button"
          style={styles.cta}
        >
          <Text style={styles.ctaLabel}>Done</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  )
})

const useStyles = makeStyles(t => ({
  background: { backgroundColor: t.color.surface, borderRadius: 28 },
  content: { paddingHorizontal: t.spacing.xl, paddingTop: 6 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: t.font.size.subtitle,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
  },
  reset: { fontSize: t.font.size.footnote, fontWeight: t.font.weight.bold, color: t.color.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 26 },
  cta: {
    height: 54,
    borderRadius: t.radius.lg,
    backgroundColor: t.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    color: t.color.onPrimary,
    fontSize: t.font.size.bodyLg,
    fontWeight: t.font.weight.bold,
  },
}))
