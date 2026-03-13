import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const responseSchema = z.array(
  z.object({
    id: z.string(),
    code: z.string(),
    name: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
  }),
)

export async function listLanguages(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        tags: ['Languages'],
        summary: 'List languages',
        response: { 200: responseSchema },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const langs = await prisma.language.findMany({ orderBy: { code: 'asc' } })
      const payload = langs.map((l) => ({
        id: l.id,
        code: l.code,
        name: l.name,
        isActive: l.isActive,
        createdAt: l.createdAt.toISOString(),
      }))
      return reply.status(200).send(payload)
    },
  )
}
