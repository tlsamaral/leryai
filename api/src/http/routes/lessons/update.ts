import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const bodySchema = z.object({ title: z.string().optional(), scenario: z.string().optional(), systemPrompt: z.string().optional(), order: z.number().optional() })
const responseSchema = z.object({ id: z.string() })

export async function updateLesson(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    { schema: { tags: ['Lessons'], summary: 'Update lesson', params: paramsSchema, body: bodySchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const payload = bodySchema.parse(request.body as unknown)
      const l = await prisma.lesson.findUnique({ where: { id } })
      if (!l) throw new BadRequestError('Lesson not found')
      const updated = await prisma.lesson.update({ where: { id }, data: payload })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
