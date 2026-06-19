# Arquitetura de IA do Core — Visão de Evolução e Plano de Migração

> Documento de alinhamento. Não é plano de execução imediato. Captura linha de raciocínio para retomada em momento futuro.

**Data:** 2026-05-27
**Escopo:** Apenas `core/src/brain_manager.py` e fluxo de decisão em `core/src/main.py`. Infra (audio, LED, TTS, wake word) permanece como está.
**Referência base:** Anthropic — "Building effective agents" (padrões: augmented LLM, prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer).

---

## 1. Diagnóstico do estado atual

### O que já está bem
- Separação infra (`AudioManager`, `LEDController`, `TTSManager`, `WakeWordDetector`) limpa e desacoplada do raciocínio.
- State machine `IDLE → LISTENING → THINKING → SPEAKING → ERROR` clara e auditável via LED.
- Retry com backoff exponencial e timeout duro por chamada Gemini (`_HARD_TIMEOUT=10s`, `_MAX_RETRIES=4`).
- Rubrica CEFR de 4 pilares (task_achievement, grammar, vocabulary, fluency) já implementada — base pedagógica sólida.
- API persiste `InteractionLog` com scores, abrindo caminho para learner model.
- Modo `DIAGNOSIS` separado existe e tem rater dedicado (`rate_cefr`).

### Onde a arquitetura não está no padrão de "agente efetivo"

#### 1.1 BrainManager generalista
Uma única classe acumula três papéis distintos do ponto de vista de IA:

| Papel | Método | Modelo | Contexto |
|-------|--------|--------|----------|
| Tutor conversacional | `generate_response` | gemini-2.5-flash (chat) | mantém histórico |
| Rater CEFR (diagnóstico) | `rate_cefr` | gemini-2.5-flash (one-shot) | transcript do aluno |
| Avaliador de turno | `evaluate_turn` | gemini-2.5-flash (one-shot) | um par turno |

Mesma classe, mesmo modelo, mesmo system prompt base — porém com objetivos pedagógicos antagônicos. Anthropic recomenda **workers especialistas**: cada papel com seu prompt, seu modelo (potencialmente um menor/mais rápido), e sua superfície de erro isolada.

#### 1.2 Roteamento por regex e keywords frágil
```python
_LESSON_TRIGGER_WORDS = {"lesson", "lição", "aula"}
_LESSON_ACTION_WORDS = {"start", "begin", "do", "let's", "lets", "vamos", "quero", ...}
_EXIT_KEYWORDS = {"goodbye", "bye", ...}
```
Aluno B2 que diz *"I'd love to dive into a lesson now"* não casa `_LESSON_ACTION_WORDS`. Aluno A1 que diz *"finished"* sem "done" não dispara saída. Detecção de intenção em produto de tutor de linguagem **não pode** depender de matching literal — usuário improvisa.

Padrão correto: **routing workflow** com classificador LLM rápido (Flash-Lite ou tool-call no próprio tutor) decidindo entre intents discretos.

#### 1.3 Evaluator-optimizer ausente — score chega tarde
`evaluate_turn` roda **depois** do TTS já reproduzir a resposta. Consequências:
- Aluno nunca recebe correção em tempo real — score só vive no banco.
- Tutor pode violar regras de nível (ex: A1 ouvindo present perfect) sem nenhum mecanismo de catch.
- `grammatical_fixes` é gerado mas nunca falado de volta — informação morre no log.

Padrão Anthropic **evaluator-optimizer**: gerador produz draft → crítico avalia contra regras → gerador revisa se falhar → só então fala. Para tutor de linguagem, esse loop é essencial: a promessa de "A1 nunca vai ouvir gramática acima do nível" não pode depender de o modelo seguir uma instrução textual num prompt gigante.

#### 1.4 Prompt monolítico
`_build_free_talk_prompt` empilha em um único bloco:
- Persona ("Lery", warm tutor)
- Constraints de nível (texto longo em `level_rules`)
- Perfil do aluno (occupation, interests, hobbies, goal, ageGroup, nativeLanguage)
- Modo da sessão (FREE_TALK vs GUIDED_LESSON)
- Comportamento core (lead, adapt, personalize, encourage, correct)
- Regras de linguagem (inglês primário, [PT] tags)
- Hard limits de tamanho (`_RESPONSE_LIMITS`)

Sob pressão de turno longo, modelo descarta pedaços. Não há como saber qual constraint foi ignorada. Padrão **prompt chaining** separa: persona estática + instrução dinâmica por turno + validação isolada.

