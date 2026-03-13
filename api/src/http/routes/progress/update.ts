import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ score: z.number().optional(), status: z.string().optional(), attempts: z.number().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateProgress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['UserProgress'], summary: 'Update user progress', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const p = await prisma.userProgress.findUnique({ where: { id } })
      if (!p) throw new BadRequestError('UserProgress not found')
      const updated = await prisma.userProgress.update({ where: { id }, data: payload })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
