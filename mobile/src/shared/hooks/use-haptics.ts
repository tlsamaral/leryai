import * as Haptics from 'expo-haptics'

export function useHaptics() {
  const tap = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const success = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  }

  return {
    tap,
    success,
  }
}
