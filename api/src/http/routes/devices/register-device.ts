import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function registerDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/register',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Devices'],
        summary: 'Register device to authenticated user',
        security: [{ bearerAuth: [] }],
        body: z.object({ serialNumber: z.string().min(1) }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { serialNumber } = request.body
      const device = await prisma.device.findUnique({ where: { serialNumber } })
      if (!device) throw new NotFoundError('Device not found')
      if (device.userId && device.userId !== userId)
        throw new BadRequestError('Device already claimed by another user')
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
