# Estratégia GTM — Desktop App + Canal de Professores

> Documento de alinhamento estratégico. Captura raciocínio sobre **dois pivôs combinados**: (1) desktop app com wake word como substituto digital do smart speaker e (2) canal B2B2C via professores particulares de idioma. Não é plano de execução imediato.

**Data:** 2026-05-27
**Escopo:** Estratégia de produto e canal de aquisição para escala no mercado BR. Complementa (não substitui) os docs `Arquitetura IA - Visão e Migração.md` e `Pricing e Modelo de Cobrança.md`.

---

## 1. Visão geral da estratégia

Combinar dois movimentos que se reforçam:

1. **Produto:** Desktop app nativo (Mac/Windows) com wake word — preserva o pitch original do Lery ("always-on, ambient, sem fricção de abrir app") sem custo de hardware.
2. **Canal:** Programa B2B2C de professores de idiomas — professor distribui Lery aos alunos, recebe comissão recorrente, ganha dashboard de acompanhamento como ferramenta de trabalho.

**Hipótese central:** desktop app entrega a experiência diferenciada que justifica preço acima de Duolingo, enquanto o canal de professores entrega aquisição massiva e qualificada com CAC baixo.

---

## 2. Pivô 1 — Desktop App com Wake Word

### 2.1 Lógica do produto

Lery roda em background no Mac/Windows do aluno. Aluno diz "Hey Lery" (ou wake word custom), app ativa, conversação começa em <1 segundo. Sem abrir nada, sem clicar.

Preserva a promessa central do hardware Pi3:
- Always-on ambient.
- Sem fricção de abrir app.
- Sem tela necessária durante a conversa.
- Conversação espontânea, não agendada.

Sem o custo do hardware:
- BOM zero.
- Sem logística reversa.
- Sem garantia.
- Sem capex pra subsidiar device.
- Distribuição digital instantânea.

### 2.2 Por que faz sentido pro público-alvo

- Estudante adulto e jovem adulto **já tem notebook**. Macs e PCs ficam ligados em mesa de estudo/trabalho horas por dia.
- Mercado BR: ~95% de quem estuda inglês com IA usa Mac ou Windows. Linux é nicho.
- Sem barreira de R$599+ de hardware = TAM explode.

### 2.3 Decisões técnicas a tomar

| Item | Opções | Recomendação |
|------|--------|--------------|
| Framework | Tauri (Rust+webview) / Electron / Swift+WinUI nativo | **Tauri** — melhor footprint, perf, e ainda permite UI web |
| Wake word engine | Porcupine (Picovoice) / openWakeWord / Vosk | **Porcupine** no MVP (commercial, free tier limitado, depois ~$0.30/device/mês). Migrar pra openWakeWord se custo escalar. |
| STT | Mesmo Whisper API que core | Whisper API (cloud) |
| TTS | gTTS (free, ruim) / Google Cloud Neural / ElevenLabs | **Google Cloud Neural** ou ElevenLabs (qualidade premium) |
| Distribuição | Direto site / Mac App Store / Microsoft Store | **Direto** no MVP (notarized DMG + signed MSI). Stores depois — burocracia atrasa launch |
| Update | Auto-update via Tauri updater | Sim, desde dia 1 |

### 2.4 Riscos técnicos

- **Permissão de microphone Mac (TCC)** = prompt na primeira execução. Fricção real, mas resolve em 1 click.
- **Notarização Apple** + **Microsoft SmartScreen** = burocracia inicial, depois ok.
- **Bateria laptop**: wake word sempre escutando consome ~5–8%/dia. Aceitável para uso desktop, problema potencial em laptop usado fora da tomada.
- **Wake word offline robusto** ainda é R&D não-trivial — falsos positivos e negativos atrapalham UX.
- **Resource usage** (CPU/RAM) precisa ser baixo. Pi3 já mostra que dá pra fazer leve.

### 2.5 Reuso do core existente

- **BrainManager, Tutor, Evaluator, Grader** — reuso 100%, agnósticos de canal.
- **Learner Model, Context Builder** — vivem na API, alimentam qualquer canal.
- **AudioManager, LEDController** do core Pi3 — descartados.
- **Wake word do Pi3** — possivelmente portável dependendo da lib usada.

