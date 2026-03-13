import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const responseSchema = z.array(z.object({ id: z.string(), code: z.string(), description: z.string().nullable(), languageId: z.string() }))

export async function listLevels(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    { schema: { tags: ['Levels'], summary: 'List levels', response: { 200: responseSchema } } },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const levels = await prisma.level.findMany({ orderBy: { code: 'asc' } })
      return reply.status(200).send(levels.map((l) => ({ id: l.id, code: l.code, description: l.description, languageId: l.languageId })))
    },
  )
}
