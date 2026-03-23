import type { FastifyInstance } from 'fastify'
import { createLesson } from './create.js'
import { deleteLesson } from './delete.js'
import { getLesson } from './get.js'
import { listLessons } from './list.js'
import { updateLesson } from './update.js'

export async function lessonsIndex(app: FastifyInstance) {
  app.register(listLessons)
  app.register(getLesson)
  app.register(createLesson)
  app.register(updateLesson)
  app.register(deleteLesson)
}
