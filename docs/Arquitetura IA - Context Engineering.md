# Arquitetura de IA — Context Engineering

> Documento complementar a `Arquitetura IA - Visão e Migração.md`. O doc anterior responde **quais agentes existem** (Guard, Router, Context Builder, Tutor, Evaluator, Speaker, Grader). Este doc responde **que contexto cada agente vê, quando, como, e por quanto tempo**.

**Data:** 2026-05-27
**Escopo:** Estratégia de Context Engineering aplicada à orquestração de IA do core. Não substitui o doc de arquitetura — refina e estende. Quando houver sobreposição, este doc cita explicitamente "estende §X do doc de arquitetura".

---

## 1. O que é Context Engineering neste projeto

Definição operacional adotada da Anthropic: **context window é recurso finito e estratégico**. Cada token gasto em system prompt, histórico, resultado de tool ou output do modelo é decisão consciente. Encher contexto com tudo "por garantia" é o equivalente a debugar com `print(*)` — funciona em produto pequeno, vira labirinto em produto real.

Quatro alavancas de context engineering, aplicadas ao Lery:

| Alavanca | O que significa no Lery |
|----------|------------------------|
| **Retrieval just-in-time** | Tutor não conhece tudo sobre o aluno upfront — busca via tools quando precisa (top 3 erros, estruturas dominadas, tópicos abertos) |
| **Compactação** | Transcripts de sessão viram "insight cards" de 3 bullets antes de virarem memória permanente |
| **Isolamento via sub-agentes** | Cada papel (Tutor, Evaluator, Grader) tem context window separado. Tutor não paga pelo prompt do Evaluator |
| **Context budget por papel** | Limites explícitos de tokens por system prompt, por history, por output. Telemetria valida |

Sem essas alavancas, o agente do plano original ainda seria um agente com **memória burra**: 7 papéis bem definidos, mas todos sufocados pelo mesmo system prompt monolítico e histórico linear sem fim.

---

## 2. Anti-padrões atuais (mapeados ao código)

Auditoria honesta do código atual, ponto a ponto. Cada anti-padrão referencia arquivo:linha para validação direta.

### 2.1 Prompt monolítico
**Onde:** `core/src/main.py:126-225` — função `_build_free_talk_prompt`.

Concatena tudo num único bloco de string injetado em `system_instruction` no boot da sessão:
- Persona ("Lery", warm tutor)
- Modo da sessão (FREE_TALK vs GUIDED_LESSON)
- Nível CEFR + regras de língua (`level_rules`)
- Perfil completo do aluno (occupation, interests, hobbies, learningGoal, ageGroup, nativeLanguage)
- Core behavior (lead, adapt, personalize, encourage, correct)
- Regras de linguagem (English primário, [PT] tags)
- Hard limits de tamanho (`_RESPONSE_LIMITS`)

**Problemas:**
- Modelo sob pressão de turno longo descarta pedaços silenciosamente.
- Impossível atualizar mid-session — `chat` do Gemini é amarrado ao `system_instruction` do `chats.create()`.
- Token desperdiçado: aluno pode passar 10 sessões sem o tutor nunca usar "ageGroup".
- Debug impossível: qual constraint foi ignorada? Nenhuma instrumentação.

### 2.2 Chat history linear sem compactação
**Onde:** `core/src/brain_manager.py:30-35` — `self.chat = self.client.chats.create(...)`.

Cada `send_message` empilha turno no histórico interno do `chat`. Em sessão de 30 turnos, o tutor está olhando para 30 turnos de transcrição completos no contexto.

**Problemas:**
- Custo cresce linear no turno.
- Latência cresce com tamanho do contexto.
- Cap de contexto será atingido eventualmente (modelo erra ou trunca).
- Nenhuma estratégia explícita de compactação.

### 2.3 Reset total entre sessões
**Onde:** `core/src/main.py:262, 584, 599` — `self.brain_manager = BrainManager(system_prompt=...)`.

Cada wake word ou switch de modo cria nova instância de `BrainManager`. Histórico do `chat` morre. O que o tutor aprendeu sobre o aluno na sessão anterior está apenas no banco como log raw, sem caminho de volta para o contexto.

