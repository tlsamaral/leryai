const dataSourceEnv = process.env.EXPO_PUBLIC_DATA_SOURCE

export const appConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3333',
  dataSource: dataSourceEnv === 'http' ? 'http' : 'mock',
  google: {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  },
} as const

export type DataSourceMode = (typeof appConfig)['dataSource']
