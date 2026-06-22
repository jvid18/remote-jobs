import { Ionicons } from '@expo/vector-icons'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, type ListRenderItem, Pressable, RefreshControl, Text, View } from 'react-native'

import { useCategories } from '@/modules/jobs/hooks/use-categories'
import { useJobs } from '@/modules/jobs/hooks/use-jobs'
import type { Job, JobType } from '@/modules/jobs/job'
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
  const filterRef = useRef<BottomSheetModal>(null)
  const listRef = useRef<FlatList>(null)

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

  // Jump back to the top whenever the active query changes, so results aren't shown
  // mid-scroll from the previous filter.
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false })
  }, [query])

  const isFiltering = Boolean(search || category || type)
  const reset = () => {
    setSearchInput('')
    setCategory(null)
    setType(null)
  }

  // Stable references so memoized JobCards skip re-rendering on every list update.
  const keyExtractor = useCallback((job: Job) => job.id, [])
  const renderItem = useCallback<ListRenderItem<Job>>(
    ({ item }) => (
      <View style={styles.cardWrap}>
        <JobCard job={item} onPress={onOpenJob} />
      </View>
    ),
    [styles.cardWrap, onOpenJob],
  )

  // App name, search and category chips stay pinned on top
  const pinnedBar = (
    <View>
      <Text style={styles.wordmark}>RemoteJobs</Text>
      <View style={styles.searchRow}>
        <SearchBar
          value={searchInput}
          onChangeText={setSearchInput}
          onClear={() => setSearchInput('')}
        />
        <Pressable
          onPress={() => filterRef.current?.present()}
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
      <View style={styles.chipsInner}>
        <CategoryChips categories={categories} selected={category} onSelect={setCategory} />
      </View>
    </View>
  )

  // Section title + count scroll with the list.
  const scrollHeader = (
    <View>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{isFiltering ? 'Results' : 'Recent jobs'}</Text>
        {jobs.status === 'ready' ? <Text style={styles.count}>{jobs.jobs.length} jobs</Text> : null}
      </View>
      <View style={styles.divider} />
    </View>
  )

  return (
    <Screen>
      {pinnedBar}
      {jobs.status === 'loading' ? (
        <>
          {scrollHeader}
          <JobsSkeleton />
        </>
      ) : null}
      {jobs.status === 'error' ? (
        <StatusView
          tone="error"
          title="No connection"
          message="We couldn't load jobs from Remotive. Check your connection and try again."
          action={{ label: 'Try again', onPress: jobs.retry }}
        />
      ) : null}
      {jobs.status === 'empty' ? (
        <>
          {scrollHeader}
          <StatusView
            title="No jobs found"
            message="Try a different keyword or adjust your filters to see more roles."
            action={{ label: 'Clear filters', onPress: reset, variant: 'outline' }}
          />
        </>
      ) : null}
      {jobs.status === 'ready' ? (
        <FlatList
          ref={listRef}
          data={jobs.jobs}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={scrollHeader}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={jobs.refreshing} onRefresh={jobs.refresh} />}
        />
      ) : null}

      <JobTypeSheet ref={filterRef} selected={type} onSelect={setType} />
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
    paddingBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: t.spacing.xl,
  },
  chipsInner: { paddingTop: 14, paddingBottom: 4 },
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
    paddingTop: 12,
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
  divider: {
    height: 1,
    backgroundColor: t.color.border,
    marginTop: 4,
    marginBottom: 16,
    marginHorizontal: t.spacing.xl,
  },
  cardWrap: { paddingHorizontal: t.spacing.xl },
  listContent: { paddingTop: 8, paddingBottom: 120 },
}))
