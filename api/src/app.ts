import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import type { FastifyReply, FastifyRequest } from 'fastify'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler.js'
import { appRoutes } from './http/routes.js'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET ?? '12###12###',
})

app.register(fastifyCookie, {
  hook: 'onRequest',
  secret: process.env.JWT_SECRET ?? '12###12###',
})

// Add authenticate decorator to validate JWT on protected routes
app.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify()
  },
)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Lery AI API',
      description: 'API for Lery AI project',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(appRoutes)

app.setErrorHandler(errorHandler)