**Problemas:**
- Continuidade conversacional perdida ("Last time you mentioned your dog...").
- Erros corrigidos na sessão anterior são re-corrigidos do zero.
- Sem mecanismo de "memória do que foi visto" entre sessões.

### 2.4 Profile/level injetados por concatenação de string sem schema
**Onde:** `_build_free_talk_prompt` em `core/src/main.py:177-197`.

`profile_lines = []` é populado com `f"- Occupation: {profile['occupation']}"`. Sem schema validado, sem versionamento, sem como detectar quando um campo novo do perfil deveria ser apresentado de forma diferente.

**Problemas:**
- Schema implícito difícil de manter quando perfil cresce.
- Nenhuma garantia de ordem ou format consistente entre sessões.
- Mudança na string quebra silenciosamente.

### 2.5 InteractionLog write-only — sem agregação de volta ao tutor
**Onde:** `api/src/http/routes/iot/*` — apenas endpoints de write (`POST /core/logs`, `POST /core/sessions`, `PATCH /core/sessions/:id/complete`).

API recebe `grammar`, `vocabulary`, `fluency`, `taskAchievement`, `grammaticalFixes`, `evaluationReasoning`. Tudo persistido. **Zero** endpoints que devolvam essa informação agregada para uso futuro do tutor.

**Problemas:**
- Memória rica gerada (4 pilares CEFR por turno + correções gramaticais), nunca consumida.
- Não há "view" ou snapshot de aluno consumível pelo agente.
- Cada sessão começa cega para o que o tutor já aprendeu sobre o aluno.

---

## 3. Modelo de contexto em camadas

Substitui o prompt monolítico por **quatro camadas com budget e ciclo de vida separados**. Cada camada tem responsabilidade clara e refresh rate próprio.

### 3.1 Camada Persona (estática)
**Budget alvo:** ~400 tokens
**Refresh:** nunca (deploy-time)
**Conteúdo:**
- Quem é Lery (warm tutor, paciente, líder da conversa)
- Princípios invariantes (nunca humilhar, nunca quebrar caráter, sempre liderar)
- Política de linguagem (English primário, [PT] tags em caso de bloqueio)

**Por que separar:** essa camada não muda entre sessões nem entre alunos. Versionada no código, não no banco.

### 3.2 Camada Learner Snapshot (por sessão)
**Budget alvo:** ~600 tokens
**Refresh:** uma vez no boot de cada sessão (pull do endpoint `GET /core/learner-snapshot/:userId`)
**Conteúdo:**
- Nível CEFR atual + tipo de aluno
- Perfil compacto (somente campos que o tutor usa rotineiramente)
- Top 3 erros recorrentes (com exemplos compactos)
- Top 3 estruturas dominadas (não corrigir mais)
- 2 tópicos abertos (para continuidade conversacional)

**Por que separar:** muda por aluno, muda devagar. Cache curto de 1h é suficiente — atualiza ao final de cada sessão via job pós-completion.

### 3.3 Camada Session State (por sessão, atualizada durante)
**Budget alvo:** ~400 tokens
**Refresh:** a cada N turnos OU no boot da sessão (e atualizada durante por Summarizer)
**Conteúdo:**
- Modo da sessão (FREE_TALK / GUIDED_LESSON)
- Lesson atual + objetivos
- Sumário rolante dos últimos N turnos (gerado por Summarizer worker)
- Estado parcial (objetivos cumpridos, objetivos abertos)

**Por que separar:** durante uma sessão longa, esses campos mudam. Compactação dos últimos turnos vira esta camada, evitando o histórico linear infinito do anti-padrão 2.2.

### 3.4 Camada Turn (efêmera)
**Budget alvo:** ~200 tokens
**Refresh:** a cada turno
**Conteúdo:**
- Input transcrito do aluno (raw)
- Última resposta do tutor (1 turno de history)

**Por que separar:** é o único contexto realmente fresh do turno corrente. Tudo antes disso vive no Session State compactado.

### 3.5 Budget total alvo

