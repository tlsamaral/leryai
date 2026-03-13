import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const paramsSchema = z.object({ id: z.string() })
const responseSchema = z.object({ id: z.string(), title: z.string(), scenario: z.string(), order: z.number(), moduleId: z.string() })

export async function getLesson(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    { schema: { tags: ['Lessons'], summary: 'Get lesson', params: paramsSchema, response: { 200: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = paramsSchema.parse(request.params as unknown)
      const l = await prisma.lesson.findUnique({ where: { id } })
      if (!l) throw new BadRequestError('Lesson not found')
      return reply.status(200).send({ id: l.id, title: l.title, scenario: l.scenario, order: l.order, moduleId: l.moduleId })
    },
  )
}
