import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'
import { WaveformBars } from './waveform-bars'

interface DeviceStatusCardProps {
  paired: boolean
  deviceName?: string
  onPress?: () => void
}

export function DeviceStatusCard({
  paired,
  deviceName,
  onPress,
}: DeviceStatusCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shell, pressed && styles.pressed]}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.header}>
        <View style={styles.statusDot}>
          <View style={[styles.statusInner, paired && styles.statusInnerActive]} />
        </View>
        <Text style={styles.statusLabel}>
          {paired ? 'Pronto · Aguardando' : 'Sem dispositivo'}
        </Text>
        <View style={styles.spacer} />
        <Ionicons name="hardware-chip-outline" size={16} color="#04D2FF" />
      </View>

      <View style={styles.waveWrap}>
        <WaveformBars active={paired} bars={9} height={56} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.deviceName} numberOfLines={1}>
          {paired ? (deviceName ?? 'Lery físico') : 'Conecte seu Lery'}
        </Text>
        <Text style={styles.helper} numberOfLines={2}>
          {paired
            ? 'Diga "Lery" no dispositivo para começar a conversar'
            : 'Pareie agora para começar suas sessões de prática'}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: '#040D12',
    borderRadius: 28,
    padding: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(4,210,255,0.18)',
    shadowColor: '#04D2FF',
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    gap: 16,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  glowTop: {
    position: 'absolute',
    top: -90,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.20)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.10)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(4,210,255,0.15)',
  },
  statusInner: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#5A6E78',
  },
  statusInnerActive: {
    backgroundColor: '#04D2FF',
    shadowColor: '#04D2FF',
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  statusLabel: {
    color: '#04D2FF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  spacer: {
    flex: 1,
  },
  waveWrap: {
    paddingVertical: 6,
  },
  footer: {
    gap: 4,
  },
  deviceName: {
    color: '#F6FAFE',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  helper: {
    color: 'rgba(229,250,255,0.6)',
    fontSize: 13,
    lineHeight: 18,
  },
})