| Camada | Tokens | Refresh |
|--------|--------|---------|
| Persona | 400 | nunca |
| Learner Snapshot | 600 | por sessão |
| Session State | 400 | por N turnos |
| Turn | 200 | por turno |
| **Subtotal system + memory** | **~1.600** | |
| History real (cap) | 4.000 | compactação dispara se exceder |
| **Total alvo por turno** | **~5.600 tokens** | |

Comparado ao atual (prompt monolítico ~2k + history linear sem cap = 8k+ em sessão longa), economia de 30-50% em tokens por turno após sessão estabilizar, sem perda de informação útil.

---

## 4. Tools de recall — memória externa via function calling

Substitui injeção upfront por **tools que o tutor chama sob demanda**. Tutor LLM tem acesso a function calling do Gemini; cada tool consulta a API e retorna dado compacto.

### 4.1 Tools propostos

| Tool | Input | Output | Quando o tutor chama |
|------|-------|--------|---------------------|
| `recall_recent_errors(top_n=3)` | inteiro | lista de erros com exemplo curto | Antes de corrigir, para evitar repetir correção já dada |
| `recall_dominated_structures(top_n=5)` | inteiro | lista de estruturas com %acerto | Para escolher complexidade próxima zona de desenvolvimento |
| `recall_open_topics(top_n=3)` | inteiro | lista de tópicos com timestamp | Para abrir conversa com continuidade ("How is your dog?") |
| `recall_last_session_summary()` | nenhum | insight card de 3 bullets | No primeiro turno da sessão, para retomar |
| `lookup_lesson_objective(objective_id)` | id | texto do objetivo + critério | Quando precisar verificar se objetivo já foi cumprido |

### 4.2 Vantagens do padrão "tools de recall"

- **Pagamento por uso:** tutor carrega no contexto só o que pediu. Aluno que não tem erros recentes registrados não consome tokens com lista vazia injetada.
- **Telemetria livre:** log de `recall_*` chamadas vira métrica de "o que o tutor quis saber". Cruz com qualidade da resposta — ferramenta de debug riquíssima.
- **Versionamento:** schema da tool é contrato. Mudar formato de retorno não quebra prompt antigo — quebra explícito na chamada de tool.
- **Cache:** retornos de `recall_*` em mesma sessão podem ser cacheados sem o tutor saber.

### 4.3 Tradeoff: latência por tool call

Cada `recall_*` adiciona ~300-500ms (query Postgres + round-trip). Tutor que chama 3 tools antes de responder = +1s adicional. Mitigação:

- Tools rápidas: queries de snapshot pré-computado, não agregações ao vivo.
- Paralelizar chamadas onde possível (Gemini suporta parallel function calling).
- Eager loading do `recall_last_session_summary` no boot — não esperar tutor pedir.

---

## 5. Compactação — insight cards

Toda sessão termina gerando um **insight card** de 3 bullets, produzido por **Summarizer worker** sub-agent.

### 5.1 O que o insight card contém

```
Session #abc123 — 2026-05-27 14:30
- top_error: "Aluno usou 'I have went' (past perfect malformado) 4x"
- top_progress: "Aluno produziu primeira frase complexa com 'although' sem hesitação"
- open_topic: "Aluno mencionou viagem para Argentina em outubro — não fechado"
```

3 bullets, formato fixo. Sumarização semântica do que importou nessa sessão para o tutor da próxima.

### 5.2 Quando rodar

- **Trigger:** ao final de cada sessão (não cron, não batch).
- **Local:** worker chamado pelo `complete_session` da API, ou pelo core ao detectar fim de sessão.
- **Modelo:** Flash-Lite (rápido, barato — ~$0.001 por chamada).
- **Input:** transcript completo da sessão + scores dos turnos + `grammaticalFixes`.
- **Output:** estrutura JSON validada com 3 campos.
- **Persistência:** nova tabela `SessionInsight` (ver §7).

### 5.3 Como o tutor consome

Próxima sessão: `recall_last_session_summary()` retorna os 3 cards mais recentes (ou apenas o último, configurável). Tutor decide se invoca; se invocar, tem continuidade narrativa real.

