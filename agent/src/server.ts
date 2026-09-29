import { app } from './app.js'
import { env } from './env.js'
import { shutdownTelemetry, startTelemetry } from './lib/otel.js'

// OTel's tracer is a lazy proxy — safe to start after other modules have
// already called trace.getTracer(), as long as it runs before the first
// request (i.e. before listen() resolves).
startTelemetry()

app
  .listen({
    host: env.HOST,
    port: env.PORT,
  })
  .then(() => {
    console.info(`🧠 Lery Agent running on http://${env.HOST}:${env.PORT}`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, async () => {
    await app.close()
    await shutdownTelemetry()
    process.exit(0)
  })
}
