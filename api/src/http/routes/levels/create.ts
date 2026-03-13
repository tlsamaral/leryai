import type { FastifyInstance } from 'fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ code: z.string(), description: z.string().optional(), languageId: z.string() })
const responseSchema = z.object({ id: z.string() })

export async function createLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['Levels'], summary: 'Create level', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = bodySchema.parse(request.body as unknown)
      const existing = await prisma.level.findFirst({ where: { code: payload.code, languageId: payload.languageId } })
      if (existing) throw new BadRequestError('Level with same code already exists for this language')
      const lv = await prisma.level.create({ data: { code: payload.code as any, description: payload.description, languageId: payload.languageId } })
      return reply.status(201).send({ id: lv.id })
    },
  )
}
