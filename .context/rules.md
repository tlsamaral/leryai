===============================================================================
                    ESPECIFICAÇÃO TÉCNICA E REGRAS: LERY AI
===============================================================================

1. IDENTIDADE E CONCEITO
-------------------------------------------------------------------------------
Nome do Projeto: Lery AI
Objetivo: Smart Speaker autônomo para ensino de conversação em inglês.
Público-Alvo: Estudantes nível B1 (Intermediário).
Wake Word: "Hey Lery" (Padrão fonético otimizado para DSP).

2. HARDWARE (CONFIGURAÇÃO FINAL)
-------------------------------------------------------------------------------
Processamento: Raspberry Pi 3 Model B (Headless - Sem tela).
Entrada de Áudio: Microfone USB Lelong LE-705 (Haste flexível/Omnidirecional).
Saída de Áudio:
  - Módulo Amplificador Digital PAM8403 (5V).
  - Alto-falante Interno 4 Ohms 3W (57mm).
  - Conexão: Saída P2 (Jack 3.5mm) da RPi conectada à entrada do módulo.
Feedback Visual: Anel de LED RGB WS2812B (12 ou 16 LEDs).
Energia: Fonte Micro-USB 5V 3A estável.

3. MAPA DE FIAÇÃO E PINAGEM (GPIO)
-------------------------------------------------------------------------------
- Anel de LED (VCC): Pino 04 (5V)
- Anel de LED (GND): Pino 09 (Ground)
- Anel de LED (DATA): Pino 12 (GPIO 18 - PWM)
- Amplificador (VCC): Pino 02 (5V)
- Amplificador (GND): Pino 06 (Ground)
- Microfone: Qualquer porta USB-A disponível.

4. REGRAS DE NEGÓCIO E ACESSO
-------------------------------------------------------------------------------
- Identificação Única: Cada dispositivo possui um Serial Number único (HWID).
- Ativação: O device só processa voz se 'isActive' for TRUE no banco de dados.
- Assinatura: O usuário deve possuir uma subscrição ACTIVE e dentro da validade.
- Multi-Device: Um usuário pode possuir múltiplos devices associados à conta.

5. LÓGICA PEDAGÓGICA (LMS) E PROGRESSÃO
-------------------------------------------------------------------------------
Níveis Suportados: A1, A2, B1, B2, C1, C2.
Regra de Ouro (70%):
  - Pontuação 0-50: Bloqueio de nível. Foco em repetição e suporte em PT-BR.
  - Pontuação 51-69: Alerta de Revisão. Permite avançar, mas exige review posterior.
  - Pontuação 70-100: Progressão Direta. Desbloqueia a próxima lição/módulo.

Modos de Operação:
  - Free Talk: Conversa natural, correções gramaticais apenas ao final.
  - Guided Lesson: Cenários fixos (ex: aeroporto), fornece "hints" (dicas).
  - Diagnosis: Teste de nivelamento para ajuste de parâmetros da IA.

6. DIRETRIZES DA IA (SYSTEM PROMPT)
-------------------------------------------------------------------------------
Persona: Lery, tutora paciente, amigável e encorajadora.
Restrições de Resposta:
  - Máximo de 3 sentenças por interação (otimização para TTS).
  - Idioma: 95% Inglês. Switch para Português apenas em caso de falha crítica.
  - Feedback Loop: Silenciosamente analisar gramática e vocabulário para scoring.

7. MODELAGEM DE DADOS (PRISMA SCHEMA)
-------------------------------------------------------------------------------
Principais Tabelas:
- User: Perfil, e-mail, nível atual.
- Device: SerialNumber, isActive, userId.
- Subscription: Status (ACTIVE/PAST_DUE), expiresAt.
- UserProgress: Score (0-100), lessonStatus (LOCKED/COMPLETED).
- InteractionLog: