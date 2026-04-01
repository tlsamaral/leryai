import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../theme'

interface SectionTitleProps {
  title: string
  subtitle?: string
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 2,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '800',
    fontSize: theme.typography.title,
    lineHeight: theme.lineHeights.title,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
    lineHeight: theme.lineHeights.body,
  },
})
