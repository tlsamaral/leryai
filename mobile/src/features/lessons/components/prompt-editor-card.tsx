import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { theme } from '../../../shared/theme'

interface PromptEditorCardProps {
  value: string
  isSaving: boolean
  onChange: (value: string) => void
  onSave: () => void
}

export function PromptEditorCard({ value, isSaving, onChange, onSave }: PromptEditorCardProps) {
  return (
    <View style={styles.card}>
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

      <Pressable
        style={({ pressed }) => [styles.saveBtn, isSaving && styles.saveBtnDisabled, pressed && styles.saveBtnPressed]}
        onPress={onSave}
        disabled={isSaving}
      >
        <Ionicons name={isSaving ? 'hourglass-outline' : 'checkmark'} size={16} color="#040D12" />
        <Text style={styles.saveBtnText}>
          {isSaving ? 'Salvando...' : 'Salvar configuração'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    gap: 12,
    ...theme.shadow.soft,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 16,
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
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    minHeight: 120,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.bg,
    lineHeight: 21,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingVertical: 13,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  saveBtnText: {
    color: '#040D12',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
})
