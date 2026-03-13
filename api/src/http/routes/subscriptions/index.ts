import type { FastifyInstance } from 'fastify'
import { listSubscriptions } from './list.js'
import { getSubscription } from './get.js'
import { createSubscription } from './create.js'
import { updateSubscription } from './update.js'
import { deleteSubscription } from './delete.js'

export async function subscriptionsIndex(app: FastifyInstance) {
  app.register(listSubscriptions)
  app.register(getSubscription)
  app.register(createSubscription)
  app.register(updateSubscription)
  app.register(deleteSubscription)
}
