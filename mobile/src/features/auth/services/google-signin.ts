import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { appConfig } from '../../../shared/config/app-config'

let configured = false

function ensureConfigured() {
  if (configured) return
  console.log('configured', appConfig)
  if (!appConfig.google.webClientId) {
    throw new Error(
      'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is missing — set it in your .env',
    )
  }
  GoogleSignin.configure({
    webClientId: appConfig.google.webClientId,
    iosClientId: appConfig.google.iosClientId || undefined,
    offlineAccess: false,
    scopes: ['profile', 'email'],
  })
  configured = true
}

export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Sign-in cancelled by user')
    this.name = 'GoogleSignInCancelledError'
  }
}

export interface GoogleSignInResult {
  idToken: string
  email: string
  name: string | null
  photo: string | null
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  ensureConfigured()

  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    })
    const response = await GoogleSignin.signIn()
    console.log(response)
    // RNGS v13+: response is { type: 'success' | 'cancelled', data }
    if (response.type === 'cancelled') {
      throw new GoogleSignInCancelledError()
    }

    const { idToken, user } = response.data
    if (!idToken) {
      throw new Error('Google did not return an idToken')
    }

    return {
      idToken,
      email: user.email,
      name: user.name,
      photo: user.photo,
    }
  } catch (err) {
    if (err instanceof GoogleSignInCancelledError) throw err
    const code = (err as { code?: string }).code
    if (
      code === statusCodes.SIGN_IN_CANCELLED ||
      code === statusCodes.IN_PROGRESS
    ) {
      throw new GoogleSignInCancelledError()
    }
    throw err
  }
}

export async function signOutFromGoogle(): Promise<void> {
  ensureConfigured()
  try {
    await GoogleSignin.signOut()
  } catch {
    // ignore — user might not be signed in to Google
  }
}
