import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
})

export async function getLanguage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: { tags: ['Languages'], summary: 'Get language by id', params: paramsSchema, response: { 200: responseSchema } },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as any)
      const lang = await prisma.language.findUnique({ where: { id } })
      if (!lang) throw new BadRequestError('Language not found')
      return reply.status(200).send({
        id: lang.id,
        code: lang.code,
        name: lang.name,
        isActive: lang.isActive,
        createdAt: lang.createdAt.toISOString(),
      })
    },
  )
}
