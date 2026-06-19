# Lery Agent Service

Serviço HTTP que isola o "cérebro" do Lery (Tutor + Evaluator) do hardware. Substitui o que hoje vive em `core/src/brain_manager.py`, permitindo que múltiplos canais (Pi, desktop, WhatsApp, etc.) reusem a mesma orquestração sem duplicar lógica.

Stack: Node.js + TypeScript, Fastify 5, Zod v4, Gemini 2.5 Flash.

## Status

MVP de validação. Implementa:

- `POST /v1/sessions` — abre sessão, monta system prompt em camadas (Persona + Learner Snapshot + Session State + Lesson), seedando o Tutor.
- `POST /v1/turns` — recebe transcrição do aluno, gera resposta com Tutor, opcionalmente avalia com Evaluator, persiste log no `api/`.
- `PATCH /v1/sessions/:agentSessionId/complete` — fecha sessão na API e descarta estado em memória.
- `GET /health` — health + número de sessões ativas + uptime.

Ainda **não** implementa: Guard, Router, Summarizer worker (insight cards), tools `recall_*` (function calling), STT/TTS. Esses entram nas próximas iterações conforme docs em `docs/Arquitetura IA - *.md`.

## Pré-requisitos

- Node 22+
- `api/` rodando localmente (`cd api && pnpm dev`)
- Banco rodando (`docker compose up -d` na raiz)
- `GOOGLE_API_KEY` válida
- Device API key cadastrada no banco (`lery_*`) — usada pelo agente pra autenticar contra `iot/*`. Para testar local, pode reusar a mesma key que o Pi usa.

## Setup

```bash
cd agent
pnpm install                # ou npm install
cp .env.example .env
# preencha GOOGLE_API_KEY e LERY_DEVICE_API_KEY
pnpm dev                    # tsx watch — porta 3334
```

A API espera `Bearer lery_<key>` no header. O Agent injeta isso automaticamente via `LERY_DEVICE_API_KEY` do `.env`. Em produção, isso vira credencial por sessão fornecida pelo canal (Pi, desktop, etc.) — não está implementado ainda.

## Banco — migração das tabelas novas

```bash
cd api
pnpm db:push                # aplica SessionInsight + LearnerProfileSnapshot
```

## Smoke test end-to-end

Em três terminais:

```bash
# Terminal 1
docker compose up -d
cd api && pnpm dev          # 3333

# Terminal 2
cd agent && pnpm dev        # 3334

# Terminal 3 — abrir sessão
curl -X POST http://localhost:3334/v1/sessions \
  -H 'Content-Type: application/json' \
  -d '{"mode":"FREE_TALK"}' | jq

# resposta: { "agentSessionId": "...", "apiSessionId": "...", "mode": "FREE_TALK", "userId": "...", "level": "A1" }

# Terminal 3 — primeiro turno
AGENT_SID="cole_aqui"
curl -X POST http://localhost:3334/v1/turns \
  -H 'Content-Type: application/json' \
  -d "{\"agentSessionId\":\"$AGENT_SID\",\"userText\":\"Hi! How are you?\"}" | jq

# resposta: { "reply": "...", "evaluation": null, "logId": "...", ... }

# Terminal 3 — turno com evaluator on
curl -X POST http://localhost:3334/v1/turns \
  -H 'Content-Type: application/json' \
  -d "{\"agentSessionId\":\"$AGENT_SID\",\"userText\":\"I am from Brazil.\",\"evaluate\":true}" | jq

# resposta inclui evaluation com 4 pilares CEFR

# Terminal 3 — fechar sessão
curl -X PATCH "http://localhost:3334/v1/sessions/$AGENT_SID/complete" | jq
```

## Arquitetura

```
canal (Pi / desktop / wpp)   →   Agent /v1/turns   →   API /core/logs
                                       │
                                       └──→  Tutor (Gemini)
                                       └──→  Evaluator (Gemini, sem polui chat)
```

Cada `agentSessionId` mantém em memória:
- 1 instância de `Tutor` (chat do Gemini com histórico interno)
- Referência ao `apiSessionId` correspondente (pra persistência)
- Configuração da sessão (lesson, level, profile)
- `turnCount`

Sessão é **stateful in-memory** — reboot do agent perde sessões abertas. Aceitável no MVP. Próximo passo: persistir snapshot do chat history se sessão durar muito.

## Convenções

- Path alias: `@/*` → `src/*`
- ESM com imports `.js`
- Estrutura: `routes/v1/<entity>/<verb>.ts` + `index.ts` que registra
- Validação: Zod schemas em request body / params / response
- Estilo: Biome (config na raiz do monorepo)

## Próximos passos (alinhados ao doc Context Engineering)

1. Telemetria de tokens por bucket (system/history/output)
2. Summarizer worker — gera `SessionInsight` ao final de cada sessão
3. Tools `recall_*` via function calling do Gemini (substitui injeção upfront de snapshot/insights)
4. Guard + Router como camadas isoladas (Flash-Lite)
5. Job de agregação que popula `LearnerProfileSnapshot` pós-sessão

Não migrar `core/` para chamar o Agent até esse MVP estar validado end-to-end.
