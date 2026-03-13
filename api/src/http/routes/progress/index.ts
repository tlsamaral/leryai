import type { FastifyInstance } from 'fastify'
import { listProgress } from './list.js'
import { getProgress } from './get.js'
import { createProgress } from './create.js'
import { updateProgress } from './update.js'
import { deleteProgress } from './delete.js'

export async function progressIndex(app: FastifyInstance) {
  app.register(listProgress)
  app.register(getProgress)
  app.register(createProgress)
  app.register(updateProgress)
  app.register(deleteProgress)
}
