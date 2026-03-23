import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { prisma } from '@/lib/prisma.js'

export async function createLanguage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Languages'],
        summary: 'Create language',
        security: [{ bearerAuth: [] }],
        body: z.object({
          code: z.string().min(2).max(10),
          name: z.string().min(1),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { code, name } = request.body
      const existing = await prisma.language.findUnique({ where: { code } })
      if (existing) throw new BadRequestError('Language code already exists')
      const lang = await prisma.language.create({ data: { code, name } })
      return reply.status(201).send({ id: lang.id })
    },
  )
}