### 5.4 Política de falha

Se Summarizer falhar (timeout, JSON inválido após retry):
- Sessão fica sem card.
- Próxima sessão recebe lista vazia em `recall_last_session_summary()`.
- Log de falha registrado para análise.
- Sistema **não bloqueia** — degradação graciosa.

---

## 6. Isolamento via sub-agentes — budget por papel

O doc de arquitetura já lista os papéis. Este doc formaliza **budget de tokens por papel** — alavanca crítica de context engineering. Cada papel paga só pelo seu próprio contexto, sem misturar.

### 6.1 Budgets propostos

| Papel | System prompt | History/contexto | Output | Observações |
|-------|---------------|------------------|--------|-------------|
| **Tutor** | ~2.000 | até 4.000 (cap) | até 300 | Critical path. Único que precisa qualidade alta. |
| **Evaluator** | ~800 | turno corrente apenas | ~200 (JSON) | Isolado, descartável após cada turno. |
| **Grader** (async) | ~1.000 | turno + lesson objectives | ~300 (JSON) | Não retorna para Tutor. Não polui critical path. |
| **Router** | ~400 | input do user apenas | ~50 (intent label) | Single-shot rápido. |
| **Guard** | ~400 | input do user apenas | ~50 (passa/bloqueia) | Pode ser combinado com Router em uma chamada. |
| **Summarizer** | ~1.000 | transcript completo da sessão | ~200 (JSON) | Pós-sessão. Não bloqueia UX. |

### 6.2 Por que isolar via budget é não-óbvio

Tentação: "Por que não dar ao Evaluator todo o contexto do Tutor? Ele sabe mais, julga melhor."

Resposta: porque misturar contextos **aumenta drift e custo sem ganho proporcional**. Evaluator com 5k de contexto inventa razões para rejeitar drafts perfeitos. Evaluator com 800 tokens olha só para o que importa (regras de nível + turno) e decide rápido.

Mesma lógica para Grader e Summarizer: papéis "post-hoc" não precisam saber o que vai acontecer depois. Só precisam julgar o que aconteceu.

### 6.3 Implicação prática

Cada papel é uma chamada Gemini separada com `system_instruction` próprio. Hoje o `BrainManager` mistura tudo — refactor para separar é parte do passo 1 do plano de migração (§11).

---

## 7. Mudanças necessárias na API

Hoje a API é **write-only** para dados de aprendizado. Para que context engineering funcione, precisa ser **read-back capaz** com agregações prontas.

### 7.1 Novas tabelas Prisma

**`SessionInsight`** — insight cards persistidos pelo Summarizer.

```prisma
model SessionInsight {
  id            String   @id @default(uuid())
  userId        String
  sessionId     String   @unique
  topError      String   @db.Text
  topProgress   String   @db.Text
  openTopic     String?  @db.Text
  createdAt     DateTime @default(now())

  user          User                @relation(fields: [userId], references: [id])
  session       ConversationSession @relation(fields: [sessionId], references: [id])

  @@index([userId, createdAt])
}
```

**`LearnerProfileSnapshot`** — snapshot agregado por aluno, refresh assíncrono.

```prisma
model LearnerProfileSnapshot {
  userId               String   @id
  recentErrors         Json     // array de {pattern, exampleCount, lastSeen}
  dominatedStructures  Json     // array de {structure, accuracyPct, sampleSize}
  openTopics           Json     // array de {topic, lastMentioned}
  updatedAt            DateTime @updatedAt

  user                 User @relation(fields: [userId], references: [id])
}
```

Snapshots como `Json` deliberadamente — flexibilidade para evoluir formato sem migração.

### 7.2 Novos endpoints

| Endpoint | Quem chama | Propósito |
|----------|-----------|-----------|
| `GET /core/learner-snapshot/:userId` | Core no boot de sessão | Retorna snapshot pronto para Learner Snapshot layer (§3.2) |
| `GET /core/session-insights/:userId?limit=3` | Tool `recall_last_session_summary` | Retorna últimos N insight cards |
| `POST /core/session-insights` | Summarizer worker | Persiste insight card ao final da sessão |

