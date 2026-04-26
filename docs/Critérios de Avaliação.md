> 🧠 **Voltar para o MOC Principal:** [[Lery AI Brain]]

# 📏 Critérios de Avaliação e Scoring (Rubrica da Lery)

Para que a avaliação da Lery não seja genérica ou baseada em "achismos" do modelo fundacional (LLM), o sistema de notas precisa seguir uma **Rubrica de Avaliação** padronizada. 

A metodologia escolhida para o motor de avaliação da Lery é baseada nos padrões de testes internacionais (como IELTS e TOEFL) e no **CEFR** (Quadro Europeu Comum de Referência para Línguas), adaptada para o contexto de Inteligência Artificial.

---

## 1. Os 4 Pilares da Avaliação (Matriz de Competências)

Para compor a nota de **0 a 100**, a Lery deve avaliar internamente o áudio transcrito do usuário dividindo a análise em 4 critérios, cada um valendo 25 pontos. 

### A. Resolução da Tarefa (Task Achievement / Pragmatics) - *25 pts*
* **O que mede:** A capacidade de comunicação prática baseada no TBLT (*Task-Based Language Teaching*). O aluno conseguiu passar a mensagem desejada?
* **Critério IA:** Se o cenário era "Pedir um café", e o aluno disse "Me want coffee black", a gramática está ruim, mas o objetivo prático (se fazer entender) foi atingido.
* **Peso:** Alto no modo *Guided Lesson*.

### B. Precisão Gramatical (Grammatical Accuracy) - *25 pts*
* **O que mede:** O uso correto da estrutura da língua de acordo com o nível atual do usuário (A1 a C2).
* **Critério IA:** A Lery deve perdoar erros complexos se o aluno for A1, focando apenas em erros estruturais básicos (ex: omitir o verbo "to be"). Se o aluno for B2, a Lery pune erros de conjugação mais sutis e falta de complexidade sintática.

### C. Recurso Lexical (Vocabulary / Lexical Resource) - *25 pts*
* **O que mede:** A variedade e adequação das palavras usadas.
* **Critério IA:** O aluno repete muito as mesmas palavras? Ele consegue buscar sinônimos quando não lembra o termo exato? Ele usa vocabulário compatível com o cenário do módulo?

### D. Fluência e Coerência (Fluency & Coherence) - *25 pts*
* **O que mede:** O fluxo da fala e a conexão lógica entre as ideias.
* **Critério IA:** Como a IA (Gemini) analisa apenas texto, a fluência aqui é medida pela lógica das respostas. O aluno responde prontamente ao que foi perguntado ou foge do assunto? Há uso de conectivos (*and, because, but*)? 
* **Nota sobre Pronúncia:** A pronúncia é avaliada na primeira camada do sistema (Hardware/Whisper). Se o modelo de _Speech-to-Text_ (Whisper) conseguiu entender e transcrever com alta confiança, a pronúncia é classificada como "inteligível".

---

## 2. Instrução de Avaliação (System Prompt de Scoring)

Para forçar a IA a usar essa metodologia, o motor do Gemini não deve apenas responder com texto, mas também gerar um JSON de avaliação em _background_ após cada lição. 

**Exemplo de Injeção no Prompt para a Avaliação (Fim da Sessão):**

> **[EVALUATION DIRECTIVE]**
> The current session has ended. You must now act as an official CEFR language evaluator. Analyze the user's overall performance in this session based on the following rubric:
> 
> 1. **Task Achievement (0-25):** Did the user fulfill the communicative goal?
> 2. **Grammar (0-25):** Consider the user's level is [A1]. Penalize only basic structural errors.
> 3. **Vocabulary (0-25):** Did the user use appropriate words for the context?
> 4. **Fluency (0-25):** Were the responses logically connected?
> 
> Output ONLY a JSON string with the scores, the total sum (0-100), and a brief string of 'grammaticalFixes' highlighting the main mistakes for the user's dashboard.
> **[/EVALUATION DIRECTIVE]**

---

## 3. Dinâmica de Progresso (Integração com o Banco de Dados)

O JSON gerado pela IA utilizando os critérios acima alimenta diretamente a entidade `UserProgress` e `InteractionLog` do seu banco de dados:

1. **Se a Soma < 50:** O sistema interpreta falha nos 4 pilares. A IA recomenda repetição no app. Status `LOCKED`.
2. **Se a Soma entre 51 - 69:** O aluno atingiu o objetivo comunicativo (Pilar A), mas falhou em Gramática ou Vocabulário. Status `REVIEW_REQUIRED`.
3. **Se a Soma >= 70:** Fluência e comunicação estabelecidas adequadamente para o nível atual. O banco marca o `LessonStatus` como `COMPLETED`.