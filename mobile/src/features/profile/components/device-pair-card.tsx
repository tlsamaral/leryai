import { StyleSheet, Text, View } from 'react-native'
import { theme } from '../../../shared/theme'
import type { Device } from '../../../shared/types/domain'

interface DevicePairCardProps {
  devices: Device[]
}

export function DevicePairCard({ devices }: DevicePairCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Lery conectado</Text>
      {devices.length === 0 ? (
        <Text style={styles.empty}>Nenhum dispositivo pareado ainda.</Text>
      ) : (
        devices.map((device) => (
          <View key={device.id} style={styles.device}>
            <Text style={styles.deviceName}>
              {device.nickname ?? device.serialNumber}
            </Text>
            <Text style={styles.deviceMeta}>{device.serialNumber}</Text>
          </View>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: theme.typography.h2,
  },
  empty: {
    color: theme.colors.muted,
    fontSize: theme.typography.body,
  },
  device: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    backgroundColor: '#FCFFFD',
  },
  deviceName: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
  deviceMeta: {
    color: theme.colors.muted,
    fontSize: theme.typography.caption,
  },
})
