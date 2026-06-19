import type { FastifyInstance } from 'fastify'
import { createTurnRoute } from './create.js'

export async function turnsRoutes(app: FastifyInstance) {
  app.register(createTurnRoute)
}
