import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { NotFoundError } from '@/core/errors/not-found-error.js'
import { prisma } from '@/lib/prisma.js'

export async function releaseDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/release',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Devices'],
        summary: 'Release device (set isActive=false). Only owner can release.',
        security: [{ bearerAuth: [] }],
        body: z.object({ id: z.string().uuid() }),
        response: { 200: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const { id } = request.body
      const device = await prisma.device.findUnique({ where: { id } })
      if (!device) throw new NotFoundError('Device not found')
      if (device.userId !== request.user.sub)
        throw new BadRequestError('Only owner may release device')
      const updated = await prisma.device.update({
        where: { id },
        data: { isActive: false },
      })
      return reply.status(200).send({ id: updated.id })
    },
  )
}
