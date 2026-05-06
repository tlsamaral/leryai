# LeryIA — Roadmap de Implementação

Gaps entre a proposta documentada no Obsidian e o estado atual do código.
Ordenado por prioridade e dependência técnica.

---

## CORE (Raspberry Pi / Python)

### [P0] Wake Word — Porcupine SDK
**Status:** NÃO implementado. `main.py` usa `input("Press Enter...")` como gatilho.
**Proposta:** Detecção local de "Hey Lery" via Porcupine (pvporcupine).
**Por quê é crítico:** Central para o TCC (justificativa técnica de DSP em `Identificação.md`). Sem isso o dispositivo não é um smart speaker de fato.
**O que fazer:**
1. `pip install pvporcupine`
2. Criar chave de acesso gratuita em picovoice.ai
3. Treinar ou usar wake word pré-treinada ("hey google" como placeholder, ou criar custom)
4. Substituir o `input()` em `main.py` por loop de escuta contínua no estado IDLE
5. Referência: `[[Identificação]]` no Obsidian documenta a justificativa fonética de "Hey Lery"

### [P0] Comunicação Core → API REST
**Status:** NÃO implementado. O script Python não faz nenhuma chamada HTTP à API.
**Proposta:** A Raspberry Pi deve autenticar-se na API via `Device.apiKey` e:
- Buscar `Lesson.systemPrompt` ativo antes de cada sessão
- Criar `ConversationSession` ao iniciar
- Postar `InteractionLog` por interação (transcrição, resposta, scores)
- Chamar `PATCH /sessions/:id/complete` ao encerrar
**O que fazer:**
1. Criar `api_client.py` no `core/src/` com funções para cada endpoint
2. Armazenar `apiKey` e `baseUrl` no `core/.env`
3. Em `main.py`, carregar o system prompt da API em vez do arquivo local (fallback para arquivo local se offline)
4. Postar InteractionLog após cada ciclo THINKING (nota: scores precisam de chamada Gemini separada — ver P1 abaixo)

### [P1] Modo DIAGNOSIS (Onboarding)
**Status:** Enum `InteractionMode.DIAGNOSIS` existe no schema, mas sem flow no core.
**Proposta:** Entrevista inicial de 5 min onde a Lery avalia nível sem correções ativas.
**O que fazer:**
1. Adicionar `DIAGNOSIS` como modo no system prompt (sem scoring, só coleta)
2. Ao criar conta via mobile, disparar sessão de diagnóstico no próximo uso do hardware
3. Resultado do diagnóstico atualiza `User.currentLevel` via API

### [P1] Avaliação por Interação (CEFR Scoring no Core)
**Status:** `InteractionLog` tem campos `taskAchievement`, `grammar`, `vocabulary`, `fluency`, `evaluationReasoning` — mas o core não os popula.
**Proposta:** Após cada turn, fazer chamada separada ao Gemini com prompt de avaliação CoT.
**O que fazer:**
1. Em `brain_manager.py`, após `generate_response()`, chamar `evaluate_turn(user_text, response_text, level)` 
2. Esse método envia prompt de avaliação com rubrica CEFR (ver `Critérios de Avaliação.md`)
3. Retorna JSON com os 4 scores + evaluationReasoning + grammaticalFixes
4. `main.py` inclui o JSON ao postar o InteractionLog na API

### [P2] TTS — ElevenLabs vs gTTS
**Status:** Implementado com `gTTS` (Google Text-to-Speech, gratuito, qualidade básica).
**Proposta original:** ElevenLabs (voz mais natural, personalização de sotaque/timbre).
**Decisão pendente:** gTTS é suficiente para TCC (demonstra conceito, reduz custo). ElevenLabs agrega valor comercial futuro.
**Se implementar ElevenLabs:**
1. `pip install elevenlabs`
2. Criar chave na elevenlabs.io (plano gratuito: 10k chars/mês)
3. Substituir `gTTS` em `main.py.text_to_speech()` por `elevenlabs.generate()`
4. Adicionar `ELEVEN_API_KEY` no `core/.env`
**Recomendação TCC:** Documentar gTTS como escolha deliberada de custo-zero para prototipagem; ElevenLabs como melhoria futura.

