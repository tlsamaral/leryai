import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function registerDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/register',
    {
      schema: {
        tags: ['Devices'],
        summary:
          'Register device to authenticated user (device becomes inactive)',
        security: [{ bearerAuth: [] }],
        body: z.object({ serialNumber: z.string() }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const userId = request.user?.sub as string
      if (!userId) throw new BadRequestError('User not authenticated')

      const { serialNumber } = request.body as { serialNumber: string }

      const device = await prisma.device.findUnique({ where: { serialNumber } })
      if (!device) throw new BadRequestError('Device not found')

      // If device already claimed by another user -> error
      if (device.userId && device.userId !== userId)
        throw new BadRequestError('Device already claimed by another user')

      // If already claimed by same user, return id
      if (device.userId === userId)
        return reply.status(200).send({ id: device.id })

      const updated = await prisma.device.update({
        where: { serialNumber },
        data: { userId, isActive: false },
      })

      return reply.status(200).send({ id: updated.id })
    },
  )
}
