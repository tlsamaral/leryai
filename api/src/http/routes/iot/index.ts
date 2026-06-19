import type { FastifyInstance } from 'fastify'
import { iotCompleteSession } from './complete-session.js'
import { iotCreateLog } from './create-log.js'
import { iotCreateSession } from './create-session.js'
import { iotCreateSessionInsight } from './create-session-insight.js'
import { iotDiagnoseSession } from './diagnose-session.js'
import { iotGetLearnerSnapshot } from './get-learner-snapshot.js'
import { iotListSessionInsights } from './list-session-insights.js'
import { iotSessionConfig } from './session-config.js'

export async function iotIndex(app: FastifyInstance) {
  app.register(iotSessionConfig)
  app.register(iotCreateSession)
  app.register(iotCreateLog)
  app.register(iotCompleteSession)
  app.register(iotDiagnoseSession)
  app.register(iotGetLearnerSnapshot)
  app.register(iotListSessionInsights)
  app.register(iotCreateSessionInsight)
}
