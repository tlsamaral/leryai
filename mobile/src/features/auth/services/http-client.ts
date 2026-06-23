import { HttpError } from '../../../shared/api/http-errors'
import { appConfig } from '../../../shared/config/app-config'
import { useSessionStore } from '../store/session-store'
import {
  clearStoredRefreshToken,
  loadStoredRefreshToken,
  saveStoredRefreshToken,
} from './session-storage'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  // Skips Authorization injection — used by /auth/google itself.
  anonymous?: boolean
  // Internal flag set by retry path. Do not pass from app code.
  __retry?: boolean
}

interface RefreshResponse {
  token: string
  refreshToken: string
}

export class HttpClient {
  private refreshPromise: Promise<boolean> | null = null

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    }

    if (!options.anonymous) {
      const token = useSessionStore.getState().accessToken
      if (token) headers.Authorization = `Bearer ${token}`
    }

    const url = `${appConfig.apiBaseUrl}${path}`
    const init: RequestInit = {
      method: options.method ?? 'GET',
      headers,
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    }

    let response: Response
    try {
      response = await fetch(url, init)
    } catch (err) {
      throw new HttpError(
        0,
        err instanceof Error ? err.message : 'Network error',
      )
    }

    if (response.status === 401 && !options.anonymous && !options.__retry) {
      const refreshed = await this.tryRefresh()
      if (refreshed) {
        return this.request<T>(path, { ...options, __retry: true })
      }
      useSessionStore.getState().clearSession()
      void clearStoredRefreshToken()
      throw new HttpError(401, 'Session expired')
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '')
      let body: unknown
      try {
        body = JSON.parse(text)
      } catch {
        body = text
      }
      throw new HttpError(
        response.status,
        typeof body === 'object' && body && 'message' in body
          ? String((body as { message: unknown }).message)
          : text || `HTTP ${response.status}`,
        body,
      )
    }

    if (response.status === 204) return undefined as T
    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      return undefined as T
    }
    return (await response.json()) as T
  }

  // Deduplicates concurrent refresh attempts — first 401 triggers the call,
  // others await the same promise.
  private async tryRefresh(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise

    this.refreshPromise = this._refresh().finally(() => {
      this.refreshPromise = null
    })

    return this.refreshPromise
  }

  private async _refresh(): Promise<boolean> {
    const refresh = await loadStoredRefreshToken()
    if (!refresh) return false

    try {
      const res = await fetch(`${appConfig.apiBaseUrl}/auth/token/refresh`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${refresh}`,
          'Content-Type': 'application/json',
        },
      })
      if (!res.ok) return false
      const data = (await res.json()) as RefreshResponse
      useSessionStore.getState().updateTokens({
        accessToken: data.token,
        refreshToken: data.refreshToken,
      })
      await saveStoredRefreshToken(data.refreshToken)
      return true
    } catch {
      return false
    }
  }
}

export const httpClient = new HttpClient()
