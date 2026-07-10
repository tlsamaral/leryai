/** biome-ignore-all lint/suspicious/useIterableCallbackReturn: Animated API returns from forEach are safe */
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PrimaryButton } from '../shared/components/primary-button'
import { theme } from '../shared/theme'

type ProvisionState = 'searching' | 'found' | 'connecting' | 'success'

// ─── expanding rings ──────────────────────────────────────────────────────────

function ExpandingRings({
  active,
  size,
  color,
}: {
  active: boolean
  size: number
  color: string
}) {
  const anims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current

  useEffect(() => {
    if (!active) {
      anims.forEach((a) => a.setValue(0))
      return
    }
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 520),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1700,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    )
    animations.forEach((a) => a.start())
    return () => {
      animations.forEach((a) => a.stop())
      anims.forEach((a) => a.setValue(0))
    }
  }, [active, anims])

  return (
    <>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: color,
            opacity: anim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0.7, 0],
            }),
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 2.5],
                }),
              },
            ],
          }}
        />
      ))}
    </>
  )
}

// ─── processing dots ──────────────────────────────────────────────────────────

function ProcessingDots() {
  const anims = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 180),
          Animated.timing(anim, {
            toValue: 1,
            duration: 360,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 360,
            useNativeDriver: true,
          }),
          Animated.delay(360),
        ]),
      ),
    )
    animations.forEach((a) => a.start())
    return () => animations.forEach((a) => a.stop())
  }, [anims])

  return (
    <View style={styles.dotsRow}>
      {anims.map((anim, i) => (
        <Animated.View key={i} style={[styles.dot, { opacity: anim }]} />
      ))}
    </View>
  )
}

// ─── main screen ──────────────────────────────────────────────────────────────

export default function WifiProvisionScreen() {
  const insets = useSafeAreaInsets()
  const [state, setState] = useState<ProvisionState>('searching')

  const cardY = useRef(new Animated.Value(500)).current
  const blurOpacity = useRef(new Animated.Value(0)).current
  const successScale = useRef(new Animated.Value(0.8)).current

  // Auto-advance: searching → found after 1.5s (replace with BLE detection later)
  useEffect(() => {
    const t = setTimeout(() => setState('found'), 1500)
    return () => clearTimeout(t)
  }, [])

  // Animate on state changes
  useEffect(() => {
    if (state === 'found') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Animated.parallel([
        Animated.spring(cardY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 120,
        }),
        Animated.timing(blurOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start()
    }

    if (state === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Animated.spring(successScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 180,
      }).start()
      const t = setTimeout(() => router.back(), 2000)
      return () => clearTimeout(t)
    }
  }, [state, cardY, blurOpacity, successScale])

  function handleConnect() {
    setState('connecting')
    setTimeout(() => setState('success'), 2000)
  }

  const showCard = state !== 'searching'

  return (
    <View style={styles.root}>
      {/* Semi-dark backdrop (always present) */}
      <View style={styles.darkOverlay} />

      {/* Blur layer (fades in when device is found) */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]}
      >
        <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Searching state: centered animation */}
      {!showCard && (
        <View style={styles.searchingContainer}>
          <View style={styles.iconWrap}>
            <ExpandingRings active size={80} color={theme.colors.primary} />
            <Ionicons
              name="radio-outline"
              size={40}
              color={theme.colors.primary}
            />
          </View>
          <ProcessingDots />
          <Text style={styles.searchingText}>Procurando Lery...</Text>
        </View>
      )}

      {/* Card: slides up from bottom when device is found */}
      {showCard && (
        <Animated.View
          style={[
            styles.card,
            {
              paddingBottom: insets.bottom + 24,
              transform: [{ translateY: cardY }],
            },
          ]}
        >
          <View style={styles.handle} />

          {state === 'success' ? (
            <View style={styles.successContent}>
              <Animated.View style={{ transform: [{ scale: successScale }] }}>
                <Ionicons
                  name="checkmark-circle"
                  size={64}
                  color={theme.colors.mint}
                />
              </Animated.View>
              <Text style={styles.successTitle}>WiFi configurado!</Text>
              <Text style={styles.successSub}>
                O Lery vai reiniciar e conectar à rede.
              </Text>
            </View>
          ) : (
            <View style={styles.cardContent}>
              <View style={styles.deviceIconWrap}>
                <Ionicons name="radio" size={48} color={theme.colors.primary} />
              </View>

              <Text style={styles.foundLabel}>Lery encontrado</Text>
              <Text style={styles.deviceName}>Lery-A3F2</Text>
              <Text style={styles.networkLabel}>Rede detectada: —</Text>

              <View style={styles.actions}>
                <PrimaryButton
                  label="Configurar WiFi"
                  onPress={handleConnect}
                  loading={state === 'connecting'}
                  icon={state === 'connecting' ? undefined : 'wifi'}
                  tone="cyan"
                />
                <Pressable
                  onPress={() => router.back()}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,13,18,0.82)',
  },

  // Searching
  searchingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  iconWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  searchingText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // Card
  card: {
    backgroundColor: 'rgba(10,27,35,0.97)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  cardContent: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
  },
  deviceIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: 'rgba(4,210,255,0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(4,210,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  foundLabel: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  deviceName: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    fontSize: 22,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  networkLabel: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    marginBottom: 12,
  },
  actions: {
    width: '100%',
    gap: 4,
    marginTop: 4,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
  },

  // Success
  successContent: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 20,
  },
  successTitle: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    fontSize: 22,
    letterSpacing: -0.5,
  },
  successSub: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
})
