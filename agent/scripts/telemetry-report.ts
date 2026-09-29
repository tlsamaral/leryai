// Aggregates telemetry/*.jsonl into per-role latency and success stats.
// Usage: pnpm telemetry:report [--date=YYYY-MM-DD]

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { LLMCallMetric } from '../src/lib/telemetry.js'

const TELEMETRY_DIR = join(process.cwd(), 'telemetry')

function loadMetrics(dateArg?: string): LLMCallMetric[] {
  let files: string[]
  try {
    files = readdirSync(TELEMETRY_DIR).filter((f) => f.endsWith('.jsonl'))
  } catch {
    return []
  }
  if (dateArg) files = files.filter((f) => f === `metrics-${dateArg}.jsonl`)

  const metrics: LLMCallMetric[] = []
  for (const file of files) {
    const content = readFileSync(join(TELEMETRY_DIR, file), 'utf8')
    for (const line of content.split('\n')) {
      if (!line.trim()) continue
      metrics.push(JSON.parse(line))
    }
  }
  return metrics
}

function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0
  const idx = Math.min(
    sortedAsc.length - 1,
    Math.floor((p / 100) * sortedAsc.length),
  )
  return sortedAsc[idx]
}

function pad(value: string | number, width: number): string {
  return String(value).padEnd(width)
}

function printReport(metrics: LLMCallMetric[]): void {
  if (metrics.length === 0) {
    console.log('No telemetry data found in telemetry/*.jsonl')
    return
  }

  const byRole = new Map<string, LLMCallMetric[]>()
  for (const m of metrics) {
    const list = byRole.get(m.role) ?? []
    list.push(m)
    byRole.set(m.role, list)
  }

  console.log(`\nTelemetry report — ${metrics.length} call(s)\n`)
  console.log(
    pad('role', 14) +
      pad('calls', 8) +
      pad('success%', 10) +
      pad('p50ms', 8) +
      pad('p95ms', 8) +
      pad('maxMs', 8) +
      'avgTokens',
  )
  console.log('-'.repeat(70))

  for (const [role, list] of [...byRole.entries()].sort()) {
    const latencies = list.map((m) => m.latencyMs).sort((a, b) => a - b)
    const successRate = (
      (100 * list.filter((m) => m.success).length) /
      list.length
    ).toFixed(0)
    const tokenSamples = list
      .map((m) => m.totalTokens)
      .filter((t): t is number => t !== null)
    const avgTokens = tokenSamples.length
      ? Math.round(
          tokenSamples.reduce((a, b) => a + b, 0) / tokenSamples.length,
        )
      : '—'

    console.log(
      pad(role, 14) +
        pad(list.length, 8) +
        pad(`${successRate}%`, 10) +
        pad(percentile(latencies, 50), 8) +
        pad(percentile(latencies, 95), 8) +
        pad(latencies[latencies.length - 1] ?? 0, 8) +
        avgTokens,
    )
  }
  console.log('')
}

const dateArg = process.argv.find((a) => a.startsWith('--date='))?.split('=')[1]

printReport(loadMetrics(dateArg))