### 2.6 Pricing do desktop app

- **Lery Plus Desktop:** R$39.90/mês (R$29.90/mês anual)
- Mesmo tier do app mobile do doc de pricing.
- Diferencial vs mobile app: wake word + ambient. UX premium real.

---

## 3. Pivô 2 — Canal B2B2C via Professores

### 3.1 Lógica do canal

Professor de idiomas (particular, escola pequena, autônomo) tem dor real:
- Aluno não pratica entre aulas → progride lento → cancela curso.
- Professor tem 20–50 alunos, não consegue oferecer conversação ilimitada.
- Aulas viram repetitivas (mesma estrutura, mesmo material) porque aluno não tem onde praticar.

Lery resolve a dor:
- Aluno pratica conversação ilimitada entre aulas.
- Professor ganha visibilidade do progresso via dashboard.
- Professor entrega mais valor por hora — foca em correção fina, prep de exame, conversação supervisionada de alto nível.
- Professor ganha **comissão recorrente** enquanto aluno mantiver assinatura.

### 3.2 Por que funciona em educação especificamente

Padrão "professional-led adoption" — Notion (PMs), Calendly (assistentes), Loom (gerentes), GitHub (devs). Profissional autoridade recomenda → adoção em massa do círculo dele.

Em educação ainda mais forte: aluno **confia no professor**. Recomendação dele converte 5–10× melhor que ad frio.

Concorrentes não fazem isso bem:
- Cambly, italki, Open English vendem direto ao consumidor.
- Apps tipo Duolingo não têm dashboard pra professor.
- Espaço aberto.

### 3.3 Conflito de interesse — gestão crítica

**A hipótese de que "aluno eventualmente abandona o professor" é provavelmente verdade no longo prazo.** Mas essa frase **NÃO PODE** ser o pitch ao professor. Mata o canal antes de começar.

**Pitch correto ao professor:**
- "Lery faz a conversação repetitiva. Você foca em correção fina, estratégia, prep de exame — o que cobra caro."
- "Aluno chega mais preparado na sua aula. Você entrega mais valor por hora."
- "Você ganha comissão recorrente enquanto ele estudar. Indique uma vez, ganhe pra sempre."
- "Dashboard te mostra onde cada aluno está fraco — você ajusta a aula com data, não com chute."

**Realidade econômica subjacente:**
- Aluno usa Lery + professor por 6–18 meses (complementar).
- Eventualmente alguns alunos migram pra Lery puro.
- Mas no caminho, professor já recebeu R$30–50 × 12 meses × N alunos em comissão. Indicou outros alunos. Relacionamento positivo.
- Mesmo após migração, professor original pode continuar recebendo comissão (modelo "lifetime referral") — alinha incentivos.

### 3.4 Estrutura de comissão sugerida

| Item | Valor | Lógica |
|------|-------|--------|
| Comissão recorrente | **25–30% do MRR** do aluno | Enquanto aluno assinar. Aluno paga R$39.90 → professor recebe R$10–12/mês |
| Bônus de ativação | **R$30 por aluno** que completar 30 dias ativo | Cobre custo de tempo do professor em apresentar o Lery |
| Cap de tempo | **Sem cap** | Incentivo perpétuo a referir mais |
| Frequência de pagamento | **Mensal via PIX** | BR é PIX, não Stripe payout |
| Mínimo de saque | **R$50** | Reduz custo operacional de payouts mínimos |

**Exemplo concreto:** professor com 15 alunos ativos no Lery Plus →
- 15 × R$10 = **R$150/mês recorrente** + bônus de ativação iniciais.
- Em 1 ano: ~R$1.800 passivos sem trabalho extra além da indicação inicial.

### 3.5 Dashboard do professor — produto dentro do produto

Ferramenta de trabalho que mantém o professor engajado independente da comissão:

**O que mostra:**
- Lista de alunos referidos por ele.
- Por aluno: horas de conversação no Lery, scores CEFR por pilar, erros recorrentes, estruturas dominadas, tópicos discutidos.
- Heatmap de uso (quando aluno pratica mais).
- Sugestões de foco pra próxima aula ("Aluno X tem errado present perfect 8x esta semana — vale revisar").

