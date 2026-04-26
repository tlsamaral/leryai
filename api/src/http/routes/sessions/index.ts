import type { FastifyInstance } from 'fastify'
import { completeSession } from './complete.js'
import { createSession } from './create.js'
import { deleteSession } from './delete.js'
import { getSession } from './get.js'
import { listSessions } from './list.js'
import { updateSession } from './update.js'

export async function sessionsIndex(app: FastifyInstance) {
  app.register(listSessions)
  app.register(getSession)
  app.register(createSession)
  app.register(updateSession)
  app.register(deleteSession)
  app.register(completeSession)
}
