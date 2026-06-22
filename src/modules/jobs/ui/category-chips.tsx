import { ScrollView } from 'react-native'

import { makeStyles } from '@/shared/theme/make-styles'
import { Chip } from '@/shared/ui/chip'

import type { Category } from '../job'

type CategoryChipsProps = {
  categories: Category[]
  selected: string | null // category name, or null for "All"
  onSelect: (name: string | null) => void
}

export function CategoryChips({ categories, selected, onSelect }: CategoryChipsProps) {
  const styles = useStyles()
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Chip label="All" selected={selected === null} onPress={() => onSelect(null)} />
      {categories.map(category => (
        <Chip
          key={category.slug}
          label={category.name}
          selected={selected === category.name}
          onPress={() => onSelect(category.name)}
        />
      ))}
    </ScrollView>
  )
}

const useStyles = makeStyles(t => ({
  row: { gap: 9, paddingVertical: 2, paddingHorizontal: t.spacing.xl },
}))