**Funcionalidades pro professor:**
- Atribuir lessons específicas a alunos (ex: "Pratique pedidos em restaurante por 7 dias").
- Mensagem ao aluno via app ("Bom trabalho! Vamos focar em pronúncia na próxima aula").
- Export de relatório PDF mensal por aluno (vira material de venda do próprio professor).

**Implicação:** dashboard é o lock-in do professor. Mesmo se comissão cair, ele continua porque vira workflow dele.

### 3.6 Tier do professor — pricing dele

| Plano | Preço | Quem |
|-------|-------|------|
| **Lery for Teachers Free** | R$0 | Professor com ≤ 5 alunos referidos ativos. Dashboard básico. |
| **Lery for Teachers Pro** | R$49.90/mês | Acima de 5 alunos, dashboard completo, atribuição de lessons, relatório PDF mensal |
| **Comissão** | 25–30% MRR aluno | Idem em ambos os tiers |

Tier Pro só vira atrativo depois que professor já tem volume. Free serve pra trazer professor pra dentro sem fricção.

### 3.7 Aquisição de professores

Como trazer professores pra dentro:

1. **LinkedIn outreach** direto a professores particulares (busca por "professor de inglês freelancer").
2. **Comunidades de professores** — grupos de Facebook, Telegram, Discord de "professores de inglês BR" são ativos.
3. **Eventos de educação** — feiras tipo Bett Brasil, Educar.
4. **Parceria com plataformas de tutores** — italki, Preply (cuidado, conflito).
5. **Programa de embaixador** — primeiros 50 professores ganham comissão maior (40%) vitalícia em troca de feedback e testimonial.

### 3.8 Riscos do canal

- **Professor percebe canibalização** e abandona. Mitigação: foco do Lery em conversação espontânea, não em substituir aula estruturada nos primeiros meses.
- **Professor mal-intencionado** cria contas falsas pra inflar comissão. Mitigação: verificação de aluno ativo (≥10h de uso/mês pra pagar comissão).
- **Compliance fiscal** — comissão é receita pro professor, precisa de RPS / NF. Lery emite informe rendimentos anual.
- **Concorrência copia** — modelo é fácil de replicar. Mitigação: ser o primeiro, build community antes.
- **Aluno desconforto** com transparência total do progresso pro professor. Mitigação: aluno opta-in expressamente; controla o que professor vê.

---

## 4. Combo dos dois — multiplicador

Cada peça sozinha é boa. Combinadas viram defensibilidade real:

```
[Professor de inglês]
   │
   │ recomenda
   ▼
[Aluno baixa desktop Lery]
   │
   │ usa entre aulas (ambient, wake word)
   ▼
[Lery coleta dados de conversação]
   │
   ├──→ [Aluno melhora medido por CEFR]
   │
   └──→ [Dashboard do professor mostra progresso]
              │
              │ professor ajusta aula com data
              ▼
        [Professor entrega mais valor]
              │
              ▼
        [Aluno fica satisfeito, fica + tempo]
              │
              ▼
        [Comissão recorrente pro professor]
              │
              ▼
        [Professor indica mais alunos]
```

Loop fechado. Cada participante ganha. Vira flywheel.

---

## 5. Implicações em outros docs

### 5.1 Arquitetura IA (`Arquitetura IA - Visão e Migração.md`)

- **Onda 2 (learner model) sobe de prioridade.** Dashboard de professor exige learner model bem feito. Não é luxo — é feature core do canal.
- **Multi-canal exige `channel` no `Session` e `User`.** Já há espaço pra isso no schema atual.
- **Latência menos crítica no desktop** (vs Pi3) — pipeline cheio cabe sem streaming.
- **Wake word offline** vira projeto técnico real. Não-trivial. Reservar R&D dedicado.

### 5.2 Pricing (`Pricing e Modelo de Cobrança.md`)

- **Modelo C (Hardware + Sub R$599 + R$89)** vira tier **premium opcional**, não MVP.
- **MVP comercial vira desktop app + canal de professor:**
  - Lery Plus Desktop: R$39.90/mês (R$29.90 anual)
  - Lery Família: R$59.90/mês (R$49.90 anual)
  - Lery for Teachers Free / Pro: R$0 / R$49.90/mês
  - Hardware Home: R$599 + R$89/mês (premium, lançado depois)

