import type { FastifyInstance } from 'fastify'
import { sessionsRoutes } from './sessions/index.js'
import { turnsRoutes } from './turns/index.js'

export async function v1Routes(app: FastifyInstance) {
  app.register(sessionsRoutes)
  app.register(turnsRoutes)
}
