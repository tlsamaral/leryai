import { type FunctionDeclaration, SchemaType } from '@google/generative-ai'

export const PEDAGOGICAL_TOOL_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: 'recall_recent_errors',
    description:
      'Fetch recent recurring errors for this student to gently address or reinforce if relevant.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        limit: {
          type: SchemaType.INTEGER,
          description: 'Maximum number of errors to retrieve (default 3)',
        },
      },
    },
  },
  {
    name: 'recall_dominated_structures',
    description:
      'Fetch grammar structures the student has already mastered to avoid over-correcting them.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        limit: {
          type: SchemaType.INTEGER,
          description: 'Maximum number of structures to retrieve (default 5)',
        },
      },
    },
  },
  {
    name: 'recall_open_topics',
    description:
      'Fetch open personal topics or plans mentioned by the student in previous sessions for natural conversational callbacks.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        limit: {
          type: SchemaType.INTEGER,
          description: 'Maximum number of topics to retrieve (default 2)',
        },
      },
    },
  },
  {
    name: 'mark_objective_complete',
    description:
      'Mark a specific lesson objective as completed once the student demonstrates competence during a guided lesson.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        objective: {
          type: SchemaType.STRING,
          description:
            'Description or phrase of the completed lesson objective',
        },
      },
      required: ['objective'],
    },
  },
]

export interface PedagogicalToolContext {
  recentErrors?: Array<{ pattern: string; exampleCount: number }>
  dominatedStructures?: Array<{ structure: string; accuracyPct: number }>
  openTopics?: Array<{ topic: string; lastMentioned: string }>
  completedObjectives?: string[]
}

export function executePedagogicalTool(
  name: string,
  args: Record<string, unknown>,
  context: PedagogicalToolContext,
): Record<string, unknown> {
  switch (name) {
    case 'recall_recent_errors': {
      const limit = typeof args.limit === 'number' ? args.limit : 3
      return {
        errors: (context.recentErrors ?? []).slice(0, limit),
      }
    }
    case 'recall_dominated_structures': {
      const limit = typeof args.limit === 'number' ? args.limit : 5
      return {
        dominatedStructures: (context.dominatedStructures ?? []).slice(
          0,
          limit,
        ),
      }
    }
    case 'recall_open_topics': {
      const limit = typeof args.limit === 'number' ? args.limit : 2
      return {
        openTopics: (context.openTopics ?? []).slice(0, limit),
      }
    }
    case 'mark_objective_complete': {
      const obj = String(args.objective ?? '')
      if (
        context.completedObjectives &&
        !context.completedObjectives.includes(obj)
      ) {
        context.completedObjectives.push(obj)
      }
      return { status: 'recorded', objective: obj }
    }
    default:
      return { error: `Unknown tool: ${name}` }
  }
}
