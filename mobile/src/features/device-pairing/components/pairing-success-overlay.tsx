import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useEffect, useRef } from 'react'
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { PulseRing } from '../../../shared/components/pulse-ring'
import { theme } from '../../../shared/theme'

interface PairingSuccessOverlayProps {
  visible: boolean
  onDismiss: () => void
}

export function PairingSuccessOverlay({ visible, onDismiss }: PairingSuccessOverlayProps) {
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const cardScale = useRef(new Animated.Value(0.72)).current
  const cardOpacity = useRef(new Animated.Value(0)).current
  const checkScale = useRef(new Animated.Value(0)).current
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!visible) return

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0.88,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 75,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.spring(checkScale, {
        toValue: 1,
        tension: 130,
        friction: 7,
        useNativeDriver: true,
      }).start()
    })

    dismissTimer.current = setTimeout(() => {
      animateOut(onDismiss)
    }, 2600)

    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current)
      backdropOpacity.setValue(0)
      cardScale.setValue(0.72)
      cardOpacity.setValue(0)
      checkScale.setValue(0)
    }
  }, [visible])

  const animateOut = (cb: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.9,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => cb())
  }

  const handleTap = () => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current)
    animateOut(onDismiss)
  }

  if (!visible) return null

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <Pressable style={styles.root} onPress={handleTap}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <PulseRing size={140} color={theme.colors.mint} active>
            <Animated.View style={{ transform: [{ scale: checkScale }] }}>
              <Ionicons name="checkmark" size={48} color={theme.colors.mint} />
            </Animated.View>
          </PulseRing>

          <View style={styles.texts}>
            <Text style={styles.title}>Conectado!</Text>
            <Text style={styles.sub}>Lery está pronto para conversar</Text>
          </View>

          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Dispositivo pareado</Text>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#040D12',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: `${theme.colors.mint}33`,
    padding: 32,
    alignItems: 'center',
    gap: 20,
    width: 300,
    shadowColor: theme.colors.mint,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  texts: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  sub: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${theme.colors.mint}18`,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: `${theme.colors.mint}33`,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: theme.colors.mint,
    shadowColor: theme.colors.mint,
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    color: theme.colors.mint,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})
