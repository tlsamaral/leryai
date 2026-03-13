import type { FastifyInstance } from 'fastify'
import { listUsers } from './list.js'
import { getUser } from './get.js'
import { createUser } from './create.js'
import { updateUser } from './update.js'
import { deleteUser } from './delete.js'

export async function usersIndex(app: FastifyInstance) {
  app.register(listUsers)
  app.register(getUser)
  app.register(createUser)
  app.register(updateUser)
  app.register(deleteUser)
}
