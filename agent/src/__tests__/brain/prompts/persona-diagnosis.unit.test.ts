import { describe, expect, it } from 'vitest'
import { buildDiagnosisPrompt } from '@/brain/prompts/diagnosis.js'
import { buildPersona } from '@/brain/prompts/persona.js'

describe('buildPersona', () => {
  it('returns non-empty string', () => {
    expect(buildPersona().length).toBeGreaterThan(0)
  })

  it('contains core identity marker', () => {
    expect(buildPersona()).toContain('Lery')
  })

  it('contains lead-conversation rule', () => {
    expect(buildPersona()).toContain('lead the conversation')
  })

  it('contains PT tag language policy', () => {
    expect(buildPersona()).toContain('[PT]')
  })
})

describe('buildDiagnosisPrompt', () => {
  it('returns non-empty string', () => {
    expect(buildDiagnosisPrompt().length).toBeGreaterThan(0)
  })

  it('contains DIAGNOSIS mode marker', () => {
    expect(buildDiagnosisPrompt()).toContain('DIAGNOSIS')
  })

  it('instructs not to reveal evaluation', () => {
    const prompt = buildDiagnosisPrompt()
    expect(prompt).toContain('Do NOT mention levels')
  })

  it('constrains to max 2 sentences', () => {
    expect(buildDiagnosisPrompt()).toContain('Max 2 sentences')
  })
})
