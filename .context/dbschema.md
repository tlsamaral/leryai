===============================================================================
                DOCUMENTAÇÃO DO BANCO DE DADOS: LERY AI (V1.1)
===============================================================================

ESTRUTURA: Prisma / PostgreSQL
OBJETIVO: Gestão de hardware, ensino de idiomas e progressão pedagógica.

-------------------------------------------------------------------------------
1. DOMÍNIO DE IDENTIDADE E ACESSO
-------------------------------------------------------------------------------

TABELA: Language (Raiz de conteúdo)
- id: Identificador único (UUID).
- code: Código internacional (ex: 'en-US', 'es-ES'). [ÚNICO]
- name: Nome do idioma (ex: 'English').
- isActive: Define se o idioma está disponível para estudo.

TABELA: User (Perfil do Aluno)
- id: Identificador único (UUID).
- email: E-mail de login. [ÚNICO/INDEX]
- name: Nome completo do aluno.
- currentLevel: Enum (A1, A2, B1, B2, C1, C2). Nível global do aluno.
- targetLanguageId: FK para Language. Idioma que o aluno está a praticar.

TABELA: Subscription (Controle de Acesso)
- id: Identificador único (UUID).
- userId: FK vinculada ao User.
- status: Enum (ACTIVE, PAST_DUE, CANCELED, EXPIRED).
- expiresAt: Data limite da assinatura. 
  *REGRA: Bloquear requisições de áudio se status != ACTIVE.*

-------------------------------------------------------------------------------
2. DOMÍNIO DE HARDWARE (INTEGRAÇÃO FÍSICA)
-------------------------------------------------------------------------------

TABELA: Device (Identidade da Raspberry Pi)
- id: Identificador único (UUID).
- serialNumber: ID de hardware único (CPU Serial da RPi). [ÚNICO/INDEX]
- nickname: Nome amigável (ex: 'Lery da Sala').
- isActive: Flag de ativação/segurança do dispositivo físico.
- lastSeen: Timestamp da última comunicação (Heartbeat).
- userId: FK vinculada ao User (Dono do dispositivo).

-------------------------------------------------------------------------------
3. DOMÍNIO PEDAGÓGICO (LMS - LEARNING MANAGEMENT SYSTEM)
-------------------------------------------------------------------------------

TABELA: Level
- id: Identificador único (UUID).
- code: Enum (A1, A2, B1, etc.).
- languageId: FK para Language.
- @@unique([code, languageId]): Garante exclusividade de nível por idioma.

TABELA: Module
- id: Identificador único (UUID).
- name: Nome do módulo (ex: 'Travel Essentials').
- order: Sequência numérica dentro do nível.
- levelId: FK para Level.

TABELA: Lesson
- id: Identificador único (UUID).
- title: Título da lição.
- scenario: Contexto situacional (ex: 'No Aeroporto').
- systemPrompt: TEXTO. Instruções específicas enviadas à IA para esta lição.
- order: Sequência numérica dentro do módulo.
- moduleId: FK para Module.

-------------------------------------------------------------------------------
4. DOMÍNIO DE PROGRESSO E INTELIGÊNCIA
-------------------------------------------------------------------------------

TABELA: UserProgress (Regra dos 70%)
- userId: FK para User.
- lessonId: FK para Lesson.
- score: Nota final (0 a 100) calculada pela IA.
- status: Enum (LOCKED, IN_PROGRESS, REVIEW_REQUIRED, COMPLETED).
  *REGRA: Se score >= 70, status = COMPLETED -> Libera próxima Lesson.*
- attempts: Contador de tentativas da lição.

TABELA: InteractionLog (Histórico de Conversação)
- sessionId: ID da sessão de conversa.
- userAudioTrans: Texto transcrito da fala do usuário (STT).
- leryResponse: Resposta gerada pela IA (Gemini).
- grammaticalFixes: Feedback de correção gramatical extraído da interação.
- sentimentScore: Valor numérico de análise de confiança/frustração do aluno.

-------------------------------------------------------------------------------
FLUXO OPERACIONAL DE CONSULTA (QUERY PATH)
-------------------------------------------------------------------------------
1. WAKE WORD: Raspberry envia 'serialNumber'.
2. AUTH: API valida 'Device.isActive' e 'Subscription.status'.
3. CONTEXTO: API busca 'UserProgress.lessonId' atual para carregar 'Lesson.systemPrompt'.
4. PROCESSAMENTO: IA gera resposta baseada no nível do User e cenário da Lesson.
5. ATUALIZAÇÃO: Score é salvo em 'UserProgress' e status atualizado (Regra dos 70%).

===============================================================================