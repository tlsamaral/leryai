import type { FastifyInstance } from 'fastify'
import { createProgress } from './create.js'
import { currentProgress } from './current.js'
import { deleteProgress } from './delete.js'
import { getProgress } from './get.js'
import { listProgress } from './list.js'
import { updateProgress } from './update.js'

export async function progressIndex(app: FastifyInstance) {
  app.register(listProgress)
  app.register(currentProgress)
  app.register(getProgress)
  app.register(createProgress)
  app.register(updateProgress)
  app.register(deleteProgress)
}
