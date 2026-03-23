import type { FastifyInstance } from 'fastify'
import { createUser } from './create.js'
import { deleteUser } from './delete.js'
import { getUser } from './get.js'
import { listUsers } from './list.js'
import { updateUser } from './update.js'

export async function usersIndex(app: FastifyInstance) {
  app.register(listUsers)
  app.register(getUser)
  app.register(createUser)
  app.register(updateUser)
  app.register(deleteUser)
}
