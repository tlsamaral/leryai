import type { SessionMode } from '@/brain/prompts/session-state.js'
import type { Tutor } from '@/brain/tutor.js'
import type { SessionConfig } from '@/lib/api-client.js'

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
}

class SessionStore {
  private readonly sessions = new Map<string, SessionState>()
  set(state: SessionState): void {
    this.sessions.set(state.agentSessionId, state)
  }
  get(agentSessionId: string): SessionState | undefined {
    return this.sessions.get(agentSessionId)
  }
  delete(agentSessionId: string): boolean {
    return this.sessions.delete(agentSessionId)
  }
  size(): number {
    return this.sessions.size
  }
}

export const sessionStore = new SessionStore()
