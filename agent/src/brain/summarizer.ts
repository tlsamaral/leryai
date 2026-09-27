import { SchemaType } from '@google/generative-ai'
import { env } from '@/env.js'
import { extractTokenUsage, genai } from '@/lib/gemini.js'
import { wrapWithTelemetry } from '@/lib/telemetry.js'

export interface SummarizeInteraction {
  userInput: string
  leryResponse: string
  grammaticalFixes?: string | null
}

export interface SessionInsightCard {
  topError: string
  topProgress: string
  openTopic: string | null
}

const SUMMARIZER_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    topError: {
      type: SchemaType.STRING,
      description:
        'The single most recurring or critical error made by the student, with a brief example.',
    },
    topProgress: {
      type: SchemaType.STRING,
      description:
        'The most notable improvement, correct structure, or effort demonstrated by the student.',
    },
    openTopic: {
      type: SchemaType.STRING,
      description:
        'An informal topic mentioned by the student that can be recalled in the next session (e.g. "going to Argentina in October"). Null if none.',
      nullable: true,
    },
  },
  required: ['topError', 'topProgress'],
} as const

export class Summarizer {
  private readonly modelName: string

  constructor(modelName = env.GEMINI_EVALUATOR_MODEL) {
    this.modelName = modelName
  }

  async summarizeSession(
    sessionId: string,
    interactions: SummarizeInteraction[],
  ): Promise<SessionInsightCard | null> {
    if (interactions.length === 0) {
      return null
    }

    const transcript = interactions
      .map(
        (it, idx) =>
          `[Turn ${idx + 1}]
Student: "${it.userInput}"
Tutor: "${it.leryResponse}"` +
          (it.grammaticalFixes &&
          it.grammaticalFixes !== 'No corrections needed.'
            ? `\nCorrections: "${it.grammaticalFixes}"`
            : ''),
      )
      .join('\n\n')

    const prompt = `You are an expert pedagogical summarizer for an English tutoring system.
Analyze this completed conversation session transcript between a student and an AI tutor:

${transcript}

Produce a compact 3-bullet insight card for the next tutoring session:
1. topError: The primary grammatical or vocabulary struggle seen in this session (e.g. "Struggled with irregular past tense verbs (said 'goed' instead of 'went')").
2. topProgress: The key breakthrough or positive demonstration (e.g. "Successfully produced complex sentences using 'because' and 'although'").
3. openTopic: Any personal life update, hobby, or plan the student mentioned that would be great to ask about next time (e.g. "Trip to Buenos Aires next month"). If no topic was mentioned, leave empty.`

    const model = genai.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: SUMMARIZER_SCHEMA,
      },
    })

    try {
      const { result: res } = await wrapWithTelemetry(
        'summarizer',
        this.modelName,
        sessionId,
        () => model.generateContent(prompt),
        (r) => extractTokenUsage(r.response),
      )
      const data = JSON.parse(
        res.response.text(),
      ) as Partial<SessionInsightCard>

      return {
        topError:
          typeof data.topError === 'string' ? data.topError : 'None noted',
        topProgress:
          typeof data.topProgress === 'string'
            ? data.topProgress
            : 'Active conversational participation',
        openTopic: typeof data.openTopic === 'string' ? data.openTopic : null,
      }
    } catch (err) {
      console.warn(`[Summarizer] session summarization failed: ${err}`)
      return null
    }
  }
}
