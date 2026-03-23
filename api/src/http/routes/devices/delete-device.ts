import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function deleteDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Devices'],
        summary: 'Delete device',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        response: { 204: z.null() },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const device = await prisma.device.findUnique({ where: { id } })
      if (!device || device.userId !== request.user.sub)
        throw new NotFoundError('Device not found')
      await prisma.device.delete({ where: { id } })
      return reply.status(204).send(null)
    },
  )
}
