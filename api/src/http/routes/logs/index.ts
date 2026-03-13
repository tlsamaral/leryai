import type { FastifyInstance } from 'fastify'
import { listLogs } from './list.js'
import { getLog } from './get.js'
import { createLog } from './create.js'
import { updateLog } from './update.js'
import { deleteLog } from './delete.js'

export async function logsIndex(app: FastifyInstance) {
  app.register(listLogs)
  app.register(getLog)
  app.register(createLog)
  app.register(updateLog)
  app.register(deleteLog)
}
