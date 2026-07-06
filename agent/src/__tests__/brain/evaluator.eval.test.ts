import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { beforeAll, describe, expect, it, test } from 'vitest'
import { Evaluator } from '@/brain/evaluator.js'
import {
  assertPillarInRange,
  logEvalResult,
} from '../helpers/eval-logger.js'

// Skip when key is absent or is the dummy placeholder set by eval-setup.ts
const hasApiKey =
  Boolean(process.env.GOOGLE_API_KEY) && process.env.GOOGLE_API_KEY !== '__dummy__'

interface Fixture {
  description: string
  input: {
    userInput: string
    leryResponse: string
    lessonObjectives: string | null
  }
  expect: {
    pillar_ranges: {
      task_achievement: [number, number]
      grammar: [number, number]
      vocabulary: [number, number]
      fluency: [number, number]
    }
    total_score_min: number
    total_score_max: number
    grammatical_fixes_not_empty: boolean
    reasoning_min_words: number
  }
}

function loadFixtures(): Array<{ name: string; fixture: Fixture }> {
  const dir = join(import.meta.dirname, '../fixtures/evaluator')
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      name: f.replace('.json', ''),
      fixture: JSON.parse(readFileSync(join(dir, f), 'utf8')) as Fixture,
    }))
}

// One retry on range failure to tolerate LLM variance
async function evalWithRetry(
  evaluator: Evaluator,
  fixture: Fixture,
  fixtureName: string,
): Promise<{ result: NonNullable<Awaited<ReturnType<Evaluator['evaluateTurn']>>>; latencyMs: number }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const start = Date.now()
    const result = await evaluator.evaluateTurn({
      userInput: fixture.input.userInput,
      leryResponse: fixture.input.leryResponse,
      lessonObjectives: fixture.input.lessonObjectives ?? undefined,
    })
    const latencyMs = Date.now() - start

    if (!result) continue

    const pillars: Array<keyof typeof fixture.expect.pillar_ranges> = [
      'task_achievement', 'grammar', 'vocabulary', 'fluency',
    ]
    const failures = pillars
      .map((p) => assertPillarInRange(fixtureName, p, result[p], fixture.expect.pillar_ranges[p]))
      .filter(Boolean)

    if (failures.length === 0) return { result, latencyMs }
    if (attempt === 1) {
      // Log final failure and surface errors
      logEvalResult({
        fixture: fixtureName,
        model: process.env.GEMINI_EVALUATOR_MODEL ?? 'unknown',
        ...result,
        latency_ms: latencyMs,
        pass: false,
        failure_reason: failures.join('; '),
        timestamp: new Date().toISOString(),
      })
      throw new Error(`Eval failed after 2 attempts:\n${failures.join('\n')}`)
    }
  }
  throw new Error('evaluateTurn returned null on both attempts')
}

describe.skipIf(!hasApiKey)('Evaluator — golden-set eval', () => {
  let evaluator: Evaluator

  beforeAll(() => {
    evaluator = new Evaluator()
  })

  const fixtures = loadFixtures()

  for (const { name, fixture } of fixtures) {
    it(fixture.description, async () => {
      const { result, latencyMs } = await evalWithRetry(evaluator, fixture, name)

      // Pillar range assertions (already checked in evalWithRetry, but keep for test output)
      const pillars = ['task_achievement', 'grammar', 'vocabulary', 'fluency'] as const
      for (const p of pillars) {
        const [min, max] = fixture.expect.pillar_ranges[p]
        expect(result[p], `${p} out of range`).toBeGreaterThanOrEqual(min)
        expect(result[p], `${p} out of range`).toBeLessThanOrEqual(max)
      }

      // Total score range
      expect(result.total_score).toBeGreaterThanOrEqual(fixture.expect.total_score_min)
      expect(result.total_score).toBeLessThanOrEqual(fixture.expect.total_score_max)

      // total_score invariant: always equals sum of 4 pillars
      const computedTotal = pillars.reduce((sum, p) => sum + result[p], 0)
      expect(result.total_score).toBe(computedTotal)

      // grammatical_fixes
      if (fixture.expect.grammatical_fixes_not_empty) {
        expect(result.grammatical_fixes.trim().length).toBeGreaterThan(0)
        expect(result.grammatical_fixes).not.toBe('No corrections needed.')
      }

      // reasoning word count
      const wordCount = result.reasoning.trim().split(/\s+/).length
      expect(wordCount).toBeGreaterThanOrEqual(fixture.expect.reasoning_min_words)

      // Latency under hard timeout
      expect(latencyMs).toBeLessThan(60_000)

      // Log pass
      logEvalResult({
        fixture: name,
        model: process.env.GEMINI_EVALUATOR_MODEL ?? 'unknown',
        ...result,
        latency_ms: latencyMs,
        pass: true,
        failure_reason: null,
        timestamp: new Date().toISOString(),
      })
    })
  }

  test('no_corrections_needed fixture returns correct grammatical_fixes text', async () => {
    const fixture = JSON.parse(
      readFileSync(
        join(import.meta.dirname, '../fixtures/evaluator/no_corrections_needed.json'),
        'utf8',
      ),
    ) as Fixture

    const result = await evaluator.evaluateTurn({
      userInput: fixture.input.userInput,
      leryResponse: fixture.input.leryResponse,
    })

    expect(result).not.toBeNull()
    expect(result?.grammatical_fixes).toMatch(/no corrections needed/i)
  })
})
