import type { FastifyInstance } from 'fastify'
import { createSubscription } from './create.js'
import { deleteSubscription } from './delete.js'
import { getSubscription } from './get.js'
import { listSubscriptions } from './list.js'
import { updateSubscription } from './update.js'

export async function subscriptionsIndex(app: FastifyInstance) {
  app.register(listSubscriptions)
  app.register(getSubscription)
  app.register(createSubscription)
  app.register(updateSubscription)
  app.register(deleteSubscription)
}
