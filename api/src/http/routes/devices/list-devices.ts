import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

export async function listDevices(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      onRequest: [app.authenticate],
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
              lastSeen: z.string(),
              userId: z.string(),
            }),
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const devices = await prisma.device.findMany({ where: { userId } })
      return reply.status(200).send(
        devices.map((d) => ({
          id: d.id,
          serialNumber: d.serialNumber,
          nickname: d.nickname,
          isActive: d.isActive,
          lastSeen: d.lastSeen.toISOString(),
          userId: d.userId,
        })),
      )
    },
  )
}
