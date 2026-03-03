import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from './core/errors/app-error.js'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      code: 'ERR_VALIDATION',
      issues: error.format()
    })
  }

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
      code: error.code
    })
  }

  console.error(error)

  return reply.status(500).send({
    message: 'Internal server error',
    code: 'ERR_INTERNAL_SERVER'
  })
}
