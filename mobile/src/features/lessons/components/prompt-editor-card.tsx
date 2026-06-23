import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { AppCard } from '../../../shared/components/app-card'
import { PrimaryButton } from '../../../shared/components/primary-button'
import { theme } from '../../../shared/theme'

interface PromptEditorCardProps {
  value: string
  isSaving: boolean
  onChange: (value: string) => void
  onSave: () => void
}

export function PromptEditorCard({
  value,
  isSaving,
  onChange,
  onSave,
}: PromptEditorCardProps) {
  return (
    <AppCard tone="default" padding={16} radius={22}>
      <View style={styles.headerRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
        </View>
        <View style={styles.headerTexts}>
          <Text style={styles.title}>Prompt do tutor</Text>
          <Text style={styles.subtitle}>
            Personalize como o Lery se comporta nesta lição
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Custom</Text>
        </View>
      </View>

      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        placeholder="Ex.: Seja encorajador, corrija com exemplos curtos e mantenha ritmo natural..."
        placeholderTextColor={theme.colors.dim}
        style={styles.input}
        textAlignVertical="top"
      />

      <View style={{ marginTop: 4 }}>
        <PrimaryButton
          label={isSaving ? 'Salvando...' : 'Salvar configuração'}
          onPress={onSave}
          disabled={isSaving}
          loading={isSaving}
          tone="cyan"
          icon={isSaving ? undefined : 'checkmark'}
        />
      </View>
    </AppCard>
  )
}

const styles = StyleSheet.create({
  // Removed card style in favor of AppCard
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTexts: { flex: 1, gap: 2 },
  title: {
    color: theme.colors.text,
    fontFamily: theme.fonts.black,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  subtitle: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.85,
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}33`,
  },
  badgeText: {
    color: theme.colors.primaryDeep,
    fontFamily: theme.fonts.black,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.bg,
    lineHeight: 21,
    marginBottom: 12,
  },
})
