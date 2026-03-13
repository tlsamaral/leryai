import type { FastifyInstance } from 'fastify'
import { listLevels } from './list.js'
import { getLevel } from './get.js'
import { createLevel } from './create.js'
import { updateLevel } from './update.js'
import { deleteLevel } from './delete.js'

export async function levelsIndex(app: FastifyInstance) {
  app.register(listLevels)
  app.register(getLevel)
  app.register(createLevel)
  app.register(updateLevel)
  app.register(deleteLevel)
}
