import { Ionicons } from '@expo/vector-icons'
import { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'

interface StreakHighlightProps {
  currentStreak: number
  longestStreak: number
}

export function StreakHighlight({
  currentStreak,
  longestStreak,
}: StreakHighlightProps) {
  const pulse = useRef(new Animated.Value(1)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  const progress = useMemo(() => {
    if (longestStreak <= 0) {
      return 0
    }

    return Math.min(currentStreak / longestStreak, 1)
  }, [currentStreak, longestStreak])

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    )

    loop.start()

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start()

    return () => {
      loop.stop()
    }
  }, [progress, progressAnim, pulse])

  const width = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Animated.View
          style={[styles.iconWrap, { transform: [{ scale: pulse }] }]}
        >
          <Ionicons name="flame" size={20} color="#F08C2D" />
        </Animated.View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>Streak ativo</Text>
          <Text style={styles.subtitle}>
            {currentStreak} dias seguidos • recorde {longestStreak}
          </Text>
        </View>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: 14,
    backgroundColor: '#F8FCFA',
    borderWidth: 1,
    borderColor: '#E2EEE8',
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#FFF1DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 1,
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E8F0EC',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
})
