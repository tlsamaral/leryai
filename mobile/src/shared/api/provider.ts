import { appConfig } from '../config/app-config'
import { MockLeryApi } from '../mocks/mock-api'
import { HttpLeryApi } from './http-api'
import type { LeryApi } from './types'

const api: LeryApi =
  appConfig.dataSource === 'http' ? new HttpLeryApi() : new MockLeryApi()

export function getLeryApi(): LeryApi {
  return api
}