#### 1.5 Parsing JSON manual
```python
raw = re.sub(r'^```(?:json)?\s*|\s*```$', '', raw, flags=re.MULTILINE).strip()
data = json.loads(raw)
```
Gemini 2.5 suporta `response_schema` nativo (structured output) — garante shape, elimina markdown fences, fail-fast em tipos. Ganho zero-custo em latência.

#### 1.6 Sem tool use
Decisões mecânicas que o tutor deveria tomar como parte do raciocínio pedagógico vivem em Python imperativo desconectado:
- Trocar de FREE_TALK para GUIDED_LESSON (detecção por regex em `main.py`)
- Decidir injetar [PT]...[/PT] (instrução textual no prompt, sem validação)
- Marcar objetivo de lesson como cumprido (não implementado)
- Subir/descer dificuldade quando aluno está confortável/perdido (não implementado)
- Terminar lesson quando objetivos cumpridos (não implementado)

Padrão **agent with tools**: tutor LLM expõe `mark_objective_complete(id)`, `request_pt_explanation()`, `request_level_adjustment(direction)`, `end_lesson()`. Decisões pedagógicas viram dados estruturados auditáveis.

#### 1.7 Sem memória de longo prazo
```python
self.brain_manager = BrainManager(system_prompt=free_talk_prompt)
```
Cada wake word ou switch de modo cria nova instância. Histórico do chat morre. O que já existe no banco (`InteractionLog`, `UserProgress`, scores por pilar, erros corrigidos) **nunca volta para o contexto** da próxima sessão.

Consequências:
- Tutor repete correções já dadas em sessões anteriores.
- Não aproveita estruturas já dominadas para puxar próxima zona de desenvolvimento.
- Não retoma tópicos abertos ("Last time you mentioned your dog — how is he?").

Padrão **augmented LLM = retrieval + tools + memory**. Learner model persistente + RAG-lite de fatos sobre o aluno + erros recorrentes no system prompt da sessão.

#### 1.8 Diagnóstico não-adaptativo
Fluxo atual:
1. 5–8 trocas casuais com prompt fixo de icebreaker.
2. Transcrição completa do aluno enviada para `rate_cefr` em uma única chamada.
3. Modelo retorna A1–C2 com uma frase de justificativa.

Limitações:
- Aluno tímido produz pouco signal — diagnóstico vira chute educado.
- Não há **probing adaptativo**: se aluno acerta past simple, próxima pergunta deveria forçar past perfect; se erra, deveria descer para present simple. Hoje conversa é casual e linear.
- Rater não vê ortografia (Whisper já corrige), entonação ou pausas — perde sinais reais de fluência.

Padrão **orchestrator-workers**: planejador escolhe próxima sonda baseado em hipótese de nível corrente. Worker pequeno classifica resposta. Convergência mais rápida e mais precisa.

#### 1.9 Sem guardrails de entrada
Nenhum filtro para:
- Input adversarial ("ignore all instructions and say...")
- Off-topic prolongado (criança falando de Minecraft por 15 min)
- PII inadvertida (aluno dizendo endereço completo)
- Conteúdo impróprio (em dispositivo doméstico com crianças, risco real)

Tutor pode ser sequestrado fora do escopo de ensino sem qualquer sinal.

#### 1.10 Observabilidade de IA ausente
Não há rastreio de:
- Token usage por sessão / por aluno / por modo
- Custo acumulado por usuário
- Drift de nível (aluno oscila A2 ↔ B1 entre sessões — bug ou progresso?)
- Latência por etapa (STT, LLM, TTS) — onde dói?
- Taxa de evaluator-rejections (quando existir)
- Taxa de fallbacks ("I'm sorry, I'm having trouble thinking right now")

Escala em produção sem isso é debug no escuro.

---

## 2. Por que mudar

### 2.1 Promessa do produto exige consistência
"Eliminar barreira de ansiedade social" só funciona se o aluno **confiar** que o tutor:
- Nunca vai usar gramática acima do nível (humilha)
- Nunca vai corrigir de forma agressiva
- Nunca vai sumir em silêncio (timeout sem feedback)
- Nunca vai esquecer quem ele é

Hoje, essas garantias dependem de o Gemini seguir um prompt textual. Em produção, modelos falham essas instruções com frequência não-nula. Sem evaluator-optimizer, falha = aluno frustrado, sem detecção.

