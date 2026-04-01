const dataSourceEnv = process.env.EXPO_PUBLIC_DATA_SOURCE

export const appConfig = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3333',
  dataSource: dataSourceEnv === 'http' ? 'http' : 'mock',
} as const

export type DataSourceMode = (typeof appConfig)['dataSource']
