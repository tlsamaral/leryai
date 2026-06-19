import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma.js'

const RecentErrorSchema = z.object({
  pattern: z.string(),
  exampleCount: z.number().int(),
  lastSeen: z.string(),
})

const DominatedStructureSchema = z.object({
  structure: z.string(),
  accuracyPct: z.number(),
  sampleSize: z.number().int(),
})

const OpenTopicSchema = z.object({
  topic: z.string(),
  lastMentioned: z.string(),
})

export async function iotGetLearnerSnapshot(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/learner-snapshot',
    {
      onRequest: [app.authenticateDevice],
      schema: {
        tags: ['IoT / Core'],
        summary: 'Get aggregated learner profile snapshot for the device user',
        description:
          'Returns the materialized learner snapshot (recent errors, dominated structures, open topics). Source for the Learner Snapshot context layer in the Agent. Returns empty arrays if no snapshot has been computed yet.',
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            userId: z.string(),
            recentErrors: z.array(RecentErrorSchema),
            dominatedStructures: z.array(DominatedStructureSchema),
            openTopics: z.array(OpenTopicSchema),
            updatedAt: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const snapshot = await prisma.learnerProfileSnapshot.findUnique({
        where: { userId },
      })

      if (!snapshot) {
        return reply.status(200).send({
          userId,
          recentErrors: [],
          dominatedStructures: [],
          openTopics: [],
          updatedAt: null,
        })
      }

      return reply.status(200).send({
        userId,
        recentErrors: snapshot.recentErrors as z.infer<
          typeof RecentErrorSchema
        >[],
        dominatedStructures: snapshot.dominatedStructures as z.infer<
          typeof DominatedStructureSchema
        >[],
        openTopics: snapshot.openTopics as z.infer<typeof OpenTopicSchema>[],
        updatedAt: snapshot.updatedAt.toISOString(),
      })
    },
  )
}