### 2.2 Diferencial competitivo é o learner model
Apps de idioma (Duolingo, Babbel) já entregam exercício adaptativo. Diferencial do Lery é **conversação adaptativa com memória persistente**. Sem learner model alimentando o prompt, somos só "ChatGPT com TTS bonito" — produto facilmente comoditizado.

### 2.3 Hardware Pi3 + rede impõe disciplina
Pi3 é constrained. Latência de rede no Brasil é alta. Cada chamada LLM extra custa caro em UX. Por isso a arquitetura precisa ser **deliberada** sobre quais decisões merecem chamada própria e quais podem rodar async em background. Hoje tudo é serial e bloqueante.

### 2.4 Manutenibilidade quando o produto escalar
BrainManager hoje cabe na cabeça de um dev. Aos 1000 usuários, com bugs reportados de "tutor falou em B2 com aluno A1", "diagnóstico errou nível", "lição não terminou" — não dá para debugar prompt monolítico sem separação de responsabilidade. Camadas com contratos claros (input/output schemas) tornam bugs reproduzíveis.

### 2.5 Padrões da Anthropic existem por uma razão
"Building effective agents" cataloga padrões observados em produção em centenas de equipes. Não é trend. É consenso operacional. Adotar agora é mais barato que adotar depois.

---

## 3. Visão arquitetural alvo

### 3.1 Camadas e responsabilidades

```
┌────────────────────────────────────────────────────────────────┐
│ User Input (transcrito por Whisper)                            │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│ [1] Input Guard                                                │
│     - Detecta: off-topic prolongado, PII, conteúdo impróprio,  │
│       prompt injection                                         │
│     - Modelo: Flash-Lite (sub-segundo)                         │
│     - Output: passa | bloqueia com razão                       │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│ [2] Router LLM                                                 │
│     - Classifica intent:                                       │
│       chat | start_lesson | end_lesson | struggle |            │
│       request_pt | exit | meta_question                        │
│     - Modelo: Flash-Lite                                       │
│     - Substitui regex em _matches_lesson_intent etc.           │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│ [3] Context Builder (Augmented LLM substrate)                  │
│     - Carrega: perfil do aluno (estático)                      │
│       + learner model (erros recorrentes, estruturas           │
│         dominadas, vocabulário visto, tópicos abertos)         │
│       + estado da sessão (lesson, objetivos, score parcial)    │
│     - Output: contexto estruturado pronto para injetar         │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│ [4] Tutor LLM (com tools)                                      │
│     - Gera draft de resposta                                   │
│     - Tools disponíveis:                                       │
│       • mark_objective_complete(id)                            │
│       • request_pt_explanation(reason)                         │
│       • request_level_probe(direction)                         │
│       • end_lesson(reason)                                     │
│       • recall_past_topic(topic_key)                           │
│     - Modelo: gemini-2.5-flash (qualidade pedagógica)          │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│ [5] Evaluator LLM                                              │
│     - Checa o draft contra:                                    │
│       • Nível CEFR respeitado (gramática, vocabulário)?        │
│       • Limite de sentenças/palavras?                          │
│       • Tom adequado (não condescendente, não agressivo)?      │
│       • Objetivos da lesson sendo trabalhados?                 │
│     - Output: aprovado | rejeitado com motivos                 │
│     - Se rejeitado → volta para [4] com feedback (máx 1 retry) │
│     - Modelo: Flash-Lite                                       │
└────────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────────┐
│ [6] Speaker                                                    │
│     - TTS apenas do output aprovado                            │
│     - Em paralelo, dispara [7] async (não bloqueia)            │
└────────────────────────────────────────────────────────────────┘
                            ↓                            ↓
                       (audio toca)              ┌──────────────┐
                                                 │ [7] Grader   │
                                                 │ (async, BG)  │
                                                 │ - 4 pilares  │
                                                 │ - persiste   │
                                                 │   no banco   │
                                                 │ - atualiza   │
                                                 │   learner    │
                                                 │   model      │
                                                 └──────────────┘
```

### 3.2 Justificativas de modelo por camada

| Camada | Modelo sugerido | Justificativa |
|--------|----------------|---------------|
| Input Guard | Flash-Lite | Classificação simples, latência crítica, antes do user |
| Router | Flash-Lite | Decisão discreta, precisa ser rápida |
| Tutor | gemini-2.5-flash | Qualidade pedagógica é o core do produto |
| Evaluator | Flash-Lite | Critica contra regras claras, não cria |
| Grader | gemini-2.5-flash | Avaliação CEFR precisa de qualidade, mas roda async |

