import type { FastifyInstance } from 'fastify'
import { getProfile } from './get.js'
import { upsertProfile } from './upsert.js'

export async function profileIndex(app: FastifyInstance) {
  app.register(getProfile)
  app.register(upsertProfile)
}
