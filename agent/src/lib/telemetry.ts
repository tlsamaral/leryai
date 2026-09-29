// Structured telemetry for LLM calls: OpenTelemetry spans (nested under
// the request's trace — see turns/create.ts — and viewable as a waterfall
// in Jaeger), console line for live dev visibility, and JSONL persistence
// for scripts/telemetry-report.ts. Three views of the same call, one
// choke point (wrapWithTelemetry) so tutor/evaluator/compliance/summarizer
// never have to know any of this exists.

import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { SpanStatusCode, trace } from '@opentelemetry/api'

const tracer = trace.getTracer('lery-agent')

export interface LLMCallMetric {
  role: string // e.g., 'tutor', 'evaluator', 'summarizer'
  model: string // Gemini model name
  inputTokens: number | null
  outputTokens: number | null
  totalTokens: number | null
  latencyMs: number
  success: boolean
  error: string | null
  timestamp: string // ISO 8601
  sessionId: string | null
}

const TELEMETRY_DIR = join(process.cwd(), 'telemetry')

/**
 * Append one metric as a JSONL line, dated same as eval-results/.
 * Always async and never awaited by callers — persistence must not add
 * latency to the request that produced the metric, and a disk error here
 * must never fail that request.
 */
export async function persistMetric(metric: LLMCallMetric): Promise<void> {
  await mkdir(TELEMETRY_DIR, { recursive: true })
  const filename = join(
    TELEMETRY_DIR,
    `metrics-${metric.timestamp.slice(0, 10)}.jsonl`,
  )
  await appendFile(filename, `${JSON.stringify(metric)}\n`, 'utf8')
}

/**
 * Emit a single LLM call metric: structured console line + fire-and-forget
 * JSONL persistence. Skips persistence under Vitest so the test suite
 * doesn't litter telemetry/ on every run.
 */
export function logLLMCall(metric: LLMCallMetric): void {
  console.info(`[telemetry] ${JSON.stringify(metric)}`)
  if (process.env.VITEST) return
  void persistMetric(metric).catch((err) => {
    console.warn(`[telemetry] failed to persist metric: ${err}`)
  })
}

/**
 * Wrap an async LLM call with automatic telemetry collection.
 *
 * Records start/end time, success/failure, and emits the metric via
 * `logLLMCall`. On error, logs the metric with `success: false` and
 * re-throws the original error.
 *
 * @example
 * ```ts
 * const { result, metric } = await wrapWithTelemetry(
 *   'evaluator', env.GEMINI_EVALUATOR_MODEL, sessionId,
 *   () => model.generateContent(prompt),
 * )
 * ```
 */
export async function wrapWithTelemetry<T>(
  role: string,
  model: string,
  sessionId: string | null,
  fn: () => Promise<T>,
  extractTokens?: (result: T) => {
    inputTokens?: number | null
    outputTokens?: number | null
    totalTokens?: number | null
  },
): Promise<{ result: T; metric: LLMCallMetric }> {
  return tracer.startActiveSpan(`llm.${role}`, async (span) => {
    span.setAttribute('llm.role', role)
    span.setAttribute('llm.model', model)
    if (sessionId) span.setAttribute('lery.session_id', sessionId)

    const start = Date.now()
    try {
      const result = await fn()
      const tokens = extractTokens ? extractTokens(result) : null
      const metric: LLMCallMetric = {
        role,
        model,
        inputTokens: tokens?.inputTokens ?? null,
        outputTokens: tokens?.outputTokens ?? null,
        totalTokens: tokens?.totalTokens ?? null,
        latencyMs: Date.now() - start,
        success: true,
        error: null,
        timestamp: new Date().toISOString(),
        sessionId,
      }
      if (metric.totalTokens !== null) {
        span.setAttribute('llm.tokens.total', metric.totalTokens)
      }
      span.setStatus({ code: SpanStatusCode.OK })
      logLLMCall(metric)
      return { result, metric }
    } catch (err) {
      const metric: LLMCallMetric = {
        role,
        model,
        inputTokens: null,
        outputTokens: null,
        totalTokens: null,
        latencyMs: Date.now() - start,
        success: false,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
        sessionId,
      }
      span.recordException(err as Error)
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: metric.error ?? undefined,
      })
      logLLMCall(metric)
      throw err
    } finally {
      span.end()
    }
  })
}
