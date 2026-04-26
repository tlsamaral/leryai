> 🧠 **Voltar para o MOC Principal:** [[Lery AI Brain]]

# 📑 Artigos e Referências Científicas: Avaliação Automatizada com IA

Para validar a sua metodologia de avaliação (os 4 pilares: Resolução da Tarefa, Gramática, Vocabulário e Fluência) perante a banca do TCC, é necessário embasar a sua rubrica na literatura acadêmica de **Automated Essay/Speech Scoring (AES/ASS)** e no uso de **Large Language Models (LLMs)** para a educação.

Abaixo estão agrupamentos de temas, artigos de referência e termos de busca exatos que você deve usar no **Google Scholar**, **IEEE Xplore** ou **Scopus** para compor a bibliografia do seu TCC.

---

## 1. Avaliação Automatizada de Fala (Automated Speaking Assessment)

Este tópico justifica a divisão da nota em 4 critérios, demonstrando que a Lery segue o padrão ouro da linguística aplicada (baseado nas rubricas do IELTS e TOEFL).

*   **Busca no Google Scholar:**
    *   *"Automated speaking assessment using natural language processing"*
    *   *"Validity of automated scoring of second language speaking"*
    *   *"CEFR automated language assessment rubrics"*
*   **Conceito a defender no TCC:** Avaliadores humanos de exames de proficiência sofrem de viés e fadiga. A literatura mostra que sistemas de NLP, quando bem parametrizados com rubricas claras (como a que você criou), alcançam uma alta correlação (Reliability) com avaliadores humanos.
*   **Artigo de Referência (Exemplo):**
    *   *Zechner, K., et al. (2009).* "Automated scoring of spontaneous speech using SpeechRater". (Um clássico que mostra como a fluência, vocabulário e gramática são medidos separadamente por máquinas).

## 2. O Uso de LLMs (Gemini/GPT) para Classificação CEFR

Este tópico valida a engenharia de software do seu projeto: o uso de um *System Prompt* estruturado pedindo um output em JSON para gerar notas precisas.

*   **Busca no Google Scholar:**
    *   *"Using Large Language Models for CEFR level evaluation"*
    *   *"Prompt engineering for automated language assessment"*
    *   *"Zero-shot automated scoring of language tests with LLMs"*
*   **Conceito a defender no TCC:** Modelos fundacionais (como o Gemini 1.5/3.1) possuem conhecimento semântico profundo. Estudos recentes comprovam que, ao injetar uma rubrica detalhada via *Prompt Engineering*, os LLMs deixam de gerar respostas genéricas e passam a atuar como avaliadores consistentes para classificar a fala de A1 até C2.
*   **Artigos de Referência:**
    *   *Mizumoto, A., & Eguchi, M. (2023).* "Exploring the potential of using an AI language model for automated essay scoring". (Embora focado em texto, a base teórica da avaliação via prompt é idêntica à transcrição de áudio).
    *   *Chu, Y., et al. (2025).* "LLM-based Automated Grading with Human-in-the-Loop" (arXiv:2504.05239). Este estudo valida o uso de "Chain-of-Thought" (CoT) para justificar a pontuação baseada em rubricas, garantindo "Interpretabilidade". Demonstra que sistemas de avaliação baseados em LLM resolvem o gargalo da correção com precisão próxima à humana.

## 3. Feedback Corretivo Automatizado (Automated Corrective Feedback - ACF)

Este tópico embasa a sua decisão de salvar o campo `grammaticalFixes` no banco de dados para que o aluno veja a correção no aplicativo Mobile (revisão assíncrona), e não enquanto ele está falando com o hardware (para não aumentar o Filtro Afetivo).

*   **Busca no Google Scholar:**
    *   *"Efficacy of automated corrective feedback in language learning"*
    *   *"Asynchronous feedback and foreign language speaking anxiety"*
    *   *"Formative assessment in mobile-assisted language learning (MALL)"*
*   **Conceito a defender no TCC:** O feedback imediato e interruptivo durante a fala gera ansiedade de performance. A literatura indica que o *Feedback Formativo e Assíncrono* (fornecido em um dashboard pós-tarefa) permite que o aluno reflita sobre seus erros morfológicos e sintáticos sem o estresse do momento comunicativo.

---

## 🛠️ Como usar isso na escrita do TCC?

Quando for redigir a seção de **"Metodologia de Avaliação da IA"**, você pode formular parágrafos assim:

> *"Para mitigar a subjetividade natural dos Grandes Modelos de Linguagem (LLMs) na avaliação do progresso do usuário, o motor da Lery foi configurado utilizando técnicas de Prompt Engineering baseadas nas rubricas do Quadro Europeu Comum de Referência (CEFR). Conforme apontado por [Inserir Autor de AES], a divisão da avaliação em múltiplos pilares — como Resolução da Tarefa, Precisão Gramatical e Vocabulário — é crucial para uma medição precisa. Além disso, o sistema adota o Feedback Corretivo Automatizado (ACF) de forma assíncrona, enviando os erros gramaticais para o dashboard mobile, uma prática que, segundo [Inserir Autor sobre Filtro Afetivo], protege a autoconfiança do aluno durante a prática oral."*