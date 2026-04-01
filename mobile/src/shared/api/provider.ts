import { getAccessToken } from '../../features/auth/store/session-store'
import { appConfig } from '../config/app-config'
import { MockLeryApi } from '../mocks/mock-api'
import { HttpLeryApi } from './http-api'
import type { LeryApi } from './types'

const api: LeryApi =
  appConfig.dataSource === 'http'
    ? new HttpLeryApi(() => getAccessToken())
    : new MockLeryApi()

export function getLeryApi(): LeryApi {
  return api
}
