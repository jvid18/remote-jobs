import { useMemo } from 'react'
import { StyleSheet } from 'react-native'

import type { Theme } from './theme'
import { useTheme } from './use-theme'

/**
 * Builds a themed StyleSheet once per theme change
 *
 * @example
 * ```ts
 * const useStyles = makeStyles((theme) => ({
 *   card: { backgroundColor: theme.color.surface }
 * }))
 * const styles = useStyles()
 * ```
 */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T) {
  return function useStyles(): T {
    const theme = useTheme()
    return useMemo(() => StyleSheet.create(factory(theme)), [theme])
  }
}
