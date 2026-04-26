import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { theme } from '../theme'

interface WaveformBarsProps {
  active?: boolean
  color?: string
  bars?: number
  height?: number
}

export function WaveformBars({
  active = true,
  color = theme.colors.primary,
  bars = 7,
  height = 48,
}: WaveformBarsProps) {
  const values = useRef(
    Array.from({ length: bars }, () => new Animated.Value(0.3)),
  ).current

  useEffect(() => {
    if (!active) {
      values.forEach((v) => v.setValue(0.18))
      return
    }

    const animations = values.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, {
            toValue: 0.3 + Math.random() * 0.7,
            duration: 380 + i * 60,
            useNativeDriver: false,
          }),
          Animated.timing(v, {
            toValue: 0.2 + Math.random() * 0.4,
            duration: 380 + i * 60,
            useNativeDriver: false,
          }),
        ]),
      ),
    )

    animations.forEach((a) => a.start())
    return () => animations.forEach((a) => a.stop())
  }, [active, values])

  return (
    <View style={[styles.row, { height }]}>
      {values.map((v, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              backgroundColor: active ? color : `${color}55`,
              height: v.interpolate({
                inputRange: [0, 1],
                outputRange: [6, height],
              }),
            },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  bar: {
    width: 4,
    borderRadius: 999,
  },
})
