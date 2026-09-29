import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockAppendFile, mockMkdir } = vi.hoisted(() => ({
  mockAppendFile: vi.fn().mockResolvedValue(undefined),
  mockMkdir: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('node:fs/promises', () => ({
  appendFile: mockAppendFile,
  mkdir: mockMkdir,
}))

import {
  logLLMCall,
  persistMetric,
  wrapWithTelemetry,
} from '@/lib/telemetry.js'

const SAMPLE_METRIC = {
  role: 'tutor',
  model: 'gemini-2.5-flash',
  inputTokens: 100,
  outputTokens: 50,
  totalTokens: 150,
  latencyMs: 200,
  success: true,
  error: null,
  timestamp: '2026-09-29T12:00:00.000Z',
  sessionId: 'sess-1',
}

describe('persistMetric', () => {
  beforeEach(() => vi.clearAllMocks())

  it('creates telemetry/ and appends a JSONL line dated from the metric', async () => {
    await persistMetric(SAMPLE_METRIC)

    expect(mockMkdir).toHaveBeenCalledWith(
      expect.stringContaining('telemetry'),
      { recursive: true },
    )
    expect(mockAppendFile).toHaveBeenCalledWith(
      expect.stringContaining('metrics-2026-09-29.jsonl'),
      `${JSON.stringify(SAMPLE_METRIC)}\n`,
      'utf8',
    )
  })
})

describe('logLLMCall', () => {
  beforeEach(() => vi.clearAllMocks())

  it('skips file persistence under Vitest', () => {
    logLLMCall(SAMPLE_METRIC)
    expect(mockAppendFile).not.toHaveBeenCalled()
  })
})

describe('wrapWithTelemetry', () => {
  const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  beforeEach(() => infoSpy.mockClear())
  afterEach(() => infoSpy.mockClear())

  it('returns the result and logs a success metric', async () => {
    const { result, metric } = await wrapWithTelemetry(
      'tutor',
      'gemini-2.5-flash',
      'sess-1',
      async () => 'ok',
      () => ({ inputTokens: 10, outputTokens: 5, totalTokens: 15 }),
    )

    expect(result).toBe('ok')
    expect(metric.success).toBe(true)
    expect(metric.totalTokens).toBe(15)
    expect(infoSpy).toHaveBeenCalledOnce()
  })

  it('logs a failure metric and rethrows on error', async () => {
    await expect(
      wrapWithTelemetry('tutor', 'gemini-2.5-flash', null, async () => {
        throw new Error('boom')
      }),
    ).rejects.toThrow('boom')

    expect(infoSpy).toHaveBeenCalledOnce()
    const logged = JSON.parse(
      (infoSpy.mock.calls[0][0] as string).replace('[telemetry] ', ''),
    )
    expect(logged.success).toBe(false)
    expect(logged.error).toBe('boom')
  })
})
