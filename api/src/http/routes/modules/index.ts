import type { FastifyInstance } from 'fastify'
import { createModule } from './create.js'
import { deleteModule } from './delete.js'
import { getModule } from './get.js'
import { listModules } from './list.js'
import { updateModule } from './update.js'

import { generateModule } from './generate.js'

export async function modulesIndex(app: FastifyInstance) {
  app.register(listModules)
  app.register(getModule)
  app.register(createModule)
  app.register(updateModule)
  app.register(deleteModule)
  app.register(generateModule)
}