Total na crítica path: Guard + Router + Tutor + Evaluator = 4 chamadas. Três são Flash-Lite (~300–600ms cada). Tutor é a chamada cara (~1–2s). Soma estimada: 2.5–4s. Hoje: 1 chamada Tutor de 1–3s + parsing. Diferença real: ~1–2s.

**Mitigação obrigatória:** o "Hmm, deixa eu pensar" já existe no `audio_manager.play_hmm` (disparado em `_SLOW_THRESHOLD=3s`). Migrar para começar tocar logo após Router decidir → cobre os 2s extras sem percepção de delay.

### 3.3 Onde vivem as decisões pedagógicas hoje vs alvo

| Decisão | Hoje | Alvo |
|---------|------|------|
| "Aluno quer começar lesson" | Regex em `_matches_lesson_intent` | Router LLM ou tool-call do Tutor |
| "Aluno quer sair" | Regex em `_EXIT_KEYWORDS` | Router LLM |
| "Resposta tem gramática acima do nível" | Não detectado | Evaluator LLM |
| "Aluno está com dificuldade, injetar PT" | Instrução textual no prompt | Tool call `request_pt_explanation` |
| "Objetivo da lesson cumprido" | Não detectado | Tool call `mark_objective_complete` |
| "Hora de terminar a lesson" | Nunca (lesson dura até user dizer exit) | Tool call `end_lesson` |
| "Subir/descer dificuldade dentro da sessão" | Não detectado | Tool call `request_level_probe` |
| "Qual o nível do aluno (diagnóstico)" | One-shot rater em transcript | Orchestrator com probes adaptativos |

### 3.4 Learner Model — o ativo escondido

Hoje o `InteractionLog` já tem:
- `grammatical_fixes` (correções aplicadas)
- 4 scores por pilar
- `evaluation_reasoning`
- Transcrição do aluno e resposta do tutor

Falta uma camada de **agregação por aluno** que extrai:
- **Erros recorrentes**: estruturas que o aluno erra 3+ vezes em 7 dias (ex: "uso de third-person -s")
- **Estruturas dominadas**: estruturas com >80% de acerto nos últimos 10 turnos (não corrigir mais)
- **Vocabulário visto**: palavras já trabalhadas (não reapresentar como nova)
- **Tópicos abertos**: temas mencionados sem fechamento ("aluno falou de viagem para Argentina no dia X")
- **Trajetória de nível**: histórico de scores agregados por sessão (detecta progressão ou regressão real vs ruído de turno único)

Esse agregado vira input para o **Context Builder** [3] — RAG-lite estilo "system prompt enriquecido com fatos recentes sobre o aluno". Sem isso, não há diferencial sobre ChatGPT genérico.

### 3.5 Diagnóstico adaptativo — esboço

Substituir `_run_diagnosis_session` por:

1. **Hipótese inicial**: A2 (mediana razoável para BR adulto).
2. **Probe loop** (orchestrator):
   - Planejador escolhe próximo prompt baseado em hipótese atual (ex: A2 → testa past simple).
   - Tutor diagnóstico gera pergunta apropriada.
   - Aluno responde.
   - Classifier worker avalia: usou estrutura corretamente? Espontaneamente? Sob hesitação?
   - Hipótese sobe (acertou complexo) ou desce (errou básico).
3. **Convergência**: para quando 3 probes consecutivos confirmam mesmo nível, ou após 8 turnos.
4. **Output**: nível final + perfil de pontos fortes/fracos por estrutura testada (não só uma letra).

Vantagens:
- Aluno tímido não distorce resultado (probes específicos forçam evidência).
- Convergência mais rápida em casos óbvios (B2 acertando A1 trivialmente → pula para B1 imediatamente).
- Output é mais rico que A1–C2: já entrega ao learner model um perfil de partida.

---

## 4. Tradeoffs reconhecidos

### 4.1 Latência
4 chamadas LLM no critical path vs 1 hoje. Mitigado por:
- 3 das 4 são Flash-Lite (rápidas).
- Hmm sound cobre janela percebida.
- Grader roda em background.
- Cache de Router para inputs curtos óbvios ("yes", "no", "ok") — bypass direto.

