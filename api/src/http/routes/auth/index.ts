import type { FastifyInstance } from 'fastify'
import { authenticateWithPassword } from './authenticate-with-password.js'
import { createAccount } from './create-account.js'
import { refreshToken } from './refresh-token.js'

export async function authRoutes(app: FastifyInstance) {
  app.register(authenticateWithPassword)
  app.register(createAccount)
  app.register(refreshToken)
}
