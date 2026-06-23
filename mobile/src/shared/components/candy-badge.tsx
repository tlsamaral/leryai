import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

type IconName = ComponentProps<typeof Ionicons>['name']

export type CandyBadgeTone =
  | 'orange'
  | 'cyan'
  | 'mint'
  | 'amber'
  | 'danger'
  | 'default'
  | 'dark'

interface CandyBadgeProps {
  label: string
  icon?: IconName
  tone?: CandyBadgeTone
  size?: 'small' | 'default' | 'large'
}

const toneMap = {
  orange: {
    outerBorder: '#FF7900',
    innerBorder: '#FFFFFF',
    bg: '#FFEBD6',
    text: '#FF7900',
  },
  cyan: {
    outerBorder: theme.colors.primaryDeep,
    innerBorder: '#FFFFFF',
    bg: theme.colors.primarySoft,
    text: theme.colors.primaryDeep,
  },
  mint: {
    outerBorder: '#1A7C56',
    innerBorder: '#FFFFFF',
    bg: '#E7F8F0',
    text: '#146345',
  },
  amber: {
    outerBorder: '#B87020',
    innerBorder: '#FFFFFF',
    bg: '#FFF6E5',
    text: '#A3631C',
  },
  danger: {
    outerBorder: '#A02530',
    innerBorder: '#FFFFFF',
    bg: '#FCE7E9',
    text: '#8F212B',
  },
  default: {
    outerBorder: '#C5D8E4',
    innerBorder: '#FFFFFF',
    bg: '#F6F9FA',
    text: '#8CA3AD',
  },
  dark: {
    outerBorder: 'rgba(4,210,255,0.3)',
    innerBorder: '#0A1B23',
    bg: 'rgba(4,210,255,0.08)',
    text: theme.colors.primary,
  },
}

export function CandyBadge({
  label,
  icon,
  tone = 'cyan',
  size = 'default',
}: CandyBadgeProps) {
  const t = toneMap[tone]

  const sizes = {
    small: {
      borderWidth: 1.5,
      innerPadding: 1.5,
      contentPaddingV: 3,
      contentPaddingH: 8,
      fontSize: 10,
      iconSize: 10,
      gap: 4,
    },
    default: {
      borderWidth: 2,
      innerPadding: 2,
      contentPaddingV: 5,
      contentPaddingH: 10,
      fontSize: 12,
      iconSize: 12,
      gap: 5,
    },
    large: {
      borderWidth: 2.5,
      innerPadding: 2,
      contentPaddingV: 6,
      contentPaddingH: 14,
      fontSize: 14,
      iconSize: 16,
      gap: 6,
    },
  }

  const s = sizes[size]

  return (
    <View
      style={[
        styles.outer,
        {
          borderColor: t.outerBorder,
          borderWidth: s.borderWidth,
          backgroundColor: t.innerBorder,
          padding: s.innerPadding,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            backgroundColor: t.bg,
            paddingVertical: s.contentPaddingV,
            paddingHorizontal: s.contentPaddingH,
            gap: s.gap,
          },
        ]}
      >
        {icon && <Ionicons name={icon} size={s.iconSize} color={t.text} />}
        <Text style={[styles.text, { color: t.text, fontSize: s.fontSize }]}>
          {label}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  inner: {
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.fonts.black,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
})