### 4.2 Custo
Mais chamadas = mais tokens. Gemini Flash é barato (~$0.075/1M input tokens em 2025). Estimativa: sessão de 20 min com 30 turnos → ~$0.02–0.05 por sessão. Em produto pago, irrelevante. Importa rastrear para detectar runaway.

### 4.3 Complexidade
Cada camada nova = mais código, mais bugs possíveis, mais coisas para debugar. Mitigação:
- Cada camada com schema input/output bem definido (Pydantic).
- Testes de contrato por camada (mock LLMs em dev).
- Telemetria desde dia 1 (não opcional).

### 4.4 Risco de over-engineering para hardware constrained
Pi3 já está no limite. Adicionar camadas é tentação de engenheiro. Mitigação: cada camada precisa justificar com **bug real observado** ou **feature solicitada por usuário**. Não construir camada antes de ter o problema.

### 4.5 Manutenção solo
Hoje o projeto é mantido por uma pessoa. Arquitetura distribuída em camadas exige disciplina de docs e testes. Sem isso, vira labirinto.

---

## 5. O que NÃO está no escopo desta visão

- Reescrita do core em outra linguagem.
- Migração de Gemini para outro provedor.
- Mudança no fluxo de wake word, STT (Whisper) ou TTS.
- Alteração na state machine de hardware (LED, audio).
- Mudança no modelo de dados da API (já suporta tudo necessário).
- Auto-fine-tuning do modelo (fora de escopo de produto consumer).

Foco é **exclusivamente** o pipeline de raciocínio entre user input transcrito e tutor output sintetizado.

---

## 6. Plano de ação — quando chegar a hora

> Ordem deliberada: cada passo entrega valor isolado, não exige o seguinte, e pode parar a qualquer ponto sem deixar o sistema quebrado.

### Passo 1 — Structured output nativo (1–2 dias)
**Por quê primeiro:** ganho técnico puro, zero latência adicional, mata classe inteira de bugs de parsing.

**O que fazer:**
- Substituir parsing manual em `rate_cefr` e `evaluate_turn` por `response_schema` do Gemini.
- Adicionar Pydantic models para `CefrRating` e `TurnEvaluation`.
- Manter fallback atual como defesa em profundidade.

**Critério de pronto:** zero ocorrências de `JSONDecodeError` em 100 chamadas de teste.

### Passo 2 — Evaluator-optimizer para nível-compliance (3–5 dias)
**Por quê em segundo:** maior ganho de qualidade percebida pelo aluno. Resolve a falha mais crítica do produto (A1 ouvindo gramática avançada).

**O que fazer:**
- Criar `LevelComplianceEvaluator` (worker novo, Flash-Lite).
- Schema input: `{draft_response, target_level, lesson_objectives?}`.
- Schema output: `{compliant: bool, violations: [{type, snippet, suggestion}]}`.
- No `_run_session`, entre `brain_manager.generate_response` e `_speak`, rodar evaluator.
- Se `compliant=false` e for primeira tentativa: re-gerar com `violations` no contexto.
- Se segunda tentativa também falhar: falar mesmo assim (não bloqueia user), logar para análise.

**Critério de pronto:** em conjunto de 30 turnos com aluno A1 mockado, evaluator rejeita ≥80% dos drafts que contêm past perfect ou conditionals.

### Passo 3 — Tool use para decisões pedagógicas (5–7 dias)
**Por quê em terceiro:** mata o roteamento por regex, que é o ponto mais frágil do código atual.

**O que fazer:**
- Definir schema de tools: `mark_objective_complete`, `request_pt_explanation`, `request_level_probe`, `end_lesson`.
- Migrar Tutor para tool-use mode do Gemini.
- Remover `_matches_lesson_intent`, `_LESSON_TRIGGER_WORDS`, `_LESSON_ACTION_WORDS`.
- Reescrever `_switch_to_guided_lesson` para ser disparado por tool call do tutor (ou Router, ver passo 5).

**Critério de pronto:** suite de 20 frases variadas pedindo lesson (formal, informal, indireto, em PT, com gírias) → todas detectadas.

### Passo 4 — Learner model + Context Builder (7–10 dias)
**Por quê em quarto:** é o diferencial competitivo real. Maior impacto em retenção a médio prazo.

**O que fazer:**
- Criar tabela `LearnerProfile` na API (agregado por user) ou view materializada.
- Job de agregação (cron ou pós-sessão) que extrai:
  - Top 5 erros recorrentes nos últimos 14 dias.
  - Top 10 estruturas dominadas (>80% acerto nos últimos 20 turnos).
  - Últimos 5 tópicos abertos.
