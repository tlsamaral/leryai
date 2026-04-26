# 🗄️ Arquitetura de Banco de Dados (Prisma Schema)

Este documento centraliza a modelagem de dados do ecossistema **Lery IA**, conectando o hardware (Raspberry Pi), o aplicativo mobile e o backend de avaliação. 

O banco de dados utiliza **PostgreSQL** e é gerenciado via **Prisma ORM**. A estrutura foi desenhada para suportar:
1. Gestão de Identidade e Assinaturas.
2. Controle de Hardware IoT (Smart Speaker).
3. Sistema de Gestão de Aprendizado (LMS) parametrizado por Níveis CEFR.
4. Histórico de Conversação e Correção Gramatical para métricas de progresso.

---

## 💻 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/lib/prisma-client"
}

datasource db {
  provider = "postgresql"
}

// --- ENUMS PARA CONSISTÊNCIA ---

enum UserLevel {
  A1
  A2
  B1
  B2
  C1
  C2
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  EXPIRED
}

enum LessonStatus {
  LOCKED
  IN_PROGRESS
  REVIEW_REQUIRED
  COMPLETED
}

enum InteractionMode {
  FREE_TALK
  GUIDED_LESSON
  DIAGNOSIS
}

// --- MODELOS DE NEGÓCIO ---

model Language {
  id        String   @id @default(uuid())
  code      String   @unique // ex: 'en-US', 'pt-BR', 'es-ES'
  name      String   // ex: 'English', 'Portuguese', 'Spanish'
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  // Relações
  levels Level[]
  users  User[]  @relation("UserTargetLanguage")

  @@index([code])
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  username     String    @unique
  passwordHash String
  name         String
  currentLevel UserLevel @default(A1)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  // Idioma que o utilizador está a estudar no momento
  targetLanguageId String?
  targetLanguage   Language? @relation("UserTargetLanguage", fields: [targetLanguageId], references: [id])

  // Relações
  profile       UserProfile?
  devices       Device[]
  subscriptions Subscription[]
  progress      UserProgress[]
  sessions      ConversationSession[]
  modules       Module[]

  @@index([email])
}

model Subscription {
  id        String             @id @default(uuid())
  userId    String
  user      User               @relation(fields: [userId], references: [id])
  status    SubscriptionStatus @default(EXPIRED)
  planType  String             // e.g., "Premium", "Basic"
  expiresAt DateTime
  createdAt DateTime           @default(now())

  @@index([userId, status])
}

model Device {
  id           String  @id @default(uuid())
  serialNumber String  @unique // Identificação única física (HWID da Raspberry Pi)
  nickname     String? // Nome dado pelo utilizador
  isActive     Boolean @default(true)
  userId       String
  user         User    @relation(fields: [userId], references: [id])
  apiKey       String? @unique // Token imutável longo para IoT

  @@index([serialNumber, isActive])
  @@index([apiKey])
}

model UserProfile {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  nativeLanguage String   @default("pt-BR") // Idioma nativo do aluno
  interests      String[] // ex: ["music", "travel", "technology"]
  hobbies        String[] // ex: ["gaming", "cooking"]
  occupation     String?  // Profissão — ajuda a contextualizar cenários
  ageGroup       String?  // ex: "teen", "adult", "senior"
  learningGoal   String?  // ex: "travel", "work", "academic"
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Level {
  id          String    @id @default(uuid())
  code        UserLevel
  description String?

  // Relação com Idioma
  languageId String
  language   Language @relation(fields: [languageId], references: [id])

  modules Module[]

  // Garante que só existe um nível 'B1' para 'English', outro para 'Spanish', etc.
  @@unique([code, languageId])
}

model Module {
  id          String   @id @default(uuid())
  name        String
  description String?
  order       Int      // Ordem de progressão dentro do nível
  isGenerated Boolean  @default(false) // Gerado automaticamente pela IA
  levelId     String
  level       Level    @relation(fields: [levelId], references: [id])
  userId      String?  // Vinculado a um usuário específico (se personalizado)
  user        User?    @relation(fields: [userId], references: [id])
  lessons     Lesson[]
}

model Lesson {
  id           String                @id @default(uuid())
  title        String
  scenario     String                // Ex: "At the Airport"
  systemPrompt String                @db.Text // Contexto específico para o Gemini
  objectives   String?               @db.Text // Objetivos pedagógicos da lição
  order        Int                   // Ordem dentro do módulo
  isGenerated  Boolean               @default(false) // Gerada automaticamente pela IA
  moduleId     String
  module       Module                @relation(fields: [moduleId], references: [id])
  userProgress UserProgress[]
  sessions     ConversationSession[]
}

model UserProgress {
  id       String @id @default(uuid())
  userId   String
  lessonId String
  user     User   @relation(fields: [userId], references: [id])
  lesson   Lesson @relation(fields: [lessonId], references: [id])

  score       Int          @default(0) // Regra dos 70% para COMPLETED
  status      LessonStatus @default(LOCKED)
  attempts    Int          @default(0)
  lastAttempt DateTime     @updatedAt

  @@unique([userId, lessonId])
  @@index([userId, status])
}

model ConversationSession {
  id           String           @id @default(uuid())
  userId       String
  user         User             @relation(fields: [userId], references: [id])
  mode         InteractionMode
  lessonId     String?          // Vincula sessão guiada à lição específica
  lesson       Lesson?          @relation(fields: [lessonId], references: [id])
  startedAt    DateTime         @default(now())
  endedAt      DateTime?
  interactions InteractionLog[]

  @@index([userId])
}

model InteractionLog {
  id               String              @id @default(uuid())
  sessionId        String
  session          ConversationSession @relation(fields: [sessionId], references: [id])
  userAudioTrans   String?             @db.Text
  leryResponse     String?             @db.Text
  grammaticalFixes String?             @db.Text // Feedback detalhado da IA
  sentimentScore   Float?              // Análise de engajamento
  createdAt        DateTime            @default(now())
}
```

---

## 📌 Principais Relacionamentos e Fluxos

1. **Gestão de Perfil (`UserProfile`)**: Essencial para a personalização. A IA lê os `interests`, `hobbies` e `occupation` para gerar conversas engajadoras.
2. **Integração de Hardware (`Device`)**: O dispositivo IoT autentica-se na API utilizando um `apiKey` associado ao `serialNumber`, garantindo segurança na nuvem.
3. **Mapeamento Pedagógico (`Level` -> `Module` -> `Lesson`)**: O usuário avança por módulos hierárquicos, controlados pela tabela `UserProgress`.
4. **Armazenamento de Diálogo (`InteractionLog`)**: Permite que o app mobile recupere o histórico da conversa para o usuário revisar suas correções de pronúncia e gramática.