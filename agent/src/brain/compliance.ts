import { SchemaType } from '@google/generative-ai'
import { env } from '@/env.js'
import { extractTokenUsage, genai } from '@/lib/gemini.js'
import { wrapWithTelemetry } from '@/lib/telemetry.js'
import { getResponseLimit } from './prompts/session-state.js'

export interface ComplianceViolation {
  type: 'LENGTH_EXCEEDED' | 'GRAMMAR_TOO_ADVANCED' | 'TONE_OR_ROLE'
  snippet: string
  reason: string
  suggestion: string
}

export interface ComplianceResult {
  compliant: boolean
  violations: ComplianceViolation[]
}

const COMPLIANCE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    compliant: { type: SchemaType.BOOLEAN },
    violations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          type: {
            type: SchemaType.STRING,
            enum: ['LENGTH_EXCEEDED', 'GRAMMAR_TOO_ADVANCED', 'TONE_OR_ROLE'],
          },
          snippet: { type: SchemaType.STRING },
          reason: { type: SchemaType.STRING },
          suggestion: { type: SchemaType.STRING },
        },
        required: ['type', 'snippet', 'reason', 'suggestion'],
      },
    },
  },
  required: ['compliant', 'violations'],
} as const

export interface CheckComplianceInput {
  tutorReply: string
  studentLevel: string
  userInput: string
  lessonObjectives?: string | null
}

export class ComplianceEvaluator {
  private readonly modelName: string

  constructor(modelName = env.GEMINI_EVALUATOR_MODEL) {
    this.modelName = modelName
  }

  async check(input: CheckComplianceInput): Promise<ComplianceResult> {
    const level = input.studentLevel.toUpperCase()
    const limitConstraint = getResponseLimit(level)

    const prompt = `You are an automated pedagogical quality gatekeeper for an English tutoring AI.
Your job is to strictly check whether the TUTOR'S draft response complies with the student's CEFR level.

STUDENT LEVEL: ${level}
STUDENT SAID: "${input.userInput}"
TUTOR DRAFT: "${input.tutorReply}"

RESPONSE CONSTRAINTS:
${limitConstraint}

LEVEL RULES:
- A1: ONLY simple present tense and very basic vocabulary. NEVER use past perfect, present perfect, conditionals or passive voice.
- A2: May use simple past and going-to future. Keep vocabulary simple. Avoid complex clauses.
- B1: May use present perfect, simple past, future forms, and basic modals.
- B2+: Full natural range.

Evaluate if the tutor draft violates length or grammar rules for level ${level}.
Return compliant: true if acceptable, or compliant: false with specific violations.`

    const model = genai.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: COMPLIANCE_SCHEMA,
      },
    })

    try {
      const { result: res } = await wrapWithTelemetry(
        'compliance',
        this.modelName,
        null,
        () => model.generateContent(prompt),
        (r) => extractTokenUsage(r.response),
      )
      const data = JSON.parse(res.response.text()) as Partial<ComplianceResult>
      return {
        compliant: Boolean(data.compliant),
        violations: Array.isArray(data.violations) ? data.violations : [],
      }
    } catch (err) {
      console.warn(
        `[ComplianceEvaluator] check failed, falling back to compliant=true: ${err}`,
      )
      return { compliant: true, violations: [] }
    }
  }
}
