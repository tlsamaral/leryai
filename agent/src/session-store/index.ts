import type { SessionMode } from '@/brain/prompts/session-state.js'
import type { Tutor } from '@/brain/tutor.js'
import type { SessionConfig } from '@/lib/api-client.js'

/** Sessions expire after 2 hours of inactivity. */
export const SESSION_TTL_MS = 2 * 60 * 60 * 1000

/** Hard cap on concurrent in-memory sessions. */
const MAX_SESSIONS = 50

/** Cleanup runs every 5 minutes. */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000

export interface SessionInteractionRecord {
  userInput: string
  leryResponse: string
  grammaticalFixes?: string | null
}

export interface SessionState {
  agentSessionId: string
  apiSessionId: string | null
  userId: string
  mode: SessionMode
  tutor: Tutor
  config: SessionConfig
  lessonObjectives: string | null
  startedAt: number
  turnCount: number
  lastActivityAt: number
  interactions: SessionInteractionRecord[]
}

class SessionStore {
  private readonly sessions = new Map<string, SessionState>()
  private cleanupTimer: ReturnType<typeof setInterval> | null = null

  set(state: SessionState): void {
    // Lazy-start cleanup on first use
    if (!this.cleanupTimer) {
      this.startCleanup()
    }

    // Evict oldest session if at capacity
    if (
      this.sessions.size >= MAX_SESSIONS &&
      !this.sessions.has(state.agentSessionId)
    ) {
      let oldestKey: string | null = null
      let oldestTime = Infinity
      for (const [key, s] of this.sessions) {
        if (s.lastActivityAt < oldestTime) {
          oldestTime = s.lastActivityAt
          oldestKey = key
        }
      }
      if (oldestKey) this.sessions.delete(oldestKey)
    }

    state.lastActivityAt = Date.now()
    this.sessions.set(state.agentSessionId, state)
  }

  get(agentSessionId: string): SessionState | undefined {
    const state = this.sessions.get(agentSessionId)
    if (state) {
      state.lastActivityAt = Date.now()
    }
    return state
  }

  delete(agentSessionId: string): boolean {
    return this.sessions.delete(agentSessionId)
  }

  size(): number {
    return this.sessions.size
  }

  /** Remove sessions that have been inactive longer than SESSION_TTL_MS. */
  cleanup(): number {
    const now = Date.now()
    let removed = 0
    for (const [key, state] of this.sessions) {
      if (now - state.lastActivityAt > SESSION_TTL_MS) {
        this.sessions.delete(key)
        removed++
      }
    }
    if (removed > 0) {
      console.info(
        `[SessionStore] cleanup: removed ${removed} expired session(s)`,
      )
    }
    return removed
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => this.cleanup(), CLEANUP_INTERVAL_MS)
    // Allow process to exit even if timer is active
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref()
    }
  }

  /** Stop the cleanup timer (useful for tests). */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }
}

export const sessionStore = new SessionStore()
