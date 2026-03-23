import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { prisma } from '@/lib/prisma.js'

export async function createDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['Devices'],
        summary: 'Create device',
        security: [{ bearerAuth: [] }],
        body: z.object({
          serialNumber: z.string().min(1),
          nickname: z.string().optional(),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { serialNumber, nickname } = request.body
      const existing = await prisma.device.findUnique({
        where: { serialNumber },
      })
      if (existing)
        throw new BadRequestError('Device with same serial already exists')
      const device = await prisma.device.create({
        data: { serialNumber, nickname, userId },
      })
      return reply.status(201).send({ id: device.id })
    },
  )
}
