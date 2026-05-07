import type { FastifyInstance } from 'fastify'
import { iotCompleteSession } from './complete-session.js'
import { iotCreateLog } from './create-log.js'
import { iotCreateSession } from './create-session.js'
import { iotDiagnoseSession } from './diagnose-session.js'
import { iotSessionConfig } from './session-config.js'

export async function iotIndex(app: FastifyInstance) {
  app.register(iotSessionConfig)
  app.register(iotCreateSession)
  app.register(iotCreateLog)
  app.register(iotCompleteSession)
  app.register(iotDiagnoseSession)
}
