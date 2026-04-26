import type { FastifyInstance } from 'fastify'
import { createLog } from './create.js'
import { deleteLog } from './delete.js'
import { disputeLog } from './dispute.js'
import { getLog } from './get.js'
import { listLogs } from './list.js'
import { updateLog } from './update.js'

export async function logsIndex(app: FastifyInstance) {
  app.register(listLogs)
  app.register(getLog)
  app.register(createLog)
  app.register(updateLog)
  app.register(deleteLog)
  app.register(disputeLog)
}