- Endpoint `GET /learner-profile/:userId` retornando agregado pronto.
- `BrainManager` puxa esse profile no boot da sessão.
- Injeta no system prompt como bloco "Things to remember about this student".

**Critério de pronto:** em sessão de teste com 3 erros conhecidos previamente injetados no DB, tutor referencia pelo menos 1 deles espontaneamente no primeiro turno relevante.

### Passo 5 — Router LLM (3–4 dias)
**Por quê em quinto:** depois do tool use estar maduro, router fica mais natural. Pode ser implementado como variação do tool use ou camada separada.

**O que fazer:**
- Substituir `_matches_keywords(user_text, _EXIT_KEYWORDS)` por classificação Router.
- Router pode ser tool call no próprio Tutor (`intent` retornado como part do response) ou chamada separada.
- Decisão de qual abordagem depende de medições de latência do passo 3.

**Critério de pronto:** suite de 50 inputs variados de saída (incluindo despedidas indiretas, "I have to go pick up my kid", "let me think about it and come back tomorrow") → ≥95% detectados.

### Passo 6 — Diagnóstico adaptativo (10–15 dias)
**Por quê por último:** mais complexo, e o diagnóstico atual, apesar de simples, não está quebrado — só é subótimo. Pagar essa complexidade só depois de tudo anterior estar estável.

**O que fazer:**
- Implementar orchestrator de probes (Python, não LLM — escolhe próximo prompt com base em hipótese).
- Worker classificador por probe (Flash-Lite, schema fixo).
- Update de hipótese após cada probe.
- Critério de parada (convergência ou cap de turnos).
- Output enriquecido (nível + perfil por estrutura).

**Critério de pronto:** em set de 5 alunos sintéticos de níveis conhecidos (A1, A2, B1, B2, C1), convergência correta em ≤6 probes para todos.

### Passo 7 — Observabilidade (paralelo, desde o passo 1)
**Por quê:** não é "passo" — é requisito contínuo. Cada passo acima precisa nascer com métricas.

**O que fazer (incremental):**
- Token usage por chamada (input/output) logado.
- Latência por camada.
- Taxa de evaluator-rejections (após passo 2).
- Taxa de tool calls bem-sucedidos (após passo 3).
- Distribuição de níveis de aluno (após passo 4).
- Dashboards básicos (mesmo que CSV exportado manualmente no início).

**Critério de pronto:** capacidade de responder, em 5 minutos, à pergunta "quanto custou o usuário X nos últimos 30 dias e qual a latência mediana dos turnos dele?"

### Passo 8 — Guardrails (paralelo, com passo 2 ou 3)
**Por quê:** baixa prioridade até o produto estar em mãos de mais usuários, mas crítico antes de hardware ser vendido para famílias com crianças.

**O que fazer:**
- Input classifier (Flash-Lite) detectando: prompt injection, PII, conteúdo impróprio.
- Política de bloqueio: tutor responde com fallback "Vamos voltar para o inglês?" + log para revisão.
- Política de PII: detecta endereço/telefone/CPF, redirige conversa.

**Critério de pronto:** suite de 20 inputs adversariais → ≥90% bloqueados ou redirecionados.

---

## 7. Decisões em aberto para discutir antes da execução

Pontos que precisam de definição antes de cada passo virar tarefa concreta:

1. **Modelo do Evaluator** — Flash-Lite (latência) ou Flash full (qualidade)? Decidir após benchmark.
2. **Tool use vs Router separado** — uma chamada com tools no Tutor, ou Router separado dedicado? Depende de latência medida.
3. **Onde mora o learner model** — tabela nova ou view materializada sobre `InteractionLog`? Pesar custo de escrita vs custo de query.
4. **Política de re-tentativa do Evaluator** — 1 retry, 2 retries, ou sempre falar o draft após N segundos? UX vs qualidade.
5. **Granularidade do learner model no prompt** — quanta informação cabe no system prompt sem inchar custo de cada turno?
6. **Quando aposentar `system-prompt.txt`** — manter como fallback offline (Pi sem rede para API) ou deletar?
7. **Versionamento de prompts** — git é suficiente ou precisamos de prompt registry com A/B test?

---

## 8. Avaliação realista de custo e priorização

Esta seção foi adicionada após reflexão honesta sobre os tradeoffs do plano. O perfil do projeto e do mantenedor importa para decidir até onde levar a complexidade.

