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
      <Text style={styles.title}>System prompt da lesson</Text>
      <TextInput
        multiline
        value={value}
        onChangeText={onChange}
        placeholder="Defina o comportamento do Lery para esta lesson"
        placeholderTextColor={theme.colors.muted}
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={onSave} disabled={isSaving}>
        <Text style={styles.buttonText}>
          {isSaving ? 'Salvando...' : 'Salvar prompt'}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: theme.typography.h2,
  },
  input: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    textAlignVertical: 'top',
    fontSize: theme.typography.body,
    color: theme.colors.text,
    backgroundColor: '#FCFFFD',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.surface,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
})
