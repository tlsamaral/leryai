import Slider from '@react-native-community/slider'
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'
import { AppCard } from '../../../shared/components/app-card'
import type { DeviceSettings, LeryVoiceTone } from '../../../shared/types/api'

interface DeviceSettingsPanelProps {
  settings: DeviceSettings | null
  isSaving: boolean
  voiceToneOptions: Array<{
    id: LeryVoiceTone
    label: string
    description: string
  }>
  onUpdate: (input: Partial<DeviceSettings>) => void
}

function valueLabel(value: number) {
  return value.toFixed(2)
}

export function DeviceSettingsPanel({
  settings,
  isSaving,
  voiceToneOptions,
  onUpdate,
}: DeviceSettingsPanelProps) {
  if (!settings) {
    return null
  }

  return (
    <AppCard tone="default" padding={16} radius={24}>
      <Text style={styles.title}>Configuração do Lery físico</Text>
      <Text style={styles.subtitle}>
        Ajuste a voz e o comportamento do dispositivo.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice tone</Text>
        <View style={styles.toneGrid}>
          {voiceToneOptions.map((tone) => {
            const selected = settings.voiceTone === tone.id
            return (
              <Pressable
                key={tone.id}
                style={[styles.toneChip, selected && styles.toneChipSelected]}
                onPress={() => onUpdate({ voiceTone: tone.id })}
              >
                <Text
                  style={[
                    styles.toneLabel,
                    selected && styles.toneLabelSelected,
                  ]}
                >
                  {tone.label}
                </Text>
                <Text
                  style={[
                    styles.toneDescription,
                    selected && styles.toneDescriptionSelected,
                  ]}
                >
                  {tone.description}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Speech speed</Text>
          <Text style={styles.valuePill}>
            {valueLabel(settings.speechSpeed)}x
          </Text>
        </View>
        <Slider
          minimumValue={0.75}
          maximumValue={1.35}
          step={0.05}
          value={settings.speechSpeed}
          onSlidingComplete={(value) =>
            onUpdate({ speechSpeed: Number(value.toFixed(2)) })
          }
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor="#D7E8E1"
          thumbTintColor={theme.colors.primary}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Listening sensitivity</Text>
          <Text style={styles.valuePill}>
            {valueLabel(settings.listeningSensitivity)}
          </Text>
        </View>
        <Slider
          minimumValue={0.2}
          maximumValue={1}
          step={0.05}
          value={settings.listeningSensitivity}
          onSlidingComplete={(value) =>
            onUpdate({ listeningSensitivity: Number(value.toFixed(2)) })
          }
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor="#D7E8E1"
          thumbTintColor={theme.colors.primary}
        />
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchTitle}>Auto listen</Text>
          <Text style={styles.switchSubtitle}>
            Comeca a escuta automaticamente apos resposta.
          </Text>
        </View>
        <Switch
          value={settings.autoListen}
          onValueChange={(value) => onUpdate({ autoListen: value })}
          trackColor={{ false: '#D6E3DE', true: '#9ED8C6' }}
          thumbColor={settings.autoListen ? theme.colors.primary : '#FBFFFD'}
        />
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchTitle}>Wake word</Text>
          <Text style={styles.switchSubtitle}>
            Ativa "Hey Lery" para iniciar conversa.
          </Text>
        </View>
        <Switch
          value={settings.wakeWordEnabled}
          onValueChange={(value) => onUpdate({ wakeWordEnabled: value })}
          trackColor={{ false: '#D6E3DE', true: '#9ED8C6' }}
          thumbColor={
            settings.wakeWordEnabled ? theme.colors.primary : '#FBFFFD'
          }
        />
      </View>

      {isSaving ? (
        <Text style={styles.savingText}>Salvando configuracoes...</Text>
      ) : null}
    </AppCard>
  )
}

const styles = StyleSheet.create({
  // Removed card styles in favor of AppCard
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
    opacity: 0.8,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.extraBold,
    fontSize: 14,
    letterSpacing: -0.1,
  },
  toneGrid: {
    gap: 8,
    marginTop: 4,
  },
  toneChip: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 12,
    backgroundColor: '#FAFDFC',
    gap: 2,
  },
  toneChipSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primarySoft,
  },
  toneLabel: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 14,
  },
  toneLabelSelected: {
    color: theme.colors.primaryDeep,
  },
  toneDescription: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    opacity: 0.85,
  },
  toneDescriptionSelected: {
    color: theme.colors.primaryDeep,
    opacity: 0.9,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valuePill: {
    color: theme.colors.primaryDeep,
    fontSize: 12,
    fontFamily: theme.fonts.black,
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: `${theme.colors.primary}33`,
  },
  switchRow: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  switchTitle: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 14,
  },
  switchSubtitle: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    maxWidth: 220,
    marginTop: 1,
    opacity: 0.8,
  },
  savingText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
  },
})
