import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function updateDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Devices'],
        summary: 'Update device',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string().uuid() }),
        body: z.object({
          nickname: z.string().optional(),
          isActive: z.boolean().optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const device = await prisma.device.findUnique({ where: { id } })
      if (!device || device.userId !== request.user.sub)
        throw new NotFoundError('Device not found')
      const updated = await prisma.device.update({
        where: { id },
        data: request.body,
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
