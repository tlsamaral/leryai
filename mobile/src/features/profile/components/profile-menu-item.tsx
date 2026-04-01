import { Ionicons } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  tone?: 'default' | 'danger'
  onPress?: () => void
}

export function ProfileMenuItem({
  icon,
  label,
  tone = 'default',
  onPress,
}: ProfileMenuItemProps) {
  const isDanger = tone === 'danger'

  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.leftSide}>
        <Ionicons
          name={icon}
          size={18}
          color={isDanger ? theme.colors.danger : theme.colors.muted}
        />
        <Text style={[styles.label, isDanger && styles.labelDanger]}>
          {label}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={isDanger ? theme.colors.danger : '#99AAA3'}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF3F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  labelDanger: {
    color: theme.colors.danger,
  },
})