### 5.3 Roadmap geral

| Fase | Prazo | Foco |
|------|-------|------|
| 1 (atual) | Já | Core IA no Pi3 funcionando como prova técnica |
| 2 | +2 meses | WhatsApp MVP (canal massivo + viral) |
| 3 | +4 meses | Desktop app Tauri com wake word (canal premium digital) |
| 4 | +5 meses | Dashboard de professor + programa de comissão (canal de aquisição) |
| 5 | +9 meses | Hardware comercial Pi3 (tier ambient premium) |

Hardware vira **último**, não primeiro. Risco financeiro e técnico concentrados onde já houver receita.

---

## 6. Riscos e contraindicações de toda a estratégia

### 6.1 Dispersão de foco
Solo dev fazendo desktop app + canal de professor + WhatsApp + hardware = nenhum bem feito. **Ordem importa.** Um por vez, validar antes de avançar.

### 6.2 Desktop app é R&D técnico real
Wake word offline robusto, distribuição multi-OS, auto-update, permissions — somam meses de trabalho que não são "core de IA". Subestimar isso é receita pra atraso.

### 6.3 Programa de comissão precisa de base mínima
Sem 50–100 alunos pagantes já no produto, professor não confia que vai receber comissão. Galinha-ovo. Solução: primeiros 20 alunos pagantes vêm de canais diretos (você mesmo), depois professor entra.

### 6.4 Compliance trabalhista/fiscal
Comissão recorrente a pessoa física pode disparar interpretação trabalhista. Consultar contador. Provável solução: PJ obrigatório para receber comissão acima de threshold.

### 6.5 Concorrência
Modelo desktop app + canal de professor é fácil de replicar. Speak, Praktika, Loora podem entrar no BR. Diferencial defensável = **qualidade do learner model + dashboard de professor**. Sem isso, vira commodity.

---

## 7. Decisões em aberto

1. **Wake word: Porcupine ($0.30/device/mês) ou openWakeWord (free, mais R&D)?** Decisão depende de scale projetado e capacidade de R&D.
2. **Linux suporte: dia 1 ou nunca?** Provavelmente nunca no MVP — nicho.
3. **Comissão vitalícia ou cap em 24 meses?** Vitalícia é mais atraente pro professor, mas perpetua custo. Sugestão: vitalícia no MVP, ajustar se margem não fechar.
4. **Aluno vê que professor ganha comissão?** Transparência total ou opaco? Transparência reduz desconfiança mas pode reduzir conversão.
5. **Pricing diferenciado pra aluno referido por professor?** Ex: aluno paga R$34.90 em vez de R$39.90 — bônus do canal. Vale testar.
6. **Dashboard mobile (PWA) pra professor ou só web?** Mobile aumenta uso, mas dobra esforço.
7. **White-label pra escolas grandes?** Cultura Inglesa, Wizard, CCAA poderiam comprar Lery branded. Modelo separado, fora do MVP.
8. **Conta familiar onde pais acompanham filho menor?** Caso de uso diferente do professor mas similar tecnicamente — vale construir junto?

---

## 8. Resumo executivo

**Estratégia:**
- Desktop app nativo (Mac/Windows) com wake word substitui hardware no MVP.
- Canal B2B2C via professores particulares de inglês oferece distribuição massiva com CAC baixo.
- Dashboard do professor + comissão recorrente alinha incentivos.
- Hardware vira tier premium futuro, não MVP.

**Pricing:**
- Lery Plus Desktop: R$39.90/mês.
- Lery Família: R$59.90/mês.
- Lery for Teachers: free / R$49.90/mês + comissão 25–30% recorrente.

**Roadmap:**
- WhatsApp MVP → Desktop app → Dashboard de professor → Hardware premium.

**Risco principal:** dispersão de foco solo. Mitigação: um canal por vez, validar antes de avançar.

**Diferencial defensável:** qualidade do learner model + dashboard de professor. Sem esses, vira commodity num espaço cada vez mais lotado.

Documento serve como referência estratégica. Ajustar conforme dados de validação aparecerem.
