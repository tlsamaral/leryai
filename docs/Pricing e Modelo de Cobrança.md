# Pricing e Modelo de Cobrança — Lery AI

> Documento de alinhamento de pricing e modelo de monetização para assinatura mensal do produto. Captura raciocínio completo: custos unitários, BOM, concorrência BR, opções de cobrança, recomendação final.

**Data:** 2026-05-27
**Escopo:** Estratégia de monetização recorrente do Lery AI (hardware + assinatura) no mercado brasileiro.
**Estágio do produto:** Pré-escala. Definições servem para MVP comercial e primeiros 100–1.000 usuários.

---

## 1. Custos unitários estimados (por usuário ativo)

Premissa: usuário ativo médio = 20 min/dia × 30 dias = **10h/mês** de uso de fala+escuta efetiva.

### 1.1 API mensal por usuário ativo

| Item | Volume/mês | Custo unitário | Total USD | Total BRL (5.20) |
|------|-----------|----------------|-----------|------------------|
| Whisper STT | 600 min | $0.006/min | $3.60 | R$18.72 |
| Gemini Flash (Tutor + Eval + Grader) | ~300 turnos × ~1.5k tokens | $0.075/1M in, $0.30/1M out | $0.20–0.50 | R$1–3 |
| Google Cloud TTS Neural | ~270k chars | $16/1M chars | $4.32 | R$22.46 |
| **Subtotal API (heavy user)** | | | **~$8–9** | **~R$42–47** |
| Light user (5 min/dia) | | | ~$2 | ~R$10 |

**Conclusão:** custo opex por usuário ativo médio = **R$30–50/mês**.

**Variáveis de redução:**
- Manter gTTS (gratuito) economiza R$22, mas qualidade ruim — afeta retenção.
- Trocar Whisper API por Whisper local no Pi (whisper.cpp tiny) economiza R$18, mas latência sobe muito em Pi3.
- Cachear respostas TTS comuns ("Hello!", "Great job!") economiza ~10%.

### 1.2 Hardware BOM (estimado, BR 2026)

| Componente | Custo |
|-----------|-------|
| Raspberry Pi 3B+ | R$300 |
| ReSpeaker 4-mic array | R$400 |
| Speaker amplificado | R$80 |
| LED ring WS2812 | R$50 |
| Case impresso/injetado | R$80 |
| Fonte + cabos | R$70 |
| Embalagem + montagem + QA | R$120 |
| **BOM total** | **~R$1.100** |
| Frete + impostos + margem mínima | +R$400–600 |
| **Custo "pronto pra vender"** | **~R$1.500–1.700** |

---

## 2. Concorrência no mercado BR

Referência mental que o cliente usa ao avaliar preço de um produto de inglês:

| Produto | Preço/mês | Tipo | Modelo |
|---------|----------|------|--------|
| Duolingo Super | R$39.90 | App, gamificação | Self-service |
| Babbel | R$35 | App estruturado | Self-service |
| Cambly | R$250–400 | Tutor humano nativo | Aulas marcadas |
| italki | R$50–150/aula | Tutor humano avulso | Pay per use |
| Cultura Inglesa / CCAA / Wizard | R$300–600 | Escola presencial | Mensalidade |
| Open English | R$200–300 | Plataforma online com tutor | Subscription |
| Alexa Skills grátis (incl. Duolingo) | Grátis | Genérico, baixa qualidade | Bundled |

**Janela de pricing aceita pelo mercado:** Lery vive entre Duolingo (R$40) e Cambly (R$300).

- Mais próximo de **Cambly em experiência** — conversação real, sem agenda, ilimitado.
- Mais próximo de **Duolingo em conveniência** — always-on, sem marcar aula.

---

## 3. Posicionamento de marca para pricing

**Pitch central:** "Tutor de conversação ilimitado em casa pelo preço de menos de uma aula particular por mês."

Cliente compara mentalmente:
- Aula particular: R$80–150/h × 4h/mês = **R$320–600/mês**
- Lery: ilimitado, R$~100–150/mês = **parece barato pra valor entregue**
- Duolingo: R$40 — Lery cobra mais, mas entrega **conversação real**, não exercício

**Sweet spot percebido pelo cliente:** **R$79–149/mês** dependendo de como o hardware é cobrado.

---

## 4. Modelos de cobrança — 4 opções avaliadas

### 4.1 Modelo A — Venda hardware + assinatura (modelo Alexa/HomePod)

- Hardware: **R$1.499 upfront** (parcelado em 12× R$149 sem juros via cartão)
- Assinatura: **R$59/mês** mensal, R$49/mês anual (R$588/ano)
- Sem assinatura device vira limitado (modo offline básico)

**Prós:**
- Receita hardware imediata cobre BOM (margem ~R$300/unidade).
- Recorrente leve, fácil de aceitar.

