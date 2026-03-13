import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ name: z.string().optional(), isActive: z.boolean().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateLanguage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['Languages'], summary: 'Update language', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const lang = await prisma.language.findUnique({ where: { id } })
      if (!lang) throw new BadRequestError('Language not found')
      const updated = await prisma.language.update({ where: { id }, data: payload })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
