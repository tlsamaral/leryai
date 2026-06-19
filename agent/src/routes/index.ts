import type { FastifyInstance } from 'fastify'
import { healthRoute } from './health.js'
import { v1Routes } from './v1/index.js'

export async function appRoutes(app: FastifyInstance) {
  app.register(healthRoute)
  app.register(v1Routes, { prefix: '/v1' })
}
