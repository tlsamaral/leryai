import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function deleteDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      schema: {
        tags: ['Devices'],
        summary: 'Delete device',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const userId = request.user?.sub as string
      if (!userId) throw new BadRequestError('User not authenticated')

      const device = await prisma.device.findUnique({ where: { id } })
      if (!device || device.userId !== userId)
        throw new BadRequestError('Device not found')

      await prisma.device.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
