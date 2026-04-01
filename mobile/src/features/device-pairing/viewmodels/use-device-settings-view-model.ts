import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getLeryApi } from '../../../shared/api/provider'
import type { DeviceSettings, LeryVoiceTone } from '../../../shared/types/api'

const voiceToneOptions: Array<{
  id: LeryVoiceTone
  label: string
  description: string
}> = [
  {
    id: 'warm',
    label: 'Warm',
    description: 'Tom acolhedor para pratica sem ansiedade',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    description: 'Tom equilibrado para uso diario',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    description: 'Tom animado para manter ritmo de estudo',
  },
]

export function useDeviceSettingsViewModel(deviceId: string | null) {
  const queryClient = useQueryClient()

  const settingsQuery = useQuery({
    queryKey: ['device-settings', deviceId],
    queryFn: async () => {
      if (!deviceId) {
        return null
      }
      return getLeryApi().getDeviceSettings(deviceId)
    },
    enabled: Boolean(deviceId),
  })

  const updateMutation = useMutation({
    mutationFn: async (input: Partial<DeviceSettings>) => {
      if (!deviceId) {
        throw new Error('Device not selected')
      }

      return getLeryApi().updateDeviceSettings(deviceId, input)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['device-settings', deviceId],
      })
    },
  })

  return {
    settings: settingsQuery.data?.settings ?? null,
    isLoadingSettings: settingsQuery.isLoading,
    isSavingSettings: updateMutation.isPending,
    updateSettings: updateMutation.mutate,
    voiceToneOptions,
  }
}
