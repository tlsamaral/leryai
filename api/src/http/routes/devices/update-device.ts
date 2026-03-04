import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function updateDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      schema: {
        tags: ['Devices'],
        summary: 'Update device',
        security: [{ bearerAuth: [] }],
        params: z.object({ id: z.string() }),
        body: z.object({
          nickname: z.string().optional(),
          isActive: z.boolean().optional(),
        }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string }
      const userId = request.user?.sub as string
      if (!userId) throw new BadRequestError('User not authenticated')

      const payload = request.body as { nickname?: string; isActive?: boolean }

      const device = await prisma.device.findUnique({ where: { id } })
      if (!device || device.userId !== userId)
        throw new BadRequestError('Device not found')

      const updated = await prisma.device.update({
        where: { id },
        data: payload,
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
