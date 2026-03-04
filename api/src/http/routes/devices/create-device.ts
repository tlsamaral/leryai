import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function createDevice(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      schema: {
        tags: ['Devices'],
        summary: 'Create device',
        security: [{ bearerAuth: [] }],
        body: z.object({
          serialNumber: z.string(),
          nickname: z.string().optional(),
        }),
        response: { 201: z.object({ id: z.string() }) },
      },
    },
    async (request, reply) => {
      const userId = request.user?.sub as string
      if (!userId) throw new BadRequestError('User not authenticated')

      const { serialNumber, nickname } = request.body as {
        serialNumber: string
        nickname?: string
      }

      // Ensure unique serial
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
