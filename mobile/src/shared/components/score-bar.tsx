import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

interface ScoreBarProps {
  label: string
  value: number
  max?: number
}

function fillColor(value: number, max: number): string {
  const pct = value / max
  if (pct < 0.5) return theme.colors.danger
  if (pct < 0.7) return theme.colors.warning
  return theme.colors.mint
}

export function ScoreBar({ label, value, max = 25 }: ScoreBarProps) {
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value / max,
      duration: 600,
      useNativeDriver: false,
    }).start()
  }, [value, max, anim])

  const color = fillColor(value, max)

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>
          {value}/{max}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: theme.fontWeights.semi,
  },
  value: {
    fontSize: theme.typography.caption,
    fontWeight: theme.fontWeights.bold,
  },
  track: {
    height: 7,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.pill,
  },
})
