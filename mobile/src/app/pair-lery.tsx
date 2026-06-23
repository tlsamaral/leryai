import { Ionicons } from '@expo/vector-icons'
import { Redirect, router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useSessionStore } from '../features/auth/store/session-store'
import { DeviceSettingsPanel } from '../features/device-pairing/components/device-settings-panel'
import { PairingSuccessOverlay } from '../features/device-pairing/components/pairing-success-overlay'
import { QRScannerModal } from '../features/device-pairing/components/qr-scanner-modal'
import { useDeviceSettingsViewModel } from '../features/device-pairing/viewmodels/use-device-settings-view-model'
import { usePairLeryViewModel } from '../features/device-pairing/viewmodels/use-pair-lery-view-model'
import { AppCard } from '../shared/components/app-card'
import { DarkHeroLayout } from '../shared/components/dark-hero-layout'
import { LoadingState } from '../shared/components/loading-state'
import { PrimaryButton } from '../shared/components/primary-button'
import { ScreenContainer } from '../shared/components/screen-container'
import { WaveformBars } from '../shared/components/waveform-bars'
import { theme } from '../shared/theme'

export default function PairLeryPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)

  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const {
    pairingCode,
    setPairingCode,
    submitCode,
    handleQRScan,
    status,
    errorMessage,
    isLoading,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isLoadingDevices,
  } = usePairLeryViewModel()

  useEffect(() => {
    if (status === 'paired') setShowSuccess(true)
  }, [status])

  const {
    settings,
    isSavingSettings,
    updateSettings,
    voiceToneOptions,
    isLoadingSettings,
  } = useDeviceSettingsViewModel(selectedDeviceId)

  if (!isBootstrapped) {
    return (
      <ScreenContainer>
        <LoadingState />
      </ScreenContainer>
    )
  }

  if (!isAuthenticated) return <Redirect href="/auth" />

  const paired = devices.length > 0

  return (
    <>
      <DarkHeroLayout
        bottomPadding={40}
        hero={
          <>
            {/* Back button */}
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons
                name="arrow-back"
                size={20}
                color="rgba(229,250,255,0.8)"
              />
              <Text style={styles.backLabel}>Voltar</Text>
            </Pressable>

            <View style={styles.heroTopRow}>
              <View style={styles.statusDot}>
                <View
                  style={[
                    styles.statusInner,
                    paired && styles.statusInnerActive,
                  ]}
                />
              </View>
              <Text style={styles.statusLabel}>
                {paired ? 'Dispositivo conectado' : 'Sem dispositivo'}
              </Text>
              <View style={styles.flex1} />
              <Ionicons
                name="hardware-chip-outline"
                size={16}
                color={theme.colors.primary}
              />
            </View>

            <WaveformBars active={paired} bars={9} height={52} />

            <View style={styles.heroTexts}>
              <Text style={styles.heroTitle}>
                {paired ? (devices[0]?.nickname ?? 'Lery') : 'Configurar Lery'}
              </Text>
              <Text style={styles.heroSub}>
                {paired
                  ? `Pareado · ${devices[0]?.serialNumber ?? ''}`
                  : 'Pareie o hardware e personalize voz, velocidade e sensibilidade de escuta.'}
              </Text>
            </View>
          </>
        }
      >
        <AppCard tone="default" padding={16} radius={22}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Ionicons
                name="qr-code-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.cardHeaderTexts}>
              <Text style={styles.cardTitle}>Pareamento rápido</Text>
              <Text style={styles.cardSub}>
                Use o código exibido no dispositivo
              </Text>
            </View>
          </View>

          {/* QR scan button */}
          <Pressable
            style={({ pressed }) => [
              styles.qrBtn,
              pressed && styles.qrBtnPressed,
            ]}
            onPress={() => setShowQRScanner(true)}
            disabled={isLoading}
          >
            <View style={styles.qrBtnIcon}>
              <Ionicons name="qr-code" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.qrBtnTexts}>
              <Text style={styles.qrBtnTitle}>Escanear QR Code</Text>
              <Text style={styles.qrBtnSub}>Use a câmera para parear</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={theme.colors.muted}
            />
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou digite o código</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.inputWrap}>
            <Ionicons
              name="key-outline"
              size={16}
              color={theme.colors.muted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={pairingCode}
              onChangeText={setPairingCode}
              placeholder="Ex.: LERY-PAIR-001"
              autoCapitalize="characters"
              placeholderTextColor={theme.colors.dim}
            />
          </View>

          <View style={{ marginTop: 4 }}>
            <PrimaryButton
              label={isLoading ? 'Pareando...' : 'Parear dispositivo'}
              onPress={submitCode}
              disabled={isLoading}
              loading={isLoading}
              tone="cyan"
              icon={isLoading ? undefined : 'bluetooth'}
            />
          </View>

          {status === 'paired' ? (
            <View style={styles.successRow}>
              <Ionicons
                name="checkmark-circle"
                size={15}
                color={theme.colors.mint}
              />
              <Text style={styles.successText}>
                Dispositivo pareado com sucesso!
              </Text>
            </View>
          ) : null}
          {status === 'error' ? (
            <View style={styles.errorRow}>
              <Ionicons
                name="close-circle"
                size={15}
                color={theme.colors.danger}
              />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={styles.hint}>Código de teste: LERY-PAIR-001</Text>
        </AppCard>

        {/* Devices list */}
        <AppCard tone="default" padding={16} radius={22}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Ionicons
                name="radio-outline"
                size={18}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.cardHeaderTexts}>
              <Text style={styles.cardTitle}>Meus Lerys</Text>
              {isLoadingDevices ? (
                <Text style={styles.cardSub}>Carregando...</Text>
              ) : (
                <Text style={styles.cardSub}>
                  {devices.length} dispositivo(s)
                </Text>
              )}
            </View>
          </View>

          {devices.length === 0 ? (
            <View style={styles.emptyDevices}>
              <Ionicons
                name="hardware-chip-outline"
                size={28}
                color={theme.colors.dim}
              />
              <Text style={styles.emptyText}>Nenhum Lery conectado ainda.</Text>
            </View>
          ) : (
            <View style={styles.deviceList}>
              {devices.map((device) => {
                const selected = selectedDeviceId === device.id
                return (
                  <Pressable
                    key={device.id}
                    style={({ pressed }) => [
                      styles.deviceItem,
                      selected && styles.deviceItemSelected,
                      pressed && { opacity: 0.85 },
                    ]}
                    onPress={() => setSelectedDeviceId(device.id)}
                  >
                    <View
                      style={[
                        styles.deviceIcon,
                        selected && styles.deviceIconSelected,
                      ]}
                    >
                      <Ionicons
                        name="hardware-chip"
                        size={18}
                        color={
                          selected
                            ? theme.colors.primaryDeep
                            : theme.colors.muted
                        }
                      />
                    </View>
                    <View style={styles.deviceTexts}>
                      <Text
                        style={[
                          styles.deviceName,
                          selected && styles.deviceNameSelected,
                        ]}
                      >
                        {device.nickname ?? 'Lery Device'}
                      </Text>
                      <Text style={styles.deviceSerial}>
                        {device.serialNumber}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.deviceRadio,
                        selected && styles.deviceRadioSelected,
                      ]}
                    >
                      {selected ? (
                        <View style={styles.deviceRadioInner} />
                      ) : null}
                    </View>
                  </Pressable>
                )
              })}
            </View>
          )}
        </AppCard>

        {/* Settings panel */}
        {selectedDeviceId ? (
          <DeviceSettingsPanel
            settings={settings}
            isSaving={isSavingSettings || isLoadingSettings}
            voiceToneOptions={voiceToneOptions}
            onUpdate={updateSettings}
          />
        ) : null}
      </DarkHeroLayout>

      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
      <PairingSuccessOverlay
        visible={showSuccess}
        onDismiss={() => setShowSuccess(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(4,210,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
    elevation: 2,
  },
  statusLabel: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.black,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroTexts: { gap: 4 },
  heroTitle: {
    color: '#F6FAFE',
    fontFamily: theme.fonts.black,
    fontSize: 24,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: 'rgba(229,250,255,0.55)',
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },

  // Back button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  backLabel: {
    color: 'rgba(229,250,255,0.8)',
    fontFamily: theme.fonts.extraBold,
    fontSize: 15,
  },

  // Cards style is handled by AppCard
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTexts: { flex: 1, gap: 2 },
  cardTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  cardSub: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    opacity: 0.85,
  },

  // Input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 14,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: 12,
  },
  inputIcon: { marginRight: 6 },
  input: {
    flex: 1,
    minHeight: 46,
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },

  // Pair button
  pairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pairBtnDisabled: { opacity: 0.55 },
  pairBtnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  pairBtnText: {
    color: '#040D12',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },

  successRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  successText: {
    color: theme.colors.mint,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  errorText: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
  },
  hint: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    opacity: 0.8,
  },

  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 16,
    padding: 14,
    backgroundColor: theme.colors.primarySoft,
  },
  qrBtnPressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  qrBtnIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${theme.colors.primary}22`,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}44`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBtnTexts: { flex: 1, gap: 2 },
  qrBtnTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 14,
    letterSpacing: -0.2,
  },
  qrBtnSub: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    opacity: 0.85,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    letterSpacing: 0.3,
  },

  // Devices
  emptyDevices: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  emptyText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    opacity: 0.8,
  },
  deviceList: { gap: 8 },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 12,
  },
  deviceItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  deviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceIconSelected: { backgroundColor: `${theme.colors.primary}22` },
  deviceTexts: { flex: 1, gap: 2 },
  deviceName: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 14,
  },
  deviceNameSelected: { color: theme.colors.primaryDeep },
  deviceSerial: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 11,
    opacity: 0.8,
  },
  deviceRadio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceRadioSelected: { borderColor: theme.colors.primary },
  deviceRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
})
