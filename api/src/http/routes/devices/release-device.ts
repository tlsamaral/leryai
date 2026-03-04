import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function releaseDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/release',
    {
      schema: {
        tags: ['Devices'],
        summary: 'Release device (set isActive=false). Only owner can release.',
        security: [{ bearerAuth: [] }],
        body: z.object({ id: z.string() }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const userId = request.user?.sub as string
      if (!userId) throw new BadRequestError('User not authenticated')

      const { id } = request.body as { id: string }

      const device = await prisma.device.findUnique({ where: { id } })
      if (!device) throw new BadRequestError('Device not found')

      if (device.userId !== userId)
        throw new BadRequestError('Only owner may release device')

      const updated = await prisma.device.update({
        where: { id },
        data: { isActive: false },
      })

      return reply.status(200).send({ id: updated.id })
    },
  )
}
