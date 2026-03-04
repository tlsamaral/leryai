import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        tags: ['Devices'],
        summary: 'Get device by id',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: {
          200: z.object({
            id: z.string(),
            serialNumber: z.string(),
            nickname: z.string().nullable(),
            isActive: z.boolean(),
            lastSeen: z.date(),
            userId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const userId = request.user?.sub as string
      if (!userId) throw new BadRequestError('User not authenticated')

      const device = await prisma.device.findUnique({ where: { id } })
      if (!device || device.userId !== userId)
        throw new BadRequestError('Device not found')

      return reply.status(200).send(device)
    },
  )
}
