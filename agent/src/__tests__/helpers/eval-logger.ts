import { appendFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export interface EvalRecord {
  fixture: string
  model: string
  task_achievement: number
  grammar: number
  vocabulary: number
  fluency: number
  total_score: number
  grammatical_fixes: string
  reasoning: string
  latency_ms: number
  pass: boolean
  failure_reason: string | null
  timestamp: string
}

const RESULTS_DIR = join(process.cwd(), 'eval-results')

export function logEvalResult(record: EvalRecord): void {
  mkdirSync(RESULTS_DIR, { recursive: true })
  const filename = join(
    RESULTS_DIR,
    `eval-${new Date().toISOString().slice(0, 10)}.jsonl`,
  )
  appendFileSync(filename, JSON.stringify(record) + '\n', 'utf8')
}

export function assertPillarInRange(
  fixture: string,
  pillar: string,
  actual: number,
  [min, max]: [number, number],
): string | null {
  if (actual < min || actual > max) {
    return `${fixture} — ${pillar}: expected [${min}, ${max}], got ${actual}`
  }
  return null
}