Padrão de rotas segue convenção do `api/src/http/routes/iot/*` (Zod schemas, pasta por entidade, plugin Fastify).

### 7.3 Job de agregação do snapshot

**Quando:** trigger ao completar sessão (`PATCH /core/sessions/:id/complete`).

**O que:** 1 query SQL que olha últimos 20 `InteractionLog` do usuário, agrupa por:
- `grammaticalFixes` ranqueados por frequência (patterns recorrentes).
- Pillares com `score / 25 >= 0.8` consistentemente (estruturas dominadas — exige semantic clustering, fase 2).
- Tópicos extraídos de `userAudioTrans` (fase 2 — usar LLM de extração).

**Fase 1 (MVP):** popular `recentErrors` apenas com top 3 `grammaticalFixes` por frequência simples (sem clustering semântico). Útil já e barato.

**Fase 2:** introduzir clustering de erros + extração de tópicos com Flash-Lite.

### 7.4 Por que materialização e não query ao vivo

- Critical path do tutor não pode pagar agregação ao vivo (latência variável).
- Snapshot stale é aceitável — refresh pós-sessão é "tempo certo": agregação reflete o que aconteceu até a última sessão completa.
- Volume baixo (1 escrita por sessão completa) — sem pressão de concurrency.

---

## 8. Budgets de contexto e telemetria

Sem instrumentação, context engineering é teoria.

### 8.1 Métricas a coletar por chamada LLM

| Bucket | O que medir |
|--------|-------------|
| `system_tokens` | Tamanho do system prompt enviado |
| `history_tokens` | Tamanho do histórico de mensagens enviado |
| `tool_call_tokens` | Tokens consumidos por results de tool dentro do contexto |
| `output_tokens` | Tokens gerados pelo modelo |
| `total_tokens` | Soma para custo |
| `latency_ms` | Tempo da chamada |
| `role` | Tutor / Evaluator / Grader / Router / Guard / Summarizer |
| `model` | Modelo usado (gemini-2.5-flash, flash-lite, etc) |

### 8.2 Métricas alvo

- Tutor `system_tokens + tool_call_tokens` < 2.000 por turno (após estabilização).
- Tutor `history_tokens` < 4.000 (compactação dispara se exceder).
- Evaluator `total_tokens` < 1.500 por turno.
- Tool calls médios por sessão entre 2 e 5 (sub: tutor ignora tools; super: tutor está confuso).
- Latência mediana de tool call < 500ms.
- Custo médio por sessão de 20 minutos < $0.10.

### 8.3 Onde a telemetria vive

- Tabela `LLMCallLog` (nova, ou reuso de logger estruturado).
- Dashboard simples (Metabase, Grafana, ou CSV exportado).
- Alertas básicos: tutor > 3k tokens de history sem compactar dispara warning.

Sem isso, qualquer afirmação de "context está sob controle" é fé.

---

## 9. Como isso alinha com as ondas do doc original

Este doc **não cria onda nova**. Refina as ondas existentes do `Arquitetura IA - Visão e Migração.md §8.5`.

### 9.1 Onda 1 enriquecida — fundação com separação de budget

O passo 1 do doc original (Structured Output) + passo 2 (Evaluator) já estavam previstos. Adições deste doc:

- Ao separar Evaluator do Tutor, **separar context budget** desde o início. Não compartilhar prompt.
- Instrumentar telemetria de tokens por bucket (§8) desde a primeira camada nova.
- Quebrar `_build_free_talk_prompt` em 4 funções (uma por camada de §3), mantendo injeção upfront por enquanto — assim a mudança é segura e mensurável.

### 9.2 Onda 2 reorientada — context engineering vira o core

O passo 4 do doc original (Learner Model + Context Builder) era genérico. Este doc o transforma em:

- Criar `SessionInsight` + Summarizer worker (compactação).
- Criar `LearnerProfileSnapshot` + endpoint `GET /core/learner-snapshot/:userId`.
- Migrar Tutor de injeção upfront para `recall_*` tools (function calling).
- Manter coexistência durante teste A/B — flag de feature controla se Learner Snapshot vem injetado ou via tool.

