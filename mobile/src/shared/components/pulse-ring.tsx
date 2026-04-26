import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { theme } from '../theme'

interface PulseRingProps {
  size?: number
  color?: string
  active?: boolean
  children?: React.ReactNode
}

export function PulseRing({
  size = 160,
  color = theme.colors.primary,
  active = true,
  children,
}: PulseRingProps) {
  const scale = useRef(new Animated.Value(1)).current
  const opacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    if (!active) {
      scale.setValue(1)
      opacity.setValue(0.3)
      return
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.07,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ]),
    )

    pulse.start()
    return () => pulse.stop()
  }, [active, scale, opacity])

  const activeColor = active ? color : theme.colors.dim

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.outerRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: activeColor,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
      <View
        style={[
          styles.innerCircle,
          {
            width: size * 0.62,
            height: size * 0.62,
            borderRadius: (size * 0.62) / 2,
            backgroundColor: active
              ? `${color}22`
              : `${theme.colors.dim}18`,
            borderColor: active ? `${color}55` : `${theme.colors.dim}33`,
          },
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    borderWidth: 2,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
})
