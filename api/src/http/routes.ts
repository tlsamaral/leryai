import type { FastifyInstance } from 'fastify'
import { authRoutes } from './routes/auth/index.js'
import { devicesIndex } from './routes/devices/index.js'

export async function appRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' })
  app.register(devicesIndex, { prefix: '/devices' })
}
