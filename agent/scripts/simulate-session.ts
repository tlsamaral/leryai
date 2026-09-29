import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
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
    expectedErrors:
      'Misses past tense endings (-ed, went/had), drops 3rd person -s, uses Portuguese vocabulary when stuck.',
    initialUtterance:
      'Hello teacher! Good morning. I am happy to speak with you today.',
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
    expectedErrors:
      'Present perfect vs past simple confusion, preposition collocations, occasional literal translations.',
    initialUtterance:
      "Hi Lery! It's great to talk to you. I'm preparing for some important work meetings this month.",
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

/**
 * Inlines the real brand mark as a data URI so the report stays a single
 * portable file. Returns null if the asset isn't reachable (e.g. the agent
 * is checked out without the mobile app) — the header just drops the mark.
 */
function loadLogoDataUri(): string | null {
  const repoRoot = process.cwd().endsWith('agent')
    ? join(process.cwd(), '..')
    : process.cwd()
  try {
    const buf = readFileSync(join(repoRoot, 'mobile/assets/logo.png'))
    return `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

/** Model-generated text lands in this HTML — escape it, never trust it as markup. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Mirrors scoreTone() in mobile/src/features/results/components/feedback-card.tsx */
function scoreTone(score: number): { tone: string; label: string } {
  if (score >= 70) return { tone: 'mint', label: 'Forte' }
  if (score >= 51) return { tone: 'amber', label: 'Médio' }
  return { tone: 'danger', label: 'Frágil' }
}

/** Mirrors fillColor() in mobile/src/shared/components/score-bar.tsx */
function barTone(value: number, max: number): string {
  const pct = value / max
  if (pct < 0.5) return 'danger'
  if (pct < 0.7) return 'warning'
  return 'mint'
}

function scoreBar(label: string, value: number, max = 25): string {
  const tone = barTone(value, max)
  const pct = Math.round((value / max) * 100)
  return `
        <div class="bar">
          <div class="bar__head">
            <span class="bar__label">${label}</span>
            <span class="bar__value bar__value--${tone}">${value}/${max}</span>
          </div>
          <div class="bar__track"><div class="bar__fill bar__fill--${tone}" style="width:${pct}%"></div></div>
        </div>`
}

export function generateHtmlReport(
  persona: Persona,
  turns: TurnLog[],
  insightCard: {
    topError: string
    topProgress: string
    openTopic: string | null
  } | null,
): string {
  const scored = turns.filter((t) => t.evaluation !== null)
  const avgScore = scored.length
    ? Math.round(
        scored.reduce((acc, t) => acc + (t.evaluation?.total_score ?? 0), 0) /
          scored.length,
      )
    : 0
  const avgLatency = turns.length
    ? Math.round(turns.reduce((acc, t) => acc + t.latencyMs, 0) / turns.length)
    : 0
  const sessionTone = scoreTone(avgScore)
  const logoDataUri = loadLogoDataUri()

  const turnsHtml = turns
    .map((t) => {
      const ev = t.evaluation
      const evalHtml = ev
        ? `
      <div class="eval">
        <div class="eval__row">
          <div class="scoreCircle scoreCircle--${scoreTone(ev.total_score).tone}">
            <span class="scoreCircle__value">${ev.total_score}</span>
            <span class="scoreCircle__unit">pts</span>
          </div>
          <div class="bars">
${scoreBar('Task Achievement', ev.task_achievement)}
${scoreBar('Grammar', ev.grammar)}
${scoreBar('Vocabulary', ev.vocabulary)}
${scoreBar('Fluency', ev.fluency)}
          </div>
        </div>
        ${
          ev.grammatical_fixes &&
          ev.grammatical_fixes !== 'No corrections needed.'
            ? `<div class="note note--amber">
          <span class="note__label">Correção pedagógica</span>
          <p>${esc(ev.grammatical_fixes)}</p>
        </div>`
            : `<div class="note note--mint">
          <span class="note__label">Correção pedagógica</span>
          <p>Nenhuma correção necessária neste turno.</p>
        </div>`
        }
        <div class="note">
          <span class="note__label">Feedback do avaliador</span>
          <p>${esc(ev.reasoning)}</p>
        </div>
      </div>`
        : ''

      return `
    <article class="card turn">
      <header class="turn__head">
        <span class="pill pill--neutral">Turno ${t.turnIndex}</span>
        <span class="turn__latency">${t.latencyMs} ms</span>
      </header>

      <div class="bubble bubble--student">
        <span class="bubble__who">${esc(persona.name)} · ${esc(persona.level)}</span>
        <p>${esc(t.studentSaid)}</p>
      </div>

      <div class="bubble bubble--lery">
        <span class="bubble__who">Lery</span>
        <p>${esc(t.tutorReply)}</p>
      </div>
${evalHtml}
    </article>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lery AI — Relatório de Simulação Pedagógica</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
  /* Design tokens mirrored from mobile/src/shared/tokens + theme */
  :root {
    --bg: #F6FAFE;
    --surface: #FFFFFF;
    --surface-alt: #F2F7FA;
    --primary: #04D2FF;
    --primary-soft: #E5FAFF;
    --primary-deep: #0091B8;
    --accent: #FFB547;
    --mint: #2BC48A;
    --text: #0A1B23;
    --muted: #5A6E78;
    --dim: #92A2AB;
    --border: #E0EBF1;
    --warning: #FF9143;
    --danger: #E63946;
    --shadow-default: #C5D8E4;
    --radius-card: 22px;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0 20px 72px;
    background: var(--bg);
    color: var(--text);
    font-family: 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
    font-weight: 600;
    -webkit-font-smoothing: antialiased;
  }
  .container { max-width: 760px; margin: 0 auto; }

  /* ── Header ────────────────────────────────────────────────────── */
  .hero { padding: 40px 0 30px; }
  .hero__brand { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .hero__brand img { width: 36px; height: 36px; display: block; }
  .hero__brandName {
    color: var(--text); font-weight: 900; font-size: 15px;
    letter-spacing: 1.2px; text-transform: uppercase;
  }
  .hero h1 {
    margin: 0 0 8px; font-size: 32px; font-weight: 900;
    letter-spacing: -0.8px; line-height: 1.15;
  }
  .hero p { margin: 0; color: var(--muted); font-size: 15px; font-weight: 600; line-height: 1.5; }
  .hero__meta { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
  .hero__chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--primary-soft); border: 1.5px solid rgba(4,210,255,.32);
    color: var(--primary-deep); border-radius: 999px; padding: 6px 13px;
    font-size: 11px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase;
  }

  /* ── Card shell (mirrors AppCard: 2px border, hard colored shadow) ─ */
  .card {
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius-card);
    box-shadow: 0 4px 0 var(--shadow-default);
    padding: 18px;
    margin-bottom: 18px;
  }
  .card--cyan { background: var(--primary-soft); border-color: rgba(4,210,255,.27); box-shadow: 0 4px 0 var(--primary-deep); }
  .card--mint { background: #E7F8F0; border-color: #B7E5CD; box-shadow: 0 4px 0 #1A7C56; }
  .card--amber { background: #FFF6E5; border-color: #FFD899; box-shadow: 0 4px 0 #B87020; }
  .card--danger { background: #FCE7E9; border-color: #F4B5BB; box-shadow: 0 4px 0 #A02530; }

  .sectionTitle {
    font-size: 11px; font-weight: 800; letter-spacing: .6px; text-transform: uppercase;
    color: var(--muted); margin: 32px 0 14px;
  }

  /* ── Persona ───────────────────────────────────────────────────── */
  .persona__top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .persona__avatar {
    width: 52px; height: 52px; border-radius: 999px; flex-shrink: 0;
    background: var(--primary-soft); border: 2px solid rgba(4,210,255,.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; font-weight: 900; color: var(--primary-deep);
  }
  .persona__name { font-size: 19px; font-weight: 900; letter-spacing: -.3px; }
  .persona__role { font-size: 13px; font-weight: 700; color: var(--muted); margin-top: 1px; }
  .persona__quote {
    margin: 0; padding: 13px 15px; background: var(--surface-alt);
    border-radius: 14px; font-size: 13.5px; font-weight: 600;
    color: var(--muted); line-height: 1.55;
  }

  /* ── Stats row (mirrors StatCard) ──────────────────────────────── */
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 4px; }
  .stat { padding: 15px; margin: 0; }
  .stat__label {
    font-size: 10.5px; font-weight: 800; letter-spacing: .6px;
    text-transform: uppercase; color: var(--muted);
  }
  .stat__value { font-size: 30px; font-weight: 900; letter-spacing: -1px; margin-top: 10px; line-height: 1; }
  .stat__hint { font-size: 11.5px; font-weight: 700; color: var(--dim); margin-top: 4px; }
  .v--mint { color: #1A7C56; } .v--amber { color: #7A4A10; }
  .v--danger { color: #A02530; } .v--cyan { color: var(--primary-deep); }

  /* ── Pills ─────────────────────────────────────────────────────── */
  .pill {
    display: inline-block; border-radius: 999px; padding: 4px 11px;
    font-size: 10px; font-weight: 800; letter-spacing: .5px; text-transform: uppercase;
    border: 1px solid transparent;
  }
  .pill--neutral { background: var(--surface-alt); border-color: var(--border); color: var(--muted); }
  .pill--mint { background: #E7F8F0; border-color: #B7E5CD; color: #1A7C56; }
  .pill--amber { background: #FFF6E5; border-color: #FFD899; color: #7A4A10; }
  .pill--danger { background: #FCE7E9; border-color: #F4B5BB; color: #A02530; }

  /* ── Turn ──────────────────────────────────────────────────────── */
  .turn__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
  .turn__latency { font-size: 11.5px; font-weight: 800; color: var(--dim); }
  .bubble { border-radius: 16px; padding: 13px 15px; margin-bottom: 10px; }
  .bubble p { margin: 5px 0 0; font-size: 14.5px; font-weight: 600; line-height: 1.55; }
  .bubble__who {
    font-size: 10px; font-weight: 800; letter-spacing: .6px; text-transform: uppercase;
  }
  .bubble--student { background: var(--surface-alt); border: 1.5px solid var(--border); }
  .bubble--student .bubble__who { color: var(--muted); }
  .bubble--lery { background: var(--primary-soft); border: 1.5px solid rgba(4,210,255,.35); }
  .bubble--lery .bubble__who { color: var(--primary-deep); }
  .bubble--lery p { color: #06343F; }

  /* ── Evaluation ────────────────────────────────────────────────── */
  .eval { margin-top: 14px; padding-top: 16px; border-top: 1.5px dashed var(--border); }
  .eval__row { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
  .scoreCircle {
    width: 66px; height: 66px; border-radius: 999px; flex-shrink: 0;
    border: 2px solid; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  .scoreCircle__value { font-size: 22px; font-weight: 900; letter-spacing: -.6px; line-height: 1; }
  .scoreCircle__unit { font-size: 9px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
  .scoreCircle--mint { background: #E7F8F0; border-color: #B7E5CD; color: var(--mint); }
  .scoreCircle--amber { background: #FFF6E5; border-color: #FFD899; color: var(--accent); }
  .scoreCircle--danger { background: #FCE7E9; border-color: #F4B5BB; color: var(--danger); }
  .bars { flex: 1; display: flex; flex-direction: column; gap: 9px; }
  .bar__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .bar__label { font-size: 11.5px; font-weight: 700; color: var(--text); }
  .bar__value { font-size: 11.5px; font-weight: 800; }
  .bar__value--mint { color: var(--mint); }
  .bar__value--warning { color: var(--warning); }
  .bar__value--danger { color: var(--danger); }
  .bar__track { height: 7px; border-radius: 999px; background: var(--border); overflow: hidden; }
  .bar__fill { height: 100%; border-radius: 999px; }
  .bar__fill--mint { background: var(--mint); }
  .bar__fill--warning { background: var(--warning); }
  .bar__fill--danger { background: var(--danger); }

  .note { background: var(--surface-alt); border-radius: 14px; padding: 11px 14px; margin-top: 9px; }
  .note p { margin: 4px 0 0; font-size: 13.5px; font-weight: 600; line-height: 1.5; color: var(--text); }
  .note__label { font-size: 10px; font-weight: 800; letter-spacing: .6px; text-transform: uppercase; color: var(--muted); }
  .note--amber { background: #FFF6E5; }
  .note--amber .note__label { color: #7A4A10; }
  .note--mint { background: #E7F8F0; }
  .note--mint .note__label { color: #1A7C56; }

  /* ── Insight card ──────────────────────────────────────────────── */
  .insight__title { font-size: 17px; font-weight: 900; letter-spacing: -.3px; margin-bottom: 4px; }
  .insight__sub { font-size: 12.5px; font-weight: 700; color: var(--muted); margin-bottom: 16px; }
  .insight__item { display: flex; gap: 12px; padding: 12px 0; border-top: 1.5px solid rgba(4,210,255,.22); }
  .insight__dot { width: 10px; height: 10px; border-radius: 999px; margin-top: 5px; flex-shrink: 0; }
  .insight__label { font-size: 10px; font-weight: 800; letter-spacing: .6px; text-transform: uppercase; color: var(--muted); }
  .insight__text { font-size: 14px; font-weight: 700; line-height: 1.5; margin-top: 3px; }

  .footer {
    text-align: center; margin-top: 36px;
    font-size: 11.5px; font-weight: 700; color: var(--dim);
  }

  @media (max-width: 560px) {
    .stats { grid-template-columns: 1fr; }
    .hero h1 { font-size: 26px; }
    .eval__row { flex-direction: column; align-items: stretch; gap: 14px; }
    .scoreCircle { align-self: flex-start; }
  }
</style>
</head>
<body>

<div class="container">

  <div class="hero">
    <div class="hero__brand">
      ${logoDataUri ? `<img src="${logoDataUri}" alt="">` : ''}
      <span class="hero__brandName">Lery AI</span>
    </div>
    <h1>Relatório de Simulação Pedagógica</h1>
    <p>Teste de estresse conversacional automatizado com aluno sintético.</p>
    <div class="hero__meta">
      <span class="hero__chip">${turns.length} turnos</span>
      <span class="hero__chip">Nível ${esc(persona.level)}</span>
      <span class="hero__chip">${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
    </div>
  </div>


  <div class="stats">
    <div class="card stat card--${sessionTone.tone}">
      <div class="stat__label">Média geral</div>
      <div class="stat__value v--${sessionTone.tone}">${avgScore}</div>
      <div class="stat__hint">${sessionTone.label} · meta 70</div>
    </div>
    <div class="card stat card--cyan">
      <div class="stat__label">Latência média</div>
      <div class="stat__value v--cyan">${avgLatency}</div>
      <div class="stat__hint">ms por turno</div>
    </div>
    <div class="card stat">
      <div class="stat__label">Turnos</div>
      <div class="stat__value">${turns.length}</div>
      <div class="stat__hint">${scored.length} avaliados</div>
    </div>
  </div>

  <div class="sectionTitle">Aluno sintético</div>
  <div class="card">
    <div class="persona__top">
      <div class="persona__avatar">${esc(persona.name.charAt(0))}</div>
      <div style="flex:1">
        <div class="persona__name">${esc(persona.name)}</div>
        <div class="persona__role">${esc(persona.occupation)}</div>
      </div>
      <span class="pill pill--mint">Nível ${esc(persona.level)}</span>
    </div>
    <p class="persona__quote">${esc(persona.backstory)}</p>
  </div>

  <div class="sectionTitle">Diálogo · ${turns.length} turnos</div>
${turnsHtml}

  ${
    insightCard
      ? `
  <div class="sectionTitle">Memória da sessão</div>
  <div class="card card--cyan">
    <div class="insight__title">Insight Card</div>
    <div class="insight__sub">Gerado pelo Summarizer worker — alimenta o contexto da próxima sessão.</div>

    <div class="insight__item">
      <span class="insight__dot" style="background: var(--danger)"></span>
      <div>
        <div class="insight__label">Principal erro</div>
        <div class="insight__text">${esc(insightCard.topError)}</div>
      </div>
    </div>
    <div class="insight__item">
      <span class="insight__dot" style="background: var(--mint)"></span>
      <div>
        <div class="insight__label">Principal progresso</div>
        <div class="insight__text">${esc(insightCard.topProgress)}</div>
      </div>
    </div>
    <div class="insight__item">
      <span class="insight__dot" style="background: var(--accent)"></span>
      <div>
        <div class="insight__label">Tópico em aberto</div>
        <div class="insight__text">${insightCard.openTopic ? esc(insightCard.openTopic) : 'Nenhum tópico informal registrado.'}</div>
      </div>
    </div>
  </div>`
      : ''
  }

  <div class="footer">lery-ai/agent · gerado por <strong>pnpm simulate</strong></div>
</div>
</body>
</html>`
}

export async function runSimulation(level = 'A1', totalTurns = 4) {
  const persona = PERSONAS[level] ?? PERSONAS.A1
  const genai = new GoogleGenerativeAI(env.GOOGLE_API_KEY)

  console.log(
    `\n${C.bold}${C.cyan}╔════════════════════════════════════════════════════════════════════╗${C.reset}`,
  )
  console.log(
    `${C.bold}${C.cyan}║   🤖 LERY AI — SIMULADOR PEDAGÓGICO DE ALUNO SINTÉTICO (E2E)      ║${C.reset}`,
  )
  console.log(
    `${C.bold}${C.cyan}╚════════════════════════════════════════════════════════════════════╝${C.reset}\n`,
  )

  console.log(
    `${C.bold}👤 Aluno Simulado:${C.reset} ${persona.name} (${C.green}Nível ${persona.level}${C.reset})`,
  )
  console.log(
    `${C.bold}💼 Perfil:${C.reset} ${persona.occupation} · ${persona.learningGoal}`,
  )
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
      {
        pattern: 'confused past tense with simple present',
        exampleCount: 3,
        lastSeen: 'yesterday',
      },
    ],
    dominatedStructures: [
      {
        structure: 'simple present positive statements',
        accuracyPct: 92,
        sampleSize: 20,
      },
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
  apiClient.createLog = async () => ({
    id: `log-${Date.now()}`,
    progressStatus: null,
  })
  apiClient.completeSession = async () => ({
    id: `api-sess-${Date.now()}`,
    finalScore: 82,
    progressStatus: null,
  })
  apiClient.createSessionInsight = async () => ({ id: `insight-${Date.now()}` })

  const app = buildTestApp()
  await app.ready()

  console.log(
    `${C.yellow}⏳ Abrindo nova sessão para ${persona.name} no Agent Service...${C.reset}`,
  )

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
  console.log(
    `${C.green}✅ Sessão iniciada com sucesso! Session ID: ${agentSessionId}${C.reset}\n`,
  )
  console.log(
    `${C.bold}──────────────────────────────────────────────────────────────────────${C.reset}`,
  )

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

    console.log(
      `${C.green}🤖 Lery (Tutor):${C.reset} "${tutorReply}" ${C.dim}(${latencyMs}ms)${C.reset}`,
    )

    if (evaluation) {
      const scoreColor = evaluation.total_score >= 70 ? C.green : C.yellow
      console.log(
        `   ${C.bold}📊 Avaliação CEFR:${C.reset} ${scoreColor}${evaluation.total_score}/100${C.reset} ` +
          `${C.dim}[Task: ${evaluation.task_achievement} | Grammar: ${evaluation.grammar} | Vocab: ${evaluation.vocabulary} | Fluency: ${evaluation.fluency}]${C.reset}`,
      )
      if (
        evaluation.grammatical_fixes &&
        evaluation.grammatical_fixes !== 'No corrections needed.'
      ) {
        console.log(
          `   ${C.magenta}💡 Correção Sugerida:${C.reset} ${evaluation.grammatical_fixes}`,
        )
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
      process.stdout.write(
        `${C.dim}⏳ ${persona.name} pensando na resposta...${C.reset}\r`,
      )
      nextStudentSpeech = await simulateStudentTurn(
        genai,
        persona,
        dialogueHistory,
      )
    }
  }

  console.log(
    `\n${C.bold}──────────────────────────────────────────────────────────────────────${C.reset}`,
  )
  console.log(
    `${C.yellow}⏳ Finalizando sessão e disparando Summarizer Worker...${C.reset}`,
  )

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
    console.log(
      `${C.bold}🧠 Cartão de Memória Gerado pelo Summarizer:${C.reset}`,
    )
    console.log(
      `   ${C.red}🔴 Principal Erro:${C.reset} ${insightCard.topError}`,
    )
    console.log(
      `   ${C.green}🟢 Progresso Notado:${C.reset} ${insightCard.topProgress}`,
    )
    console.log(
      `   ${C.magenta}🟣 Tópico para Lembrar:${C.reset} ${insightCard.openTopic ?? 'Nenhum'}`,
    )
  }

  // Generate HTML Report
  const reportHtml = generateHtmlReport(persona, turnLogs, insightCard)
  const reportPath = process.cwd().endsWith('agent')
    ? join(process.cwd(), 'simulation-report.html')
    : join(process.cwd(), 'agent/simulation-report.html')
  writeFileSync(reportPath, reportHtml, 'utf8')

  console.log(`\n${C.bold}${C.cyan}📄 Relatório Visual gerado em:${C.reset}`)
  console.log(`   ${C.bold}${reportPath}${C.reset}`)
  console.log(
    `${C.dim}Dica: abra com 'open ${reportPath}' para inspecionar no navegador!${C.reset}\n`,
  )

  await app.close()
}

// CLI entry point — guarded so the module can be imported (e.g. to render a
// report from fixtures) without kicking off a real, billable simulation.
const isMain = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false

if (isMain) {
  const levelArg =
    process.argv.find((a) => a.startsWith('--level='))?.split('=')[1] ?? 'A1'
  const turnsArg = Number(
    process.argv.find((a) => a.startsWith('--turns='))?.split('=')[1] ?? '4',
  )
  const modelArg = process.argv
    .find((a) => a.startsWith('--model='))
    ?.split('=')[1]
  if (modelArg) {
    ;(env as any).GEMINI_TUTOR_MODEL = modelArg
    ;(env as any).GEMINI_EVALUATOR_MODEL = modelArg
  }

  runSimulation(levelArg, turnsArg).catch((err) => {
    console.error('Simulation failed:', err)
    process.exit(1)
  })
}
