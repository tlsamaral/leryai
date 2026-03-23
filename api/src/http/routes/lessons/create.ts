import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function createLesson(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Lessons'],
        summary: 'Create lesson',
        security: [{ bearerAuth: [] }],
        body: z.object({
          title: z.string().min(1),
          scenario: z.string().min(1),
          systemPrompt: z.string().min(1),
          order: z.number().int().min(1),
          moduleId: z.string().uuid(),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { title, scenario, systemPrompt, order, moduleId } = request.body
      const mod = await prisma.module.findUnique({ where: { id: moduleId } })
      if (!mod) throw new NotFoundError('Module not found')
      const l = await prisma.lesson.create({
        data: { title, scenario, systemPrompt, order, moduleId },
      })
      return reply.status(201).send({ id: l.id })
    },
  )
}
