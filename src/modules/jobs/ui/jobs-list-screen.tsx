import { Ionicons } from '@expo/vector-icons'
import { useMemo, useState } from 'react'
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native'

import { useCategories } from '@/modules/jobs/hooks/use-categories'
import { useJobs } from '@/modules/jobs/hooks/use-jobs'
import type { JobType } from '@/modules/jobs/job'
import type { JobQuery } from '@/modules/jobs/job-catalog'
import { CategoryChips } from '@/modules/jobs/ui/category-chips'
import { JobCard } from '@/modules/jobs/ui/job-card'
import { JobTypeSheet } from '@/modules/jobs/ui/job-type-sheet'
import { JobsSkeleton } from '@/modules/jobs/ui/jobs-skeleton'
import { SearchBar } from '@/modules/jobs/ui/search-bar'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { makeStyles } from '@/shared/theme/make-styles'
import { useTheme } from '@/shared/theme/use-theme'
import { Screen } from '@/shared/ui/screen'
import { StatusView } from '@/shared/ui/status-view'

type JobsListScreenProps = {
  onOpenJob: (id: string) => void
}

export function JobsListScreen({ onOpenJob }: JobsListScreenProps) {
  const styles = useStyles()
  const theme = useTheme()

  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [type, setType] = useState<JobType | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)

  const search = useDebouncedValue(searchInput, 300)
  const query = useMemo<JobQuery>(
    () => ({
      search: search || undefined,
      category: category ?? undefined,
      type: type ?? undefined,
    }),
    [search, category, type],
  )

  const jobs = useJobs(query)
  const { categories } = useCategories()

  const isFiltering = Boolean(search || category || type)
  const reset = () => {
    setSearchInput('')
    setCategory(null)
    setType(null)
  }

  const header = (
    <View>
      <Text style={styles.wordmark}>RemoteJobs</Text>
      <View style={styles.searchRow}>
        <SearchBar
          value={searchInput}
          onChangeText={setSearchInput}
          onClear={() => setSearchInput('')}
        />
        <Pressable
          onPress={() => setFilterOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Filter by job type"
          accessibilityState={{ selected: type !== null }}
          style={[styles.filterButton, type !== null && styles.filterButtonActive]}
        >
          <Ionicons
            name="options-outline"
            size={21}
            color={type !== null ? theme.color.onPrimary : theme.color.textPrimary}
          />
        </Pressable>
      </View>
      <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{isFiltering ? 'Results' : 'Recent jobs'}</Text>
        {jobs.status === 'ready' ? <Text style={styles.count}>{jobs.jobs.length} jobs</Text> : null}
      </View>
    </View>
  )

  return (
    <Screen>
      {header}
      {jobs.status === 'loading' ? <JobsSkeleton /> : null}
      {jobs.status === 'error' ? (
        <StatusView
          tone="error"
          title="No connection"
          message="We couldn't load jobs from Remotive. Check your connection and try again."
          action={{ label: 'Try again', onPress: jobs.retry }}
        />
      ) : null}
      {jobs.status === 'empty' ? (
        <StatusView
          title="No jobs found"
          message="Try a different keyword or adjust your filters to see more roles."
          action={{ label: 'Clear filters', onPress: reset, variant: 'outline' }}
        />
      ) : null}
      {jobs.status === 'ready' ? (
        <FlatList
          data={jobs.jobs}
          keyExtractor={job => job.id}
          renderItem={({ item }) => <JobCard job={item} onPress={() => onOpenJob(item.id)} />}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={jobs.refreshing} onRefresh={jobs.refresh} />}
        />
      ) : null}

      <JobTypeSheet
        visible={filterOpen}
        selected={type}
        onSelect={setType}
        onClose={() => setFilterOpen(false)}
      />
    </Screen>
  )
}

const useStyles = makeStyles(t => ({
  wordmark: {
    fontSize: t.font.size.h3,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
    paddingHorizontal: t.spacing.xl,
    paddingTop: 8,
    paddingBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: t.spacing.xl,
    marginBottom: 16,
  },
  filterButton: {
    width: 54,
    height: 54,
    borderRadius: t.radius.lg,
    backgroundColor: t.color.surface,
    borderWidth: 1,
    borderColor: t.color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: { backgroundColor: t.color.primary, borderColor: t.color.primary },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.spacing.xl,
    paddingTop: 18,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: t.font.size.subtitle,
    fontWeight: t.font.weight.extrabold,
    color: t.color.textPrimary,
  },
  count: {
    fontSize: t.font.size.footnote,
    fontWeight: t.font.weight.bold,
    color: t.color.textMuted,
  },
  listContent: { paddingHorizontal: t.spacing.xl, paddingBottom: 120 },
}))
