import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

type IconName = ComponentProps<typeof Ionicons>['name']

interface StatCardProps {
  icon: IconName
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'cyan' | 'mint' | 'amber'
}

const toneMap = {
  default: {
    bg: theme.colors.surface,
    border: theme.colors.border,
    iconBg: theme.colors.surfaceAlt,
    iconColor: theme.colors.primary,
    valueColor: theme.colors.text,
  },
  cyan: {
    bg: theme.colors.primarySoft,
    border: `${theme.colors.primary}33`,
    iconBg: '#FFFFFF',
    iconColor: theme.colors.primaryDeep,
    valueColor: theme.colors.primaryDeep,
  },
  mint: {
    bg: '#E7F8F0',
    border: '#B7E5CD',
    iconBg: '#FFFFFF',
    iconColor: theme.colors.mint,
    valueColor: '#1A7C56',
  },
  amber: {
    bg: '#FFF6E5',
    border: '#FFD899',
    iconBg: '#FFFFFF',
    iconColor: theme.colors.accent,
    valueColor: '#7A4A10',
  },
}

export function StatCard({ icon, label, value, hint, tone = 'default' }: StatCardProps) {
  const t = toneMap[tone]
  return (
    <View
      style={[
        styles.shell,
        { backgroundColor: t.bg, borderColor: t.border },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: t.iconBg }]}>
        <Ionicons name={icon} size={18} color={t.iconColor} />
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color: t.valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      {hint ? (
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    gap: 4,
    minHeight: 118,
    ...theme.shadow.soft,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  hint: {
    color: theme.colors.dim,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
})
