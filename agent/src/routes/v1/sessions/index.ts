import type { FastifyInstance } from 'fastify'
import { completeSessionRoute } from './complete.js'
import { createSessionRoute } from './create.js'

export async function sessionsRoutes(app: FastifyInstance) {
  app.register(createSessionRoute)
  app.register(completeSessionRoute)
}