**Pivô conceitual:** parar de injetar tudo no prompt. Tutor passa a **buscar** o que precisa. Esse é o coração do context engineering.

### 9.3 Onda 3 — tool use vira natural

Passo 3 do doc original (Tool Use para decisões pedagógicas: `mark_objective_complete`, `request_pt_explanation`, etc) fica mais natural porque a infra de tools já foi construída na Onda 2 para os `recall_*`. Adicionar tools de decisão pedagógica é incremento, não nova arquitetura.

---

## 10. Tradeoffs específicos do context engineering

### 10.1 Latência adicional de tool calls
Cada `recall_*` é uma viagem extra. 3 tools = +1s por turno. Em hardware Pi3 com rede ruim, somando aos outros papéis (Guard, Router, Evaluator), produto pode passar de 8s/turno.

**Mitigações:**
- Tools usam snapshot pré-computado (consulta rápida, não agregação).
- Eager load do `recall_last_session_summary` no boot, antes do primeiro turno.
- Parallel function calling onde Gemini suportar.
- Cap de tools por turno: tutor não chama mais de 2 antes de responder.

### 10.2 Custo de compactação
Summarizer roda Flash-Lite por sessão. Estimativa: $0.001 por sessão. Em 1.000 sessões/mês = $1. Desprezível.

**Ponto de falha:** se Summarizer cair, sessão fica sem insight card. Fallback: log de falha + lista vazia no `recall_last_session_summary`. Sistema degrada graciosamente.

### 10.3 Snapshot stale
`LearnerProfileSnapshot` atualiza pós-sessão. Durante sessão corrente, snapshot é do estado anterior. Aceitável — sessão em andamento ainda está produzindo dados, não tem sentido refletir nela.

**Quando vira problema:** se uma sessão for muito longa (>2h) e o aluno mudar padrão drasticamente no meio. Caso raro; aceitável no MVP.

### 10.4 Migração não é flip switch
Tutor que existe hoje (com prompt monolítico) precisa aprender a chamar tools. Modelo precisa de exemplos no system prompt sobre quando usar cada tool. Período de transição com fallback é obrigatório.

**Estratégia:** A/B test interno — mesma conversa rodada com injeção upfront vs com tools. Comparar qualidade subjetiva e custo. Migrar quando tools ganharem.

### 10.5 Risco de superengenharia
Snapshot, insight card, telemetria, tools... muita coisa nova. Cada peça precisa justificar com bug real ou feature solicitada.

**Mitigação:** seguir o plano de migração de §11 em ordem. Cada passo entrega valor sozinho. Parar a qualquer ponto sem regressão.

---

## 11. Plano de migração

Cinco passos. Cada um entrega valor isolado. Alinhado com as ondas do doc original.

### Passo 1 — Quebrar prompt monolítico em layers
**Esforço:** 1-2 dias
**O que fazer:**
- Refatorar `_build_free_talk_prompt` em 4 funções: `build_persona()`, `build_learner_snapshot()`, `build_session_state()`, `build_turn()`.
- Cada função retorna string + contagem de tokens estimada.
- Concatenação ainda upfront (compatível com chat session do Gemini).
- Adicionar logging dos tokens por camada.

**Critério de pronto:** logs mostram tokens por camada em cada sessão. Total não muda comportamento.

### Passo 2 — Telemetria de tokens por bucket
**Esforço:** 2-3 dias
**O que fazer:**
- Wrapper em `BrainManager.generate_response` que registra system/history/tool/output tokens.
- Tabela `LLMCallLog` (ou logger estruturado em arquivo JSON).
- Dashboard básico (CSV exportado + planilha já basta no MVP).

**Critério de pronto:** capacidade de responder "qual a mediana de tokens por turno do tutor na última semana?" em 5 minutos.

### Passo 3 — `SessionInsight` + Summarizer worker
**Esforço:** 3-4 dias
**O que fazer:**
- Schema Prisma `SessionInsight` + migração.
- Endpoint `POST /core/session-insights` (chamado pelo Summarizer).
- Função `summarize_session(transcript, logs)` que chama Flash-Lite com structured output.
- Trigger no `complete_session` que dispara Summarizer (async).

