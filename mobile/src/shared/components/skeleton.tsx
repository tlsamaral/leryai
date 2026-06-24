import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native'
import { theme } from '../theme'

interface SkeletonProps {
  width?: number | `${number}%`
  height?: number
  radius?: number
  style?: ViewStyle
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius = theme.radius.md,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.55)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.55,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [opacity])

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: width as number | `${number}%`,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  )
}

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={styles.card}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="40%" height={14} />
          <Skeleton width="80%" height={12} />
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: theme.colors.border,
  },
  list: {
    gap: 14,
  },
  card: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: 10,
  },
})
