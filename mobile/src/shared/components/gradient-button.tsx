import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

interface GradientButtonProps {
  label: string
  icon?: keyof typeof Ionicons.glyphMap
  onPress?: () => void
  disabled?: boolean
  variant?: 'primary' | 'ghost'
}

export function GradientButton({
  label,
  icon,
  onPress,
  disabled = false,
  variant = 'primary',
}: GradientButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.ghost,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {icon && (
        <View style={styles.iconWrap}>
          <Ionicons
            name={icon}
            size={16}
            color={isPrimary ? '#040D12' : theme.colors.primary}
          />
        </View>
      )}
      <Text style={[styles.label, !isPrimary && styles.labelGhost]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.32,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.4,
  },
  iconWrap: {
    marginRight: 2,
  },
  label: {
    color: '#040D12',
    fontSize: theme.typography.body,
    fontWeight: theme.fontWeights.bold,
    letterSpacing: theme.tracking.normal,
  },
  labelGhost: {
    color: theme.colors.primary,
  },
})
