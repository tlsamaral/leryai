import type { SessionConfig } from '@/lib/api-client.js'

export type SessionMode = 'FREE_TALK' | 'GUIDED_LESSON' | 'DIAGNOSIS'

// Hard response-length constraints by CEFR level.
// Lower levels need shorter replies: less to process, less intimidating.
const RESPONSE_LIMITS: Record<string, string> = {
  A1:
    'RESPONSE LENGTH — HARD LIMIT: 1 sentence only. ' +
    'Maximum 8 words in that sentence. ' +
    'Then ask ONE simple yes/no question.',
  A2:
    'RESPONSE LENGTH — HARD LIMIT: 2 short sentences maximum. ' +
    'Each sentence must have at most 10 words. End with ONE simple question.',
  B1:
    'RESPONSE LENGTH — HARD LIMIT: 2 sentences maximum. ' +
    'Keep them clear and direct. End with a question or clear instruction.',
  B2:
    'RESPONSE LENGTH — HARD LIMIT: 3 sentences maximum. ' +
    'Natural pace. End with a question or challenge.',
  C1:
    'RESPONSE LENGTH — HARD LIMIT: 3 sentences maximum. ' +
    'Rich language welcome. End with a question or discussion prompt.',
  C2:
    'RESPONSE LENGTH — HARD LIMIT: 3 sentences maximum. ' +
    'Speak naturally as with a native speaker.',
}

const LEVEL_RULES: Record<string, string> = {
  A1:
    'The student is A1 (complete beginner). Use ONLY simple present tense and very basic vocabulary. ' +
    'Never use past perfect, present perfect, conditionals or passive voice.',
  A2:
    'The student is A2 (elementary). You may use simple past and going-to future. ' +
    'Keep vocabulary simple. Avoid complex clauses.',
  B1: 'The student is B1 (intermediate). You may use present perfect, simple past, future forms and basic modals.',
  B2: 'The student is B2 (upper-intermediate). Full range of tenses including conditionals and passive. Natural pace.',
  C1: 'The student is C1 (advanced). Use natural fluent English with idiomatic expressions and complex sentences.',
  C2: 'The student is C2 (mastery). Speak exactly as you would with a native speaker. No simplification.',
}

// Session State layer — refresh per session and updated mid-session.
// ~400 tokens budget.
export function buildSessionState(
  config: SessionConfig,
  mode: SessionMode,
  rollingSummary: string | null,
): string {
  const level = config.level
  const sections: string[] = [`CURRENT MODE: ${mode}`]

  const levelRule = LEVEL_RULES[level] ?? LEVEL_RULES.A1
  sections.push(`LANGUAGE RULE FOR LEVEL ${level}:\n${levelRule}`)

  const responseLimit = RESPONSE_LIMITS[level] ?? RESPONSE_LIMITS.B1
  sections.push(`RESPONSE LENGTH CONSTRAINT:\n${responseLimit}`)

  if (mode === 'GUIDED_LESSON' && config.lesson) {
    sections.push(
      `LESSON: ${config.lesson.title}\nScenario: ${config.lesson.scenario}` +
        (config.lesson.objectives
          ? `\nObjectives:\n${config.lesson.objectives}`
          : ''),
    )
  }

  if (rollingSummary) {
    sections.push(`ROLLING SUMMARY OF EARLIER TURNS:\n${rollingSummary}`)
  }

  return sections.join('\n\n')
}

export function getResponseLimit(level: string): string {
  return RESPONSE_LIMITS[level] ?? RESPONSE_LIMITS.B1
}
