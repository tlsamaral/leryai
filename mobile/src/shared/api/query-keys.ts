export const queryKeys = {
  me: ['me'] as const,
  progress: {
    current: ['progress', 'current'] as const,
  },
  learning: {
    map: ['learning', 'map'] as const,
  },
  lessons: {
    result: (lessonId: string) => ['lessons', 'result', lessonId] as const,
  },
  results: {
    list: ['results', 'list'] as const,
  },
  profile: ['profile'] as const,
  devices: {
    settings: (deviceId: string) => ['devices', deviceId, 'settings'] as const,
  },
} as const
