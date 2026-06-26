# Estratégia Mobile — Integração com API, Auth Google e Padrões de Loading

> Documento de execução para integrar o app Expo com a API real, usando React Query como camada única de cache de servidor, Google como único método de auth, e padrão unificado de loading state. Complementa `Arquitetura IA - Visão e Migração.md` e `Estratégia GTM - Desktop App e Canal de Professores.md`.

**Data:** 2026-06-22
**Escopo:** Apenas `mobile/` ↔ `api/`. Não toca `core/`, `agent/`, nem desktop/whatsapp.
**Estado de partida:** mobile com base sólida (React Query instalado, abstração `LeryApi` mock/http, Zustand, SecureStore) mas auth fake com `idToken: 'mock-google-token'` e sem revalidação de token.

---

## 1. Diagnóstico do estado atual

### Mobile (`mobile/`)
- ✅ `@tanstack/react-query` 5.96 — instalado, `QueryClient` registrado em `src/app/_layout.tsx`
- ✅ `zustand` 5.x — session store em `features/auth/store/session-store.ts`
- ✅ `expo-secure-store` — persistência criptografada em `features/auth/services/session-storage.ts`
- ✅ Abstração `LeryApi` (interface) com implementações `MockLeryApi` e `HttpLeryApi`
- ✅ Toggle `appConfig.dataSource` (mock | http) via `EXPO_PUBLIC_DATA_SOURCE`
- ❌ `useAuthViewModel` chama `authGoogle({ idToken: 'mock-google-token' })` — não há fluxo Google real
- ❌ Sem auto-refresh em 401
- ❌ Sem revalidação de token no boot do app
- ❌ Sem route guard declarativo — redirect manual depende do componente
- ❌ Sem padrão unificado de loading state — cada tela trata `isPending/error` na mão

### API (`api/`)
- ✅ Email/senha auth (`authenticate-with-password`, `create-account`)
- ✅ `/token/refresh` PATCH com cookie httpOnly
- ✅ `@fastify/jwt` configurado, access token expira em 1h, refresh em 3d
- ❌ Sem endpoint `/auth/google`
- ❌ `User.passwordHash` é `String` obrigatório — não comporta Google-only
- ❌ Sem `User.googleId` para dedupe por `sub` do Google
- ❌ Sem endpoint `GET /me` para revalidação de sessão

---

## 2. Objetivos

1. **Google Auth como único método** (remove ou deprecia email/senha).
2. **JWT access (1h) + refresh (30d)** em SecureStore.
3. **Revalidação automática** no boot via `GET /me`.
4. **Auto-refresh transparente em 401** com dedupe de chamadas concorrentes.
5. **React Query como única fonte de verdade do cache de servidor** — Zustand fica só pra session/UI state.
6. **Loading state padronizado**: 1 hook + 1 componente, 4 estados (idle / loading / error / data).
7. **Route guard declarativo** com `expo-router` baseado em `isAuthenticated`.

---

## 3. Arquitetura alvo

```
┌────────────────────────────────────────────────────────────┐
│                   Mobile App (Expo + Router)               │
├────────────────────────────────────────────────────────────┤
│  RootLayout                                                │
│  ├─ QueryClientProvider (config global: staleTime, retry)  │
│  ├─ SessionBootstrap   (carrega refreshToken, valida /me)  │
│  └─ AuthGuard          (redirect por route group)          │
│                                                            │
│  features/auth/                                            │
│  ├─ services/google-signin.ts   (native @react-native-...) │
│  ├─ services/session-storage.ts (SecureStore wrapper)      │
│  ├─ services/http-client.ts     (fetch + refresh dedupe)   │
│  ├─ store/session-store.ts      (zustand: tokens + user)   │
│  └─ hooks/                                                 │
│     ├─ use-sign-in.ts           (mutation Google)          │
│     ├─ use-sign-out.ts                                     │
│     └─ use-me.ts                (query revalidação)        │
│                                                            │
│  shared/api/                                               │
│  ├─ http-api.ts        (LeryApi implementation HTTP)       │
│  ├─ query-keys.ts      (factories tipadas)                 │
│  ├─ provider.ts        (escolhe http vs mock)              │
│  └─ types.ts                                               │
│                                                            │
│  shared/components/                                        │
│  ├─ async-boundary.tsx (loading + error + retry unified)   │
│  ├─ skeleton.tsx                                           │
│  └─ error-state.tsx                                        │
└────────────────────────────────────────────────────────────┘
                              │ HTTPS (Bearer JWT)
                              ▼
┌────────────────────────────────────────────────────────────┐
│                       API (Fastify)                        │
├────────────────────────────────────────────────────────────┤
│  POST /auth/google     (verify idToken → JWT pair)         │
│  GET  /me              (validate JWT, return user)         │
│  PATCH /token/refresh  (existente)                         │
└────────────────────────────────────────────────────────────┘
```

