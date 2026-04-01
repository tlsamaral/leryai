import * as SecureStore from 'expo-secure-store'
import type { User } from '../../../shared/types/domain'

const SESSION_KEY = 'lery.mobile.session'

export interface PersistedSession {
  accessToken: string
  refreshToken: string
  user: User
}

export async function loadPersistedSession(): Promise<PersistedSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as PersistedSession
  } catch {
    return null
  }
}

export async function persistSession(session: PersistedSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session))
}

export async function clearPersistedSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY)
}
