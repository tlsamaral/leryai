import Slider from '@react-native-community/slider'
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'
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
    <View style={styles.card}>
      <Text style={styles.title}>Configuracao do Lery fisico</Text>
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
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    padding: 16,
    gap: 14,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 13,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  toneGrid: {
    gap: 8,
  },
  toneChip: {
    borderWidth: 1,
    borderColor: '#DCEAE4',
    borderRadius: 14,
    padding: 11,
    backgroundColor: '#FAFDFC',
    gap: 2,
  },
  toneChipSelected: {
    borderColor: '#8ACBB7',
    backgroundColor: '#EAF7F2',
  },
  toneLabel: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  toneLabelSelected: {
    color: '#0E6550',
  },
  toneDescription: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  toneDescriptionSelected: {
    color: '#477A6D',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valuePill: {
    color: '#0D5E4A',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#E5F5EF',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  switchRow: {
    borderWidth: 1,
    borderColor: '#E4ECE8',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  switchTitle: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  switchSubtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    maxWidth: 220,
    marginTop: 1,
  },
  savingText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
})