---

## 4. Token strategy

- **Access token** — JWT assinado pela API, expira **1h**, fica em **memória** (Zustand). Performance e zero leak de longo prazo.
- **Refresh token** — JWT longo, expira **30d**, fica em **SecureStore** (encrypted). Nunca em estado React.
- **Google idToken** — efêmero. Só usado uma vez na chamada `POST /auth/google`, descartado em seguida.

### Boot flow
```
App start
  ├─ SessionBootstrap monta
  ├─ Carrega refreshToken do SecureStore
  ├─ Se existe:
  │   └─ PATCH /token/refresh com refresh
  │       ├─ sucesso → seta access em memória, chama GET /me, hidrata user
  │       └─ falha   → limpa SecureStore, redireciona /auth
  └─ Sem refresh → /auth
```

### Refresh dedupe
HTTP client guarda 1 promise em curso. Várias chamadas paralelas que respondem 401 esperam a mesma promise. Após resolver: retentam original 1 vez. Flag `__retry` previne loop infinito.

---

## 5. Google Auth — decisão técnica

**Escolha:** `@react-native-google-signin/google-signin` (não `expo-auth-session`).

**Por quê:**
- UX nativa (modal Google nativo, biometria do device).
- Funciona com Expo dev client (SDK 54+).
- `expo-auth-session` exige browser interno, mais fricção e mais código.
- Native module dá API mais limpa e menos edge cases.

**Tradeoff:** quebra Expo Go. Precisa de Expo dev client. Projeto já vai precisar mesmo pra outras nativas no futuro (`expo-camera` já está). Custo aceito.

### Fluxo end-to-end
```
1. mobile chama GoogleSignin.signIn() → idToken
2. mobile: POST /auth/google { idToken }
3. API: google-auth-library verifica idToken (audience = WEB_CLIENT_ID)
4. API: extrai sub, email, name, picture
5. API: find-or-create User (deduplica por googleId, fallback email)
6. API: gera JWT pair, retorna { token, refreshToken, user }
7. mobile: persiste refreshToken em SecureStore, access em memória
8. mobile: AuthGuard detecta isAuthenticated, redireciona /(tabs)/home
```

### Configuração Google Cloud Console
- Criar OAuth 2.0 Client IDs:
  - **Web** (audience verificado pela API)
  - **iOS** (bundle id do app)
  - **Android** (package name + SHA-1)
- Em produção: SHA-1 de cada keystore (debug, release, Play Console)
- Variáveis de env do app:
  - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
  - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- API:
  - `GOOGLE_WEB_CLIENT_ID` (mesma que mobile usa como audience)

---

## 6. React Query patterns

### Query keys tipados e centralizados
```ts
// shared/api/query-keys.ts
export const queryKeys = {
  me: ['me'] as const,
  progress: { current: ['progress', 'current'] as const },
  learning: { map: ['learning', 'map'] as const },
  lessons: {
    result: (lessonId: string) => ['lessons', 'result', lessonId] as const,
  },
  results: { list: ['results', 'list'] as const },
  profile: ['profile'] as const,
  devices: {
    settings: (deviceId: string) =>
      ['devices', deviceId, 'settings'] as const,
  },
} as const
```

### Hook pattern por recurso
```ts
// features/lessons/hooks/use-learning-map.ts
export function useLearningMap() {
  return useQuery({
    queryKey: queryKeys.learning.map,
    queryFn: () => getLeryApi().getLearningMap(),
    staleTime: 5 * 60 * 1000,
  })
}
```

### Mutation com cache invalidation
```ts
export function useRetryLesson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (lessonId: string) => getLeryApi().retryLesson(lessonId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.learning.map })
      qc.invalidateQueries({ queryKey: queryKeys.progress.current })
    },
  })
}
```

### QueryClient config global
```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: (failureCount, error) => {
        if (error instanceof HttpError && error.status < 500) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false, // mobile sem foco
    },
    mutations: { retry: false },
  },
})
```

---

## 7. Loading state pattern

### Filosofia
Toda tela que depende de dado externo passa pelo `AsyncBoundary`. Tela nunca lida com `isPending/error` na mão.

```tsx
// shared/components/async-boundary.tsx
interface Props<T> {
  query: UseQueryResult<T>
  children: (data: T) => ReactNode
  loading?: ReactNode
  error?: (err: Error, retry: () => void) => ReactNode
  empty?: (data: T) => boolean
  emptyState?: ReactNode
}
```

