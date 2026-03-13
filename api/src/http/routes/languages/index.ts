import type { FastifyInstance } from 'fastify'
import { listLanguages } from './list.js'
import { getLanguage } from './get.js'
import { createLanguage } from './create.js'
import { updateLanguage } from './update.js'
import { deleteLanguage } from './delete.js'

export async function languagesIndex(app: FastifyInstance) {
  app.register(listLanguages)
  app.register(getLanguage)
  app.register(createLanguage)
  app.register(updateLanguage)
  app.register(deleteLanguage)
}