**Critério de pronto:** após 5 sessões reais de teste, todas têm insight card persistido com 3 bullets coerentes.

### Passo 4 — Snapshot endpoint + materialização
**Esforço:** 4-5 dias
**O que fazer:**
- Schema Prisma `LearnerProfileSnapshot`.
- Endpoint `GET /core/learner-snapshot/:userId`.
- Job de agregação disparado por `complete_session` — query SQL simples (top 3 grammaticalFixes por frequência).
- Cache invalidation simples: snapshot vence após cada sessão completa.

**Critério de pronto:** após 3 sessões com 5 erros conhecidos injetados, snapshot retorna os 3 mais frequentes corretamente.

### Passo 5 — Migrar Tutor para `recall_*` tools
**Esforço:** 5-7 dias
**O que fazer:**
- Definir schema de tools (Gemini function calling): `recall_recent_errors`, `recall_dominated_structures`, `recall_open_topics`, `recall_last_session_summary`, `lookup_lesson_objective`.
- Implementar handlers que chamam endpoints da API.
- Atualizar system prompt do Tutor com exemplos de quando usar cada tool.
- Feature flag controlando: prompt injetado vs tools.
- A/B test interno com mesma sequência de turnos.

**Critério de pronto:** tutor com tools alcança pelo menos paridade de qualidade com injeção upfront, com 30% menos tokens médios por turno.

---

## 12. Decisões em aberto

Pontos a discutir antes de cada passo virar tarefa concreta. Complementam §7 do doc de arquitetura.

1. **Frequência de compactação:** sempre ao final da sessão? Ou também a cada N turnos dentro de sessão longa? Pesar custo vs benefício de history sempre fresh.
2. **Snapshot stack:** view materializada Postgres (refresh on commit) vs tabela com trigger explícito? Decisão por performance vs simplicidade de debug.
3. **Formato de retorno das tools:** texto formatado pronto para injetar no contexto, ou JSON estruturado que o tutor formata? Padronizar antes de implementar.
4. **Cap real do history quando tutor já tem snapshot + tools:** 4k é palpite. Precisa medir com dados reais para ajustar.
5. **Insight cards no dashboard do professor:** cruzamento com `Estratégia GTM - Desktop App e Canal de Professores.md`. Professor revê os cards do aluno? Ou são só consumo interno do tutor?
6. **Compactação no meio da sessão:** quando dispara? Threshold de tokens (>3k de history) ou de turnos (>15)? Medir o que dá menos cortes esquisitos.
7. **Eager load vs lazy load** do `recall_last_session_summary`: chamar no boot, no primeiro turno, ou só quando tutor pedir? Latency vs simplicidade.
8. **Versionamento de schema de tools:** quando schema de tool mudar (campo adicionado, removido), como gerir? Versioning explícito ou breaking change controlado?
9. **Política de privacidade dos insight cards:** aluno tem direito a ver e deletar? GDPR/LGPD afetam — definir antes de produção.

---

## 13. Conclusão

O doc `Arquitetura IA - Visão e Migração.md` descreve **quais agentes existem**. Este doc descreve **como esses agentes pensam com tokens disciplinados**.

Context engineering não é over-engineering — é a diferença entre um sistema com 7 papéis bem nomeados gastando tokens como se fossem grátis, e um sistema com 7 papéis que escolhem conscientemente o que vê, quando, e por quanto tempo.

Para o Lery especificamente, é o que transforma o "tutor stateful com TTS bonito" em **um agente com memória real do aluno**. Sem context engineering, learner model é dado parado no banco. Com context engineering, vira o coração do diferencial competitivo.

Quando voltar para executar: começar pelo passo 1 (quebrar prompt em layers) + passo 2 (telemetria). São os passos mais baratos, e desbloqueiam medições que validam ou invalidam os passos seguintes.

Documento serve como referência. Ajustar conforme a implementação dos primeiros passos revelar surpresas.