---

## API (TypeScript / Fastify)

### [P0] Autenticação de Dispositivo IoT (apiKey Middleware)
**Status:** Auth JWT para usuários existe. Dispositivos (Raspberry Pi) precisam de autenticação separada.
**O que fazer:**
1. Criar middleware `authenticateDevice` em `api/src/http/` que lê header `X-Device-Key`
2. Valida contra `Device.apiKey` no banco, retorna `userId` e `deviceId`
3. Criar rotas exclusivas para IoT em `/core/` prefixadas com esse middleware:
   - `GET /core/session/config` — retorna systemPrompt ativo e configurações
   - `POST /core/sessions` — cria ConversationSession
   - `POST /core/logs` — cria InteractionLog com scores CEFR
   - `PATCH /core/sessions/:id/complete` — finaliza sessão

### [P1] GradeHITL — Fase Optimizing (LLM Reflector)
**Status:** Fase 1 (Grading) e Fase 2 (Inquiring via `/logs/:id/dispute`) implementadas. Fase 3 não existe.
**O que fazer:**
1. Criar job assíncrono (cron ou queue) que processa `InteractionLog` com `disputeStatus = PENDING`
2. Job chama Gemini com: transcrição original + avaliação original + motivo da disputa
3. Gemini decide ACCEPTED ou REJECTED e sugere ajuste de rubrica
4. Atualizar `disputeStatus` para `ACCEPTED` ou `REJECTED`
5. Se `ACCEPTED`: atualizar `totalScore` e reprocessar `applyProgressRule`

### [P1] SentimentScore — Cálculo Automático
**Status:** Campo `sentimentScore` existe no schema mas não é calculado em nenhuma rota.
**O que fazer:**
1. Em `POST /core/logs`, após salvar o log, fazer chamada assíncrona ao Gemini com prompt:
   `"Analyze the emotional tone of this student response. Return a float from -1.0 (frustrated/anxious) to 1.0 (confident/engaged): [userAudioTrans]"`
2. Atualizar `sentimentScore` no InteractionLog

### [P2] Subscription Enforcement
**Status:** `Subscription` existe no schema mas nenhuma rota verifica assinatura ativa.
**O que fazer:**
1. Middleware `checkSubscription` que valida `Subscription.status = ACTIVE` e `expiresAt > now()`
2. Aplicar no prefixo `/sessions` e `/modules/generate`
3. Retornar 402 Payment Required se inativa

### [P2] Rota de Progressão Atual
**Status:** `GET /progress/current` existe mas verificar se retorna lição atual desbloqueada para uso no core.
**O que fazer:**
1. Garantir que retorna `{ lesson: { id, systemPrompt, scenario }, level, module }` para o core carregar o contexto correto

---

## MOBILE (React Native / Expo)

### [P0] Onboarding e Perfil
- Tela de criação de conta + preenchimento de `UserProfile` (interesses, hobbies, ocupação, objetivo)
- Tela de pareamento de dispositivo (input de serial number → `POST /devices`)

### [P0] Dashboard Principal
- Score atual, lição em progresso, streaks
- Acesso rápido a sessão de Free Talk vs Guided Lesson

### [P1] Histórico de Sessões e Revisão de Erros
- Lista de sessões com data, modo, score final
- Detalhe da sessão: timeline de interações com `userAudioTrans`, `leryResponse`, `grammaticalFixes`, `evaluationReasoning`
- Botão "Reportar avaliação imprecisa" → `POST /logs/:id/dispute`

### [P1] Tela de Progressão (LMS)
- Mapa visual de módulos e lições por nível CEFR
- Status visual: LOCKED (🔒), IN_PROGRESS (▶), REVIEW_REQUIRED (⚠️), COMPLETED (✅)
- Score histórico por lição

