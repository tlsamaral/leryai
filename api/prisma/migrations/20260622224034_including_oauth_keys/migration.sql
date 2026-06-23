/*
  Warnings:

  - You are about to drop the column `lastSeen` on the `Device` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiKey]` on the table `Device` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "ConversationSession" ADD COLUMN     "lessonId" TEXT;

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "lastSeen",
ADD COLUMN     "apiKey" TEXT;

-- AlterTable
ALTER TABLE "InteractionLog" ADD COLUMN     "disputeStatus" "DisputeStatus",
ADD COLUMN     "evaluationReasoning" TEXT,
ADD COLUMN     "fluency" INTEGER,
ADD COLUMN     "grammar" INTEGER,
ADD COLUMN     "isDisputed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taskAchievement" INTEGER,
ADD COLUMN     "totalScore" INTEGER,
ADD COLUMN     "vocabulary" INTEGER;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "isGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "objectives" TEXT;

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isGenerated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "diagnosisCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleId" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nativeLanguage" TEXT NOT NULL DEFAULT 'pt-BR',
    "interests" TEXT[],
    "hobbies" TEXT[],
    "occupation" TEXT,
    "ageGroup" TEXT,
    "learningGoal" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "topError" TEXT NOT NULL,
    "topProgress" TEXT NOT NULL,
    "openTopic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerProfileSnapshot" (
    "userId" TEXT NOT NULL,
    "recentErrors" JSONB NOT NULL DEFAULT '[]',
    "dominatedStructures" JSONB NOT NULL DEFAULT '[]',
    "openTopics" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnerProfileSnapshot_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionInsight_sessionId_key" ON "SessionInsight"("sessionId");

-- CreateIndex
CREATE INDEX "SessionInsight_userId_createdAt_idx" ON "SessionInsight"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Device_apiKey_key" ON "Device"("apiKey");

-- CreateIndex
CREATE INDEX "Device_apiKey_idx" ON "Device"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationSession" ADD CONSTRAINT "ConversationSession_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
