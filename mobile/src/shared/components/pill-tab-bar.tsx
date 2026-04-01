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
  home: { icon: 'home' },
  results: { icon: 'bar-chart' },
  profile: { icon: 'person' },
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
                  name={tabConfig[key].icon}
                  size={21}
                  color={isFocused ? theme.colors.primary : '#6E837B'}
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
          <Ionicons name="add" size={24} color="#F6FFFA" />
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
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(31, 138, 112, 0.18)',
    backgroundColor: 'rgba(249, 255, 252, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#0D2D24',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  item: {
    width: 56,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemFocused: {
    backgroundColor: 'rgba(176, 235, 216, 0.34)',
  },
  plusButton: {
    width: 56,
    height: 56,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#EBF8F2',
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
})
