/**
 * AppCard
 *
 * Base card shell with iOS Maps-inspired 3D bottom shadow:
 * - Zero blur, colored hard shadow = depth + physicality
 * - Variants: default, cyan, mint, amber, danger
 * - Pressable or static
 *
 * Use this as the foundation for all cards in the app.
 */
import type { PropsWithChildren } from 'react'
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native'
import { theme } from '../theme'

export type CardTone = 'default' | 'cyan' | 'mint' | 'amber' | 'danger'

const toneMap: Record<
  CardTone,
  { bg: string; border: string; shadowColor: string }
> = {
  default: {
    bg: theme.colors.surface,
    border: theme.colors.border,
    shadowColor: '#C5D8E4',
  },
  cyan: {
    bg: theme.colors.primarySoft,
    border: `${theme.colors.primary}44`,
    shadowColor: theme.colors.primaryDeep,
  },
  mint: {
    bg: '#E7F8F0',
    border: '#B7E5CD',
    shadowColor: '#1A7C56',
  },
  amber: {
    bg: '#FFF6E5',
    border: '#FFD899',
    shadowColor: '#B87020',
  },
  danger: {
    bg: '#FCE7E9',
    border: '#F4B5BB',
    shadowColor: '#A02530',
  },
}

interface AppCardProps extends PropsWithChildren {
  tone?: CardTone
  onPress?: () => void
  /** Extra padding inside the card */
  padding?: number
  /** Rounding. Default 22. */
  radius?: number
  /** Optional custom container style */
  style?: StyleProp<ViewStyle>
}

export function AppCard({
  tone = 'default',
  onPress,
  padding = 16,
  radius = 22,
  style,
  children,
}: AppCardProps) {
  const t = toneMap[tone]

  const cardStyle = [
    styles.base,
    {
      backgroundColor: t.bg,
      borderColor: t.border,
      shadowColor: t.shadowColor,
      padding,
      borderRadius: radius,
    },
    style,
  ]

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    )
  }

  return <View style={cardStyle}>{children}</View>
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    // 3D hard bottom shadow — zero blur, colored
    shadowOpacity: 0.55,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.985 }, { translateY: 2 }],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
  },
})