**Contras:**
- Barreira de entrada altíssima no mercado BR.
- R$1.499 trava ~90% do público potencial.
- Risco de "comprou e abandonou" sem churn assinatura.

### 4.2 Modelo B — HaaS (Hardware as a Service, modelo Peloton/Whoop)

- Hardware: **R$0 entrada** OU **R$199 depósito** (refund se devolver em 30 dias)
- Assinatura: **R$149/mês** com fidelidade 24 meses
- Cancelou antes do prazo? Paga multa proporcional OU devolve device

**Cálculo de retorno:**
- LTV em 24 meses: R$149 × 24 = **R$3.576**
- Custos em 24 meses: BOM R$1.500 + opex R$50 × 24 = **R$2.700**
- Margem por usuário 24 meses: **~R$876 (24%)**

**Prós:**
- Zero barreira de entrada — escala rápido.
- Recorrência forte (cliente preso 24 meses).
- Receita previsível para investidor.

**Contras:**
- Capex pesado pro fundador (R$1.500 BOM por device antes do primeiro recebimento).
- Churn early = perda total do BOM.
- Logística reversa custosa (correios BR).
- Risco financeiro alto sem funding.

### 4.3 Modelo C — Híbrido subsidiado (recomendado MVP)

- Hardware: **R$599 entrada** (subsidiado — perde R$900 por unidade no momento da venda)
- Assinatura: **R$89/mês** mensal OU **R$69/mês anual** (cobrado R$828/ano)
- Sem fidelidade obrigatória; assinatura pausável

**Cálculo de retorno:**
- Receita ano 1: R$599 + R$89 × 12 = **R$1.667**
- Custos ano 1: BOM R$1.500 + opex R$50 × 12 = **R$2.100**
- **Perda ano 1: ~R$430 por cliente**
- Ano 2+: lucra R$1.068/ano (R$89 × 12 - R$50 × 12)
- **Breakeven: ~14 meses**
- LTV positivo se cliente fica ≥ 14 meses

**Prós:**
- Entrada acessível (~smartphone médio popular).
- Barreira psicológica baixa.
- Sem fidelidade obrigatória = menos fricção de venda.
- Margem boa ano 2+.

**Contras:**
- Depende fortemente de retenção pra dar lucro.
- Subsídio de R$900 por device precisa de funding ou capex próprio.
- Risco se churn médio < 14 meses.

### 4.4 Modelo D — Freemium app + Premium hardware

- App grátis no celular: tutor básico, 10 min/dia limitado.
- Hardware Lery: R$999 + R$79/mês para experiência ilimitada.
- App vira funil de aquisição pro hardware.

**Prós:**
- Topo de funil amplo via app gratuito.
- Monetização gradual.

**Contras:**
- Dispersa foco do MVP.
- App canibaliza diferencial do hardware (smart speaker).
- Custo de manter duas plataformas com qualidade.

**Não recomendado para MVP.** Considerar pós-1.000 usuários no hardware.

---

## 5. Estrutura de tiers (independente do modelo)

| Plano | Preço/mês | Para quem |
|-------|-----------|-----------|
| **Solo Mensal** | R$89 | 1 perfil, 1 device |
| **Solo Anual** | R$69/mês (R$828/ano cobrado à vista ou 12×) | desconto ~22% pra commit |
| **Família Mensal** | R$129 | até 4 perfis no mesmo device, progresso individual |
| **Família Anual** | R$99/mês (R$1.188/ano) | desconto ~23% pra commit |

**Trial:**
- **7 dias grátis** após receber hardware.
- Não usar 30 dias — opex API queimando seria caro (R$30–50 por usuário em trial).
- 7 dias é tempo suficiente para wow + onboarding + 1ª lesson completa.

---

## 6. Formas de pagamento essenciais no BR

| Método | Prioridade | Notas |
|--------|-----------|-------|
| Cartão crédito recorrente | **Crítica** | Base de recorrência. Stripe / Pagar.me / Iugu |
| Cartão crédito parcelado (hardware) | **Crítica** | Sem 12× sem juros, vendas de hardware caem ~60% |
| PIX recorrente (Open Finance) | **Alta** | BACEN já habilita PIX automático em 2026. Captura não-bancarizado e quem evita cartão |
| PIX one-time anual | **Alta** | Cliente paga R$828 à vista — oferecer **5% off (R$786)** como incentivo |
| Boleto | **Média** | Apenas para hardware ou anual. **Nunca para mensal recorrente** — taxa de inadimplência destrói LTV |
| Apple Pay / Google Pay | **Média** | Conversão mobile sobe ~15% |
| Mercado Pago / PicPay | **Baixa** | Nicho, mas inclui não-bancarizado e jovens |

**Gateways recomendados:**
- **Pagar.me** ou **Iugu** — recorrência nativa + PIX recorrente + parcelamento bem suportados.
- **Stripe BR** funciona, mas suporte a PIX recorrente é inferior.

