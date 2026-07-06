import { describe, expect, it, beforeEach } from 'vitest'
import { sessionStore } from '@/session-store/index.js'
import type { SessionState } from '@/session-store/index.js'

function makeState(id: string): SessionState {
  return {
    agentSessionId: id,
    apiSessionId: null,
    userId: 'user-1',
    mode: 'FREE_TALK',
    tutor: {} as never,
    config: {} as never,
    lessonObjectives: null,
    startedAt: Date.now(),
    turnCount: 0,
  }
}

describe('SessionStore', () => {
  beforeEach(() => {
    // Clean slate — delete any leftover sessions from prior tests
    const state1 = sessionStore.get('a')
    if (state1) sessionStore.delete('a')
    const state2 = sessionStore.get('b')
    if (state2) sessionStore.delete('b')
  })

  it('get returns undefined for unknown id', () => {
    expect(sessionStore.get('nonexistent-id-xyz')).toBeUndefined()
  })

  it('set then get returns the same state', () => {
    const state = makeState('a')
    sessionStore.set(state)
    expect(sessionStore.get('a')).toBe(state)
    sessionStore.delete('a')
  })

  it('delete removes the session', () => {
    sessionStore.set(makeState('a'))
    sessionStore.delete('a')
    expect(sessionStore.get('a')).toBeUndefined()
  })

  it('delete returns true when session existed', () => {
    sessionStore.set(makeState('a'))
    expect(sessionStore.delete('a')).toBe(true)
  })

  it('delete returns false when session did not exist', () => {
    expect(sessionStore.delete('nonexistent-xyz')).toBe(false)
  })

  it('size reflects number of active sessions', () => {
    const before = sessionStore.size()
    sessionStore.set(makeState('a'))
    sessionStore.set(makeState('b'))
    expect(sessionStore.size()).toBe(before + 2)
    sessionStore.delete('a')
    sessionStore.delete('b')
    expect(sessionStore.size()).toBe(before)
  })

  it('sessions are isolated by id', () => {
    const stateA = makeState('a')
    const stateB = makeState('b')
    sessionStore.set(stateA)
    sessionStore.set(stateB)
    expect(sessionStore.get('a')).toBe(stateA)
    expect(sessionStore.get('b')).toBe(stateB)
    sessionStore.delete('a')
    sessionStore.delete('b')
  })

  it('overwrite replaces existing session', () => {
    const original = makeState('a')
    const replacement = { ...makeState('a'), turnCount: 99 }
    sessionStore.set(original)
    sessionStore.set(replacement)
    expect(sessionStore.get('a')?.turnCount).toBe(99)
    sessionStore.delete('a')
  })
})
