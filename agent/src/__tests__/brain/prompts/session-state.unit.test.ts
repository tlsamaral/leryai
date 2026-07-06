import { describe, expect, it } from 'vitest'
import {
  buildSessionState,
  getResponseLimit,
} from '@/brain/prompts/session-state.js'
import type { SessionConfig } from '@/lib/api-client.js'

function makeConfig(overrides: Partial<SessionConfig> = {}): SessionConfig {
  return {
    deviceId: 'dev-1',
    userId: 'user-1',
    level: 'B1',
    diagnosisCompleted: true,
    lesson: null,
    module: null,
    profile: null,
    ...overrides,
  }
}

describe('buildSessionState', () => {
  it('includes mode in output', () => {
    const out = buildSessionState(makeConfig(), 'FREE_TALK', null)
    expect(out).toContain('FREE_TALK')
  })

  it('includes level rule for known level', () => {
    const out = buildSessionState(makeConfig({ level: 'A1' }), 'FREE_TALK', null)
    expect(out).toContain('A1')
    expect(out).toContain('LANGUAGE RULE FOR LEVEL A1')
  })

  it('falls back to A1 rule for unknown level', () => {
    const out = buildSessionState(makeConfig({ level: 'X9' }), 'FREE_TALK', null)
    expect(out).toContain('LANGUAGE RULE FOR LEVEL X9')
    expect(out).toContain('complete beginner')
  })

  it('includes response length constraint', () => {
    const out = buildSessionState(makeConfig(), 'FREE_TALK', null)
    expect(out).toContain('RESPONSE LENGTH CONSTRAINT')
  })

  it('falls back to B1 response limit for unknown level', () => {
    const out = buildSessionState(makeConfig({ level: 'Z0' }), 'FREE_TALK', null)
    expect(out).toContain('2 sentences maximum')
  })

  it('includes lesson section in GUIDED_LESSON mode', () => {
    const config = makeConfig({
      level: 'B1',
      lesson: {
        id: 'lesson-1',
        title: 'At the Airport',
        scenario: 'You are checking in.',
        systemPrompt: 'Be helpful.',
        objectives: 'Use travel vocabulary.',
        order: 1,
      },
    })
    const out = buildSessionState(config, 'GUIDED_LESSON', null)
    expect(out).toContain('At the Airport')
    expect(out).toContain('Use travel vocabulary.')
  })

  it('omits lesson section in FREE_TALK even if lesson present', () => {
    const config = makeConfig({
      lesson: {
        id: 'l1',
        title: 'Hidden Lesson',
        scenario: 'scenario',
        systemPrompt: 'prompt',
        objectives: null,
        order: 1,
      },
    })
    const out = buildSessionState(config, 'FREE_TALK', null)
    expect(out).not.toContain('Hidden Lesson')
  })

  it('includes rolling summary when provided', () => {
    const out = buildSessionState(makeConfig(), 'FREE_TALK', 'Student discussed travel.')
    expect(out).toContain('ROLLING SUMMARY OF EARLIER TURNS')
    expect(out).toContain('Student discussed travel.')
  })

  it('omits rolling summary section when null', () => {
    const out = buildSessionState(makeConfig(), 'FREE_TALK', null)
    expect(out).not.toContain('ROLLING SUMMARY')
  })

  it('omits lesson objectives when null', () => {
    const config = makeConfig({
      lesson: {
        id: 'l1',
        title: 'Test',
        scenario: 'scenario',
        systemPrompt: 'prompt',
        objectives: null,
        order: 1,
      },
    })
    const out = buildSessionState(config, 'GUIDED_LESSON', null)
    expect(out).not.toContain('Objectives:')
  })

  it('covers all 6 CEFR levels without throwing', () => {
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']) {
      expect(() =>
        buildSessionState(makeConfig({ level }), 'FREE_TALK', null),
      ).not.toThrow()
    }
  })
})

describe('getResponseLimit', () => {
  it('returns A1 limit', () => {
    expect(getResponseLimit('A1')).toContain('1 sentence only')
  })

  it('returns C2 limit', () => {
    expect(getResponseLimit('C2')).toContain('native speaker')
  })

  it('falls back to B1 for unknown level', () => {
    expect(getResponseLimit('Z9')).toContain('2 sentences maximum')
  })
})
