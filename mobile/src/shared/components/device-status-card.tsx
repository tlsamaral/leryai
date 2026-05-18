import { Image, StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'
import { AppCard } from './app-card'
import { WaveformBars } from './waveform-bars'

interface DeviceStatusCardProps {
  paired: boolean
  deviceName?: string
  variant?: 'light' | 'dark'
  onPress?: () => void
}

export function DeviceStatusCard({
  paired,
  deviceName,
  variant = 'dark',
  onPress,
}: DeviceStatusCardProps) {
  const isLight = variant === 'light'

  return (
    <AppCard tone="default" onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.statusDot, isLight && styles.statusDotLight]}>
          <View
            style={[
              styles.statusInner,
              isLight && styles.statusInnerLight,
              paired && styles.statusInnerActive,
            ]}
          />
        </View>
        <Text style={[styles.statusLabel, isLight && styles.statusLabelLight]}>
          {paired ? 'Pronto · Aguardando' : 'Sem dispositivo'}
        </Text>
        <View style={styles.spacer} />
        <Image
          source={require('../../../assets/logo.png')}
          style={[styles.headerLogo, isLight && styles.headerLogoLight]}
        />
      </View>

      <View style={styles.waveWrap}>
        <WaveformBars active={paired} bars={9} height={56} />
      </View>

      <View style={styles.footer}>
        <Text
          style={[styles.deviceName, isLight && styles.deviceNameLight]}
          numberOfLines={1}
        >
          {paired ? (deviceName ?? 'Lery físico') : 'Conecte seu Lery'}
        </Text>
        <Text
          style={[styles.helper, isLight && styles.helperLight]}
          numberOfLines={2}
        >
          {paired
            ? 'Diga "Hey Lery" no dispositivo para começar a conversar'
            : 'Pareie agora para começar suas sessões de prática'}
        </Text>
      </View>
    </AppCard>
  )
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    gap: 14,
  },
  shellDark: {
    backgroundColor: 'rgba(4, 210, 255, 0.08)',
    borderColor: 'rgba(4, 210, 255, 0.15)',
  },
  shellLight: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.border,
    shadowOpacity: 0.55,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
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
  statusDotLight: {
    backgroundColor: theme.colors.primarySoft,
  },
  statusInner: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#5A6E78',
  },
  statusInnerLight: {
    backgroundColor: '#B0C4CC',
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
    fontFamily: theme.fonts.black,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  statusLabelLight: {
    color: theme.colors.primaryDeep,
  },
  spacer: {
    flex: 1,
  },
  headerLogo: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    opacity: 0.6,
  },
  headerLogoLight: {
    tintColor: theme.colors.primaryDeep,
    opacity: 0.25,
  },
  waveWrap: {
    paddingVertical: 4,
  },
  footer: {
    gap: 4,
  },
  deviceName: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    fontSize: 22,
    letterSpacing: -0.4,
  },
  deviceNameLight: {
    color: theme.colors.text,
  },
  helper: {
    color: 'rgba(229,250,255,0.6)',
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.9,
  },
  helperLight: {
    color: theme.colors.muted,
  },
})
