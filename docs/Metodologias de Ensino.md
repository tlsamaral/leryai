> 🧠 **Voltar para o MOC Principal:** [[Lery AI Brain]]

# 📚 Metodologias de Ensino e Embasamento Pedagógico para Lery IA

Para que a Lery IA não seja apenas um "chatbot com voz", mas sim uma ferramenta educacional eficaz com embasamento científico para o seu TCC, é fundamental ancorar o funcionamento da IA em metodologias de ensino de línguas (ESL/EFL) validadas e reconhecidas.

Abaixo estão as metodologias e teorias que mais se alinham à sua proposta de **conversação, baixa ansiedade e uso de IA**.

---

## 1. Abordagem Comunicativa (Communicative Language Teaching - CLT)

A **CLT** é a metodologia mais aceita mundialmente para o ensino moderno de idiomas. 
* **O Conceito:** O foco não é a perfeição gramatical isolada, mas sim a capacidade de se comunicar e transmitir significado. O erro é visto como parte natural do processo comunicativo.
* **Como a Lery aplica:** No modo **Free Talk**, a Lery não interrompe o fluxo de fala do aluno para corrigir um verbo errado na hora (o que gera ansiedade). Ela foca no significado, mantém o engajamento e faz a correção gramatical ("Grammatical Fixes") de forma assíncrona ou gentil ao final da resposta.

## 2. Ensino de Línguas Baseado em Tarefas (Task-Based Language Teaching - TBLT)

O **TBLT** é um desdobramento da Abordagem Comunicativa.
* **O Conceito:** O aprendizado ocorre quando o aluno usa o idioma para completar uma tarefa do mundo real, em vez de apenas memorizar vocabulário.
* **Como a Lery aplica:** Este é o coração do modo **Guided Lesson**. A Lery propõe uma tarefa clara (ex: "Faça o check-in no hotel", "Peça um café sem açúcar"). O progresso do aluno (a Regra dos 70%) é medido pela capacidade de concluir a tarefa e se fazer entender pelo "atendente" (a IA).

## 3. Hipótese do Filtro Afetivo (Stephen Krashen)

Esta não é uma metodologia prática, mas sim uma **teoria de aquisição de linguagem** que é a *espinha dorsal teórica do seu TCC*.
* **O Conceito:** Stephen Krashen propõe que existe um "Filtro Afetivo" (formado por ansiedade, medo e falta de confiança). Se o filtro estiver alto (o aluno está ansioso), o cérebro bloqueia a aquisição do idioma. Se o filtro estiver baixo, o aprendizado flui.
* **Como a Lery aplica:** A Lery IA ataca diretamente o Filtro Afetivo. Sendo um ambiente sem julgamento humano (não há professor impaciente nem colegas avaliando), sem câmeras, e utilizando as luzes de LED (computação afetiva) para transmitir calma, a IA abaixa drasticamente o filtro afetivo do usuário, permitindo o destrave da fala.

## 4. Teoria do Scaffolding (Vygotsky / Bruner)

* **O Conceito:** *Scaffolding* (andaime) é o suporte temporário oferecido por um tutor para ajudar o aluno a alcançar um nível de compreensão que ele não conseguiria sozinho. À medida que o aluno evolui, o suporte é retirado.
* **Como a Lery aplica:** No System Prompt da Lery, você definiu o uso de "Hints" (Dicas) e o *Code-Switching* temporário para o português (a Rede de Segurança). Se o aluno "trava", a IA fornece o andaime (dica ou tradução), ajuda-o a subir o degrau, e depois retira o suporte encorajando-o a continuar em inglês.

## 5. Avaliação Automatizada com Interpretabilidade (Automated Grading & CoT)

* **O Conceito:** Avaliações conduzidas por LLMs (Large Language Models) não devem apenas "dar uma nota", mas seguir um raciocínio lógico estruturado (*Chain-of-Thought* ou CoT) baseado em rubricas predefinidas para garantir transparência e precisão próxima à humana, conforme demonstrado no framework *GradeHITL* (Chu et al., 2025).
* **Como a Lery aplica:** A Lery utiliza prompts de avaliação baseados em 4 pilares (Resolução da Tarefa, Gramática, Vocabulário e Fluência). Ao gerar o JSON de progresso com um campo `grammaticalFixes` justificando a pontuação, o sistema ganha **Interpretabilidade** metodológica, assegurando que o aluno compreenda o motivo de sua avaliação e receba feedback acionável no dashboard mobile.

---

## 🔍 Termos e Autores para Pesquisar no Google Scholar (Para o TCC)

Se precisar buscar artigos científicos para enriquecer o referencial teórico do TCC, utilize estas palavras-chave de busca:

1. **Para CLT & TBLT com IA:** 
   * *"Task-based language teaching using AI chatbots"*
   * *"Communicative competence and conversational AI"*
2. **Para a Teoria do Filtro Afetivo (O Mais Importante para você):** 
   * *"Stephen Krashen Affective Filter Hypothesis"*
   * *"Reducing foreign language speaking anxiety through human-computer interaction"*
   * *"Low-stakes environment in second language speaking"*
3. **Para Scaffolding com Agentes Virtuais:** 
   * *"Pedagogical agents and scaffolding in language learning"*
   * *"Automated corrective feedback in EFL"*

---
**Dica de Arquitetura:** Você pode cruzar essas metodologias com o arquivo `[[Lógica-LMS-Avaliação]]`. Por exemplo, garantir que as Lições do Banco de Dados sejam modeladas como "Tarefas" (TBLT) em vez de simples "Tópicos de Gramática".