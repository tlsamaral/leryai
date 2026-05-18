import { Ionicons } from '@expo/vector-icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'

import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHaptics } from '../hooks/use-haptics'
import { theme } from '../theme'

const tabConfig = {
  home: { icon: 'home-outline', iconFocused: 'home', label: 'Início' },
  journey: { icon: 'map-outline', iconFocused: 'map', label: 'Trilha' },
  results: {
    icon: 'bar-chart-outline',
    iconFocused: 'bar-chart',
    label: 'Progresso',
  },
  profile: { icon: 'person-outline', iconFocused: 'person', label: 'Perfil' },
} as const

export function PillTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const haptics = useHaptics()

  const tabs = useMemo(
    () => state.routes.filter((route) => route.name in tabConfig),
    [state.routes],
  )

  return (
    <View
      style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.tabsRow}>
        {tabs.map((route) => {
          const isFocused =
            state.index === state.routes.findIndex((r) => r.key === route.key)
          const key = route.name as keyof typeof tabConfig
          const cfg = tabConfig[key]
          const { options } = descriptors[route.key]

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })
                if (!isFocused && !event.defaultPrevented) {
                  haptics.tap()
                  navigation.navigate(route.name, route.params)
                }
              }}
              style={styles.tabItem}
            >
              <View style={styles.iconWrap}>
                <Ionicons
                  name={isFocused ? cfg.iconFocused : cfg.icon}
                  size={isFocused ? 28 : 26}
                  color={isFocused ? theme.colors.primaryDeep : '#A5B5BA'}
                />
              </View>
              {isFocused && <View style={styles.activeDot} />}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderTopColor: '#EAEFEF',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    height: 48,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primaryDeep,
    marginTop: 4,
    position: 'absolute',
    bottom: 2,
  },
})
