import type { FastifyInstance } from 'fastify'
import { authRoutes } from './routes/auth/index.js'
import { devicesIndex } from './routes/devices/index.js'
import { languagesIndex } from './routes/languages/index.js'
import { lessonsIndex } from './routes/lessons/index.js'
import { levelsIndex } from './routes/levels/index.js'
import { logsIndex } from './routes/logs/index.js'
import { modulesIndex } from './routes/modules/index.js'
import { profileIndex } from './routes/profile/index.js'
import { progressIndex } from './routes/progress/index.js'
import { sessionsIndex } from './routes/sessions/index.js'
import { subscriptionsIndex } from './routes/subscriptions/index.js'
import { usersIndex } from './routes/users/index.js'

export async function appRoutes(app: FastifyInstance) {
  app.register(authRoutes, { prefix: '/auth' })
  app.register(devicesIndex, { prefix: '/devices' })
  app.register(languagesIndex, { prefix: '/languages' })
  app.register(usersIndex, { prefix: '/users' })
  app.register(profileIndex, { prefix: '/profile' })
  app.register(subscriptionsIndex, { prefix: '/subscriptions' })
  app.register(levelsIndex, { prefix: '/levels' })
  app.register(modulesIndex, { prefix: '/modules' })
  app.register(lessonsIndex, { prefix: '/lessons' })
  app.register(progressIndex, { prefix: '/progress' })
  app.register(sessionsIndex, { prefix: '/sessions' })
  app.register(logsIndex, { prefix: '/logs' })
}
