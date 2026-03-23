import type { FastifyInstance } from 'fastify'
import { createLanguage } from './create.js'
import { deleteLanguage } from './delete.js'
import { getLanguage } from './get.js'
import { listLanguages } from './list.js'
import { updateLanguage } from './update.js'

export async function languagesIndex(app: FastifyInstance) {
  app.register(listLanguages)
  app.register(getLanguage)
  app.register(createLanguage)
  app.register(updateLanguage)
  app.register(deleteLanguage)
}
