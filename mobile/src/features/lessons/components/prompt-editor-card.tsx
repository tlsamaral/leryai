import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
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
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Prompt do tutor</Text>
          <Text style={styles.subtitle}>
            Personalize a personalidade do Lery nesta lesson.
          </Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={12} color="#0D5E4A" />
          <Text style={styles.badgeText}>Custom</Text>
        </View>
      </View>

      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        placeholder="Ex.: Seja encorajador, corrija com exemplos curtos e mantenha ritmo natural"
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={onSave} disabled={isSaving}>
        <Text style={styles.buttonText}>
          {isSaving ? 'Salvando...' : 'Salvar configuracao'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2ECE7',
    padding: 14,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 1,
    maxWidth: 240,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F7F0',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#0D5E4A',
    fontSize: 11,
    fontWeight: '700',
  },
  input: {
    minHeight: 128,
    borderWidth: 1,
    borderColor: '#DCE9E3',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    fontSize: 15,
    color: theme.colors.text,
    backgroundColor: '#FAFDFC',
    lineHeight: 22,
  },
  button: {
    minHeight: 42,
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#F6FFFA',
    fontWeight: '700',
    fontSize: 14,
  },
})
