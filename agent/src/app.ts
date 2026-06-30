import type { FastifyReply, FastifyRequest } from 'fastify'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { AgentError } from './errors.js'
import { appRoutes } from './routes/index.js'

export const app = fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(appRoutes)

app.setErrorHandler(
  (error: unknown, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AgentError) {
      return reply.status(error.statusCode).send({
        message: error.message,
        kind: error.name,
      })
    }

    app.log.error({ err: error }, error instanceof Error ? 'Unhandled error' : 'Unknown error')
    return reply.status(500).send({ message: 'Internal server error' })
  },
)
