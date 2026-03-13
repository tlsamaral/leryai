import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ title: z.string(), scenario: z.string(), systemPrompt: z.string(), order: z.number(), moduleId: z.string() })
const responseSchema = z.object({ id: z.string() })

export async function createLesson(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['Lessons'], summary: 'Create lesson', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = bodySchema.parse(request.body as unknown)
      const mod = await prisma.module.findUnique({ where: { id: payload.moduleId } })
      if (!mod) throw new BadRequestError('Module not found')
      const l = await prisma.lesson.create({ data: { title: payload.title, scenario: payload.scenario, systemPrompt: payload.systemPrompt, order: payload.order, moduleId: payload.moduleId } })
      return reply.status(201).send({ id: l.id })
    },
  )
}
