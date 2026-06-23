import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'
import { AppCard, type CardTone } from './app-card'

type IconName = ComponentProps<typeof Ionicons>['name']

interface StatCardProps {
  icon: IconName
  label: string
  value: string
  hint?: string
  tone?: 'default' | 'cyan' | 'mint' | 'amber'
}

const toneMap: Record<
  'default' | 'cyan' | 'mint' | 'amber',
  { cardTone: CardTone; iconBg: string; iconColor: string; valueColor: string }
> = {
  default: {
    cardTone: 'default',
    iconBg: theme.colors.surfaceAlt,
    iconColor: theme.colors.primary,
    valueColor: theme.colors.text,
  },
  cyan: {
    cardTone: 'cyan',
    iconBg: '#FFFFFF',
    iconColor: theme.colors.primaryDeep,
    valueColor: theme.colors.primaryDeep,
  },
  mint: {
    cardTone: 'mint',
    iconBg: '#FFFFFF',
    iconColor: theme.colors.mint,
    valueColor: '#1A7C56',
  },
  amber: {
    cardTone: 'amber',
    iconBg: '#FFFFFF',
    iconColor: theme.colors.accent,
    valueColor: '#7A4A10',
  },
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = 'default',
}: StatCardProps) {
  const t = toneMap[tone]
  return (
    <AppCard tone={t.cardTone} padding={14} radius={22} style={styles.card}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          <View style={[styles.iconWrap, { backgroundColor: t.iconBg }]}>
            <Ionicons name={icon} size={18} color={t.iconColor} />
          </View>
        </View>
        <View style={styles.body}>
          <Text
            style={[styles.value, { color: t.valueColor }]}
            numberOfLines={1}
          >
            {value}
          </Text>
          {hint ? (
            <Text style={styles.hint} numberOfLines={1}>
              {hint}
            </Text>
          ) : null}
        </View>
      </View>
    </AppCard>
  )
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  body: {
    gap: 0,
    marginTop: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17, // perfectly circular
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.extraBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    flex: 1,
    marginTop: 8,
  },
  value: {
    fontFamily: theme.fonts.black,
    fontSize: 32,
    letterSpacing: -1,
  },
  hint: {
    color: theme.colors.dim,
    fontFamily: theme.fonts.bold,
    fontSize: 12,
    marginTop: 0,
  },
})
