import type { FastifyInstance } from 'fastify'
import { createLevel } from './create.js'
import { deleteLevel } from './delete.js'
import { getLevel } from './get.js'
import { listLevels } from './list.js'
import { updateLevel } from './update.js'

export async function levelsIndex(app: FastifyInstance) {
  app.register(listLevels)
  app.register(getLevel)
  app.register(createLevel)
  app.register(updateLevel)
  app.register(deleteLevel)
}
