import { useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'
import { Chip } from '@/shared/ui/chip'

import type { Category } from '../job'

type CategoryChipsProps = {
  categories: Category[]
  selected: string | null // category name, or null for "All"
  onSelect: (name: string | null) => void
}

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  const styles = useStyles()
  const theme = useTheme()
  const scrollRef = useRef<ScrollView>(null)
  // Layout x of each chip within the scroll content, keyed by category name ('' = "All").
  const offsets = useRef<Record<string, number>>({})

  // Bring the selected chip to the left edge, keeping it aligned with the rest of the
  // content (spacing.xl in from the screen border) instead of flush against it.
  useEffect(() => {
    const x = offsets.current[selected ?? '']
    if (x === undefined) return
    scrollRef.current?.scrollTo({ x: Math.max(0, x - theme.spacing.xl), animated: true })
  }, [selected, theme.spacing.xl])

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip
        label="All"
        selected={selected === null}
        onPress={() => onSelect(null)}
        onLayout={e => {
          offsets.current[''] = e.nativeEvent.layout.x
        }}
      />
      {categories.map(category => (
        <Chip
          key={category.slug}
          label={category.name}
          selected={selected === category.name}
          onPress={() => onSelect(category.name)}
          onLayout={e => {
            offsets.current[category.name] = e.nativeEvent.layout.x
          }}
        />
      ))}
    </ScrollView>
  )
}

const useStyles = makeStyles(t => ({
  row: { gap: 9, paddingVertical: 2, paddingHorizontal: t.spacing.xl },
}))
