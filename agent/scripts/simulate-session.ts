import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildTestApp } from '../src/__tests__/helpers/test-app.js'
import { Summarizer } from '../src/brain/summarizer.js'
import { env } from '../src/env.js'
import { apiClient } from '../src/lib/api-client.js'

// ANSI formatting for terminal
const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  bgBlue: '\x1b[44m',
}

interface Persona {
  name: string
  level: string
  occupation: string
  interests: string[]
  hobbies: string[]
  learningGoal: string
  backstory: string
  expectedErrors: string
  initialUtterance: string
}

const PERSONAS: Record<string, Persona> = {
  A1: {
    name: 'Carlos',
    level: 'A1',
    occupation: 'Backend Developer',
    interests: ['coding', 'coffee', 'travel'],
    hobbies: ['gaming', 'cycling'],
    learningGoal: 'Survive in an English speaking country and travel',
    backstory:
      'Beginner English student from Brazil. Very enthusiastic but struggles with verbs. Uses simple present for everything ("Yesterday I eat pizza"). Mixes Portuguese words when stuck ("I was with... como fala... hunger?"). Mentioning plans to visit Vancouver next December.',
    expectedErrors: 'Misses past tense endings (-ed, went/had), drops 3rd person -s, uses Portuguese vocabulary when stuck.',
    initialUtterance: 'Hello teacher! Good morning. I am happy to speak with you today.',
  },
  B1: {
    name: 'Marina',
    level: 'B1',
    occupation: 'Product Designer',
    interests: ['design', 'psychology', 'cinema'],
    hobbies: ['photography', 'yoga'],
    learningGoal: 'Lead design critique meetings with global colleagues',
    backstory:
      'Intermediate student from Brazil. Can converse fluently about everyday topics, but confuses present perfect vs past simple ("I live here for 3 years" instead of "I have lived"), and uses incorrect prepositions ("depend of", "interested for"). Mentioning her preparation for an interview next week.',
    expectedErrors: 'Present perfect vs past simple confusion, preposition collocations, occasional literal translations.',
    initialUtterance: "Hi Lery! It's great to talk to you. I'm preparing for some important work meetings this month.",
  },
}

interface TurnLog {
  turnIndex: number
  studentSaid: string
  tutorReply: string
  latencyMs: number
  evaluation: {
    task_achievement: number
    grammar: number
    vocabulary: number
    fluency: number
    total_score: number
    grammatical_fixes: string
    reasoning: string
  } | null
}

async function simulateStudentTurn(
  genai: GoogleGenerativeAI,
  persona: Persona,
  dialogueHistory: Array<{ role: 'student' | 'tutor'; text: string }>,
): Promise<string> {
  const historyText = dialogueHistory
    .map((h) => `${h.role === 'student' ? persona.name : 'Lery'}: "${h.text}"`)
    .join('\n')

  const prompt = `You are roleplaying as ${persona.name}, an English language student chatting with your personal AI English tutor named Lery.

STUDENT PROFILE:
- Name: ${persona.name}
- CEFR Level: ${persona.level}
- Occupation: ${persona.occupation}
- Persona & Backstory: ${persona.backstory}
- Typical errors to exhibit naturally: ${persona.expectedErrors}

DIALOGUE SO FAR:
${historyText}

INSTRUCTIONS:
1. Respond directly to Lery's last message as ${persona.name}.
2. Stay strictly true to your level (${persona.level}). If you are A1, use short sentences, basic vocabulary, and make realistic grammatical slips naturally. If asked about your plans, casually bring up your backstory details (like your vacation or work).
3. Do NOT include quotes, "Carlos:", or meta-commentary. Return ONLY what the student speaks out loud.`

  const model = genai.getGenerativeModel({ model: env.GEMINI_EVALUATOR_MODEL })
  const result = await model.generateContent(prompt)
  return result.response.text().trim().replace(/^"|"$/g, '')
}

