/**
 * PrimaryButton
 *
 * iOS Maps-style pill CTA with:
 * - Brand cyan background (#04D2FF)
 * - Hard 3D bottom shadow in deep cyan (#0091B8) — zero blur, y-offset only
 * - Press animation: translateY +2 + reduced shadow = "pushed in" feel
 * - Full-width by default, or auto width with alignSelf: 'center'
 */
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { theme } from '../theme'

type IconName = ComponentProps<typeof Ionicons>['name']

interface PrimaryButtonProps {
  label: string
  onPress: () => void
  icon?: IconName
  iconSide?: 'left' | 'right'
  disabled?: boolean
  loading?: boolean
  /** 'fill' = 100% width (default), 'auto' = wraps content */
  width?: 'fill' | 'auto'
  /** Visual tone variant */
  tone?: 'cyan' | 'dark' | 'ghost'
}

const toneConfig = {
  cyan: {
    bg: theme.colors.primary,
    shadowColor: theme.colors.primaryDeep,
    textColor: '#040D12',
    iconColor: '#040D12',
    loaderColor: '#040D12',
  },
  dark: {
    bg: '#0A1B23',
    shadowColor: '#000000',
    textColor: '#FFFFFF',
    iconColor: '#FFFFFF',
    loaderColor: '#FFFFFF',
  },
  ghost: {
    bg: theme.colors.primarySoft,
    borderWidth: 1.5,
    border: theme.colors.primaryDeep,
    shadowColor: `${theme.colors.primaryDeep}66`,
    textColor: theme.colors.primaryDeep,
    iconColor: theme.colors.primaryDeep,
    loaderColor: theme.colors.primaryDeep,
  },
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  iconSide = 'left',
  disabled = false,
  loading = false,
  width = 'fill',
  tone = 'cyan',
}: PrimaryButtonProps) {
  const t = toneConfig[tone]

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        width === 'auto' && styles.btnAuto,
        { backgroundColor: t.bg, shadowColor: t.shadowColor },
        (disabled || loading) && styles.btnDisabled,
        pressed && styles.btnPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={t.loaderColor} />
      ) : (
        <View style={styles.inner}>
          {icon && iconSide === 'left' && (
            <Ionicons name={icon} size={18} color={t.iconColor} />
          )}
          <Text style={[styles.label, { color: t.textColor }]}>{label}</Text>
          {icon && iconSide === 'right' && (
            <Ionicons name={icon} size={18} color={t.iconColor} />
          )}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    // 3D shadow — zero blur, hard bottom edge
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  btnAuto: {
    alignSelf: 'center',
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnPressed: {
    // Simulate button being physically pushed down
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: theme.fonts.extraBold,
    fontSize: 17,
    letterSpacing: -0.3,
  },
})