Uso:
```tsx
const learningMap = useLearningMap()
return (
  <AsyncBoundary query={learningMap}>
    {(data) => <LearningMapView data={data} />}
  </AsyncBoundary>
)
```

Tela pode customizar skeleton via `loading` prop. Caso geral usa `<Skeleton />`.

---

## 8. HTTP client com refresh automático

Pontos críticos:

- **Auto-refresh em 401**: client tenta refresh, retenta original.
- **Dedupe**: 1 promise de refresh em curso; chamadas paralelas reusam.
- **`__retry` flag**: previne loop infinito caso retry também falhe.
- **Erro fatal de refresh**: limpa SecureStore + Zustand, propaga erro pra `AsyncBoundary` ou `AuthGuard` direcionar.

---

## 9. Route guard

```tsx
function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapped } = useSessionStore()
  const segments = useSegments()

  useEffect(() => {
    if (!isBootstrapped) return
    const inAuthGroup = segments[0] === 'auth'
    if (!isAuthenticated && !inAuthGroup) router.replace('/auth')
    else if (isAuthenticated && inAuthGroup) router.replace('/(tabs)/home')
  }, [isAuthenticated, isBootstrapped, segments])

  if (!isBootstrapped) return <SplashScreen />
  return <>{children}</>
}
```

---

## 10. Plano de execução em 5 ondas

### Onda 1 — API ready (2 dias)
- Migration: `User.passwordHash` opcional + `User.googleId String? @unique` + `User.avatarUrl String?`
- Endpoint `POST /auth/google` — verifica idToken via `google-auth-library`, find-or-create, retorna JWT pair
- Endpoint `GET /me` — retorna user + currentLevel + diagnosisCompleted
- Decisão: manter ou remover `authenticate-with-password` + `create-account`

### Onda 2 — Mobile foundation (2 dias)
- `HttpClient` com refresh dedupe (em `features/auth/services/http-client.ts`)
- `query-keys.ts` centralizado
- `QueryClient` config global
- `AsyncBoundary` + `Skeleton` + `ErrorState`

### Onda 3 — Google Auth real (2 dias)
- Setup `@react-native-google-signin/google-signin` + Expo dev client
- Client IDs (web + iOS + Android) no Google Cloud Console
- `useSignIn`, `useSignOut`, `useMe`

### Onda 4 — Route guard + bootstrap (1 dia)
- `SessionBootstrap` no `_layout.tsx`
- `AuthGuard` por `useSegments()`
- Refator de `auth.tsx` pra usar `useSignIn`

### Onda 5 — Migrar features (3-5 dias)
- Por feature: hook (query/mutation), substituir mock, envolver UI em `AsyncBoundary`
- Manter `MockLeryApi` pra dev sem rede e testes

---

## 11. Decisões em aberto

1. **Google native vs expo-auth-session** — recomendação: native. Aceita Expo dev client.
2. **Refresh rotativo (gera novo a cada uso) ou estático?** MVP: estático TTL 30d. Rotativo na Onda 6 se preocupado com replay.
3. **Manter email/senha como fallback?** Recomendação: remover ou deprecar. Simplifica suporte.
4. **Apple Sign-In em paralelo?** App Store exige se houver Google em iOS. Adicionar antes de submeter pra review.
5. **Pré-fetch no boot?** Após login: `/me`, `/learning/map`, `/progress/current`. Reduz spinner inicial. Faz na Onda 5.
6. **Telemetria de erros?** Sentry / PostHog. Antes de produção.
7. **Offline mode?** React Query persister + `react-native-mmkv`? Fora do MVP — produto exige rede pra IA.

---

## 12. Tradeoffs honestos

- **Native Google Sign-In quebra Expo Go.** Force dev client. Avise team.
- **Refresh dedupe é sutil** — bug clássico se errado. Vale teste unitário.
- **Apple Sign-In vai cair na revisão da App Store** se publicar com Google. Adicione na fase 2.
- **`/me` no boot adiciona ~200-500ms ao splash.** Aceitável; mostra splash bonito.
- **`MockLeryApi` continua útil** mesmo após migração — pra dev sem API rodando.

---

## 13. Conclusão

Estratégia entrega:
- Auth Google funcional ponta-a-ponta com revalidação automática.
- Camada de cache de servidor unificada via React Query.
- Padrão de loading que escala — não duplica código por tela.
- HTTP client robusto a 401 com dedupe.
- Route guard declarativo separado do código da tela.

Pode parar em qualquer onda sem regredir o que já funciona. Recomenda execução incremental: Ondas 1-4 são fundação; Onda 5 (migrar features) entrega valor por incremento e pode ser distribuída.
