jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file, need to use require() instead of import.
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
)

jest.mock('expo-font')

jest.mock('@expo/vector-icons', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file
  const { createElement } = require('react')
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file
  const { Text } = require('react-native')
  const MockIcon = (props: { name?: string; [key: string]: unknown }) =>
    createElement(Text, props, props.name ?? 'icon')
  return {
    __esModule: true,
    Ionicons: MockIcon,
    createIconSet: () => MockIcon,
  }
})

jest.mock('@expo/vector-icons/MaterialIcons', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file
  const { createElement } = require('react')
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file
  const { Text } = require('react-native')
  return {
    __esModule: true,
    default: (props: { name?: string; [key: string]: unknown }) =>
      createElement(Text, props, props.name ?? 'icon'),
  }
})

// gorhom mounts its content through a portal only after an imperative present();
// render children inline so component tests can query the sheet contents directly.
jest.mock('@gorhom/bottom-sheet', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file
  const { createElement, forwardRef } = require('react')
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest setup file
  const { View } = require('react-native')
  const passthrough = forwardRef((props: { children?: React.ReactNode }, _ref: unknown) =>
    createElement(View, null, props.children),
  )
  passthrough.displayName = 'MockBottomSheet'
  return {
    __esModule: true,
    BottomSheetModal: passthrough,
    BottomSheetView: View,
    BottomSheetBackdrop: () => null,
    BottomSheetModalProvider: ({ children }: { children: React.ReactNode }) => children,
  }
})

jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 }
  const frame = { x: 0, y: 0, width: 375, height: 812 }
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    initialWindowMetrics: { frame, insets },
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
  }
})
