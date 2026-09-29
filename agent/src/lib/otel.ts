// OpenTelemetry bootstrap — must be imported before any module that
// creates spans (see server.ts). Exports traces via OTLP/HTTP to a local
// Jaeger instance (docker-compose.yml) or any OTLP-compatible collector.
//
// Free and vendor-neutral end to end: the SDK/exporter are Apache-2.0,
// and Jaeger all-in-one is self-hosted — no SaaS, no bill.

import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { env } from '@/env.js'

// Only surface real export failures (e.g. Jaeger not running), not the
// SDK's verbose debug/info chatter.
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR)

let sdk: NodeSDK | null = null

export function startTelemetry(): void {
  if (!env.OTEL_ENABLED || sdk) return

  sdk = new NodeSDK({
    resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: 'lery-agent' }),
    traceExporter: new OTLPTraceExporter({
      url: `${env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    }),
  })
  sdk.start()
}

export async function shutdownTelemetry(): Promise<void> {
  await sdk?.shutdown()
  sdk = null
}
