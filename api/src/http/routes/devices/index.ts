import type { FastifyInstance } from 'fastify'
import { createDevice } from './create-device'
import { deleteDevice } from './delete-device'
import { getDevice } from './get-device'
import { listDevices } from './list-devices'
import { registerDevice } from './register-device'
import { updateDevice } from './update-device'

export async function devicesIndex(app: FastifyInstance) {
  app.register(listDevices)
  app.register(getDevice)
  app.register(createDevice)
  app.register(updateDevice)
  app.register(deleteDevice)
  app.register(registerDevice)
}
