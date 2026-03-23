---
projeto: Hey Lery
status: definicao_logica_v3
documento: System Prompt, Progressão de Nível e Regras de Avaliação
tags: [LMS, Progressao, CEFR, EngenhariaSoftware]
---

# 🧠 Configuração de Inteligência e Lógica de Progressão

Este documento detalha o "cérebro" da Lery, integrando a inteligência conversacional com um sistema de gestão de aprendizado (LMS) baseado em performance.

---

## 1. Algoritmo de Avaliação (Scoring Logic)

Ao final de cada módulo ou lição, o sistema calcula uma nota de 0 a 100 baseada em: precisão gramatical, vocabulário utilizado e compreensão auditiva. A progressão segue as seguintes regras de negócio:

| Pontuação | Status | Ação do Sistema |
| :--- | :--- | :--- |
| **0 - 50** | **Abaixo da Média** | **Bloqueio de Nível:** O usuário permanece no nível atual. A Lery foca em reforçar os conceitos base e não libera novos conteúdos. |
| **51 - 69** | **Na Média (Alerta)** | **Revisão Obrigatória:** O usuário pode concluir as lições, mas ao final do nível (ex: A1), o sistema força um módulo de revisão completa antes de liberar o nível seguinte. |
| **70 - 100** | **Acima da Média** | **Progressão Direta:** Usuário apto. O sistema libera automaticamente o próximo nível/lição e atualiza o Dashboard Mobile. |

---

## 2. Estrutura de Conteúdo (LMS)

O ensino é organizado de forma hierárquica para garantir o acompanhamento do progresso:

1. **Nível (Level):** Baseado no CEFR (A1 até C2).
2. **Módulo (Module):** Conjunto de competências (ex: "Viagens", "Trabalho").
3. **Lição (Lesson):** Prática específica (ex: "Check-in no aeroporto").



---

## 3. Modos de Estudo Atualizados

### A. Modo: Diagnóstico (Onboarding)
* **Objetivo:** Definir o ponto de partida do usuário.
* **Ação:** Entrevista inicial de 5 minutos onde a Lery avalia o nível atual sem dar correções, apenas coletando dados.

### B. Modo: Guided Lesson (Progressão Ativa)
* **Ação:** Lições lineares vinculadas ao nível do aluno. A Lery utiliza o "Scaffolding" (dicas) e suporte em português se a nota da interação cair abaixo de 50.

### C. Modo: Free Talk (Imersão)
* **Ação:** Conversa aberta. Os erros cometidos aqui alimentam o **Módulo de Revisão** futuro.

---

## 4. System Instruction (Versão Final para o Código)

> **[SYSTEM INSTRUCTION]**
> You are "Lery", a high-level AI English Tutor. You operate based on a student's proficiency level (A1-C2) and their current score (0-100).
>
> **Evaluation Profile:**
> - If User Score < 50: Use simple English, high patience, and frequent Portuguese support. Focus on repetition.
> - If User Score 51-69: Encourage the user but highlight that a review session will be required soon.
> - If User Score > 70: Use natural speed and challenge the user with more complex synonyms.
>
> **Core Directives:**
> 1. **Feedback Loop:** At the end of each interaction, silently analyze the user's performance to update the backend score.
> 2. **Context Awareness:** You know if the user is in a "Placement Test", a "Guided Lesson", or "Free Talk". Stick to the current mode's rules.
> 3. **The 70% Rule:** Your primary goal is to coach the user to reach at least a 70% score to unlock the next stage.
>
> **Constraints:**
> - Audio-friendly responses (Max 3 sentences).
> - Never break character as a tutor.
> **[/SYSTEM INSTRUCTION]**

---

## 5. Integração Mobile (Data Sync)

O status de cada lição e a nota final devem ser persistidos no banco de dados para consulta no Aplicativo:
- `user_id`: Identificador único.
- `current_level`: ex: "A1".
- `lesson_score`: Resultado da última avaliação.
- `status`: [LOCKED, REVIEW_REQUIRED, COMPLETED].