function generateHtmlReport(
  persona: Persona,
  turns: TurnLog[],
  insightCard: { topError: string; topProgress: string; openTopic: string | null } | null,
): string {
  const turnsHtml = turns
    .map(
      (t) => `
    <div class="turn-card">
      <div class="turn-header">
        <span class="badge turn-badge">Turn ${t.turnIndex}</span>
        <span class="latency">${t.latencyMs}ms</span>
      </div>
      <div class="bubble student-bubble">
        <strong>${persona.name} (${persona.level}):</strong>
        <p>${t.studentSaid}</p>
      </div>
      <div class="bubble tutor-bubble">
        <strong>Lery (Tutor):</strong>
        <p>${t.tutorReply}</p>
      </div>
      ${
        t.evaluation
          ? `
      <div class="eval-box">
        <div class="eval-scores">
          <span class="score-pill total">Total: ${t.evaluation.total_score}/100</span>
          <span class="score-pill">Task: ${t.evaluation.task_achievement}/25</span>
          <span class="score-pill">Grammar: ${t.evaluation.grammar}/25</span>
          <span class="score-pill">Vocab: ${t.evaluation.vocabulary}/25</span>
          <span class="score-pill">Fluency: ${t.evaluation.fluency}/25</span>
        </div>
        <div class="eval-fixes">
          <strong>Correção Pedagógica:</strong> ${t.evaluation.grammatical_fixes}
        </div>
        <div class="eval-reasoning">
          <strong>Feedback:</strong> ${t.evaluation.reasoning}
        </div>
      </div>`
          : ''
      }
    </div>`,
    )
    .join('\n')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Lery AI — Relatório de Simulação Pedagógica</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #e2e8f0; margin: 0; padding: 32px; }
  .container { max-width: 900px; margin: 0 auto; }
  h1 { color: #fff; margin-bottom: 4px; font-size: 1.8rem; }
  .subtitle { color: #94a3b8; font-size: 0.95rem; margin-bottom: 24px; }
  .persona-card { background: #161f30; border: 1px solid #233554; border-radius: 12px; padding: 20px; margin-bottom: 32px; }
  .badge { display: inline-block; padding: 4px 10px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
  .badge-a1 { background: #064e3b; color: #6ee7b7; }
  .badge-b1 { background: #1e3a5f; color: #7dd3fc; }
  .turn-card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
  .turn-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .turn-badge { background: #374151; color: #d1d5db; }
  .latency { color: #64748b; font-size: 0.8rem; }
  .bubble { padding: 12px 16px; border-radius: 8px; margin-bottom: 10px; font-size: 0.95rem; line-height: 1.5; }
  .student-bubble { background: #1e293b; border-left: 4px solid #38bdf8; }
  .tutor-bubble { background: #064e3b; border-left: 4px solid #10b981; }
  .eval-box { background: #0d131f; border: 1px dashed #334155; border-radius: 8px; padding: 12px 14px; margin-top: 10px; font-size: 0.85rem; }
  .eval-scores { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
  .score-pill { background: #1e293b; padding: 2px 8px; border-radius: 6px; font-weight: 600; color: #94a3b8; }
  .score-pill.total { background: #4338ca; color: #e0e7ff; }
  .eval-fixes { color: #facc15; margin-bottom: 4px; }
  .eval-reasoning { color: #94a3b8; }
  .insight-card { background: linear-gradient(135deg, #1e1b4b, #172554); border: 1px solid #4338ca; border-radius: 12px; padding: 24px; margin-top: 32px; }
  .insight-title { color: #c7d2fe; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .insight-item { margin-bottom: 12px; font-size: 0.95rem; }
  .insight-item strong { color: #a5b4fc; }
</style>
</head>
<body>
<div class="container">
  <h1>Lery AI — Sessão de Simulação Pedagógica</h1>
  <div class="subtitle">Teste de estresse conversacional automatizado com Aluno Sintético</div>

  <div class="persona-card">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
      <h2 style="margin:0; font-size:1.2rem; color:#fff;">Aluno: ${persona.name}</h2>
      <span class="badge ${persona.level === 'A1' ? 'badge-a1' : 'badge-b1'}">Nível ${persona.level}</span>
    </div>
    <p style="margin:0 0 8px 0; color:#94a3b8; font-size:0.9rem;"><strong>Profissão:</strong> ${persona.occupation} · <strong>Objetivo:</strong> ${persona.learningGoal}</p>
    <p style="margin:0; color:#cbd5e1; font-size:0.85rem; font-style:italic;">"${persona.backstory}"</p>
  </div>

  <h2>Turnos do Diálogo (${turns.length} turnos)</h2>
  ${turnsHtml}

  ${
    insightCard
      ? `
  <div class="insight-card">
    <div class="insight-title">🧠 Cartão de Memória da Sessão (Summarizer Insight)</div>
    <div class="insight-item"><strong>🔴 Principal Erro Identificado:</strong> ${insightCard.topError}</div>
    <div class="insight-item"><strong>🟢 Principal Conquista/Progresso:</strong> ${insightCard.topProgress}</div>
    <div class="insight-item"><strong>🟣 Tópico em Aberto (Próxima Sessão):</strong> ${insightCard.openTopic ?? 'Nenhum tópico informal registrado'}</div>
  </div>`
      : ''
  }
</div>
</body>
</html>`
}

export async function runSimulation(level = 'A1', totalTurns = 4) {
  const persona = PERSONAS[level] ?? PERSONAS.A1
  const genai = new GoogleGenerativeAI(env.GOOGLE_API_KEY)

  console.log(`\n${C.bold}${C.cyan}╔════════════════════════════════════════════════════════════════════╗${C.reset}`)
  console.log(`${C.bold}${C.cyan}║   🤖 LERY AI — SIMULADOR PEDAGÓGICO DE ALUNO SINTÉTICO (E2E)      ║${C.reset}`)
  console.log(`${C.bold}${C.cyan}╚════════════════════════════════════════════════════════════════════╝${C.reset}\n`)

  console.log(`${C.bold}👤 Aluno Simulado:${C.reset} ${persona.name} (${C.green}Nível ${persona.level}${C.reset})`)
  console.log(`${C.bold}💼 Perfil:${C.reset} ${persona.occupation} · ${persona.learningGoal}`)
  console.log(`${C.dim}Backstory: "${persona.backstory}"${C.reset}\n`)

  // Mock API client if API backend is not currently running locally
  // so the simulator runs standalone anywhere!
  apiClient.getSessionConfig = async () => ({
    deviceId: 'sim-device-001',
    userId: 'sim-user-001',
    level: persona.level,
    diagnosisCompleted: true,
    lesson: null,
    module: null,
    profile: {
      nativeLanguage: 'pt-BR',
      interests: persona.interests,
      hobbies: persona.hobbies,
      occupation: persona.occupation,
      ageGroup: 'adult',
      learningGoal: persona.learningGoal,
    },
  })
  apiClient.getLearnerSnapshot = async () => ({
    userId: 'sim-user-001',
    recentErrors: [
      { pattern: 'confused past tense with simple present', exampleCount: 3, lastSeen: 'yesterday' },
    ],
    dominatedStructures: [
      { structure: 'simple present positive statements', accuracyPct: 92, sampleSize: 20 },
    ],
    openTopics: [
      { topic: 'planning trip to Canada', lastMentioned: '3 days ago' },
    ],
    updatedAt: new Date().toISOString(),
  })
  apiClient.listSessionInsights = async () => ({
    insights: [
      {
        id: 'ins-1',
        sessionId: 'prev-session',
        topError: 'Dropped regular past endings (-ed)',
        topProgress: 'Comfortable with basic introductions',
        openTopic: 'Traveling to Canada soon',
        createdAt: new Date().toISOString(),
      },
    ],
  })
  apiClient.createSession = async () => ({ id: `api-sess-${Date.now()}` })
  apiClient.createLog = async () => ({ id: `log-${Date.now()}`, progressStatus: null })
  apiClient.completeSession = async () => ({
    id: `api-sess-${Date.now()}`,
    finalScore: 82,
    progressStatus: null,
  })
  apiClient.createSessionInsight = async () => ({ id: `insight-${Date.now()}` })

  const app = buildTestApp()
  await app.ready()

  console.log(`${C.yellow}⏳ Abrindo nova sessão para ${persona.name} no Agent Service...${C.reset}`)

  const sessionRes = await app.inject({
    method: 'POST',
    url: '/v1/sessions',
    payload: { mode: 'FREE_TALK' },
  })

  if (sessionRes.statusCode !== 201) {
    console.error(`${C.red}Falha ao abrir sessão: ${sessionRes.body}${C.reset}`)
    return
  }

  const { agentSessionId } = sessionRes.json()
  console.log(`${C.green}✅ Sessão iniciada com sucesso! Session ID: ${agentSessionId}${C.reset}\n`)
  console.log(`${C.bold}──────────────────────────────────────────────────────────────────────${C.reset}`)

  const dialogueHistory: Array<{ role: 'student' | 'tutor'; text: string }> = []
  const turnLogs: TurnLog[] = []
  let nextStudentSpeech = persona.initialUtterance

  for (let turn = 1; turn <= totalTurns; turn++) {
    console.log(`\n${C.bold}${C.blue}[Turno ${turn}/${totalTurns}]${C.reset}`)
    console.log(`${C.cyan}🗣️  ${persona.name}:${C.reset} "${nextStudentSpeech}"`)

    const turnStart = Date.now()
    const turnRes = await app.inject({
      method: 'POST',
      url: '/v1/turns',
      payload: {
        agentSessionId,
        userText: nextStudentSpeech,
        evaluate: true, // evaluate student CEFR on every turn for testing
      },
    })

    const latencyMs = Date.now() - turnStart
    if (turnRes.statusCode !== 200) {
      console.error(`${C.red}Erro no turno ${turn}: ${turnRes.body}${C.reset}`)
      break
    }

    const { reply: tutorReply, evaluation } = turnRes.json()

    console.log(`${C.green}🤖 Lery (Tutor):${C.reset} "${tutorReply}" ${C.dim}(${latencyMs}ms)${C.reset}`)

    if (evaluation) {
      const scoreColor = evaluation.total_score >= 70 ? C.green : C.yellow
      console.log(
        `   ${C.bold}📊 Avaliação CEFR:${C.reset} ${scoreColor}${evaluation.total_score}/100${C.reset} ` +
          `${C.dim}[Task: ${evaluation.task_achievement} | Grammar: ${evaluation.grammar} | Vocab: ${evaluation.vocabulary} | Fluency: ${evaluation.fluency}]${C.reset}`,
      )
      if (evaluation.grammatical_fixes && evaluation.grammatical_fixes !== 'No corrections needed.') {
        console.log(`   ${C.magenta}💡 Correção Sugerida:${C.reset} ${evaluation.grammatical_fixes}`)
      }
      if (evaluation.reasoning) {
        console.log(`   ${C.dim}📝 Feedback: ${evaluation.reasoning}${C.reset}`)
      }
    }

    turnLogs.push({
      turnIndex: turn,
      studentSaid: nextStudentSpeech,
      tutorReply,
      latencyMs,
      evaluation,
    })

    dialogueHistory.push({ role: 'student', text: nextStudentSpeech })
    dialogueHistory.push({ role: 'tutor', text: tutorReply })

    if (turn < totalTurns) {
      // Small pause between turns to respect API quotas and pace naturally
      await new Promise((r) => setTimeout(r, 2000))
      process.stdout.write(`${C.dim}⏳ ${persona.name} pensando na resposta...${C.reset}\r`)
      nextStudentSpeech = await simulateStudentTurn(genai, persona, dialogueHistory)
    }
  }

  console.log(`\n${C.bold}──────────────────────────────────────────────────────────────────────${C.reset}`)
  console.log(`${C.yellow}⏳ Finalizando sessão e disparando Summarizer Worker...${C.reset}`)

  const summarizer = new Summarizer()
  const insightCard = await summarizer.summarizeSession(
    agentSessionId,
    turnLogs.map((t) => ({
      userInput: t.studentSaid,
      leryResponse: t.tutorReply,
      grammaticalFixes: t.evaluation?.grammatical_fixes,
    })),
  )

  await app.inject({
    method: 'PATCH',
    url: `/v1/sessions/${agentSessionId}/complete`,
  })

  console.log(`${C.green}✅ Sessão finalizada com sucesso!${C.reset}\n`)

  if (insightCard) {
    console.log(`${C.bold}🧠 Cartão de Memória Gerado pelo Summarizer:${C.reset}`)
    console.log(`   ${C.red}🔴 Principal Erro:${C.reset} ${insightCard.topError}`)
    console.log(`   ${C.green}🟢 Progresso Notado:${C.reset} ${insightCard.topProgress}`)
    console.log(`   ${C.magenta}🟣 Tópico para Lembrar:${C.reset} ${insightCard.openTopic ?? 'Nenhum'}`)
  }

  // Generate HTML Report
  const reportHtml = generateHtmlReport(persona, turnLogs, insightCard)
  const reportPath = process.cwd().endsWith('agent')
    ? join(process.cwd(), 'simulation-report.html')
    : join(process.cwd(), 'agent/simulation-report.html')
  writeFileSync(reportPath, reportHtml, 'utf8')

  console.log(`\n${C.bold}${C.cyan}📄 Relatório Visual gerado em:${C.reset}`)
  console.log(`   ${C.bold}${reportPath}${C.reset}`)
  console.log(`${C.dim}Dica: abra com 'open ${reportPath}' para inspecionar no navegador!${C.reset}\n`)

  await app.close()
}

// CLI entry point
const levelArg = process.argv.find((a) => a.startsWith('--level='))?.split('=')[1] ?? 'A1'
const turnsArg = Number(process.argv.find((a) => a.startsWith('--turns='))?.split('=')[1] ?? '4')

runSimulation(levelArg, turnsArg).catch((err) => {
  console.error('Simulation failed:', err)
  process.exit(1)
})
