import type {
  DeviceSettingsResponse,
  LearningMapResponse,
  LessonResultDetailResponse,
  ProfileResponse,
} from '../types/api'
import type { User } from '../types/domain'

const now = new Date()

export const mockUser: User = {
  id: 'user-1',
  name: 'Talles Amaral',
  email: 'talles@lery.ai',
  avatarUrl: null,
}

export const mockMap: LearningMapResponse = {
  level: 'A1',
  modules: [
    {
      id: 'module-1',
      name: 'Daily Basics',
      description: 'Small talk and day-to-day situations',
      order: 1,
      lessons: [
        {
          id: 'lesson-1',
          title: 'Coffee Shop',
          scenario: 'Ordering drinks politely',
          order: 1,
          status: 'COMPLETED',
          score: 84,
          attempts: 2,
          isCurrent: false,
        },
        {
          id: 'lesson-2',
          title: 'Introducing Yourself',
          scenario: 'First conversation with a new friend',
          order: 2,
          status: 'IN_PROGRESS',
          score: 68,
          attempts: 1,
          isCurrent: true,
        },
        {
          id: 'lesson-3',
          title: 'At the Grocery Store',
          scenario: 'Asking for products and prices',
          order: 3,
          status: 'LOCKED',
          score: 0,
          attempts: 0,
          isCurrent: false,
        },
      ],
    },
    {
      id: 'module-2',
      name: 'Travel Moments',
      description: 'Situations when moving around the city',
      order: 2,
      lessons: [
        {
          id: 'lesson-4',
          title: 'Taking a Taxi',
          scenario: 'Giving destination details',
          order: 1,
          status: 'LOCKED',
          score: 0,
          attempts: 0,
          isCurrent: false,
        },
        {
          id: 'lesson-5',
          title: 'At the Hotel',
          scenario: 'Check-in and room requests',
          order: 2,
          status: 'LOCKED',
          score: 0,
          attempts: 0,
          isCurrent: false,
        },
      ],
    },
  ],
}

export const basePromptByLesson: Record<string, string> = {
  'lesson-1': 'Guide the learner through polite ordering interactions.',
  'lesson-2': 'Focus on introductions, greetings, and confidence building.',
  'lesson-3': 'Practice price and quantity questions naturally.',
  'lesson-4': 'Train concise destination and route communication.',
  'lesson-5': 'Train check-in flow with common requests and clarifications.',
}

export const promptOverrides: Record<string, string> = {
  'lesson-2': 'Keep answers short and correct grammar in a friendly tone.',
}

export const resultsByLesson: Record<string, LessonResultDetailResponse> = {
  'lesson-1': {
    lessonId: 'lesson-1',
    lessonTitle: 'Coffee Shop',
    attempts: [
      {
        session: {
          id: 'session-1',
          userId: 'user-1',
          lessonId: 'lesson-1',
          mode: 'GUIDED_LESSON',
          startedAt: new Date(
            now.getTime() - 1000 * 60 * 60 * 24 * 3,
          ).toISOString(),
          endedAt: new Date(
            now.getTime() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 12,
          ).toISOString(),
        },
        score: 79,
        feedbackSummary:
          'Good clarity. Work on article usage and prepositions.',
        logs: [
          {
            id: 'log-1',
            sessionId: 'session-1',
            userAudioTrans: 'Can I have one cappuccino and one cookie?',
            leryResponse:
              'Great sentence! You can also say: May I have a cappuccino and a cookie?',
            grammaticalFixes: 'Use "a cookie" for singular countable noun.',
            sentimentScore: 0.9,
            taskAchievement: 22,
            grammar: 18,
            vocabulary: 20,
            fluency: 19,
            totalScore: 79,
            evaluationReasoning:
              'User successfully ordered (task achieved). Minor article error with singular noun. Good vocabulary for A2. Fluency is natural.',
            isDisputed: false,
            disputeStatus: null,
            createdAt: new Date(
              now.getTime() - 1000 * 60 * 60 * 24 * 3,
            ).toISOString(),
          },
        ],
      },
      {
        session: {
          id: 'session-2',
          userId: 'user-1',
          lessonId: 'lesson-1',
          mode: 'GUIDED_LESSON',
          startedAt: new Date(
            now.getTime() - 1000 * 60 * 60 * 24 * 2,
          ).toISOString(),
          endedAt: new Date(
            now.getTime() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 14,
          ).toISOString(),
        },
        score: 84,
        feedbackSummary: 'Excellent politeness and better pacing.',
        logs: [
          {
            id: 'log-2',
            sessionId: 'session-2',
            userAudioTrans: 'Could I get a latte, please?',
            leryResponse: 'Perfect! Natural and polite.',
            grammaticalFixes: 'No fixes needed.',
            sentimentScore: 0.95,
            taskAchievement: 25,
            grammar: 22,
            vocabulary: 21,
            fluency: 16,
            totalScore: 84,
            evaluationReasoning:
              'Perfect polite request structure. All grammar correct. Vocabulary appropriate for B1. Slight hesitation noted before "please".',
            isDisputed: false,
            disputeStatus: null,
            createdAt: new Date(
              now.getTime() - 1000 * 60 * 60 * 24 * 2,
            ).toISOString(),
          },
        ],
      },
    ],
  },
  'lesson-2': {
    lessonId: 'lesson-2',
    lessonTitle: 'Introducing Yourself',
    attempts: [
      {
        session: {
          id: 'session-3',
          userId: 'user-1',
          lessonId: 'lesson-2',
          mode: 'GUIDED_LESSON',
          startedAt: new Date(
            now.getTime() - 1000 * 60 * 60 * 10,
          ).toISOString(),
          endedAt: new Date(
            now.getTime() - 1000 * 60 * 60 * 10 + 1000 * 60 * 8,
          ).toISOString(),
        },
        score: 68,
        feedbackSummary:
          'Good confidence. Review present simple and question order.',
        logs: [
          {
            id: 'log-3',
            sessionId: 'session-3',
            userAudioTrans: 'I am from Brazil and I work with design.',
            leryResponse:
              'Very good! Try adding one hobby to sound more natural.',
            grammaticalFixes: 'Use "work in design" or "work as a designer".',
            sentimentScore: 0.88,
            taskAchievement: 18,
            grammar: 15,
            vocabulary: 17,
            fluency: 18,
            totalScore: 68,
            evaluationReasoning:
              'Good communication of origin and job. Preposition error with "work with design". Vocabulary adequate. Fluency shows confidence.',
            isDisputed: false,
            disputeStatus: null,
            createdAt: new Date(
              now.getTime() - 1000 * 60 * 60 * 10,
            ).toISOString(),
          },
        ],
      },
    ],
  },
}

export const mockProfile: ProfileResponse = {
  profile: {
    id: 'profile-1',
    nativeLanguage: 'pt-BR',
    interests: ['music', 'technology', 'travel'],
    hobbies: ['reading', 'gaming'],
    occupation: 'Product Designer',
    ageGroup: 'adult',
    learningGoal: 'travel',
  },
  streak: {
    currentStreak: 7,
    longestStreak: 18,
    lastActiveDate: now.toISOString(),
  },
  devices: [],
}

export const validPairingCode = 'LERY-PAIR-001'

export const mockDeviceSettingsByDeviceId: Record<
  string,
  DeviceSettingsResponse
> = {
  'device-1': {
    deviceId: 'device-1',
    settings: {
      voiceTone: 'warm',
      speechSpeed: 1,
      listeningSensitivity: 0.62,
      autoListen: true,
      wakeWordEnabled: true,
    },
    updatedAt: now.toISOString(),
  },
}
