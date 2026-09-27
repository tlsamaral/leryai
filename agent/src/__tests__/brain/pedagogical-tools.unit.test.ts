import { describe, expect, it } from 'vitest'
import {
  executePedagogicalTool,
  PEDAGOGICAL_TOOL_DECLARATIONS,
} from '@/brain/tools/pedagogical-tools.js'

describe('Pedagogical Tools', () => {
  it('exports valid function declarations for Gemini', () => {
    expect(PEDAGOGICAL_TOOL_DECLARATIONS.length).toBeGreaterThanOrEqual(4)
    const names = PEDAGOGICAL_TOOL_DECLARATIONS.map((t) => t.name)
    expect(names).toContain('recall_recent_errors')
    expect(names).toContain('recall_dominated_structures')
    expect(names).toContain('recall_open_topics')
    expect(names).toContain('mark_objective_complete')
  })

  it('recall_recent_errors returns sliced errors', () => {
    const res = executePedagogicalTool(
      'recall_recent_errors',
      { limit: 2 },
      {
        recentErrors: [
          { pattern: 'past tense -ed', exampleCount: 4 },
          { pattern: 'third person -s', exampleCount: 3 },
          { pattern: 'in vs on', exampleCount: 2 },
        ],
      },
    )
    expect(res).toEqual({
      errors: [
        { pattern: 'past tense -ed', exampleCount: 4 },
        { pattern: 'third person -s', exampleCount: 3 },
      ],
    })
  })

  it('recall_dominated_structures returns mastered structures', () => {
    const res = executePedagogicalTool(
      'recall_dominated_structures',
      { limit: 1 },
      {
        dominatedStructures: [
          { structure: 'present simple', accuracyPct: 95 },
          { structure: 'future with going to', accuracyPct: 88 },
        ],
      },
    )
    expect(res).toEqual({
      dominatedStructures: [{ structure: 'present simple', accuracyPct: 95 }],
    })
  })

  it('recall_open_topics returns open topics', () => {
    const res = executePedagogicalTool(
      'recall_open_topics',
      {},
      {
        openTopics: [
          { topic: 'vacation in Italy', lastMentioned: 'yesterday' },
        ],
      },
    )
    expect(res).toEqual({
      openTopics: [{ topic: 'vacation in Italy', lastMentioned: 'yesterday' }],
    })
  })

  it('mark_objective_complete appends objective to completedObjectives', () => {
    const context = { completedObjectives: [] }
    const res = executePedagogicalTool(
      'mark_objective_complete',
      { objective: 'Order food at restaurant' },
      context,
    )
    expect(res).toEqual({
      status: 'recorded',
      objective: 'Order food at restaurant',
    })
    expect(context.completedObjectives).toContain('Order food at restaurant')
  })

  it('returns error for unknown tool', () => {
    const res = executePedagogicalTool('nonexistent_tool', {}, {})
    expect(res).toHaveProperty('error')
  })
})
