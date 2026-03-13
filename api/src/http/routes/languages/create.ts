import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { BadRequestError } from '@/core/errors/bad-request-error'

const bodySchema = z.object({ code: z.string(), name: z.string() })
const responseSchema = z.object({ id: z.string() })

export async function createLanguage(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    { schema: { tags: ['Languages'], summary: 'Create language', body: bodySchema, response: { 201: responseSchema } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { code, name } = bodySchema.parse(request.body as unknown)
      const existing = await prisma.language.findUnique({ where: { code } })
      if (existing) throw new BadRequestError('Language code already exists')
      const lang = await prisma.language.create({ data: { code, name } })
      return reply.status(201).send({ id: lang.id })
    },
  )
}
