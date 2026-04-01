import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getLeryApi } from '../../../shared/api/provider'

export function usePairLeryViewModel() {
  const queryClient = useQueryClient()
  const [pairingCode, setPairingCode] = useState('')
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'pairing' | 'paired' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => getLeryApi().getProfile(),
  })

  useEffect(() => {
    if (!selectedDeviceId && profileQuery.data?.devices[0]?.id) {
      setSelectedDeviceId(profileQuery.data.devices[0].id)
    }
  }, [profileQuery.data, selectedDeviceId])

  const mutation = useMutation({
    mutationFn: (code: string) =>
      getLeryApi().pairDevice({ pairingCode: code }),
    onMutate: () => {
      setStatus('pairing')
      setErrorMessage(null)
    },
    onSuccess: async (data) => {
      setStatus('paired')
      setSelectedDeviceId(data.id)
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: () => {
      setStatus('error')
      setErrorMessage('Codigo invalido. Use LERY-PAIR-001 no mock.')
    },
  })

  return {
    pairingCode,
    setPairingCode,
    submitCode: () => mutation.mutate(pairingCode),
    devices: profileQuery.data?.devices ?? [],
    selectedDeviceId,
    setSelectedDeviceId,
    isLoadingDevices: profileQuery.isLoading,
    isLoading: mutation.isPending,
    status,
    errorMessage,
  }
}
