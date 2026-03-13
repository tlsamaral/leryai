import type { FastifyInstance } from 'fastify'
import { listModules } from './list.js'
import { getModule } from './get.js'
import { createModule } from './create.js'
import { updateModule } from './update.js'
import { deleteModule } from './delete.js'

export async function modulesIndex(app: FastifyInstance) {
  app.register(listModules)
  app.register(getModule)
  app.register(createModule)
  app.register(updateModule)
  app.register(deleteModule)
}