---

## 7. Mecânicas de retenção que afetam o pricing

Pricing não é só preço — é também política. Mecânicas que reduzem churn ou aumentam LTV:

- **Pause subscription** (até 60 dias/ano) — reduz churn voluntário. Custo zero (device offline = $0 API).
- **Family upgrade**: cliente Solo + 3 perfis adicionais = +R$40 sobre Solo. Aumenta LTV sem CAC novo.
- **Referral**: indicação dá 1 mês grátis para os dois lados — CAC subsidiado por LTV.
- **Anual com cashback**: cliente paga anual, recebe R$100 em "lery credits" para hardware novo / acessórios. Ancora retenção em ciclo de 12 meses.
- **Win-back**: cliente cancelou? Oferta de 50% off por 3 meses para reativação.

---

## 8. Recomendação final

### MVP / primeiros 100–1.000 usuários: **Modelo C (Híbrido subsidiado)**

- **Hardware:** R$599 (parcelado 10× R$59.90 sem juros)
- **Sub Solo:** R$89/mês ou R$69/mês anual
- **Sub Família:** R$129/mês ou R$99/mês anual
- **Trial:** 7 dias após receber device
- **Pagamento:** cartão crédito + PIX recorrente + PIX anual com 5% off

### Razões para escolher Modelo C

1. **R$599 é barreira aceitável** — smartphone médio popular, parcelável.
2. **R$89/mês cabe no orçamento** de classe média que já paga curso de inglês (300–500/mês).
3. **Margem ano 2+ é boa** (R$1.068/ano por cliente recorrente).
4. **Breakeven de 14 meses é tolerável** — LTV médio de cursos de inglês no BR é 18–36 meses.
5. **Sem fidelidade obrigatória reduz fricção de venda** — barreira psicológica baixíssima vs HaaS.
6. **Subsídio controlável** — para 100 clientes, capex de R$90.000 (R$900 × 100). Viável sem funding pesado.

### Pivô futuro (≥1.000 users)

- Avaliar **Modelo B (HaaS)** como **tier de aquisição agressiva** (sem entrada, R$149/mês), mantendo Modelo C como tier premium "compra + sub mais barata".
- Considerar **Modelo D (freemium app)** como funil de topo após hardware ter brand recognition.

---

## 9. Indicadores a monitorar para ajustar pricing

Para decidir reajustes futuros, instrumentar:

- **CAC** (custo de aquisição por cliente — anúncios, sales, indicação)
- **Churn mensal** (% de cancelamento por mês)
- **LTV** (receita total média por cliente até cancelar)
- **LTV/CAC** (alvo: ≥ 3)
- **Payback period** (meses até recuperar CAC + subsídio de hardware)
- **NPS pós-30 dias** (correlaciona com churn futuro)
- **Heavy vs light user split** (afeta custo médio de API)
- **% pagamento à vista vs parcelado** (afeta fluxo de caixa)

Sem esses indicadores, qualquer reajuste de pricing é chute. Dashboards desde o cliente número 1.

---

## 10. Decisões em aberto para discutir

Pontos que precisam de definição antes de cada modelo ir ao mercado:

1. **Capex para subsidiar hardware** — fundador banca? Funding? Pré-venda com Kickstarter-like?
2. **Logística reversa** — se cliente devolve, quem paga frete? Política clara.
3. **Inadimplência cartão** — política de retentativa (3 tentativas em 7 dias) e quando bloquear device.
4. **PIX recorrente em 2026** — quão maduro está? Vale apostar dia 1 ou esperar cartão estável?
5. **Plano Família requer 1 ou múltiplos devices?** — define se é tier de upgrade simples ou produto novo.
6. **Política de pause** — cliente pode pausar quantas vezes? Mínimo de meses pagos antes de poder pausar?
7. **Garantia hardware** — 1 ano BR padrão. Política de troca de device defeituoso clara.
8. **Preço diferenciado por região?** — interior BR paga menos? Complica operações, evitar no MVP.

---

## 11. Conclusão

Pricing recomendado para MVP:

> **Hardware R$599 (parcelado 10×) + Assinatura Solo R$89/mês (ou R$69 anual) + Família R$129/mês (ou R$99 anual). Trial 7 dias. Pagamento via cartão recorrente, PIX recorrente e PIX anual com 5% off.**

Esse pricing posiciona o Lery como **alternativa premium ao Duolingo e alternativa acessível ao Cambly**, num espaço de mercado pouco ocupado no BR. Margem ano 2+ é saudável. Barreira de entrada é gerenciável. Risco principal é retenção abaixo de 14 meses — mitigado por mecânicas de pause, referral e família.

Documento serve como referência. Ajustar conforme dados reais de CAC, churn e uso aparecerem.
