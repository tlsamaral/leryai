import type { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
    authenticateDevice(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }

  interface FastifyRequest {
    deviceId?: string
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; id?: string; name?: string; email?: string }
    user: { sub: string; id?: string; name?: string; email?: string }
  }
}