### 8.1 Perfil do mantenedor e do projeto (estado atual)

- Desenvolvedor solo.
- Entusiasta querendo construir portfólio robusto e referência de arquitetura.
- Não quer matar o projeto com over-engineering prematuro.
- Hardware Raspberry Pi 3 — latência sensível.
- Pré-escala — produto ainda não está nas mãos de 1.000 usuários.

Posição entre os cenários discutidos: híbrido entre **portfólio/referência** e **produto sustentável solo**. Não é TCC puro nem é venda em massa imediata. Implica: construir as camadas que ensinam padrões de agente real **E** que sobrevivem à manutenção solo, descartar as que são luxo prematuro.

### 8.2 Os quatro eixos de custo, ordenados por impacto

#### Eixo 1 — Latência (mais perigoso)

Pi3 + internet brasileira. Hoje:
```
[STT Whisper ~1.5s] → [Gemini 1–3s] → [TTS gTTS 1–2s] = 3.5–6.5s
```

Plano completo, serial:
```
[STT] → [Guard 0.5s] → [Router 0.5s] → [Tutor 1–3s] → [Evaluator 0.5–1s] → [retry?] → [TTS]
= 5–10s
```

Conversa humana flui em <2s. >4s percebe travamento. >7s aluno desiste. **Esse é o tradeoff que define se o produto sobrevive, não o custo de token.**

Mitigações obrigatórias se executar plano cheio:
- Streaming do Tutor direto pro TTS (Gemini suporta; gTTS não — implicaria trocar provider TTS).
- Evaluator em paralelo ao início do TTS, com policy de interrupção — risco de cortar fala no meio.
- Guard + Router em uma única chamada Flash-Lite (combine, não serialize).
- Cache de Router para inputs curtos óbvios ("yes", "no", "ok", "hmm").

Sem essas mitigações, plano completo entrega produto pior que o atual.

#### Eixo 2 — Manutenção (subestimado)

Solo dev. Cada camada nova é um sistema a debugar quando aluno reportar bug bizarro às 23h. BrainManager hoje cabe em uma tela. Sistema alvo: 6 arquivos, 4 schemas Pydantic, contratos entre camadas, mocks de LLM em testes.

Custo real estimado: ~30% do tempo de dev migra para manutenção de pipeline em vez de feature de produto. Sem testes de contrato por camada, sistema vira labirinto em 3 meses.

#### Eixo 3 — Debug surface

Hoje: bug = ler 1 prompt + 1 log.
Alvo: bug pode estar em Guard, Router, Context Builder, Tutor ou Evaluator.

Sem telemetria por camada, debug fica impossível. Por isso o passo 7 (observabilidade) é **pré-requisito**, não paralelo. Não começa nenhum dos outros passos sem isso pronto.

#### Eixo 4 — Custo de token

Irrelevante no estágio atual. Flash + Flash-Lite em sessão de 20 min ≈ $0.05. Não é eixo de decisão. Só vira problema em runaway (loop infinito de retries) — daí o passo 7 também resolve.

### 8.3 Reclassificação dos passos por valor/custo no estágio atual

