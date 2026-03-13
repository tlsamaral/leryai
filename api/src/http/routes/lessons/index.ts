import type { FastifyInstance } from 'fastify'
import { listLessons } from './list.js'
import { getLesson } from './get.js'
import { createLesson } from './create.js'
import { updateLesson } from './update.js'
import { deleteLesson } from './delete.js'

export async function lessonsIndex(app: FastifyInstance) {
  app.register(listLessons)
  app.register(getLesson)
  app.register(createLesson)
  app.register(updateLesson)
  app.register(deleteLesson)
}
