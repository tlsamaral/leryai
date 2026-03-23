import type { FastifyInstance } from 'fastify'
import { createDevice } from './create-device.js'
import { deleteDevice } from './delete-device.js'
import { getDevice } from './get-device.js'
import { listDevices } from './list-devices.js'
import { registerDevice } from './register-device.js'
import { releaseDevice } from './release-device.js'
import { updateDevice } from './update-device.js'

export async function devicesIndex(app: FastifyInstance) {
  app.register(listDevices)
  app.register(getDevice)
  app.register(createDevice)
  app.register(updateDevice)
  app.register(deleteDevice)
  app.register(registerDevice)
  app.register(releaseDevice)
}
