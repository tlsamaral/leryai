import { create } from 'zustand'
import type { User } from '../../../shared/types/domain'
import {
  clearPersistedSession,
  loadPersistedSession,
  persistSession,
} from '../services/session-storage'

interface SessionState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  isBootstrapped: boolean
  setSession: (input: {
    accessToken: string
    refreshToken: string
    user: User
  }) => void
  clearSession: () => void
  bootstrap: () => Promise<void>
}

export const useSessionStore = create<SessionState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isBootstrapped: false,
  setSession: ({ accessToken, refreshToken, user }) => {
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
    })
    void persistSession({ accessToken, refreshToken, user })
  },
  clearSession: () => {
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    })
    void clearPersistedSession()
  },
  bootstrap: async () => {
    const persisted = await loadPersistedSession()
    if (persisted) {
      set({
        accessToken: persisted.accessToken,
        refreshToken: persisted.refreshToken,
        user: persisted.user,
        isAuthenticated: true,
        isBootstrapped: true,
      })
      return
    }

    set({ isBootstrapped: true })
  },
}))

export function getAccessToken() {
  return useSessionStore.getState().accessToken
}
