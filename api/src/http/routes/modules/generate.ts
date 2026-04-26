import {
  GoogleGenerativeAI,
  type Schema,
  SchemaType,
} from '@google/generative-ai'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { BadRequestError } from '@/core/errors/bad-request-error.js'
import { prisma } from '@/lib/prisma.js'

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    moduleName: { type: SchemaType.STRING },
    moduleDescription: { type: SchemaType.STRING },
    lessons: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          scenario: { type: SchemaType.STRING },
          objectives: { type: SchemaType.STRING },
          systemPrompt: { type: SchemaType.STRING },
        },
        required: ['title', 'scenario', 'systemPrompt'],
      },
    },
  },
  required: ['moduleName', 'moduleDescription', 'lessons'],
}

export async function generateModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/generate',
    {
      onRequest: [app.authenticate],
      schema: {
        tags: ['AI Generation'],
        summary: 'Generate a personalized module and lessons using Gemini AI',
        security: [{ bearerAuth: [] }],
        body: z.object({
          levelId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            moduleId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { levelId } = request.body

      const apiKey = process.env.GOOGLE_API_KEY
      if (!apiKey) throw new BadRequestError('AI configuration missing')

      const profile = await prisma.userProfile.findUnique({
        where: { userId },
      })

      if (!profile) {
        throw new BadRequestError('User profile missing. Fill profile first.')
      }

      const level = await prisma.level.findUnique({
        where: { id: levelId },
      })

      if (!level) throw new BadRequestError('Invalid level')

      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      })

      const prompt = `
        As an expert English tutor, create a personalized English learning module for a student.
        Level: ${level.code}
        Student Interests: ${profile.interests.join(', ')}
        Student Hobbies: ${profile.hobbies.join(', ')}
        Student Occupation: ${profile.occupation ?? 'Student'}
        Student Learning Goal: ${profile.learningGoal ?? 'Conversational fluency'}
        
        Requirements:
        1. The module name and description should be in Portuguese.
        2. Create 3 personalized lessons.
        3. Each lesson must have a "systemPrompt" in English that defines the Lery AI's character and behavior for roleplay.
        4. "objectives" and "scenario" should be in Portuguese.
        5. The "systemPrompt" should include: Persona (who Lery is), Scenario context, and concrete goals for that specific lesson interaction.
        6. Max 3 sentences for the persona description inside the systemPrompt.
      `

      const result = await model.generateContent(prompt)
      const aiResponse = JSON.parse(result.response.text())

      const lastModule = await prisma.module.findFirst({
        where: { levelId },
        orderBy: { order: 'desc' },
      })

      const nextOrder = (lastModule?.order ?? 0) + 1

      const module = await prisma.module.create({
        data: {
          name: aiResponse.moduleName,
          description: aiResponse.moduleDescription,
          levelId,
          userId,
          isGenerated: true,
          order: nextOrder,
          lessons: {
            create: aiResponse.lessons.map((lesson: any, index: number) => ({
              title: lesson.title,
              scenario: lesson.scenario,
              objectives: lesson.objectives,
              systemPrompt: lesson.systemPrompt,
              isGenerated: true,
              order: index + 1,
            })),
          },
        },
      })

      return reply.status(201).send({ moduleId: module.id })
    },
  )
}
