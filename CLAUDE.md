# Lery AI

Tutor de conversação autônomo em hardware (Raspberry Pi 3) para ensino de inglês. Smart Speaker que elimina barreiras de custo e ansiedade social no aprendizado de idiomas.

## Arquitetura

Monorepo com 4 módulos:

- **`core/`** — Aplicação Python que roda no Raspberry Pi. Pipeline de voz: gravação (sounddevice) → STT (OpenAI Whisper) → IA generativa (Google Gemini) → TTS (gTTS). Máquina de estados: IDLE → LISTENING → THINKING → SPEAKING. LED ring para feedback visual.
- **`api/`** — REST API em TypeScript com Fastify + Prisma + PostgreSQL. Validação com Zod (fastify-type-provider-zod). Auth via JWT. Swagger UI em `/docs`.
- **`web/`** — Frontend web (em desenvolvimento).
- **`mobile/`** — App mobile (em desenvolvimento).

## Stack

| Módulo | Linguagem | Runtime / Framework | Banco |
|--------|-----------|-------------------|-------|
| core | Python | — | — |
| api | TypeScript (ESM) | Node.js / Fastify 5 | PostgreSQL 15 (Prisma ORM) |
| web | — | — | — |
| mobile | — | — | — |

## Comandos

```bash
# API
cd api
pnpm dev              # tsx watch — porta 3333
pnpm build            # tsup → dist/
pnpm db:push          # prisma db push
pnpm db:studio        # prisma studio

# Banco de dados
docker compose up -d  # PostgreSQL na porta 5432 (docker/docker/lery_api)

# Core (Raspberry Pi)
cd core
pip install -r requirements.txt
python src/main.py

# Lint / Format (Biome — raiz do projeto)
npx @biomejs/biome check --write .
```

## Convenções de código

- **Linter/Formatter:** Biome (configurado na raiz). Indent com espaços (2), single quotes, sem ponto-e-vírgula obrigatório (semicolons: asNeeded), LF line endings.
- **API routes:** cada entidade tem pasta própria em `api/src/http/routes/{entidade}/` com arquivos `create.ts`, `get.ts`, `list.ts`, `update.ts`, `delete.ts` e `index.ts` que exporta o plugin.
- **Validação:** schemas Zod para request/response em cada rota.
- **Prisma client:** gerado em `api/src/lib/prisma-client/` (output customizado no schema).
- **Python (core):** classes separadas por responsabilidade — `AudioManager`, `BrainManager`, `LEDController`. Configuração via `.env` e `config/system-prompt.txt`.

## Modelo de dados (principais entidades)

Language → Level → Module → Lesson → UserProgress
User → Subscription, Device, ConversationSession → InteractionLog

**Regra dos 70%:** lições só desbloqueiam quando `UserProgress.score >= 70`. Níveis CEFR: A1–C2.

## Variáveis de ambiente

- `core/.env` — `GOOGLE_API_KEY`, `OPENAI_API_KEY`
- `api/.env` — `DATABASE_URL`, `JWT_SECRET`

## Commits

Seguir padrão Conventional Commits: `tipo(escopo): descrição`
Tipos: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`
Escopos: `api`, `core`, `web`, `mobile`, `config`, `workspace`
