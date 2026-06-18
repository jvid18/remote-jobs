import { Tabs } from 'expo-router'
import { Platform } from 'react-native'

import { Colors } from '@/shared/constants/colors'
import { useColorScheme } from '@/shared/hooks/use-color-scheme'
import { HapticTab } from '@/shared/ui/haptic-tab'
import { IconSymbol } from '@/shared/ui/icons/icon-symbol'
import TabBarBackground from '@/shared/ui/tab-bar-background'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Tabs>
  )
}
