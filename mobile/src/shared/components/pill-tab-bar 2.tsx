import { Ionicons } from '@expo/vector-icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Easing,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
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
  const xAnim = useRef(new Animated.Value(0)).current
  const widthAnim = useRef(new Animated.Value(0)).current
  const itemLayouts = useRef<Record<string, { x: number; width: number }>>({})

  const focusedRoute = state.routes[state.index]?.name

  const animateTo = useCallback(
    (routeName: string) => {
      const layout = itemLayouts.current[routeName]
      if (!layout) {
        return
      }

      Animated.parallel([
        Animated.timing(xAnim, {
          toValue: layout.x,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: layout.width,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start()
    },
    [widthAnim, xAnim],
  )

  useEffect(() => {
    if (focusedRoute) {
      animateTo(focusedRoute)
    }
  }, [focusedRoute, animateTo])

  const onTabLayout = (routeName: string) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout
    itemLayouts.current[routeName] = { x, width }
    if (focusedRoute === routeName) {
      animateTo(routeName)
    }
  }

  return (
    <View
      style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <View style={styles.container}>
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <Animated.View
          pointerEvents="none"
          style={[styles.activePill, { left: xAnim, width: widthAnim }]}
        />
        {state.routes.map((route, index) => {
          if (!(route.name in tabConfig)) {
            return null
          }

          const key = route.name as keyof typeof tabConfig
          const isFocused = state.index === index
          const { options } = descriptors[route.key]

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              haptics.tap()
              animateTo(route.name)
              navigation.navigate(route.name, route.params)
            }
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLayout={onTabLayout(route.name)}
              style={styles.item}
            >
              <Ionicons
                name={tabConfig[key].icon}
                size={22}
                color={isFocused ? theme.colors.primary : theme.colors.muted}
              />
            </Pressable>
          )
        })}
      </View>

      <Pressable
        style={[
          styles.plusButton,
          { bottom: Math.max(insets.bottom, 10) + 13 },
        ]}
        onPress={() => {
          haptics.tap()
          router.push('/pair-lery')
        }}
      >
        <Ionicons name="add" color={theme.colors.surface} size={26} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    backgroundColor: 'transparent',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 6,
    alignItems: 'flex-start',
  },
  container: {
    overflow: 'hidden',
    backgroundColor: 'rgba(246, 255, 251, 0.82)',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(31, 138, 112, 0.16)',
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    width: '80%',
    ...theme.shadow.soft,
  },
  activePill: {
    position: 'absolute',
    top: 7,
    bottom: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(176, 235, 216, 0.42)',
  },
  item: {
    width: 60,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
    zIndex: 2,
    marginHorizontal: 2,
  },
  plusButton: {
    position: 'absolute',
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    width: 58,
    height: 58,
    borderWidth: 4,
    borderColor: '#ECFAF4',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.34,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
})
