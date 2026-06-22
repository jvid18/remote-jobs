import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useFavoriteCount } from '@/modules/favorites/hooks/use-favorites'
import { useTheme } from '@/shared/theme/use-theme'
import { HapticTab } from '@/shared/ui/haptic-tab'
import TabBarBackground from '@/shared/ui/tab-bar-background'

export default function TabLayout() {
  const theme = useTheme()
  const favoriteCount = useFavoriteCount()
  const { bottom } = useSafeAreaInsets()
  const tabBarBadge = favoriteCount === 0 ? undefined : favoriteCount > 99 ? '99+' : favoriteCount

  return (
    <Tabs
      safeAreaInsets={{ bottom: bottom > 0 ? 20 : 0 }}
      screenOptions={{
        tabBarActiveTintColor: theme.color.primary,
        tabBarInactiveTintColor: theme.color.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({ ios: { position: 'absolute' }, default: {} }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
          ),
          tabBarBadge: tabBarBadge,
          tabBarBadgeStyle: {
            backgroundColor: theme.color.favorite,
            fontSize: 10,
          },
        }}
      />
    </Tabs>
  )
}
