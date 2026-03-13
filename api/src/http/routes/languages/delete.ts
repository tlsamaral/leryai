import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })

export async function deleteLanguage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    { schema: { tags: ['Languages'], summary: 'Delete language', params: paramsSchema, response: { 204: z.null() } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const lang = await prisma.language.findUnique({ where: { id } })
      if (!lang) throw new BadRequestError('Language not found')
      await prisma.language.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
