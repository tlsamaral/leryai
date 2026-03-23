import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

const userLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])

export async function createLevel(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Levels'],
        summary: 'Create level',
        security: [{ bearerAuth: [] }],
        body: z.object({
          code: userLevelSchema,
          description: z.string().optional(),
          languageId: z.string().uuid(),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { code, description, languageId } = request.body
      const lang = await prisma.language.findUnique({
        where: { id: languageId },
      })
      if (!lang) throw new NotFoundError('Language not found')
      const existing = await prisma.level.findFirst({
        where: { code, languageId },
      })
      if (existing)
        throw new BadRequestError(
          'Level with same code already exists for this language',
        )
      const lv = await prisma.level.create({
        data: { code, description, languageId },
      })
      return reply.status(201).send({ id: lv.id })
    },
  )
}
