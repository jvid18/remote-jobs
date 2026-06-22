import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'
import { type Edge, SafeAreaView } from 'react-native-safe-area-context'

import { makeStyles } from '@/shared/theme/make-styles'

type ScreenProps = {
  children: ReactNode
  edges?: readonly Edge[]
  style?: ViewStyle
}

export function Screen({ children, edges = ['top'], style }: ScreenProps) {
  const styles = useStyles()
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  )
}

const useStyles = makeStyles(t => ({
  screen: { flex: 1, backgroundColor: t.color.background },
}))
