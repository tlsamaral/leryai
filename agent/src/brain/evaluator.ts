import { env } from '@/env.js'
import { backoffMs, genai, isRetryable, sleep } from '@/lib/gemini.js'
import type { EvaluationResult } from './types.js'

function stripCodeFences(s: string): string {
  return s.replace(/^```(?:json)?\s*|\s*```$/gm, '').trim()
}

function clamp(value: unknown, min: number, max: number): number {
  const n =
    typeof value === 'number' ? value : Number.parseInt(String(value), 10)
  if (Number.isNaN(n)) return min
  return Math.max(min, Math.min(max, n))
}

export interface EvaluateTurnInput {
  userInput: string
  leryResponse: string
  lessonObjectives?: string
}

export class Evaluator {
  async evaluateTurn(
    input: EvaluateTurnInput,
  ): Promise<EvaluationResult | null> {
    const objectivesSection = input.lessonObjectives
      ? `LESSON OBJECTIVES:\n${input.lessonObjectives}\n\n`
      : ''

    const prompt = `You are an English language assessment specialist using the CEFR framework.
Evaluate the student's response in this tutoring exchange.

${objectivesSection}STUDENT SAID:
"${input.userInput}"

TUTOR RESPONDED:
"${input.leryResponse}"

Score the student's response on 4 pillars. Each pillar is worth 0–25 points (total 100):

- task_achievement (0–25): Did the student complete the communicative task? Did they respond relevantly and fully?
- grammar (0–25): Accuracy of grammar structures used. Penalize recurring errors, reward correct complex structures.
- vocabulary (0–25): Range and appropriateness of word choice for the student's level.
- fluency (0–25): Naturalness, sentence length, coherence, and absence of excessive hesitation.

Also provide:
- grammatical_fixes: Rewrite the student's sentence with all errors corrected. If no errors, write "No corrections needed."
- reasoning: One sentence summarizing the key strength and main area to improve.

Respond ONLY with valid JSON, no extra text, no markdown fences:
{"task_achievement": <int>, "grammar": <int>, "vocabulary": <int>, "fluency": <int>, "total_score": <int>, "grammatical_fixes": "<str>", "reasoning": "<str>"}`

    const model = genai.getGenerativeModel({ model: env.GEMINI_EVALUATOR_MODEL })

    let lastErr: unknown
    for (let attempt = 0; attempt < env.TUTOR_MAX_RETRIES; attempt++) {
      try {
        const res = await model.generateContent(prompt)
        const raw = stripCodeFences(res.response.text())
        const data = JSON.parse(raw) as Partial<EvaluationResult>

        const pillars: (keyof EvaluationResult)[] = [
          'task_achievement',
          'grammar',
          'vocabulary',
          'fluency',
        ]
        const normalized: EvaluationResult = {
          task_achievement: clamp(data.task_achievement, 0, 25),
          grammar: clamp(data.grammar, 0, 25),
          vocabulary: clamp(data.vocabulary, 0, 25),
          fluency: clamp(data.fluency, 0, 25),
          total_score: 0,
          grammatical_fixes:
            typeof data.grammatical_fixes === 'string'
              ? data.grammatical_fixes
              : 'No corrections needed.',
          reasoning: typeof data.reasoning === 'string' ? data.reasoning : '',
        }
        normalized.total_score = pillars.reduce(
          (acc, p) => acc + (normalized[p] as number),
          0,
        )
        return normalized
      } catch (err) {
        lastErr = err
        if (!isRetryable(err) || attempt === env.TUTOR_MAX_RETRIES - 1) break
        await sleep(backoffMs(attempt))
        console.warn(
          `[Evaluator] retry ${attempt + 1}/${env.TUTOR_MAX_RETRIES}: ${err}`,
        )
      }
    }

    console.error(`[Evaluator] failed after retries: ${lastErr}`)
    return null
  }
}