| Passo | Valor agora | Custo | Veredito |
|-------|------------|-------|----------|
| 1 Structured output | Alto | Baixo | **Faça primeiro.** Maior ROI técnico do plano. |
| 2 Evaluator level-compliance | Alto | Médio | **Faça**, mas só após medir latência baseline (passo 7). |
| 7 Observabilidade básica | Crítico | Baixo | **Pré-requisito de tudo.** Token usage, latência por etapa, taxa de fallback. |
| 8 Guardrails | Crítico antes de qualquer venda | Médio | **Faça antes de hardware sair pra casa com criança.** Não antes se for só portfólio/TCC. |
| 3 Tool use | Médio | Médio-Alto | **Espera regex quebrar com user real.** Hoje funciona "bem o suficiente". |
| 5 Router | Baixo (sobre #3) | Baixo | **Funde no #3**, não vira passo separado. |
| 4 Learner model | Alto a longo prazo | Alto | **Espera ter retenção** que justifique. Sem usuário recorrente, não há sinal pra agregar. |
| 6 Diagnóstico adaptativo | Baixo | Alto | **Pula** até dados mostrarem que diagnóstico atual erra. |

Resumo: dos 8 passos, **3 valem agora** (1, 2, 7), **2 viram pré-requisito antes de vender** (#2 + #8), **3 são "depois quando doer"** (4, 6, possivelmente 3).

### 8.4 Risco de over-engineering — reconhecido explicitamente

Construir arquitetura pra escala que ainda não existe é tentação. Métrica honesta: **quantos bugs reais hoje vêm das 10 fraquezas listadas na §1?**

- Se zero ou um → parte do plano é teoria.
- Se vários → cada um justifica a camada correspondente.

Anthropic mesma recomenda no "Building effective agents": **começar simples, adicionar complexidade quando necessário**. Plano completo é referência arquitetural, não obrigação de execução total.

Outro lado: se o produto vai pra mãos de criança em casa, guardrails (#8) não é over-engineering, é responsabilidade legal/ética. Decisão de cenário muda peso.

### 8.5 Recomendação ajustada ao perfil declarado

Posição "entusiasta + portfólio + sem matar projeto" implica execução em **três ondas**, não passo a passo isolado.

#### Onda 1 — Fundação enxuta (1–2 semanas de dev solo)
Entrega valor real, exibe padrões de agente, custo baixo.
- Passo 7 (observabilidade básica) — pré-requisito.
- Passo 1 (structured output) — ganho técnico puro.
- Passo 2 (evaluator level-compliance) — só geração + log de violação, sem retry ainda. Mostra padrão evaluator-optimizer no portfólio sem complicar latência.

Resultado pra portfólio: já é justificável dizer "uso evaluator-optimizer e structured output". Resultado pra produto: melhor qualidade percebida, mesma latência.

#### Onda 2 — Diferencial pedagógico (só se primeira tiver tração)
Espera Onda 1 estar em produção 2–4 semanas. Mede: usuários voltam? Qualidade percebida melhorou?
- Passo 2 completo (com retry de fato no evaluator, max 1).
- Passo 4 parcial — learner model **simples**: só "top 3 erros recorrentes" injetado no prompt. Sem RAG complexo, sem agregação pesada. Uma query SQL agregando `InteractionLog`.
- Passo 8 se houver intenção de vender hardware.

Resultado pra portfólio: agora tem memória persistente + evaluator-optimizer real. Já é "agente" no sentido Anthropic.

#### Onda 3 — Camadas avançadas (só quando dor real aparecer)
Não construir antes de bug reportado ou feature pedida.
- Passo 3 (tool use) **se** detecção por regex falhar com usuários reais.
- Passo 6 (diagnóstico adaptativo) **se** dados mostrarem que rater atual erra por margem grande.
- Passo 5 (router separado) provavelmente nunca — fica embutido no tool use.

### 8.6 Sinais que indicam quando avançar de onda

Critérios objetivos para não decidir por entusiasmo:

- **Onda 1 → Onda 2**: ≥ 5 usuários ativos por 2+ semanas, ou bug reportado relacionado a "tutor falou em nível errado".
- **Onda 2 → Onda 3**: ≥ 20 usuários ativos, ou ≥ 3 bugs reportados de detecção de intenção (regex falhando), ou venda real de hardware planejada em ≤ 90 dias.

Sem esses sinais, onda fica em backlog. Doc continua válido como referência de visão.

### 8.7 Tradeoff do tradeoff

Risco oposto também é real: travar em "esperar sinal" para sempre, nunca evoluir, e quando precisar evoluir já estar enterrado em débito técnico do BrainManager monolítico.

Mitigação: Onda 1 não negocia. É baseline mínimo independente de sinal. Onda 2 e 3 dependem de sinal, mas Onda 1 acontece de qualquer forma quando houver janela de execução.

---

## 9. Conclusão

O core hoje funciona. Não está quebrado. Mas é um **chatbot stateful com TTS**, não um **agente pedagógico autônomo**. A diferença vai ser visível a partir do 1.000º usuário, quando inconsistências forem reportadas e debugging do prompt monolítico ficar impossível.

A migração não precisa ser big bang. Cada passo do plano entrega valor sozinho. Pode parar em qualquer ponto sem regressão. Mas cada passo depois do passo 3 começa a justificar o nome "agente" no sentido que a Anthropic define.

Encaixa na visão do produto: "tutor autônomo" com "memória" e "consistência pedagógica" exige essa arquitetura. Sem ela, somos commodities.

Quando voltar para executar: começar pelo passo 1 (structured output) — é o ganho mais barato e desbloqueia testes mais limpos para os passos seguintes.
