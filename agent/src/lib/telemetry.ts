// Lightweight structured telemetry for LLM calls.
// Logs metrics as JSON lines to stdout for now — can be upgraded to
// a file, database, or external service later without changing callers.

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

/**
 * Emit a single LLM call metric as a structured JSON line.
 */
export function logLLMCall(metric: LLMCallMetric): void {
  console.info(`[telemetry] ${JSON.stringify(metric)}`)
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
    logLLMCall(metric)
    throw err
  }
}