### [P2] Geração de Módulo Personalizado
- Botão "Gerar novo módulo para mim" → `POST /modules/generate`
- Exibe módulo criado pela IA com as 3 lições personalizadas

---

## DOCUMENTAÇÃO / TCC

### [P0] Benchmark de Latência
- Medir e documentar latência ponta-a-ponta de 3 cenários:
  1. Rede Wi-Fi doméstica (cenário típico)
  2. Hotspot mobile 4G
  3. Conexão ruim simulada
- Reportar: tempo de STT (Whisper), tempo de LLM (Gemini), tempo de TTS, total
- Documentar no TCC como resultado quantitativo

### [P0] Validação da Rubrica CEFR
- Selecionar 20-30 interações reais com scores gerados pela IA
- Pedir a 2 professores nativos de inglês para avaliar as mesmas interações com a mesma rubrica
- Calcular coeficiente de correlação (Pearson/Spearman) entre scores IA vs humanos
- Documentar como evidência da confiabilidade do sistema no capítulo de Resultados

### [P1] Diagrama de Arquitetura (Figura para o TCC)
- Criar diagrama visual do ecossistema: Hardware → API → Mobile
- Incluir: FSM dos estados, pipeline de voz, camadas do banco de dados
- Sugerido: usar o Figma ou draw.io, exportar como figura para o artigo

### [P1] Setup ReSpeaker HAT
- Documentar instalação dos drivers seeed-voicecard no Raspberry Pi OS
- Testar e documentar configuração de `LERY_AUDIO_DEVICE` e `LERY_AUDIO_OUTPUT_DEVICE` no `.env`

---

## CHECKLIST DE ALINHAMENTO PROPOSTA vs IMPLEMENTADO

| Componente | Proposta | Implementado | Status |
|-----------|----------|--------------|--------|
| FSM 5 estados | ✅ | ✅ | OK |
| STT Whisper | ✅ | ✅ | OK |
| LLM Gemini | ✅ | ✅ gemini-2.5-flash | OK |
| TTS ElevenLabs | ✅ proposta | ⚠️ gTTS | Divergência documentada |
| Wake Word Porcupine | ✅ | ❌ input() manual | **IMPLEMENTAR** |
| LED Ring feedback visual | ✅ | ✅ NeoPixel 16 LEDs | OK |
| Code-Switching PT/EN | ✅ | ✅ tags [PT][/PT] | OK |
| System Prompt personalizado | ✅ | ✅ config/system-prompt.txt + DB | OK |
| API REST Fastify | ✅ | ✅ | OK |
| Hierarquia LMS (Language→Lesson) | ✅ | ✅ | OK |
| Regra dos 70% | ✅ | ✅ progress-rule.ts | OK |
| CEFR A1-C2 | ✅ | ✅ enum UserLevel | OK |
| InteractionLog 4 pilares | ✅ | ✅ schema ok | OK |
| Scores populados pelo core | ✅ | ❌ nenhuma chamada | **IMPLEMENTAR** |
| GradeHITL Fase 1+2 | ✅ | ✅ complete + dispute | OK |
| GradeHITL Fase 3 (Optimizing) | ✅ | ❌ não existe | **IMPLEMENTAR** |
| Device auth IoT | ✅ | ❌ falta middleware | **IMPLEMENTAR** |
| Comunicação Core → API | ✅ | ❌ inexistente | **IMPLEMENTAR** |
| Modo DIAGNOSIS | ✅ | ⚠️ enum existe, sem flow | **IMPLEMENTAR** |
| SentimentScore | ✅ | ⚠️ campo no schema, sem cálculo | **IMPLEMENTAR** |
| Geração dinâmica de módulos | ✅ | ✅ /modules/generate | OK |
| Mobile App | ✅ | ❌ não iniciado | **DESENVOLVER** |
| Subscription enforcement | ✅ | ⚠️ modelo no DB, sem middleware | **IMPLEMENTAR** |
