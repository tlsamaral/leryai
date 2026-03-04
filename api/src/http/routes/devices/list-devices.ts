import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function listDevices(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      schema: {
        tags: ['Devices'],
        summary: 'List devices for authenticated user',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              serialNumber: z.string(),
              nickname: z.string().nullable(),
              isActive: z.boolean(),
              lastSeen: z.date(),
              userId: z.string(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.sub as string
      if (!userId) throw new BadRequestError('User not authenticated')

      const devices = await prisma.device.findMany({ where: { userId } })
      return reply.status(200).send(devices)
    },
  )
}
