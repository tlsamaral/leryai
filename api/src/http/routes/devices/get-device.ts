import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function getDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Devices'],
        summary: 'Get device by id',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: {
          200: z.object({
            id: z.string(),
            serialNumber: z.string(),
            nickname: z.string().nullable(),
            isActive: z.boolean(),
            lastSeen: z.string(),
            userId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const device = await prisma.device.findUnique({ where: { id } })
      if (!device || device.userId !== request.user.sub)
        throw new NotFoundError('Device not found')
      return reply.status(200).send({
        id: device.id,
        serialNumber: device.serialNumber,
        nickname: device.nickname,
        isActive: device.isActive,
        lastSeen: device.lastSeen.toISOString(),
        userId: device.userId,
      })
    },
  )
}
