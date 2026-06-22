import { Modal, Pressable, Text, View } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'
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
  visible: boolean
  selected: JobType | null
  onSelect: (type: JobType | null) => void
  onClose: () => void
}

export function JobTypeSheet({ visible, selected, onSelect, onClose }: JobTypeSheetProps) {
  const styles = useStyles()
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close filters"
      />
      <View style={styles.sheet}>
        <View style={styles.handle} />
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
        <Pressable onPress={onClose} accessibilityRole="button" style={styles.cta}>
          <Text style={styles.ctaLabel}>Done</Text>
        </Pressable>
      </View>
    </Modal>
  )
}

const useStyles = makeStyles(t => ({
  backdrop: { flex: 1, backgroundColor: 'rgba(20,20,34,0.38)' },
  sheet: {
    backgroundColor: t.color.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: t.spacing.xl,
    paddingTop: 10,
    paddingBottom: 30,
  },
  handle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: t.color.border,
    alignSelf: 'center',
    marginBottom: 18,
  },
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
