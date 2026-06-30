export interface ChatTurn {
  role: 'user' | 'model'
  content: string
}
export interface TutorReply {
  text: string
  attempts: number
  latencyMs: number
}
export interface EvaluationResult {
  task_achievement: number
  grammar: number
  vocabulary: number
  fluency: number
  total_score: number
  grammatical_fixes: string
  reasoning: string
}
export interface CefrRating {
  estimated_cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  justification: string
}
