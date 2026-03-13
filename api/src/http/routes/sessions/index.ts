import type { FastifyInstance } from 'fastify'
import { listSessions } from './list.js'
import { getSession } from './get.js'
import { createSession } from './create.js'
import { updateSession } from './update.js'
import { deleteSession } from './delete.js'

export async function sessionsIndex(app: FastifyInstance) {
  app.register(listSessions)
  app.register(getSession)
  app.register(createSession)
  app.register(updateSession)
  app.register(deleteSession)
}
