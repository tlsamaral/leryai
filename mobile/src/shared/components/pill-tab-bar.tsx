import { Ionicons } from '@expo/vector-icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHaptics } from '../hooks/use-haptics'
import { theme } from '../theme'

const tabConfig = {
  home: { icon: 'radio-outline', iconFocused: 'radio' },
  journey: { icon: 'map-outline', iconFocused: 'map' },
  results: { icon: 'bar-chart-outline', iconFocused: 'bar-chart' },
  profile: { icon: 'person-outline', iconFocused: 'person' },
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
      <View style={styles.row}>
        <View style={styles.pillWrap}>
          <BlurView
            intensity={55}
            tint="light"
            style={StyleSheet.absoluteFill}
          />

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
                style={[styles.item, isFocused && styles.itemFocused]}
              >
                <Ionicons
                  name={isFocused ? cfg.iconFocused : cfg.icon}
                  size={22}
                  color={isFocused ? theme.colors.primary : theme.colors.dim}
                />
              </Pressable>
            )
          })}
        </View>

        <Pressable
          style={styles.plusButton}
          onPress={() => {
            haptics.tap()
            router.push('/pair-lery')
          }}
        >
          <Ionicons name="hardware-chip-outline" size={22} color="#040D12" />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    marginTop: -6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillWrap: {
    flex: 1,
    minHeight: 64,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}22`,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  item: {
    width: 54,
    height: 48,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemFocused: {
    backgroundColor: theme.colors.primarySoft,
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.pill,
    borderWidth: 2.5,
    borderColor: theme.colors.primarySoft,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
})
