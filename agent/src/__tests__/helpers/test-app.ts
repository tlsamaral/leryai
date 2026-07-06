import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { AgentError } from '@/errors.js'
import { appRoutes } from '@/routes/index.js'

export function buildTestApp() {
  const app = fastify({ logger: false })
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)
  app.register(appRoutes)
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AgentError) {
      return reply
        .status(error.statusCode)
        .send({ message: error.message, kind: error.name })
    }
    return reply.status(500).send({ message: 'Internal server error' })
  })
  return app
}
