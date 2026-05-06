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
import { prisma } from './lib/prisma.js'
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

// Accepts JWT or Device API Key
app.decorate(
  'authenticate',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization

    if (authHeader?.startsWith('Bearer lery_')) {
      const apiKey = authHeader.replace('Bearer ', '')

      const device = await prisma.device.findUnique({
        where: { apiKey },
        select: { id: true, userId: true, isActive: true },
      })

      if (!device || !device.isActive) {
        return reply.status(401).send({ message: 'Invalid Device API Key' })
      }

      request.user = { sub: device.userId, id: device.userId } as any
      ;(request as any).deviceId = device.id
      return
    }

    await request.jwtVerify()
  },
)

// Device-only — rejects JWT tokens; for IoT-exclusive routes
app.decorate(
  'authenticateDevice',
  async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization

    if (!authHeader?.startsWith('Bearer lery_')) {
      return reply.status(401).send({ message: 'Device API key required. Use Bearer lery_<key>' })
    }

    const apiKey = authHeader.replace('Bearer ', '')

    const device = await prisma.device.findUnique({
      where: { apiKey },
      select: { id: true, userId: true, isActive: true },
    })

    if (!device || !device.isActive) {
      return reply.status(401).send({ message: 'Invalid or inactive Device API Key' })
    }

    request.user = { sub: device.userId, id: device.userId } as any
    ;(request as any).deviceId = device.id
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
