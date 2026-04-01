import { Ionicons } from '@expo/vector-icons'
import { Redirect } from 'expo-router'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSessionStore } from '../features/auth/store/session-store'
import { DeviceSettingsPanel } from '../features/device-pairing/components/device-settings-panel'
import { useDeviceSettingsViewModel } from '../features/device-pairing/viewmodels/use-device-settings-view-model'
import { usePairLeryViewModel } from '../features/device-pairing/viewmodels/use-pair-lery-view-model'
import { LoadingState } from '../shared/components/loading-state'
import { ScreenContainer } from '../shared/components/screen-container'
import { theme } from '../shared/theme'

export default function PairLeryPage() {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isBootstrapped = useSessionStore((state) => state.isBootstrapped)

  const {
    pairingCode,
    setPairingCode,
    submitCode,
    status,
    errorMessage,
    isLoading,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isLoadingDevices,
  } = usePairLeryViewModel()

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

  if (!isAuthenticated) {
    return <Redirect href="/auth" />
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Text style={styles.badge}>Lery Device Control</Text>
            <View style={styles.statusChip}>
              <Ionicons
                name={
                  devices.length > 0 ? 'checkmark-circle' : 'radio-button-off'
                }
                size={14}
                color={devices.length > 0 ? '#C7FFDF' : '#E2F2EA'}
              />
              <Text style={styles.statusChipText}>
                {devices.length > 0 ? 'Conectado' : 'Sem dispositivo'}
              </Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Configurar Lery fisico</Text>
          <Text style={styles.heroSubtitle}>
            Pareie o hardware e personalize voz, velocidade e escuta com
            controle total.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pareamento rapido</Text>
          <Text style={styles.cardSubtitle}>
            Escaneie o QR do dispositivo ou use o codigo manual.
          </Text>

          <TextInput
            style={styles.input}
            value={pairingCode}
            onChangeText={setPairingCode}
            placeholder="Ex.: LERY-PAIR-001"
            autoCapitalize="characters"
            placeholderTextColor={theme.colors.muted}
          />

          <Pressable
            style={styles.button}
            onPress={submitCode}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Pareando...' : 'Parear dispositivo'}
            </Text>
          </Pressable>

          <Text style={styles.hint}>Mock de pareamento: LERY-PAIR-001</Text>
          {status === 'paired' ? (
            <Text style={styles.success}>Dispositivo pareado com sucesso.</Text>
          ) : null}
          {status === 'error' ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.deviceHeader}>
            <Text style={styles.cardTitle}>Seus Lerys</Text>
            {isLoadingDevices ? (
              <Text style={styles.inlineHint}>Carregando...</Text>
            ) : null}
          </View>

          {devices.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum Lery conectado ainda.</Text>
          ) : (
            <View style={styles.deviceList}>
              {devices.map((device) => {
                const selected = selectedDeviceId === device.id
                return (
                  <Pressable
                    key={device.id}
                    style={[
                      styles.deviceItem,
                      selected && styles.deviceItemSelected,
                    ]}
                    onPress={() => setSelectedDeviceId(device.id)}
                  >
                    <View>
                      <Text
                        style={[
                          styles.deviceTitle,
                          selected && styles.deviceTitleSelected,
                        ]}
                      >
                        {device.nickname ?? 'Lery Device'}
                      </Text>
                      <Text style={styles.deviceMeta}>
                        {device.serialNumber}
                      </Text>
                    </View>
                    <Ionicons
                      name={selected ? 'radio-button-on' : 'radio-button-off'}
                      size={20}
                      color={selected ? theme.colors.primary : '#9AB1A8'}
                    />
                  </Pressable>
                )
              })}
            </View>
          )}
        </View>

        {selectedDeviceId ? (
          <DeviceSettingsPanel
            settings={settings}
            isSaving={isSavingSettings || isLoadingSettings}
            voiceToneOptions={voiceToneOptions}
            onUpdate={updateSettings}
          />
        ) : null}
      </ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 120,
    gap: 12,
  },
  heroCard: {
    borderRadius: 28,
    backgroundColor: '#1C8A6F',
    borderWidth: 1,
    borderColor: '#146B55',
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#1C8A6F',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    color: '#D7F5EA',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusChipText: {
    color: '#F3FFFA',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#F5FFFB',
    fontSize: 27,
    fontWeight: '800',
    marginTop: 10,
    lineHeight: 33,
  },
  heroSubtitle: {
    color: '#D6F3E9',
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    padding: 14,
    gap: 9,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDE9E3',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: theme.colors.text,
    fontSize: 15,
    backgroundColor: '#FAFDFC',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    alignItems: 'center',
    paddingVertical: 11,
  },
  buttonText: {
    color: '#F4FFFA',
    fontSize: 15,
    fontWeight: '700',
  },
  hint: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  success: {
    color: theme.colors.success,
    fontSize: 12,
    fontWeight: '600',
  },
  error: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inlineHint: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  deviceList: {
    gap: 8,
  },
  deviceItem: {
    borderWidth: 1,
    borderColor: '#DEE9E4',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceItemSelected: {
    borderColor: '#8ACBB7',
    backgroundColor: '#ECF8F3',
  },
  deviceTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  deviceTitleSelected: {
    color: '#0F664F',
  },
  deviceMeta: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 1,
  },
})
