# 🧠 Lery AI - Central Brain (MOC)

Bem-vindo ao **Brain** do ecossistema **Lery IA**. Este documento funciona como o *Map of Content* (MOC) principal, centralizando todas as ramificações do projeto, desde a concepção acadêmica até as especificações de hardware, software e banco de dados.

A proposta central do Lery IA é criar um **Ecossistema Híbrido** (IoT + Mobile) para o ensino de inglês, atuando na redução da "ansiedade de fala" (*Foreign Language Speaking Anxiety*) através de um ambiente de baixo julgamento e alta personalização.

---

## 📂 1. Índice de Documentação (Módulos do Projeto)

Abaixo estão os links para os pilares do projeto. Acesse cada um para aprofundamento técnico e conceitual:

*   🎓 **[[TCC]]**: Fundamentação teórica, referências bibliográficas, resumo e abstração acadêmica da proposta do LeryIA.
*   ⚙️ **[[Lery AI]]**: Especificações do hardware (Raspberry Pi, ReSpeaker), Máquina de Estados (FSM) e fluxo de dados (Whisper -> Gemini -> ElevenLabs).
*   💡 **[[Identificação]]**: O conceito por trás do nome "Hey Lery", justificativas de processamento de sinal (DSP) para a *Wake Word* e mapeamento dos LEDs de feedback.
*   🤖 **[[System Prompt Lery]]**: Diretrizes da persona da Lery, regras de *Code-Switching* (uso de suporte em português) e modos operacionais da IA (Free Talk vs Guided).
*   📊 **[[Lógica-LMS-Avaliação]]**: O "cérebro" pedagógico. Regras de pontuação (Scoring de 0-100), estrutura baseada no CEFR, modos de onboarding e lógica de progressão.
*   📚 **[[Metodologias de Ensino]]**: Embasamento científico e teorias educacionais (CLT, TBLT, Filtro Afetivo e Scaffolding) que orientam a IA.
*   📏 **[[Critérios de Avaliação]]**: Matriz de rubrica para o motor do LLM, dividindo o Scoring em 4 pilares (Resolução, Gramática, Vocabulário e Fluência).
*   📑 **[[Artigos e Referências - Avaliação]]**: Base científica e referências (AES/ASS, Prompt Engineering e ACF) para fundamentar os critérios da IA.
*   🔄 **[[Fluxograma de Avaliação]]**: Adaptação do framework GradeHITL em 3 fases (Grading, Inquiring e Optimizing) para a arquitetura do Lery IA.
*   📱 **[[LinkedIn - Linha do Tempo]]**: Planejamento de postagens "Build in Public" para validação de mercado, portfólio e histórico de evolução.
*   🎨 **[[Identidade Visual e Logo]]**: Psicologia das cores, tipografia e diretrizes de design minimalista para a interface do ecossistema Lery.
*   🗺️ **[[Scheme]]**: Diagramas visuais e fluxos do projeto.

---

## 🏗️ 2. Visão Geral do Ecossistema

O sistema é dividido em três camadas principais que trabalham em sincronia:

1.  **Hardware (IoT Smart Speaker):** Dispositivo físico baseado em Raspberry Pi, sem tela, focado apenas na conversação. Conta com processamento de borda para a *Wake Word* e comunicação na nuvem para NLP.
2.  **App Mobile (Dashboard & LMS):** Aplicativo para acompanhamento, revisão de transcrições, gestão de assinatura, configuração de voz/personalidade da Lery e exibição do progresso do aluno.
3.  **Backend (Nuvem & IA):** Banco de dados relacional (PostgreSQL), processamento do LLM (Gemini 3.1 / 1.5 Flash), conversão de áudio (十一Labs e OpenAI Whisper).

---

## 🗄️ 3. Modelagem de Dados (Banco de Dados / Prisma)

O projeto mobile e backend conta com um schema estruturado em PostgreSQL utilizando o Prisma ORM. O modelo reflete a lógica de gamificação, avaliação e hardware IoT.

### 🔹 Enums Globais
*   `UserLevel`: Padrão europeu CEFR (A1 a C2).
*   `SubscriptionStatus`: Gestão de acesso (ACTIVE, PAST_DUE, CANCELED, EXPIRED).
*   `LessonStatus`: Controle de progressão (LOCKED, IN_PROGRESS, REVIEW_REQUIRED, COMPLETED).
*   `InteractionMode`: Contexto da IA (FREE_TALK, GUIDED_LESSON, DIAGNOSIS).

### 🔹 Domínio de Usuário e Segurança
*   **User & UserProfile**: Armazena as credenciais, o idioma alvo e as configurações de personalização (interesses, ocupação, faixa etária) fundamentais para a IA gerar cenários mais realistas.
*   **Device**: Relaciona o identificador físico (Hardware ID / Serial Number do Raspberry Pi) ao usuário logado, com uma API Key para acesso imutável.
*   **Subscription**: Gestão de planos de pagamento e validade do acesso.

### 🔹 Domínio Pedagógico (LMS)
A estrutura de ensino segue a hierarquia: `Language` -> `Level` -> `Module` -> `Lesson`.
*   As lições (`Lesson`) possuem um `systemPrompt` individual, permitindo customizar a persona da Lery por contexto (ex: *At the Airport*).
*   Existe a *flag* `isGenerated` nos Módulos e Lições, indicando o uso de IA gerativa para escalar a criação de conteúdo dinâmico baseado no perfil do usuário.

### 🔹 Domínio de Progressão e Sessões (Métricas)
*   **UserProgress**: Armazena as tentativas, bloqueios e o `score`. Se a pontuação passar de 70 (Regra dos 70%), o status muda para `COMPLETED`.
*   **ConversationSession & InteractionLog**: O "coração" da avaliação. Guarda o modo de interação, a transcrição da fala do usuário (`userAudioTrans`), a resposta da Lery (`leryResponse`) e o log de correções (`grammaticalFixes`). Inclui também a análise de sentimento (`sentimentScore`) para entender o engajamento emocional do usuário e a eficácia na redução de ansiedade.

---

## 🚀 4. Próximos Passos e Integração

1.  **Sincronização de Banco de Dados:** Criar a API REST ou GraphQL que permitirá que o script Python embarcado na Raspberry Pi consuma os dados de `Lesson` (System Prompts) e poste os resultados no `InteractionLog`.
2.  **Desenvolvimento do App Mobile:** Integrar a autenticação de usuário e a tela de pareamento Bluetooth/Wi-Fi com o objeto `Device`.
3.  **Testes de Campo (Hardware):** Avaliar a latência de ponta a ponta (Mic -> Whisper -> Gemini -> ElevenLabs -> Speaker) e a fluidez da máquina de estados definida em `[[Lery AI]]`.