
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Language
 * 
 */
export type Language = $Result.DefaultSelection<Prisma.$LanguagePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model Device
 * 
 */
export type Device = $Result.DefaultSelection<Prisma.$DevicePayload>
/**
 * Model UserProfile
 * 
 */
export type UserProfile = $Result.DefaultSelection<Prisma.$UserProfilePayload>
/**
 * Model Level
 * 
 */
export type Level = $Result.DefaultSelection<Prisma.$LevelPayload>
/**
 * Model Module
 * 
 */
export type Module = $Result.DefaultSelection<Prisma.$ModulePayload>
/**
 * Model Lesson
 * 
 */
export type Lesson = $Result.DefaultSelection<Prisma.$LessonPayload>
/**
 * Model UserProgress
 * 
 */
export type UserProgress = $Result.DefaultSelection<Prisma.$UserProgressPayload>
/**
 * Model ConversationSession
 * 
 */
export type ConversationSession = $Result.DefaultSelection<Prisma.$ConversationSessionPayload>
/**
 * Model InteractionLog
 * 
 */
export type InteractionLog = $Result.DefaultSelection<Prisma.$InteractionLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserLevel: {
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
  C2: 'C2'
};

export type UserLevel = (typeof UserLevel)[keyof typeof UserLevel]


export const SubscriptionStatus: {
  ACTIVE: 'ACTIVE',
  PAST_DUE: 'PAST_DUE',
  CANCELED: 'CANCELED',
  EXPIRED: 'EXPIRED'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const LessonStatus: {
  LOCKED: 'LOCKED',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
  COMPLETED: 'COMPLETED'
};

export type LessonStatus = (typeof LessonStatus)[keyof typeof LessonStatus]


export const InteractionMode: {
  FREE_TALK: 'FREE_TALK',
  GUIDED_LESSON: 'GUIDED_LESSON',
  DIAGNOSIS: 'DIAGNOSIS'
};

export type InteractionMode = (typeof InteractionMode)[keyof typeof InteractionMode]


export const DisputeStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

export type DisputeStatus = (typeof DisputeStatus)[keyof typeof DisputeStatus]

}

export type UserLevel = $Enums.UserLevel

export const UserLevel: typeof $Enums.UserLevel

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type LessonStatus = $Enums.LessonStatus

export const LessonStatus: typeof $Enums.LessonStatus

export type InteractionMode = $Enums.InteractionMode

export const InteractionMode: typeof $Enums.InteractionMode

export type DisputeStatus = $Enums.DisputeStatus

export const DisputeStatus: typeof $Enums.DisputeStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Languages
 * const languages = await prisma.language.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Languages
   * const languages = await prisma.language.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.language`: Exposes CRUD operations for the **Language** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Languages
    * const languages = await prisma.language.findMany()
    * ```
    */
  get language(): Prisma.LanguageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.device`: Exposes CRUD operations for the **Device** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Devices
    * const devices = await prisma.device.findMany()
    * ```
    */
  get device(): Prisma.DeviceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userProfile`: Exposes CRUD operations for the **UserProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProfiles
    * const userProfiles = await prisma.userProfile.findMany()
    * ```
    */
  get userProfile(): Prisma.UserProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.level`: Exposes CRUD operations for the **Level** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Levels
    * const levels = await prisma.level.findMany()
    * ```
    */
  get level(): Prisma.LevelDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.module`: Exposes CRUD operations for the **Module** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Modules
    * const modules = await prisma.module.findMany()
    * ```
    */
  get module(): Prisma.ModuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lesson`: Exposes CRUD operations for the **Lesson** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lessons
    * const lessons = await prisma.lesson.findMany()
    * ```
    */
  get lesson(): Prisma.LessonDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userProgress`: Exposes CRUD operations for the **UserProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserProgresses
    * const userProgresses = await prisma.userProgress.findMany()
    * ```
    */
  get userProgress(): Prisma.UserProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.conversationSession`: Exposes CRUD operations for the **ConversationSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConversationSessions
    * const conversationSessions = await prisma.conversationSession.findMany()
    * ```
    */
  get conversationSession(): Prisma.ConversationSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.interactionLog`: Exposes CRUD operations for the **InteractionLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InteractionLogs
    * const interactionLogs = await prisma.interactionLog.findMany()
    * ```
    */
  get interactionLog(): Prisma.InteractionLogDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Language: 'Language',
    User: 'User',
    Subscription: 'Subscription',
    Device: 'Device',
    UserProfile: 'UserProfile',
    Level: 'Level',
    Module: 'Module',
    Lesson: 'Lesson',
    UserProgress: 'UserProgress',
    ConversationSession: 'ConversationSession',
    InteractionLog: 'InteractionLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "language" | "user" | "subscription" | "device" | "userProfile" | "level" | "module" | "lesson" | "userProgress" | "conversationSession" | "interactionLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Language: {
        payload: Prisma.$LanguagePayload<ExtArgs>
        fields: Prisma.LanguageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LanguageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LanguageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          findFirst: {
            args: Prisma.LanguageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LanguageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          findMany: {
            args: Prisma.LanguageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          create: {
            args: Prisma.LanguageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          createMany: {
            args: Prisma.LanguageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LanguageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          delete: {
            args: Prisma.LanguageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          update: {
            args: Prisma.LanguageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          deleteMany: {
            args: Prisma.LanguageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LanguageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LanguageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>[]
          }
          upsert: {
            args: Prisma.LanguageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LanguagePayload>
          }
          aggregate: {
            args: Prisma.LanguageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLanguage>
          }
          groupBy: {
            args: Prisma.LanguageGroupByArgs<ExtArgs>
            result: $Utils.Optional<LanguageGroupByOutputType>[]
          }
          count: {
            args: Prisma.LanguageCountArgs<ExtArgs>
            result: $Utils.Optional<LanguageCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubscriptionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SubscriptionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      Device: {
        payload: Prisma.$DevicePayload<ExtArgs>
        fields: Prisma.DeviceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeviceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeviceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findFirst: {
            args: Prisma.DeviceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeviceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          findMany: {
            args: Prisma.DeviceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          create: {
            args: Prisma.DeviceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          createMany: {
            args: Prisma.DeviceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeviceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          delete: {
            args: Prisma.DeviceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          update: {
            args: Prisma.DeviceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          deleteMany: {
            args: Prisma.DeviceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeviceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeviceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>[]
          }
          upsert: {
            args: Prisma.DeviceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DevicePayload>
          }
          aggregate: {
            args: Prisma.DeviceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDevice>
          }
          groupBy: {
            args: Prisma.DeviceGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeviceGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeviceCountArgs<ExtArgs>
            result: $Utils.Optional<DeviceCountAggregateOutputType> | number
          }
        }
      }
      UserProfile: {
        payload: Prisma.$UserProfilePayload<ExtArgs>
        fields: Prisma.UserProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findFirst: {
            args: Prisma.UserProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          findMany: {
            args: Prisma.UserProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          create: {
            args: Prisma.UserProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          createMany: {
            args: Prisma.UserProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          delete: {
            args: Prisma.UserProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          update: {
            args: Prisma.UserProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          deleteMany: {
            args: Prisma.UserProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>[]
          }
          upsert: {
            args: Prisma.UserProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProfilePayload>
          }
          aggregate: {
            args: Prisma.UserProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProfile>
          }
          groupBy: {
            args: Prisma.UserProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProfileCountArgs<ExtArgs>
            result: $Utils.Optional<UserProfileCountAggregateOutputType> | number
          }
        }
      }
      Level: {
        payload: Prisma.$LevelPayload<ExtArgs>
        fields: Prisma.LevelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LevelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LevelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          findFirst: {
            args: Prisma.LevelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LevelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          findMany: {
            args: Prisma.LevelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>[]
          }
          create: {
            args: Prisma.LevelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          createMany: {
            args: Prisma.LevelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LevelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>[]
          }
          delete: {
            args: Prisma.LevelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          update: {
            args: Prisma.LevelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          deleteMany: {
            args: Prisma.LevelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LevelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LevelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>[]
          }
          upsert: {
            args: Prisma.LevelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LevelPayload>
          }
          aggregate: {
            args: Prisma.LevelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLevel>
          }
          groupBy: {
            args: Prisma.LevelGroupByArgs<ExtArgs>
            result: $Utils.Optional<LevelGroupByOutputType>[]
          }
          count: {
            args: Prisma.LevelCountArgs<ExtArgs>
            result: $Utils.Optional<LevelCountAggregateOutputType> | number
          }
        }
      }
      Module: {
        payload: Prisma.$ModulePayload<ExtArgs>
        fields: Prisma.ModuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          findFirst: {
            args: Prisma.ModuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          findMany: {
            args: Prisma.ModuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          create: {
            args: Prisma.ModuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          createMany: {
            args: Prisma.ModuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          delete: {
            args: Prisma.ModuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          update: {
            args: Prisma.ModuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          deleteMany: {
            args: Prisma.ModuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ModuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          upsert: {
            args: Prisma.ModuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          aggregate: {
            args: Prisma.ModuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModule>
          }
          groupBy: {
            args: Prisma.ModuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModuleCountArgs<ExtArgs>
            result: $Utils.Optional<ModuleCountAggregateOutputType> | number
          }
        }
      }
      Lesson: {
        payload: Prisma.$LessonPayload<ExtArgs>
        fields: Prisma.LessonFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LessonFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LessonFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          findFirst: {
            args: Prisma.LessonFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LessonFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          findMany: {
            args: Prisma.LessonFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          create: {
            args: Prisma.LessonCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          createMany: {
            args: Prisma.LessonCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LessonCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          delete: {
            args: Prisma.LessonDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          update: {
            args: Prisma.LessonUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          deleteMany: {
            args: Prisma.LessonDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LessonUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LessonUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>[]
          }
          upsert: {
            args: Prisma.LessonUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LessonPayload>
          }
          aggregate: {
            args: Prisma.LessonAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLesson>
          }
          groupBy: {
            args: Prisma.LessonGroupByArgs<ExtArgs>
            result: $Utils.Optional<LessonGroupByOutputType>[]
          }
          count: {
            args: Prisma.LessonCountArgs<ExtArgs>
            result: $Utils.Optional<LessonCountAggregateOutputType> | number
          }
        }
      }
      UserProgress: {
        payload: Prisma.$UserProgressPayload<ExtArgs>
        fields: Prisma.UserProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          findFirst: {
            args: Prisma.UserProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          findMany: {
            args: Prisma.UserProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>[]
          }
          create: {
            args: Prisma.UserProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          createMany: {
            args: Prisma.UserProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>[]
          }
          delete: {
            args: Prisma.UserProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          update: {
            args: Prisma.UserProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserProgressPayload>
          }
          aggregate: {
            args: Prisma.UserProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserProgress>
          }
          groupBy: {
            args: Prisma.UserProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserProgressCountAggregateOutputType> | number
          }
        }
      }
      ConversationSession: {
        payload: Prisma.$ConversationSessionPayload<ExtArgs>
        fields: Prisma.ConversationSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConversationSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConversationSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          findFirst: {
            args: Prisma.ConversationSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConversationSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          findMany: {
            args: Prisma.ConversationSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>[]
          }
          create: {
            args: Prisma.ConversationSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          createMany: {
            args: Prisma.ConversationSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConversationSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>[]
          }
          delete: {
            args: Prisma.ConversationSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          update: {
            args: Prisma.ConversationSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          deleteMany: {
            args: Prisma.ConversationSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConversationSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConversationSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>[]
          }
          upsert: {
            args: Prisma.ConversationSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConversationSessionPayload>
          }
          aggregate: {
            args: Prisma.ConversationSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConversationSession>
          }
          groupBy: {
            args: Prisma.ConversationSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConversationSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConversationSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ConversationSessionCountAggregateOutputType> | number
          }
        }
      }
      InteractionLog: {
        payload: Prisma.$InteractionLogPayload<ExtArgs>
        fields: Prisma.InteractionLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InteractionLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InteractionLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>
          }
          findFirst: {
            args: Prisma.InteractionLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InteractionLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>
          }
          findMany: {
            args: Prisma.InteractionLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>[]
          }
          create: {
            args: Prisma.InteractionLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>
          }
          createMany: {
            args: Prisma.InteractionLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InteractionLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>[]
          }
          delete: {
            args: Prisma.InteractionLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>
          }
          update: {
            args: Prisma.InteractionLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>
          }
          deleteMany: {
            args: Prisma.InteractionLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InteractionLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InteractionLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>[]
          }
          upsert: {
            args: Prisma.InteractionLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InteractionLogPayload>
          }
          aggregate: {
            args: Prisma.InteractionLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInteractionLog>
          }
          groupBy: {
            args: Prisma.InteractionLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<InteractionLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.InteractionLogCountArgs<ExtArgs>
            result: $Utils.Optional<InteractionLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    language?: LanguageOmit
    user?: UserOmit
    subscription?: SubscriptionOmit
    device?: DeviceOmit
    userProfile?: UserProfileOmit
    level?: LevelOmit
    module?: ModuleOmit
    lesson?: LessonOmit
    userProgress?: UserProgressOmit
    conversationSession?: ConversationSessionOmit
    interactionLog?: InteractionLogOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LanguageCountOutputType
   */

  export type LanguageCountOutputType = {
    levels: number
    users: number
  }

  export type LanguageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    levels?: boolean | LanguageCountOutputTypeCountLevelsArgs
    users?: boolean | LanguageCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LanguageCountOutputType
     */
    select?: LanguageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountLevelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LevelWhereInput
  }

  /**
   * LanguageCountOutputType without action
   */
  export type LanguageCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    devices: number
    subscriptions: number
    progress: number
    sessions: number
    modules: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    devices?: boolean | UserCountOutputTypeCountDevicesArgs
    subscriptions?: boolean | UserCountOutputTypeCountSubscriptionsArgs
    progress?: boolean | UserCountOutputTypeCountProgressArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    modules?: boolean | UserCountOutputTypeCountModulesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDevicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountModulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleWhereInput
  }


  /**
   * Count Type LevelCountOutputType
   */

  export type LevelCountOutputType = {
    modules: number
  }

  export type LevelCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    modules?: boolean | LevelCountOutputTypeCountModulesArgs
  }

  // Custom InputTypes
  /**
   * LevelCountOutputType without action
   */
  export type LevelCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LevelCountOutputType
     */
    select?: LevelCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LevelCountOutputType without action
   */
  export type LevelCountOutputTypeCountModulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleWhereInput
  }


  /**
   * Count Type ModuleCountOutputType
   */

  export type ModuleCountOutputType = {
    lessons: number
  }

  export type ModuleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lessons?: boolean | ModuleCountOutputTypeCountLessonsArgs
  }

  // Custom InputTypes
  /**
   * ModuleCountOutputType without action
   */
  export type ModuleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleCountOutputType
     */
    select?: ModuleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ModuleCountOutputType without action
   */
  export type ModuleCountOutputTypeCountLessonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonWhereInput
  }


  /**
   * Count Type LessonCountOutputType
   */

  export type LessonCountOutputType = {
    userProgress: number
    sessions: number
  }

  export type LessonCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProgress?: boolean | LessonCountOutputTypeCountUserProgressArgs
    sessions?: boolean | LessonCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * LessonCountOutputType without action
   */
  export type LessonCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LessonCountOutputType
     */
    select?: LessonCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LessonCountOutputType without action
   */
  export type LessonCountOutputTypeCountUserProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgressWhereInput
  }

  /**
   * LessonCountOutputType without action
   */
  export type LessonCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationSessionWhereInput
  }


  /**
   * Count Type ConversationSessionCountOutputType
   */

  export type ConversationSessionCountOutputType = {
    interactions: number
  }

  export type ConversationSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    interactions?: boolean | ConversationSessionCountOutputTypeCountInteractionsArgs
  }

  // Custom InputTypes
  /**
   * ConversationSessionCountOutputType without action
   */
  export type ConversationSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSessionCountOutputType
     */
    select?: ConversationSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConversationSessionCountOutputType without action
   */
  export type ConversationSessionCountOutputTypeCountInteractionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteractionLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Language
   */

  export type AggregateLanguage = {
    _count: LanguageCountAggregateOutputType | null
    _min: LanguageMinAggregateOutputType | null
    _max: LanguageMaxAggregateOutputType | null
  }

  export type LanguageMinAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type LanguageMaxAggregateOutputType = {
    id: string | null
    code: string | null
    name: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type LanguageCountAggregateOutputType = {
    id: number
    code: number
    name: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type LanguageMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    isActive?: true
    createdAt?: true
  }

  export type LanguageMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    isActive?: true
    createdAt?: true
  }

  export type LanguageCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type LanguageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Language to aggregate.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Languages
    **/
    _count?: true | LanguageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LanguageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LanguageMaxAggregateInputType
  }

  export type GetLanguageAggregateType<T extends LanguageAggregateArgs> = {
        [P in keyof T & keyof AggregateLanguage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLanguage[P]>
      : GetScalarType<T[P], AggregateLanguage[P]>
  }




  export type LanguageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LanguageWhereInput
    orderBy?: LanguageOrderByWithAggregationInput | LanguageOrderByWithAggregationInput[]
    by: LanguageScalarFieldEnum[] | LanguageScalarFieldEnum
    having?: LanguageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LanguageCountAggregateInputType | true
    _min?: LanguageMinAggregateInputType
    _max?: LanguageMaxAggregateInputType
  }

  export type LanguageGroupByOutputType = {
    id: string
    code: string
    name: string
    isActive: boolean
    createdAt: Date
    _count: LanguageCountAggregateOutputType | null
    _min: LanguageMinAggregateOutputType | null
    _max: LanguageMaxAggregateOutputType | null
  }

  type GetLanguageGroupByPayload<T extends LanguageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LanguageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LanguageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LanguageGroupByOutputType[P]>
            : GetScalarType<T[P], LanguageGroupByOutputType[P]>
        }
      >
    >


  export type LanguageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
    levels?: boolean | Language$levelsArgs<ExtArgs>
    users?: boolean | Language$usersArgs<ExtArgs>
    _count?: boolean | LanguageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["language"]>

  export type LanguageSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type LanguageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "isActive" | "createdAt", ExtArgs["result"]["language"]>
  export type LanguageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    levels?: boolean | Language$levelsArgs<ExtArgs>
    users?: boolean | Language$usersArgs<ExtArgs>
    _count?: boolean | LanguageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LanguageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LanguageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LanguagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Language"
    objects: {
      levels: Prisma.$LevelPayload<ExtArgs>[]
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      name: string
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["language"]>
    composites: {}
  }

  type LanguageGetPayload<S extends boolean | null | undefined | LanguageDefaultArgs> = $Result.GetResult<Prisma.$LanguagePayload, S>

  type LanguageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LanguageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LanguageCountAggregateInputType | true
    }

  export interface LanguageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Language'], meta: { name: 'Language' } }
    /**
     * Find zero or one Language that matches the filter.
     * @param {LanguageFindUniqueArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LanguageFindUniqueArgs>(args: SelectSubset<T, LanguageFindUniqueArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Language that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LanguageFindUniqueOrThrowArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LanguageFindUniqueOrThrowArgs>(args: SelectSubset<T, LanguageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Language that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindFirstArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LanguageFindFirstArgs>(args?: SelectSubset<T, LanguageFindFirstArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Language that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindFirstOrThrowArgs} args - Arguments to find a Language
     * @example
     * // Get one Language
     * const language = await prisma.language.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LanguageFindFirstOrThrowArgs>(args?: SelectSubset<T, LanguageFindFirstOrThrowArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Languages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Languages
     * const languages = await prisma.language.findMany()
     * 
     * // Get first 10 Languages
     * const languages = await prisma.language.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const languageWithIdOnly = await prisma.language.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LanguageFindManyArgs>(args?: SelectSubset<T, LanguageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Language.
     * @param {LanguageCreateArgs} args - Arguments to create a Language.
     * @example
     * // Create one Language
     * const Language = await prisma.language.create({
     *   data: {
     *     // ... data to create a Language
     *   }
     * })
     * 
     */
    create<T extends LanguageCreateArgs>(args: SelectSubset<T, LanguageCreateArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Languages.
     * @param {LanguageCreateManyArgs} args - Arguments to create many Languages.
     * @example
     * // Create many Languages
     * const language = await prisma.language.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LanguageCreateManyArgs>(args?: SelectSubset<T, LanguageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Languages and returns the data saved in the database.
     * @param {LanguageCreateManyAndReturnArgs} args - Arguments to create many Languages.
     * @example
     * // Create many Languages
     * const language = await prisma.language.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Languages and only return the `id`
     * const languageWithIdOnly = await prisma.language.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LanguageCreateManyAndReturnArgs>(args?: SelectSubset<T, LanguageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Language.
     * @param {LanguageDeleteArgs} args - Arguments to delete one Language.
     * @example
     * // Delete one Language
     * const Language = await prisma.language.delete({
     *   where: {
     *     // ... filter to delete one Language
     *   }
     * })
     * 
     */
    delete<T extends LanguageDeleteArgs>(args: SelectSubset<T, LanguageDeleteArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Language.
     * @param {LanguageUpdateArgs} args - Arguments to update one Language.
     * @example
     * // Update one Language
     * const language = await prisma.language.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LanguageUpdateArgs>(args: SelectSubset<T, LanguageUpdateArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Languages.
     * @param {LanguageDeleteManyArgs} args - Arguments to filter Languages to delete.
     * @example
     * // Delete a few Languages
     * const { count } = await prisma.language.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LanguageDeleteManyArgs>(args?: SelectSubset<T, LanguageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Languages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Languages
     * const language = await prisma.language.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LanguageUpdateManyArgs>(args: SelectSubset<T, LanguageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Languages and returns the data updated in the database.
     * @param {LanguageUpdateManyAndReturnArgs} args - Arguments to update many Languages.
     * @example
     * // Update many Languages
     * const language = await prisma.language.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Languages and only return the `id`
     * const languageWithIdOnly = await prisma.language.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LanguageUpdateManyAndReturnArgs>(args: SelectSubset<T, LanguageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Language.
     * @param {LanguageUpsertArgs} args - Arguments to update or create a Language.
     * @example
     * // Update or create a Language
     * const language = await prisma.language.upsert({
     *   create: {
     *     // ... data to create a Language
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Language we want to update
     *   }
     * })
     */
    upsert<T extends LanguageUpsertArgs>(args: SelectSubset<T, LanguageUpsertArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Languages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageCountArgs} args - Arguments to filter Languages to count.
     * @example
     * // Count the number of Languages
     * const count = await prisma.language.count({
     *   where: {
     *     // ... the filter for the Languages we want to count
     *   }
     * })
    **/
    count<T extends LanguageCountArgs>(
      args?: Subset<T, LanguageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LanguageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Language.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LanguageAggregateArgs>(args: Subset<T, LanguageAggregateArgs>): Prisma.PrismaPromise<GetLanguageAggregateType<T>>

    /**
     * Group by Language.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LanguageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LanguageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LanguageGroupByArgs['orderBy'] }
        : { orderBy?: LanguageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LanguageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLanguageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Language model
   */
  readonly fields: LanguageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Language.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LanguageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    levels<T extends Language$levelsArgs<ExtArgs> = {}>(args?: Subset<T, Language$levelsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Language$usersArgs<ExtArgs> = {}>(args?: Subset<T, Language$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Language model
   */
  interface LanguageFieldRefs {
    readonly id: FieldRef<"Language", 'String'>
    readonly code: FieldRef<"Language", 'String'>
    readonly name: FieldRef<"Language", 'String'>
    readonly isActive: FieldRef<"Language", 'Boolean'>
    readonly createdAt: FieldRef<"Language", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Language findUnique
   */
  export type LanguageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language findUniqueOrThrow
   */
  export type LanguageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language findFirst
   */
  export type LanguageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Languages.
     */
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language findFirstOrThrow
   */
  export type LanguageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Language to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Languages.
     */
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language findMany
   */
  export type LanguageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter, which Languages to fetch.
     */
    where?: LanguageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Languages to fetch.
     */
    orderBy?: LanguageOrderByWithRelationInput | LanguageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Languages.
     */
    cursor?: LanguageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Languages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Languages.
     */
    skip?: number
    distinct?: LanguageScalarFieldEnum | LanguageScalarFieldEnum[]
  }

  /**
   * Language create
   */
  export type LanguageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The data needed to create a Language.
     */
    data: XOR<LanguageCreateInput, LanguageUncheckedCreateInput>
  }

  /**
   * Language createMany
   */
  export type LanguageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Languages.
     */
    data: LanguageCreateManyInput | LanguageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Language createManyAndReturn
   */
  export type LanguageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * The data used to create many Languages.
     */
    data: LanguageCreateManyInput | LanguageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Language update
   */
  export type LanguageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The data needed to update a Language.
     */
    data: XOR<LanguageUpdateInput, LanguageUncheckedUpdateInput>
    /**
     * Choose, which Language to update.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language updateMany
   */
  export type LanguageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Languages.
     */
    data: XOR<LanguageUpdateManyMutationInput, LanguageUncheckedUpdateManyInput>
    /**
     * Filter which Languages to update
     */
    where?: LanguageWhereInput
    /**
     * Limit how many Languages to update.
     */
    limit?: number
  }

  /**
   * Language updateManyAndReturn
   */
  export type LanguageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * The data used to update Languages.
     */
    data: XOR<LanguageUpdateManyMutationInput, LanguageUncheckedUpdateManyInput>
    /**
     * Filter which Languages to update
     */
    where?: LanguageWhereInput
    /**
     * Limit how many Languages to update.
     */
    limit?: number
  }

  /**
   * Language upsert
   */
  export type LanguageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * The filter to search for the Language to update in case it exists.
     */
    where: LanguageWhereUniqueInput
    /**
     * In case the Language found by the `where` argument doesn't exist, create a new Language with this data.
     */
    create: XOR<LanguageCreateInput, LanguageUncheckedCreateInput>
    /**
     * In case the Language was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LanguageUpdateInput, LanguageUncheckedUpdateInput>
  }

  /**
   * Language delete
   */
  export type LanguageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    /**
     * Filter which Language to delete.
     */
    where: LanguageWhereUniqueInput
  }

  /**
   * Language deleteMany
   */
  export type LanguageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Languages to delete
     */
    where?: LanguageWhereInput
    /**
     * Limit how many Languages to delete.
     */
    limit?: number
  }

  /**
   * Language.levels
   */
  export type Language$levelsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    where?: LevelWhereInput
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    cursor?: LevelWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LevelScalarFieldEnum | LevelScalarFieldEnum[]
  }

  /**
   * Language.users
   */
  export type Language$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Language without action
   */
  export type LanguageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    name: string | null
    currentLevel: $Enums.UserLevel | null
    createdAt: Date | null
    updatedAt: Date | null
    targetLanguageId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    name: string | null
    currentLevel: $Enums.UserLevel | null
    createdAt: Date | null
    updatedAt: Date | null
    targetLanguageId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    passwordHash: number
    name: number
    currentLevel: number
    createdAt: number
    updatedAt: number
    targetLanguageId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    name?: true
    currentLevel?: true
    createdAt?: true
    updatedAt?: true
    targetLanguageId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    name?: true
    currentLevel?: true
    createdAt?: true
    updatedAt?: true
    targetLanguageId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    name?: true
    currentLevel?: true
    createdAt?: true
    updatedAt?: true
    targetLanguageId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel: $Enums.UserLevel
    createdAt: Date
    updatedAt: Date
    targetLanguageId: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    currentLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    targetLanguageId?: boolean
    targetLanguage?: boolean | User$targetLanguageArgs<ExtArgs>
    profile?: boolean | User$profileArgs<ExtArgs>
    devices?: boolean | User$devicesArgs<ExtArgs>
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    progress?: boolean | User$progressArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    modules?: boolean | User$modulesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    currentLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    targetLanguageId?: boolean
    targetLanguage?: boolean | User$targetLanguageArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    currentLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    targetLanguageId?: boolean
    targetLanguage?: boolean | User$targetLanguageArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    currentLevel?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    targetLanguageId?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "passwordHash" | "name" | "currentLevel" | "createdAt" | "updatedAt" | "targetLanguageId", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    targetLanguage?: boolean | User$targetLanguageArgs<ExtArgs>
    profile?: boolean | User$profileArgs<ExtArgs>
    devices?: boolean | User$devicesArgs<ExtArgs>
    subscriptions?: boolean | User$subscriptionsArgs<ExtArgs>
    progress?: boolean | User$progressArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    modules?: boolean | User$modulesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    targetLanguage?: boolean | User$targetLanguageArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    targetLanguage?: boolean | User$targetLanguageArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      targetLanguage: Prisma.$LanguagePayload<ExtArgs> | null
      profile: Prisma.$UserProfilePayload<ExtArgs> | null
      devices: Prisma.$DevicePayload<ExtArgs>[]
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      progress: Prisma.$UserProgressPayload<ExtArgs>[]
      sessions: Prisma.$ConversationSessionPayload<ExtArgs>[]
      modules: Prisma.$ModulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      passwordHash: string
      name: string
      currentLevel: $Enums.UserLevel
      createdAt: Date
      updatedAt: Date
      targetLanguageId: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    targetLanguage<T extends User$targetLanguageArgs<ExtArgs> = {}>(args?: Subset<T, User$targetLanguageArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    profile<T extends User$profileArgs<ExtArgs> = {}>(args?: Subset<T, User$profileArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    devices<T extends User$devicesArgs<ExtArgs> = {}>(args?: Subset<T, User$devicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    subscriptions<T extends User$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, User$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    progress<T extends User$progressArgs<ExtArgs> = {}>(args?: Subset<T, User$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    modules<T extends User$modulesArgs<ExtArgs> = {}>(args?: Subset<T, User$modulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly currentLevel: FieldRef<"User", 'UserLevel'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly targetLanguageId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.targetLanguage
   */
  export type User$targetLanguageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Language
     */
    select?: LanguageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Language
     */
    omit?: LanguageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LanguageInclude<ExtArgs> | null
    where?: LanguageWhereInput
  }

  /**
   * User.profile
   */
  export type User$profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    where?: UserProfileWhereInput
  }

  /**
   * User.devices
   */
  export type User$devicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    cursor?: DeviceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * User.subscriptions
   */
  export type User$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * User.progress
   */
  export type User$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    where?: UserProgressWhereInput
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    cursor?: UserProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    where?: ConversationSessionWhereInput
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    cursor?: ConversationSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * User.modules
   */
  export type User$modulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    where?: ModuleWhereInput
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    cursor?: ModuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.SubscriptionStatus | null
    planType: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    status: $Enums.SubscriptionStatus | null
    planType: string | null
    expiresAt: Date | null
    createdAt: Date | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    userId: number
    status: number
    planType: number
    expiresAt: number
    createdAt: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    planType?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    planType?: true
    expiresAt?: true
    createdAt?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    userId?: true
    status?: true
    planType?: true
    expiresAt?: true
    createdAt?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    userId: string
    status: $Enums.SubscriptionStatus
    planType: string
    expiresAt: Date
    createdAt: Date
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    planType?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    planType?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    status?: boolean
    planType?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>

  export type SubscriptionSelectScalar = {
    id?: boolean
    userId?: boolean
    status?: boolean
    planType?: boolean
    expiresAt?: boolean
    createdAt?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "status" | "planType" | "expiresAt" | "createdAt", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SubscriptionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      status: $Enums.SubscriptionStatus
      planType: string
      expiresAt: Date
      createdAt: Date
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Subscriptions and returns the data saved in the database.
     * @param {SubscriptionCreateManyAndReturnArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubscriptionCreateManyAndReturnArgs>(args?: SelectSubset<T, SubscriptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions and returns the data updated in the database.
     * @param {SubscriptionUpdateManyAndReturnArgs} args - Arguments to update many Subscriptions.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Subscriptions and only return the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SubscriptionUpdateManyAndReturnArgs>(args: SelectSubset<T, SubscriptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly userId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'SubscriptionStatus'>
    readonly planType: FieldRef<"Subscription", 'String'>
    readonly expiresAt: FieldRef<"Subscription", 'DateTime'>
    readonly createdAt: FieldRef<"Subscription", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription createManyAndReturn
   */
  export type SubscriptionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription updateManyAndReturn
   */
  export type SubscriptionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model Device
   */

  export type AggregateDevice = {
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  export type DeviceMinAggregateOutputType = {
    id: string | null
    serialNumber: string | null
    nickname: string | null
    isActive: boolean | null
    userId: string | null
    apiKey: string | null
  }

  export type DeviceMaxAggregateOutputType = {
    id: string | null
    serialNumber: string | null
    nickname: string | null
    isActive: boolean | null
    userId: string | null
    apiKey: string | null
  }

  export type DeviceCountAggregateOutputType = {
    id: number
    serialNumber: number
    nickname: number
    isActive: number
    userId: number
    apiKey: number
    _all: number
  }


  export type DeviceMinAggregateInputType = {
    id?: true
    serialNumber?: true
    nickname?: true
    isActive?: true
    userId?: true
    apiKey?: true
  }

  export type DeviceMaxAggregateInputType = {
    id?: true
    serialNumber?: true
    nickname?: true
    isActive?: true
    userId?: true
    apiKey?: true
  }

  export type DeviceCountAggregateInputType = {
    id?: true
    serialNumber?: true
    nickname?: true
    isActive?: true
    userId?: true
    apiKey?: true
    _all?: true
  }

  export type DeviceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Device to aggregate.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Devices
    **/
    _count?: true | DeviceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeviceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeviceMaxAggregateInputType
  }

  export type GetDeviceAggregateType<T extends DeviceAggregateArgs> = {
        [P in keyof T & keyof AggregateDevice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDevice[P]>
      : GetScalarType<T[P], AggregateDevice[P]>
  }




  export type DeviceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeviceWhereInput
    orderBy?: DeviceOrderByWithAggregationInput | DeviceOrderByWithAggregationInput[]
    by: DeviceScalarFieldEnum[] | DeviceScalarFieldEnum
    having?: DeviceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeviceCountAggregateInputType | true
    _min?: DeviceMinAggregateInputType
    _max?: DeviceMaxAggregateInputType
  }

  export type DeviceGroupByOutputType = {
    id: string
    serialNumber: string
    nickname: string | null
    isActive: boolean
    userId: string
    apiKey: string | null
    _count: DeviceCountAggregateOutputType | null
    _min: DeviceMinAggregateOutputType | null
    _max: DeviceMaxAggregateOutputType | null
  }

  type GetDeviceGroupByPayload<T extends DeviceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeviceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeviceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeviceGroupByOutputType[P]>
            : GetScalarType<T[P], DeviceGroupByOutputType[P]>
        }
      >
    >


  export type DeviceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serialNumber?: boolean
    nickname?: boolean
    isActive?: boolean
    userId?: boolean
    apiKey?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serialNumber?: boolean
    nickname?: boolean
    isActive?: boolean
    userId?: boolean
    apiKey?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serialNumber?: boolean
    nickname?: boolean
    isActive?: boolean
    userId?: boolean
    apiKey?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["device"]>

  export type DeviceSelectScalar = {
    id?: boolean
    serialNumber?: boolean
    nickname?: boolean
    isActive?: boolean
    userId?: boolean
    apiKey?: boolean
  }

  export type DeviceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "serialNumber" | "nickname" | "isActive" | "userId" | "apiKey", ExtArgs["result"]["device"]>
  export type DeviceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeviceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DevicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Device"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serialNumber: string
      nickname: string | null
      isActive: boolean
      userId: string
      apiKey: string | null
    }, ExtArgs["result"]["device"]>
    composites: {}
  }

  type DeviceGetPayload<S extends boolean | null | undefined | DeviceDefaultArgs> = $Result.GetResult<Prisma.$DevicePayload, S>

  type DeviceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeviceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeviceCountAggregateInputType | true
    }

  export interface DeviceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Device'], meta: { name: 'Device' } }
    /**
     * Find zero or one Device that matches the filter.
     * @param {DeviceFindUniqueArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeviceFindUniqueArgs>(args: SelectSubset<T, DeviceFindUniqueArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Device that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeviceFindUniqueOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeviceFindUniqueOrThrowArgs>(args: SelectSubset<T, DeviceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeviceFindFirstArgs>(args?: SelectSubset<T, DeviceFindFirstArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Device that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindFirstOrThrowArgs} args - Arguments to find a Device
     * @example
     * // Get one Device
     * const device = await prisma.device.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeviceFindFirstOrThrowArgs>(args?: SelectSubset<T, DeviceFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Devices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Devices
     * const devices = await prisma.device.findMany()
     * 
     * // Get first 10 Devices
     * const devices = await prisma.device.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deviceWithIdOnly = await prisma.device.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeviceFindManyArgs>(args?: SelectSubset<T, DeviceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Device.
     * @param {DeviceCreateArgs} args - Arguments to create a Device.
     * @example
     * // Create one Device
     * const Device = await prisma.device.create({
     *   data: {
     *     // ... data to create a Device
     *   }
     * })
     * 
     */
    create<T extends DeviceCreateArgs>(args: SelectSubset<T, DeviceCreateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Devices.
     * @param {DeviceCreateManyArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeviceCreateManyArgs>(args?: SelectSubset<T, DeviceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Devices and returns the data saved in the database.
     * @param {DeviceCreateManyAndReturnArgs} args - Arguments to create many Devices.
     * @example
     * // Create many Devices
     * const device = await prisma.device.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeviceCreateManyAndReturnArgs>(args?: SelectSubset<T, DeviceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Device.
     * @param {DeviceDeleteArgs} args - Arguments to delete one Device.
     * @example
     * // Delete one Device
     * const Device = await prisma.device.delete({
     *   where: {
     *     // ... filter to delete one Device
     *   }
     * })
     * 
     */
    delete<T extends DeviceDeleteArgs>(args: SelectSubset<T, DeviceDeleteArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Device.
     * @param {DeviceUpdateArgs} args - Arguments to update one Device.
     * @example
     * // Update one Device
     * const device = await prisma.device.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeviceUpdateArgs>(args: SelectSubset<T, DeviceUpdateArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Devices.
     * @param {DeviceDeleteManyArgs} args - Arguments to filter Devices to delete.
     * @example
     * // Delete a few Devices
     * const { count } = await prisma.device.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeviceDeleteManyArgs>(args?: SelectSubset<T, DeviceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeviceUpdateManyArgs>(args: SelectSubset<T, DeviceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Devices and returns the data updated in the database.
     * @param {DeviceUpdateManyAndReturnArgs} args - Arguments to update many Devices.
     * @example
     * // Update many Devices
     * const device = await prisma.device.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Devices and only return the `id`
     * const deviceWithIdOnly = await prisma.device.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeviceUpdateManyAndReturnArgs>(args: SelectSubset<T, DeviceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Device.
     * @param {DeviceUpsertArgs} args - Arguments to update or create a Device.
     * @example
     * // Update or create a Device
     * const device = await prisma.device.upsert({
     *   create: {
     *     // ... data to create a Device
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Device we want to update
     *   }
     * })
     */
    upsert<T extends DeviceUpsertArgs>(args: SelectSubset<T, DeviceUpsertArgs<ExtArgs>>): Prisma__DeviceClient<$Result.GetResult<Prisma.$DevicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Devices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceCountArgs} args - Arguments to filter Devices to count.
     * @example
     * // Count the number of Devices
     * const count = await prisma.device.count({
     *   where: {
     *     // ... the filter for the Devices we want to count
     *   }
     * })
    **/
    count<T extends DeviceCountArgs>(
      args?: Subset<T, DeviceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeviceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeviceAggregateArgs>(args: Subset<T, DeviceAggregateArgs>): Prisma.PrismaPromise<GetDeviceAggregateType<T>>

    /**
     * Group by Device.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeviceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeviceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeviceGroupByArgs['orderBy'] }
        : { orderBy?: DeviceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeviceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeviceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Device model
   */
  readonly fields: DeviceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Device.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeviceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Device model
   */
  interface DeviceFieldRefs {
    readonly id: FieldRef<"Device", 'String'>
    readonly serialNumber: FieldRef<"Device", 'String'>
    readonly nickname: FieldRef<"Device", 'String'>
    readonly isActive: FieldRef<"Device", 'Boolean'>
    readonly userId: FieldRef<"Device", 'String'>
    readonly apiKey: FieldRef<"Device", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Device findUnique
   */
  export type DeviceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findUniqueOrThrow
   */
  export type DeviceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device findFirst
   */
  export type DeviceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findFirstOrThrow
   */
  export type DeviceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Device to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Devices.
     */
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device findMany
   */
  export type DeviceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter, which Devices to fetch.
     */
    where?: DeviceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Devices to fetch.
     */
    orderBy?: DeviceOrderByWithRelationInput | DeviceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Devices.
     */
    cursor?: DeviceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Devices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Devices.
     */
    skip?: number
    distinct?: DeviceScalarFieldEnum | DeviceScalarFieldEnum[]
  }

  /**
   * Device create
   */
  export type DeviceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to create a Device.
     */
    data: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
  }

  /**
   * Device createMany
   */
  export type DeviceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Device createManyAndReturn
   */
  export type DeviceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to create many Devices.
     */
    data: DeviceCreateManyInput | DeviceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device update
   */
  export type DeviceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The data needed to update a Device.
     */
    data: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
    /**
     * Choose, which Device to update.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device updateMany
   */
  export type DeviceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
  }

  /**
   * Device updateManyAndReturn
   */
  export type DeviceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * The data used to update Devices.
     */
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyInput>
    /**
     * Filter which Devices to update
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Device upsert
   */
  export type DeviceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * The filter to search for the Device to update in case it exists.
     */
    where: DeviceWhereUniqueInput
    /**
     * In case the Device found by the `where` argument doesn't exist, create a new Device with this data.
     */
    create: XOR<DeviceCreateInput, DeviceUncheckedCreateInput>
    /**
     * In case the Device was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeviceUpdateInput, DeviceUncheckedUpdateInput>
  }

  /**
   * Device delete
   */
  export type DeviceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
    /**
     * Filter which Device to delete.
     */
    where: DeviceWhereUniqueInput
  }

  /**
   * Device deleteMany
   */
  export type DeviceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Devices to delete
     */
    where?: DeviceWhereInput
    /**
     * Limit how many Devices to delete.
     */
    limit?: number
  }

  /**
   * Device without action
   */
  export type DeviceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Device
     */
    select?: DeviceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Device
     */
    omit?: DeviceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeviceInclude<ExtArgs> | null
  }


  /**
   * Model UserProfile
   */

  export type AggregateUserProfile = {
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  export type UserProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
    nativeLanguage: string | null
    occupation: string | null
    ageGroup: string | null
    learningGoal: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    nativeLanguage: string | null
    occupation: string | null
    ageGroup: string | null
    learningGoal: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserProfileCountAggregateOutputType = {
    id: number
    userId: number
    nativeLanguage: number
    interests: number
    hobbies: number
    occupation: number
    ageGroup: number
    learningGoal: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserProfileMinAggregateInputType = {
    id?: true
    userId?: true
    nativeLanguage?: true
    occupation?: true
    ageGroup?: true
    learningGoal?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileMaxAggregateInputType = {
    id?: true
    userId?: true
    nativeLanguage?: true
    occupation?: true
    ageGroup?: true
    learningGoal?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserProfileCountAggregateInputType = {
    id?: true
    userId?: true
    nativeLanguage?: true
    interests?: true
    hobbies?: true
    occupation?: true
    ageGroup?: true
    learningGoal?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfile to aggregate.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProfiles
    **/
    _count?: true | UserProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProfileMaxAggregateInputType
  }

  export type GetUserProfileAggregateType<T extends UserProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProfile[P]>
      : GetScalarType<T[P], AggregateUserProfile[P]>
  }




  export type UserProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProfileWhereInput
    orderBy?: UserProfileOrderByWithAggregationInput | UserProfileOrderByWithAggregationInput[]
    by: UserProfileScalarFieldEnum[] | UserProfileScalarFieldEnum
    having?: UserProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProfileCountAggregateInputType | true
    _min?: UserProfileMinAggregateInputType
    _max?: UserProfileMaxAggregateInputType
  }

  export type UserProfileGroupByOutputType = {
    id: string
    userId: string
    nativeLanguage: string
    interests: string[]
    hobbies: string[]
    occupation: string | null
    ageGroup: string | null
    learningGoal: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserProfileCountAggregateOutputType | null
    _min: UserProfileMinAggregateOutputType | null
    _max: UserProfileMaxAggregateOutputType | null
  }

  type GetUserProfileGroupByPayload<T extends UserProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
            : GetScalarType<T[P], UserProfileGroupByOutputType[P]>
        }
      >
    >


  export type UserProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nativeLanguage?: boolean
    interests?: boolean
    hobbies?: boolean
    occupation?: boolean
    ageGroup?: boolean
    learningGoal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nativeLanguage?: boolean
    interests?: boolean
    hobbies?: boolean
    occupation?: boolean
    ageGroup?: boolean
    learningGoal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nativeLanguage?: boolean
    interests?: boolean
    hobbies?: boolean
    occupation?: boolean
    ageGroup?: boolean
    learningGoal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProfile"]>

  export type UserProfileSelectScalar = {
    id?: boolean
    userId?: boolean
    nativeLanguage?: boolean
    interests?: boolean
    hobbies?: boolean
    occupation?: boolean
    ageGroup?: boolean
    learningGoal?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "nativeLanguage" | "interests" | "hobbies" | "occupation" | "ageGroup" | "learningGoal" | "createdAt" | "updatedAt", ExtArgs["result"]["userProfile"]>
  export type UserProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      nativeLanguage: string
      interests: string[]
      hobbies: string[]
      occupation: string | null
      ageGroup: string | null
      learningGoal: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userProfile"]>
    composites: {}
  }

  type UserProfileGetPayload<S extends boolean | null | undefined | UserProfileDefaultArgs> = $Result.GetResult<Prisma.$UserProfilePayload, S>

  type UserProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProfileCountAggregateInputType | true
    }

  export interface UserProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProfile'], meta: { name: 'UserProfile' } }
    /**
     * Find zero or one UserProfile that matches the filter.
     * @param {UserProfileFindUniqueArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProfileFindUniqueArgs>(args: SelectSubset<T, UserProfileFindUniqueArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProfileFindUniqueOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProfileFindFirstArgs>(args?: SelectSubset<T, UserProfileFindFirstArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindFirstOrThrowArgs} args - Arguments to find a UserProfile
     * @example
     * // Get one UserProfile
     * const userProfile = await prisma.userProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProfiles
     * const userProfiles = await prisma.userProfile.findMany()
     * 
     * // Get first 10 UserProfiles
     * const userProfiles = await prisma.userProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProfileFindManyArgs>(args?: SelectSubset<T, UserProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProfile.
     * @param {UserProfileCreateArgs} args - Arguments to create a UserProfile.
     * @example
     * // Create one UserProfile
     * const UserProfile = await prisma.userProfile.create({
     *   data: {
     *     // ... data to create a UserProfile
     *   }
     * })
     * 
     */
    create<T extends UserProfileCreateArgs>(args: SelectSubset<T, UserProfileCreateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProfiles.
     * @param {UserProfileCreateManyArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProfileCreateManyArgs>(args?: SelectSubset<T, UserProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProfiles and returns the data saved in the database.
     * @param {UserProfileCreateManyAndReturnArgs} args - Arguments to create many UserProfiles.
     * @example
     * // Create many UserProfiles
     * const userProfile = await prisma.userProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProfile.
     * @param {UserProfileDeleteArgs} args - Arguments to delete one UserProfile.
     * @example
     * // Delete one UserProfile
     * const UserProfile = await prisma.userProfile.delete({
     *   where: {
     *     // ... filter to delete one UserProfile
     *   }
     * })
     * 
     */
    delete<T extends UserProfileDeleteArgs>(args: SelectSubset<T, UserProfileDeleteArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProfile.
     * @param {UserProfileUpdateArgs} args - Arguments to update one UserProfile.
     * @example
     * // Update one UserProfile
     * const userProfile = await prisma.userProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProfileUpdateArgs>(args: SelectSubset<T, UserProfileUpdateArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProfiles.
     * @param {UserProfileDeleteManyArgs} args - Arguments to filter UserProfiles to delete.
     * @example
     * // Delete a few UserProfiles
     * const { count } = await prisma.userProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProfileDeleteManyArgs>(args?: SelectSubset<T, UserProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProfileUpdateManyArgs>(args: SelectSubset<T, UserProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProfiles and returns the data updated in the database.
     * @param {UserProfileUpdateManyAndReturnArgs} args - Arguments to update many UserProfiles.
     * @example
     * // Update many UserProfiles
     * const userProfile = await prisma.userProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProfiles and only return the `id`
     * const userProfileWithIdOnly = await prisma.userProfile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProfile.
     * @param {UserProfileUpsertArgs} args - Arguments to update or create a UserProfile.
     * @example
     * // Update or create a UserProfile
     * const userProfile = await prisma.userProfile.upsert({
     *   create: {
     *     // ... data to create a UserProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProfile we want to update
     *   }
     * })
     */
    upsert<T extends UserProfileUpsertArgs>(args: SelectSubset<T, UserProfileUpsertArgs<ExtArgs>>): Prisma__UserProfileClient<$Result.GetResult<Prisma.$UserProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileCountArgs} args - Arguments to filter UserProfiles to count.
     * @example
     * // Count the number of UserProfiles
     * const count = await prisma.userProfile.count({
     *   where: {
     *     // ... the filter for the UserProfiles we want to count
     *   }
     * })
    **/
    count<T extends UserProfileCountArgs>(
      args?: Subset<T, UserProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProfileAggregateArgs>(args: Subset<T, UserProfileAggregateArgs>): Prisma.PrismaPromise<GetUserProfileAggregateType<T>>

    /**
     * Group by UserProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProfileGroupByArgs['orderBy'] }
        : { orderBy?: UserProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProfile model
   */
  readonly fields: UserProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProfile model
   */
  interface UserProfileFieldRefs {
    readonly id: FieldRef<"UserProfile", 'String'>
    readonly userId: FieldRef<"UserProfile", 'String'>
    readonly nativeLanguage: FieldRef<"UserProfile", 'String'>
    readonly interests: FieldRef<"UserProfile", 'String[]'>
    readonly hobbies: FieldRef<"UserProfile", 'String[]'>
    readonly occupation: FieldRef<"UserProfile", 'String'>
    readonly ageGroup: FieldRef<"UserProfile", 'String'>
    readonly learningGoal: FieldRef<"UserProfile", 'String'>
    readonly createdAt: FieldRef<"UserProfile", 'DateTime'>
    readonly updatedAt: FieldRef<"UserProfile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProfile findUnique
   */
  export type UserProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findUniqueOrThrow
   */
  export type UserProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile findFirst
   */
  export type UserProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findFirstOrThrow
   */
  export type UserProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfile to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProfiles.
     */
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile findMany
   */
  export type UserProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter, which UserProfiles to fetch.
     */
    where?: UserProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProfiles to fetch.
     */
    orderBy?: UserProfileOrderByWithRelationInput | UserProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProfiles.
     */
    cursor?: UserProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProfiles.
     */
    skip?: number
    distinct?: UserProfileScalarFieldEnum | UserProfileScalarFieldEnum[]
  }

  /**
   * UserProfile create
   */
  export type UserProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProfile.
     */
    data: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
  }

  /**
   * UserProfile createMany
   */
  export type UserProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProfile createManyAndReturn
   */
  export type UserProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to create many UserProfiles.
     */
    data: UserProfileCreateManyInput | UserProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProfile update
   */
  export type UserProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProfile.
     */
    data: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
    /**
     * Choose, which UserProfile to update.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile updateMany
   */
  export type UserProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
  }

  /**
   * UserProfile updateManyAndReturn
   */
  export type UserProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * The data used to update UserProfiles.
     */
    data: XOR<UserProfileUpdateManyMutationInput, UserProfileUncheckedUpdateManyInput>
    /**
     * Filter which UserProfiles to update
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProfile upsert
   */
  export type UserProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProfile to update in case it exists.
     */
    where: UserProfileWhereUniqueInput
    /**
     * In case the UserProfile found by the `where` argument doesn't exist, create a new UserProfile with this data.
     */
    create: XOR<UserProfileCreateInput, UserProfileUncheckedCreateInput>
    /**
     * In case the UserProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProfileUpdateInput, UserProfileUncheckedUpdateInput>
  }

  /**
   * UserProfile delete
   */
  export type UserProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
    /**
     * Filter which UserProfile to delete.
     */
    where: UserProfileWhereUniqueInput
  }

  /**
   * UserProfile deleteMany
   */
  export type UserProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProfiles to delete
     */
    where?: UserProfileWhereInput
    /**
     * Limit how many UserProfiles to delete.
     */
    limit?: number
  }

  /**
   * UserProfile without action
   */
  export type UserProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProfile
     */
    select?: UserProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProfile
     */
    omit?: UserProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProfileInclude<ExtArgs> | null
  }


  /**
   * Model Level
   */

  export type AggregateLevel = {
    _count: LevelCountAggregateOutputType | null
    _min: LevelMinAggregateOutputType | null
    _max: LevelMaxAggregateOutputType | null
  }

  export type LevelMinAggregateOutputType = {
    id: string | null
    code: $Enums.UserLevel | null
    description: string | null
    languageId: string | null
  }

  export type LevelMaxAggregateOutputType = {
    id: string | null
    code: $Enums.UserLevel | null
    description: string | null
    languageId: string | null
  }

  export type LevelCountAggregateOutputType = {
    id: number
    code: number
    description: number
    languageId: number
    _all: number
  }


  export type LevelMinAggregateInputType = {
    id?: true
    code?: true
    description?: true
    languageId?: true
  }

  export type LevelMaxAggregateInputType = {
    id?: true
    code?: true
    description?: true
    languageId?: true
  }

  export type LevelCountAggregateInputType = {
    id?: true
    code?: true
    description?: true
    languageId?: true
    _all?: true
  }

  export type LevelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Level to aggregate.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Levels
    **/
    _count?: true | LevelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LevelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LevelMaxAggregateInputType
  }

  export type GetLevelAggregateType<T extends LevelAggregateArgs> = {
        [P in keyof T & keyof AggregateLevel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLevel[P]>
      : GetScalarType<T[P], AggregateLevel[P]>
  }




  export type LevelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LevelWhereInput
    orderBy?: LevelOrderByWithAggregationInput | LevelOrderByWithAggregationInput[]
    by: LevelScalarFieldEnum[] | LevelScalarFieldEnum
    having?: LevelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LevelCountAggregateInputType | true
    _min?: LevelMinAggregateInputType
    _max?: LevelMaxAggregateInputType
  }

  export type LevelGroupByOutputType = {
    id: string
    code: $Enums.UserLevel
    description: string | null
    languageId: string
    _count: LevelCountAggregateOutputType | null
    _min: LevelMinAggregateOutputType | null
    _max: LevelMaxAggregateOutputType | null
  }

  type GetLevelGroupByPayload<T extends LevelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LevelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LevelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LevelGroupByOutputType[P]>
            : GetScalarType<T[P], LevelGroupByOutputType[P]>
        }
      >
    >


  export type LevelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    description?: boolean
    languageId?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
    modules?: boolean | Level$modulesArgs<ExtArgs>
    _count?: boolean | LevelCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["level"]>

  export type LevelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    description?: boolean
    languageId?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["level"]>

  export type LevelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    description?: boolean
    languageId?: boolean
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["level"]>

  export type LevelSelectScalar = {
    id?: boolean
    code?: boolean
    description?: boolean
    languageId?: boolean
  }

  export type LevelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "description" | "languageId", ExtArgs["result"]["level"]>
  export type LevelInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
    modules?: boolean | Level$modulesArgs<ExtArgs>
    _count?: boolean | LevelCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LevelIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }
  export type LevelIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    language?: boolean | LanguageDefaultArgs<ExtArgs>
  }

  export type $LevelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Level"
    objects: {
      language: Prisma.$LanguagePayload<ExtArgs>
      modules: Prisma.$ModulePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: $Enums.UserLevel
      description: string | null
      languageId: string
    }, ExtArgs["result"]["level"]>
    composites: {}
  }

  type LevelGetPayload<S extends boolean | null | undefined | LevelDefaultArgs> = $Result.GetResult<Prisma.$LevelPayload, S>

  type LevelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LevelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LevelCountAggregateInputType | true
    }

  export interface LevelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Level'], meta: { name: 'Level' } }
    /**
     * Find zero or one Level that matches the filter.
     * @param {LevelFindUniqueArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LevelFindUniqueArgs>(args: SelectSubset<T, LevelFindUniqueArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Level that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LevelFindUniqueOrThrowArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LevelFindUniqueOrThrowArgs>(args: SelectSubset<T, LevelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Level that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelFindFirstArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LevelFindFirstArgs>(args?: SelectSubset<T, LevelFindFirstArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Level that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelFindFirstOrThrowArgs} args - Arguments to find a Level
     * @example
     * // Get one Level
     * const level = await prisma.level.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LevelFindFirstOrThrowArgs>(args?: SelectSubset<T, LevelFindFirstOrThrowArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Levels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Levels
     * const levels = await prisma.level.findMany()
     * 
     * // Get first 10 Levels
     * const levels = await prisma.level.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const levelWithIdOnly = await prisma.level.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LevelFindManyArgs>(args?: SelectSubset<T, LevelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Level.
     * @param {LevelCreateArgs} args - Arguments to create a Level.
     * @example
     * // Create one Level
     * const Level = await prisma.level.create({
     *   data: {
     *     // ... data to create a Level
     *   }
     * })
     * 
     */
    create<T extends LevelCreateArgs>(args: SelectSubset<T, LevelCreateArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Levels.
     * @param {LevelCreateManyArgs} args - Arguments to create many Levels.
     * @example
     * // Create many Levels
     * const level = await prisma.level.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LevelCreateManyArgs>(args?: SelectSubset<T, LevelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Levels and returns the data saved in the database.
     * @param {LevelCreateManyAndReturnArgs} args - Arguments to create many Levels.
     * @example
     * // Create many Levels
     * const level = await prisma.level.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Levels and only return the `id`
     * const levelWithIdOnly = await prisma.level.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LevelCreateManyAndReturnArgs>(args?: SelectSubset<T, LevelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Level.
     * @param {LevelDeleteArgs} args - Arguments to delete one Level.
     * @example
     * // Delete one Level
     * const Level = await prisma.level.delete({
     *   where: {
     *     // ... filter to delete one Level
     *   }
     * })
     * 
     */
    delete<T extends LevelDeleteArgs>(args: SelectSubset<T, LevelDeleteArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Level.
     * @param {LevelUpdateArgs} args - Arguments to update one Level.
     * @example
     * // Update one Level
     * const level = await prisma.level.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LevelUpdateArgs>(args: SelectSubset<T, LevelUpdateArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Levels.
     * @param {LevelDeleteManyArgs} args - Arguments to filter Levels to delete.
     * @example
     * // Delete a few Levels
     * const { count } = await prisma.level.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LevelDeleteManyArgs>(args?: SelectSubset<T, LevelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Levels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Levels
     * const level = await prisma.level.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LevelUpdateManyArgs>(args: SelectSubset<T, LevelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Levels and returns the data updated in the database.
     * @param {LevelUpdateManyAndReturnArgs} args - Arguments to update many Levels.
     * @example
     * // Update many Levels
     * const level = await prisma.level.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Levels and only return the `id`
     * const levelWithIdOnly = await prisma.level.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LevelUpdateManyAndReturnArgs>(args: SelectSubset<T, LevelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Level.
     * @param {LevelUpsertArgs} args - Arguments to update or create a Level.
     * @example
     * // Update or create a Level
     * const level = await prisma.level.upsert({
     *   create: {
     *     // ... data to create a Level
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Level we want to update
     *   }
     * })
     */
    upsert<T extends LevelUpsertArgs>(args: SelectSubset<T, LevelUpsertArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Levels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelCountArgs} args - Arguments to filter Levels to count.
     * @example
     * // Count the number of Levels
     * const count = await prisma.level.count({
     *   where: {
     *     // ... the filter for the Levels we want to count
     *   }
     * })
    **/
    count<T extends LevelCountArgs>(
      args?: Subset<T, LevelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LevelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Level.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LevelAggregateArgs>(args: Subset<T, LevelAggregateArgs>): Prisma.PrismaPromise<GetLevelAggregateType<T>>

    /**
     * Group by Level.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LevelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LevelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LevelGroupByArgs['orderBy'] }
        : { orderBy?: LevelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LevelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLevelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Level model
   */
  readonly fields: LevelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Level.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LevelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    language<T extends LanguageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LanguageDefaultArgs<ExtArgs>>): Prisma__LanguageClient<$Result.GetResult<Prisma.$LanguagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    modules<T extends Level$modulesArgs<ExtArgs> = {}>(args?: Subset<T, Level$modulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Level model
   */
  interface LevelFieldRefs {
    readonly id: FieldRef<"Level", 'String'>
    readonly code: FieldRef<"Level", 'UserLevel'>
    readonly description: FieldRef<"Level", 'String'>
    readonly languageId: FieldRef<"Level", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Level findUnique
   */
  export type LevelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level findUniqueOrThrow
   */
  export type LevelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level findFirst
   */
  export type LevelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Levels.
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Levels.
     */
    distinct?: LevelScalarFieldEnum | LevelScalarFieldEnum[]
  }

  /**
   * Level findFirstOrThrow
   */
  export type LevelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Level to fetch.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Levels.
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Levels.
     */
    distinct?: LevelScalarFieldEnum | LevelScalarFieldEnum[]
  }

  /**
   * Level findMany
   */
  export type LevelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter, which Levels to fetch.
     */
    where?: LevelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Levels to fetch.
     */
    orderBy?: LevelOrderByWithRelationInput | LevelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Levels.
     */
    cursor?: LevelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Levels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Levels.
     */
    skip?: number
    distinct?: LevelScalarFieldEnum | LevelScalarFieldEnum[]
  }

  /**
   * Level create
   */
  export type LevelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * The data needed to create a Level.
     */
    data: XOR<LevelCreateInput, LevelUncheckedCreateInput>
  }

  /**
   * Level createMany
   */
  export type LevelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Levels.
     */
    data: LevelCreateManyInput | LevelCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Level createManyAndReturn
   */
  export type LevelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * The data used to create many Levels.
     */
    data: LevelCreateManyInput | LevelCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Level update
   */
  export type LevelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * The data needed to update a Level.
     */
    data: XOR<LevelUpdateInput, LevelUncheckedUpdateInput>
    /**
     * Choose, which Level to update.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level updateMany
   */
  export type LevelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Levels.
     */
    data: XOR<LevelUpdateManyMutationInput, LevelUncheckedUpdateManyInput>
    /**
     * Filter which Levels to update
     */
    where?: LevelWhereInput
    /**
     * Limit how many Levels to update.
     */
    limit?: number
  }

  /**
   * Level updateManyAndReturn
   */
  export type LevelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * The data used to update Levels.
     */
    data: XOR<LevelUpdateManyMutationInput, LevelUncheckedUpdateManyInput>
    /**
     * Filter which Levels to update
     */
    where?: LevelWhereInput
    /**
     * Limit how many Levels to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Level upsert
   */
  export type LevelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * The filter to search for the Level to update in case it exists.
     */
    where: LevelWhereUniqueInput
    /**
     * In case the Level found by the `where` argument doesn't exist, create a new Level with this data.
     */
    create: XOR<LevelCreateInput, LevelUncheckedCreateInput>
    /**
     * In case the Level was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LevelUpdateInput, LevelUncheckedUpdateInput>
  }

  /**
   * Level delete
   */
  export type LevelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
    /**
     * Filter which Level to delete.
     */
    where: LevelWhereUniqueInput
  }

  /**
   * Level deleteMany
   */
  export type LevelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Levels to delete
     */
    where?: LevelWhereInput
    /**
     * Limit how many Levels to delete.
     */
    limit?: number
  }

  /**
   * Level.modules
   */
  export type Level$modulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    where?: ModuleWhereInput
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    cursor?: ModuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Level without action
   */
  export type LevelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Level
     */
    select?: LevelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Level
     */
    omit?: LevelOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LevelInclude<ExtArgs> | null
  }


  /**
   * Model Module
   */

  export type AggregateModule = {
    _count: ModuleCountAggregateOutputType | null
    _avg: ModuleAvgAggregateOutputType | null
    _sum: ModuleSumAggregateOutputType | null
    _min: ModuleMinAggregateOutputType | null
    _max: ModuleMaxAggregateOutputType | null
  }

  export type ModuleAvgAggregateOutputType = {
    order: number | null
  }

  export type ModuleSumAggregateOutputType = {
    order: number | null
  }

  export type ModuleMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    order: number | null
    isGenerated: boolean | null
    levelId: string | null
    userId: string | null
  }

  export type ModuleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    order: number | null
    isGenerated: boolean | null
    levelId: string | null
    userId: string | null
  }

  export type ModuleCountAggregateOutputType = {
    id: number
    name: number
    description: number
    order: number
    isGenerated: number
    levelId: number
    userId: number
    _all: number
  }


  export type ModuleAvgAggregateInputType = {
    order?: true
  }

  export type ModuleSumAggregateInputType = {
    order?: true
  }

  export type ModuleMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order?: true
    isGenerated?: true
    levelId?: true
    userId?: true
  }

  export type ModuleMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order?: true
    isGenerated?: true
    levelId?: true
    userId?: true
  }

  export type ModuleCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    order?: true
    isGenerated?: true
    levelId?: true
    userId?: true
    _all?: true
  }

  export type ModuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Module to aggregate.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Modules
    **/
    _count?: true | ModuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ModuleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ModuleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModuleMaxAggregateInputType
  }

  export type GetModuleAggregateType<T extends ModuleAggregateArgs> = {
        [P in keyof T & keyof AggregateModule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModule[P]>
      : GetScalarType<T[P], AggregateModule[P]>
  }




  export type ModuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleWhereInput
    orderBy?: ModuleOrderByWithAggregationInput | ModuleOrderByWithAggregationInput[]
    by: ModuleScalarFieldEnum[] | ModuleScalarFieldEnum
    having?: ModuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModuleCountAggregateInputType | true
    _avg?: ModuleAvgAggregateInputType
    _sum?: ModuleSumAggregateInputType
    _min?: ModuleMinAggregateInputType
    _max?: ModuleMaxAggregateInputType
  }

  export type ModuleGroupByOutputType = {
    id: string
    name: string
    description: string | null
    order: number
    isGenerated: boolean
    levelId: string
    userId: string | null
    _count: ModuleCountAggregateOutputType | null
    _avg: ModuleAvgAggregateOutputType | null
    _sum: ModuleSumAggregateOutputType | null
    _min: ModuleMinAggregateOutputType | null
    _max: ModuleMaxAggregateOutputType | null
  }

  type GetModuleGroupByPayload<T extends ModuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModuleGroupByOutputType[P]>
            : GetScalarType<T[P], ModuleGroupByOutputType[P]>
        }
      >
    >


  export type ModuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    order?: boolean
    isGenerated?: boolean
    levelId?: boolean
    userId?: boolean
    level?: boolean | LevelDefaultArgs<ExtArgs>
    user?: boolean | Module$userArgs<ExtArgs>
    lessons?: boolean | Module$lessonsArgs<ExtArgs>
    _count?: boolean | ModuleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    order?: boolean
    isGenerated?: boolean
    levelId?: boolean
    userId?: boolean
    level?: boolean | LevelDefaultArgs<ExtArgs>
    user?: boolean | Module$userArgs<ExtArgs>
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    order?: boolean
    isGenerated?: boolean
    levelId?: boolean
    userId?: boolean
    level?: boolean | LevelDefaultArgs<ExtArgs>
    user?: boolean | Module$userArgs<ExtArgs>
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    order?: boolean
    isGenerated?: boolean
    levelId?: boolean
    userId?: boolean
  }

  export type ModuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "order" | "isGenerated" | "levelId" | "userId", ExtArgs["result"]["module"]>
  export type ModuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    level?: boolean | LevelDefaultArgs<ExtArgs>
    user?: boolean | Module$userArgs<ExtArgs>
    lessons?: boolean | Module$lessonsArgs<ExtArgs>
    _count?: boolean | ModuleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ModuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    level?: boolean | LevelDefaultArgs<ExtArgs>
    user?: boolean | Module$userArgs<ExtArgs>
  }
  export type ModuleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    level?: boolean | LevelDefaultArgs<ExtArgs>
    user?: boolean | Module$userArgs<ExtArgs>
  }

  export type $ModulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Module"
    objects: {
      level: Prisma.$LevelPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
      lessons: Prisma.$LessonPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      order: number
      isGenerated: boolean
      levelId: string
      userId: string | null
    }, ExtArgs["result"]["module"]>
    composites: {}
  }

  type ModuleGetPayload<S extends boolean | null | undefined | ModuleDefaultArgs> = $Result.GetResult<Prisma.$ModulePayload, S>

  type ModuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ModuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ModuleCountAggregateInputType | true
    }

  export interface ModuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Module'], meta: { name: 'Module' } }
    /**
     * Find zero or one Module that matches the filter.
     * @param {ModuleFindUniqueArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModuleFindUniqueArgs>(args: SelectSubset<T, ModuleFindUniqueArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Module that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ModuleFindUniqueOrThrowArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModuleFindUniqueOrThrowArgs>(args: SelectSubset<T, ModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Module that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindFirstArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModuleFindFirstArgs>(args?: SelectSubset<T, ModuleFindFirstArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Module that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindFirstOrThrowArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModuleFindFirstOrThrowArgs>(args?: SelectSubset<T, ModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Modules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Modules
     * const modules = await prisma.module.findMany()
     * 
     * // Get first 10 Modules
     * const modules = await prisma.module.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moduleWithIdOnly = await prisma.module.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModuleFindManyArgs>(args?: SelectSubset<T, ModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Module.
     * @param {ModuleCreateArgs} args - Arguments to create a Module.
     * @example
     * // Create one Module
     * const Module = await prisma.module.create({
     *   data: {
     *     // ... data to create a Module
     *   }
     * })
     * 
     */
    create<T extends ModuleCreateArgs>(args: SelectSubset<T, ModuleCreateArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Modules.
     * @param {ModuleCreateManyArgs} args - Arguments to create many Modules.
     * @example
     * // Create many Modules
     * const module = await prisma.module.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModuleCreateManyArgs>(args?: SelectSubset<T, ModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Modules and returns the data saved in the database.
     * @param {ModuleCreateManyAndReturnArgs} args - Arguments to create many Modules.
     * @example
     * // Create many Modules
     * const module = await prisma.module.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Modules and only return the `id`
     * const moduleWithIdOnly = await prisma.module.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModuleCreateManyAndReturnArgs>(args?: SelectSubset<T, ModuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Module.
     * @param {ModuleDeleteArgs} args - Arguments to delete one Module.
     * @example
     * // Delete one Module
     * const Module = await prisma.module.delete({
     *   where: {
     *     // ... filter to delete one Module
     *   }
     * })
     * 
     */
    delete<T extends ModuleDeleteArgs>(args: SelectSubset<T, ModuleDeleteArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Module.
     * @param {ModuleUpdateArgs} args - Arguments to update one Module.
     * @example
     * // Update one Module
     * const module = await prisma.module.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModuleUpdateArgs>(args: SelectSubset<T, ModuleUpdateArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Modules.
     * @param {ModuleDeleteManyArgs} args - Arguments to filter Modules to delete.
     * @example
     * // Delete a few Modules
     * const { count } = await prisma.module.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModuleDeleteManyArgs>(args?: SelectSubset<T, ModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Modules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Modules
     * const module = await prisma.module.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModuleUpdateManyArgs>(args: SelectSubset<T, ModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Modules and returns the data updated in the database.
     * @param {ModuleUpdateManyAndReturnArgs} args - Arguments to update many Modules.
     * @example
     * // Update many Modules
     * const module = await prisma.module.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Modules and only return the `id`
     * const moduleWithIdOnly = await prisma.module.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ModuleUpdateManyAndReturnArgs>(args: SelectSubset<T, ModuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Module.
     * @param {ModuleUpsertArgs} args - Arguments to update or create a Module.
     * @example
     * // Update or create a Module
     * const module = await prisma.module.upsert({
     *   create: {
     *     // ... data to create a Module
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Module we want to update
     *   }
     * })
     */
    upsert<T extends ModuleUpsertArgs>(args: SelectSubset<T, ModuleUpsertArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Modules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleCountArgs} args - Arguments to filter Modules to count.
     * @example
     * // Count the number of Modules
     * const count = await prisma.module.count({
     *   where: {
     *     // ... the filter for the Modules we want to count
     *   }
     * })
    **/
    count<T extends ModuleCountArgs>(
      args?: Subset<T, ModuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Module.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ModuleAggregateArgs>(args: Subset<T, ModuleAggregateArgs>): Prisma.PrismaPromise<GetModuleAggregateType<T>>

    /**
     * Group by Module.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ModuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModuleGroupByArgs['orderBy'] }
        : { orderBy?: ModuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Module model
   */
  readonly fields: ModuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Module.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    level<T extends LevelDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LevelDefaultArgs<ExtArgs>>): Prisma__LevelClient<$Result.GetResult<Prisma.$LevelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends Module$userArgs<ExtArgs> = {}>(args?: Subset<T, Module$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lessons<T extends Module$lessonsArgs<ExtArgs> = {}>(args?: Subset<T, Module$lessonsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Module model
   */
  interface ModuleFieldRefs {
    readonly id: FieldRef<"Module", 'String'>
    readonly name: FieldRef<"Module", 'String'>
    readonly description: FieldRef<"Module", 'String'>
    readonly order: FieldRef<"Module", 'Int'>
    readonly isGenerated: FieldRef<"Module", 'Boolean'>
    readonly levelId: FieldRef<"Module", 'String'>
    readonly userId: FieldRef<"Module", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Module findUnique
   */
  export type ModuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module findUniqueOrThrow
   */
  export type ModuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module findFirst
   */
  export type ModuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Modules.
     */
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module findFirstOrThrow
   */
  export type ModuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Modules.
     */
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module findMany
   */
  export type ModuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Modules to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module create
   */
  export type ModuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The data needed to create a Module.
     */
    data: XOR<ModuleCreateInput, ModuleUncheckedCreateInput>
  }

  /**
   * Module createMany
   */
  export type ModuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Modules.
     */
    data: ModuleCreateManyInput | ModuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Module createManyAndReturn
   */
  export type ModuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * The data used to create many Modules.
     */
    data: ModuleCreateManyInput | ModuleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Module update
   */
  export type ModuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The data needed to update a Module.
     */
    data: XOR<ModuleUpdateInput, ModuleUncheckedUpdateInput>
    /**
     * Choose, which Module to update.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module updateMany
   */
  export type ModuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Modules.
     */
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyInput>
    /**
     * Filter which Modules to update
     */
    where?: ModuleWhereInput
    /**
     * Limit how many Modules to update.
     */
    limit?: number
  }

  /**
   * Module updateManyAndReturn
   */
  export type ModuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * The data used to update Modules.
     */
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyInput>
    /**
     * Filter which Modules to update
     */
    where?: ModuleWhereInput
    /**
     * Limit how many Modules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Module upsert
   */
  export type ModuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The filter to search for the Module to update in case it exists.
     */
    where: ModuleWhereUniqueInput
    /**
     * In case the Module found by the `where` argument doesn't exist, create a new Module with this data.
     */
    create: XOR<ModuleCreateInput, ModuleUncheckedCreateInput>
    /**
     * In case the Module was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModuleUpdateInput, ModuleUncheckedUpdateInput>
  }

  /**
   * Module delete
   */
  export type ModuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter which Module to delete.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module deleteMany
   */
  export type ModuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Modules to delete
     */
    where?: ModuleWhereInput
    /**
     * Limit how many Modules to delete.
     */
    limit?: number
  }

  /**
   * Module.user
   */
  export type Module$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Module.lessons
   */
  export type Module$lessonsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    where?: LessonWhereInput
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    cursor?: LessonWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Module without action
   */
  export type ModuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Module
     */
    omit?: ModuleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
  }


  /**
   * Model Lesson
   */

  export type AggregateLesson = {
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  export type LessonAvgAggregateOutputType = {
    order: number | null
  }

  export type LessonSumAggregateOutputType = {
    order: number | null
  }

  export type LessonMinAggregateOutputType = {
    id: string | null
    title: string | null
    scenario: string | null
    systemPrompt: string | null
    objectives: string | null
    order: number | null
    isGenerated: boolean | null
    moduleId: string | null
  }

  export type LessonMaxAggregateOutputType = {
    id: string | null
    title: string | null
    scenario: string | null
    systemPrompt: string | null
    objectives: string | null
    order: number | null
    isGenerated: boolean | null
    moduleId: string | null
  }

  export type LessonCountAggregateOutputType = {
    id: number
    title: number
    scenario: number
    systemPrompt: number
    objectives: number
    order: number
    isGenerated: number
    moduleId: number
    _all: number
  }


  export type LessonAvgAggregateInputType = {
    order?: true
  }

  export type LessonSumAggregateInputType = {
    order?: true
  }

  export type LessonMinAggregateInputType = {
    id?: true
    title?: true
    scenario?: true
    systemPrompt?: true
    objectives?: true
    order?: true
    isGenerated?: true
    moduleId?: true
  }

  export type LessonMaxAggregateInputType = {
    id?: true
    title?: true
    scenario?: true
    systemPrompt?: true
    objectives?: true
    order?: true
    isGenerated?: true
    moduleId?: true
  }

  export type LessonCountAggregateInputType = {
    id?: true
    title?: true
    scenario?: true
    systemPrompt?: true
    objectives?: true
    order?: true
    isGenerated?: true
    moduleId?: true
    _all?: true
  }

  export type LessonAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lesson to aggregate.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lessons
    **/
    _count?: true | LessonCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LessonAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LessonSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LessonMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LessonMaxAggregateInputType
  }

  export type GetLessonAggregateType<T extends LessonAggregateArgs> = {
        [P in keyof T & keyof AggregateLesson]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLesson[P]>
      : GetScalarType<T[P], AggregateLesson[P]>
  }




  export type LessonGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LessonWhereInput
    orderBy?: LessonOrderByWithAggregationInput | LessonOrderByWithAggregationInput[]
    by: LessonScalarFieldEnum[] | LessonScalarFieldEnum
    having?: LessonScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LessonCountAggregateInputType | true
    _avg?: LessonAvgAggregateInputType
    _sum?: LessonSumAggregateInputType
    _min?: LessonMinAggregateInputType
    _max?: LessonMaxAggregateInputType
  }

  export type LessonGroupByOutputType = {
    id: string
    title: string
    scenario: string
    systemPrompt: string
    objectives: string | null
    order: number
    isGenerated: boolean
    moduleId: string
    _count: LessonCountAggregateOutputType | null
    _avg: LessonAvgAggregateOutputType | null
    _sum: LessonSumAggregateOutputType | null
    _min: LessonMinAggregateOutputType | null
    _max: LessonMaxAggregateOutputType | null
  }

  type GetLessonGroupByPayload<T extends LessonGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LessonGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LessonGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LessonGroupByOutputType[P]>
            : GetScalarType<T[P], LessonGroupByOutputType[P]>
        }
      >
    >


  export type LessonSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    scenario?: boolean
    systemPrompt?: boolean
    objectives?: boolean
    order?: boolean
    isGenerated?: boolean
    moduleId?: boolean
    module?: boolean | ModuleDefaultArgs<ExtArgs>
    userProgress?: boolean | Lesson$userProgressArgs<ExtArgs>
    sessions?: boolean | Lesson$sessionsArgs<ExtArgs>
    _count?: boolean | LessonCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    scenario?: boolean
    systemPrompt?: boolean
    objectives?: boolean
    order?: boolean
    isGenerated?: boolean
    moduleId?: boolean
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    scenario?: boolean
    systemPrompt?: boolean
    objectives?: boolean
    order?: boolean
    isGenerated?: boolean
    moduleId?: boolean
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lesson"]>

  export type LessonSelectScalar = {
    id?: boolean
    title?: boolean
    scenario?: boolean
    systemPrompt?: boolean
    objectives?: boolean
    order?: boolean
    isGenerated?: boolean
    moduleId?: boolean
  }

  export type LessonOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "scenario" | "systemPrompt" | "objectives" | "order" | "isGenerated" | "moduleId", ExtArgs["result"]["lesson"]>
  export type LessonInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | ModuleDefaultArgs<ExtArgs>
    userProgress?: boolean | Lesson$userProgressArgs<ExtArgs>
    sessions?: boolean | Lesson$sessionsArgs<ExtArgs>
    _count?: boolean | LessonCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LessonIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }
  export type LessonIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }

  export type $LessonPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lesson"
    objects: {
      module: Prisma.$ModulePayload<ExtArgs>
      userProgress: Prisma.$UserProgressPayload<ExtArgs>[]
      sessions: Prisma.$ConversationSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      scenario: string
      systemPrompt: string
      objectives: string | null
      order: number
      isGenerated: boolean
      moduleId: string
    }, ExtArgs["result"]["lesson"]>
    composites: {}
  }

  type LessonGetPayload<S extends boolean | null | undefined | LessonDefaultArgs> = $Result.GetResult<Prisma.$LessonPayload, S>

  type LessonCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LessonFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LessonCountAggregateInputType | true
    }

  export interface LessonDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lesson'], meta: { name: 'Lesson' } }
    /**
     * Find zero or one Lesson that matches the filter.
     * @param {LessonFindUniqueArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LessonFindUniqueArgs>(args: SelectSubset<T, LessonFindUniqueArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lesson that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LessonFindUniqueOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LessonFindUniqueOrThrowArgs>(args: SelectSubset<T, LessonFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LessonFindFirstArgs>(args?: SelectSubset<T, LessonFindFirstArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lesson that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindFirstOrThrowArgs} args - Arguments to find a Lesson
     * @example
     * // Get one Lesson
     * const lesson = await prisma.lesson.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LessonFindFirstOrThrowArgs>(args?: SelectSubset<T, LessonFindFirstOrThrowArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lessons that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lessons
     * const lessons = await prisma.lesson.findMany()
     * 
     * // Get first 10 Lessons
     * const lessons = await prisma.lesson.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lessonWithIdOnly = await prisma.lesson.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LessonFindManyArgs>(args?: SelectSubset<T, LessonFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lesson.
     * @param {LessonCreateArgs} args - Arguments to create a Lesson.
     * @example
     * // Create one Lesson
     * const Lesson = await prisma.lesson.create({
     *   data: {
     *     // ... data to create a Lesson
     *   }
     * })
     * 
     */
    create<T extends LessonCreateArgs>(args: SelectSubset<T, LessonCreateArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lessons.
     * @param {LessonCreateManyArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lesson = await prisma.lesson.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LessonCreateManyArgs>(args?: SelectSubset<T, LessonCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lessons and returns the data saved in the database.
     * @param {LessonCreateManyAndReturnArgs} args - Arguments to create many Lessons.
     * @example
     * // Create many Lessons
     * const lesson = await prisma.lesson.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lessons and only return the `id`
     * const lessonWithIdOnly = await prisma.lesson.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LessonCreateManyAndReturnArgs>(args?: SelectSubset<T, LessonCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lesson.
     * @param {LessonDeleteArgs} args - Arguments to delete one Lesson.
     * @example
     * // Delete one Lesson
     * const Lesson = await prisma.lesson.delete({
     *   where: {
     *     // ... filter to delete one Lesson
     *   }
     * })
     * 
     */
    delete<T extends LessonDeleteArgs>(args: SelectSubset<T, LessonDeleteArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lesson.
     * @param {LessonUpdateArgs} args - Arguments to update one Lesson.
     * @example
     * // Update one Lesson
     * const lesson = await prisma.lesson.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LessonUpdateArgs>(args: SelectSubset<T, LessonUpdateArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lessons.
     * @param {LessonDeleteManyArgs} args - Arguments to filter Lessons to delete.
     * @example
     * // Delete a few Lessons
     * const { count } = await prisma.lesson.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LessonDeleteManyArgs>(args?: SelectSubset<T, LessonDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LessonUpdateManyArgs>(args: SelectSubset<T, LessonUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lessons and returns the data updated in the database.
     * @param {LessonUpdateManyAndReturnArgs} args - Arguments to update many Lessons.
     * @example
     * // Update many Lessons
     * const lesson = await prisma.lesson.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lessons and only return the `id`
     * const lessonWithIdOnly = await prisma.lesson.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LessonUpdateManyAndReturnArgs>(args: SelectSubset<T, LessonUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lesson.
     * @param {LessonUpsertArgs} args - Arguments to update or create a Lesson.
     * @example
     * // Update or create a Lesson
     * const lesson = await prisma.lesson.upsert({
     *   create: {
     *     // ... data to create a Lesson
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lesson we want to update
     *   }
     * })
     */
    upsert<T extends LessonUpsertArgs>(args: SelectSubset<T, LessonUpsertArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lessons.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonCountArgs} args - Arguments to filter Lessons to count.
     * @example
     * // Count the number of Lessons
     * const count = await prisma.lesson.count({
     *   where: {
     *     // ... the filter for the Lessons we want to count
     *   }
     * })
    **/
    count<T extends LessonCountArgs>(
      args?: Subset<T, LessonCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LessonCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LessonAggregateArgs>(args: Subset<T, LessonAggregateArgs>): Prisma.PrismaPromise<GetLessonAggregateType<T>>

    /**
     * Group by Lesson.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LessonGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LessonGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LessonGroupByArgs['orderBy'] }
        : { orderBy?: LessonGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LessonGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLessonGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lesson model
   */
  readonly fields: LessonFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lesson.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LessonClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    module<T extends ModuleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ModuleDefaultArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    userProgress<T extends Lesson$userProgressArgs<ExtArgs> = {}>(args?: Subset<T, Lesson$userProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends Lesson$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Lesson$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lesson model
   */
  interface LessonFieldRefs {
    readonly id: FieldRef<"Lesson", 'String'>
    readonly title: FieldRef<"Lesson", 'String'>
    readonly scenario: FieldRef<"Lesson", 'String'>
    readonly systemPrompt: FieldRef<"Lesson", 'String'>
    readonly objectives: FieldRef<"Lesson", 'String'>
    readonly order: FieldRef<"Lesson", 'Int'>
    readonly isGenerated: FieldRef<"Lesson", 'Boolean'>
    readonly moduleId: FieldRef<"Lesson", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Lesson findUnique
   */
  export type LessonFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson findUniqueOrThrow
   */
  export type LessonFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson findFirst
   */
  export type LessonFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson findFirstOrThrow
   */
  export type LessonFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lesson to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lessons.
     */
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson findMany
   */
  export type LessonFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter, which Lessons to fetch.
     */
    where?: LessonWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lessons to fetch.
     */
    orderBy?: LessonOrderByWithRelationInput | LessonOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lessons.
     */
    cursor?: LessonWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lessons from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lessons.
     */
    skip?: number
    distinct?: LessonScalarFieldEnum | LessonScalarFieldEnum[]
  }

  /**
   * Lesson create
   */
  export type LessonCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to create a Lesson.
     */
    data: XOR<LessonCreateInput, LessonUncheckedCreateInput>
  }

  /**
   * Lesson createMany
   */
  export type LessonCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lessons.
     */
    data: LessonCreateManyInput | LessonCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lesson createManyAndReturn
   */
  export type LessonCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * The data used to create many Lessons.
     */
    data: LessonCreateManyInput | LessonCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lesson update
   */
  export type LessonUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The data needed to update a Lesson.
     */
    data: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
    /**
     * Choose, which Lesson to update.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson updateMany
   */
  export type LessonUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lessons.
     */
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyInput>
    /**
     * Filter which Lessons to update
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to update.
     */
    limit?: number
  }

  /**
   * Lesson updateManyAndReturn
   */
  export type LessonUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * The data used to update Lessons.
     */
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyInput>
    /**
     * Filter which Lessons to update
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lesson upsert
   */
  export type LessonUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * The filter to search for the Lesson to update in case it exists.
     */
    where: LessonWhereUniqueInput
    /**
     * In case the Lesson found by the `where` argument doesn't exist, create a new Lesson with this data.
     */
    create: XOR<LessonCreateInput, LessonUncheckedCreateInput>
    /**
     * In case the Lesson was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LessonUpdateInput, LessonUncheckedUpdateInput>
  }

  /**
   * Lesson delete
   */
  export type LessonDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    /**
     * Filter which Lesson to delete.
     */
    where: LessonWhereUniqueInput
  }

  /**
   * Lesson deleteMany
   */
  export type LessonDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lessons to delete
     */
    where?: LessonWhereInput
    /**
     * Limit how many Lessons to delete.
     */
    limit?: number
  }

  /**
   * Lesson.userProgress
   */
  export type Lesson$userProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    where?: UserProgressWhereInput
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    cursor?: UserProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * Lesson.sessions
   */
  export type Lesson$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    where?: ConversationSessionWhereInput
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    cursor?: ConversationSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * Lesson without action
   */
  export type LessonDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
  }


  /**
   * Model UserProgress
   */

  export type AggregateUserProgress = {
    _count: UserProgressCountAggregateOutputType | null
    _avg: UserProgressAvgAggregateOutputType | null
    _sum: UserProgressSumAggregateOutputType | null
    _min: UserProgressMinAggregateOutputType | null
    _max: UserProgressMaxAggregateOutputType | null
  }

  export type UserProgressAvgAggregateOutputType = {
    score: number | null
    attempts: number | null
  }

  export type UserProgressSumAggregateOutputType = {
    score: number | null
    attempts: number | null
  }

  export type UserProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    lessonId: string | null
    score: number | null
    status: $Enums.LessonStatus | null
    attempts: number | null
    lastAttempt: Date | null
  }

  export type UserProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    lessonId: string | null
    score: number | null
    status: $Enums.LessonStatus | null
    attempts: number | null
    lastAttempt: Date | null
  }

  export type UserProgressCountAggregateOutputType = {
    id: number
    userId: number
    lessonId: number
    score: number
    status: number
    attempts: number
    lastAttempt: number
    _all: number
  }


  export type UserProgressAvgAggregateInputType = {
    score?: true
    attempts?: true
  }

  export type UserProgressSumAggregateInputType = {
    score?: true
    attempts?: true
  }

  export type UserProgressMinAggregateInputType = {
    id?: true
    userId?: true
    lessonId?: true
    score?: true
    status?: true
    attempts?: true
    lastAttempt?: true
  }

  export type UserProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    lessonId?: true
    score?: true
    status?: true
    attempts?: true
    lastAttempt?: true
  }

  export type UserProgressCountAggregateInputType = {
    id?: true
    userId?: true
    lessonId?: true
    score?: true
    status?: true
    attempts?: true
    lastAttempt?: true
    _all?: true
  }

  export type UserProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProgress to aggregate.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserProgresses
    **/
    _count?: true | UserProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserProgressMaxAggregateInputType
  }

  export type GetUserProgressAggregateType<T extends UserProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserProgress[P]>
      : GetScalarType<T[P], AggregateUserProgress[P]>
  }




  export type UserProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserProgressWhereInput
    orderBy?: UserProgressOrderByWithAggregationInput | UserProgressOrderByWithAggregationInput[]
    by: UserProgressScalarFieldEnum[] | UserProgressScalarFieldEnum
    having?: UserProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserProgressCountAggregateInputType | true
    _avg?: UserProgressAvgAggregateInputType
    _sum?: UserProgressSumAggregateInputType
    _min?: UserProgressMinAggregateInputType
    _max?: UserProgressMaxAggregateInputType
  }

  export type UserProgressGroupByOutputType = {
    id: string
    userId: string
    lessonId: string
    score: number
    status: $Enums.LessonStatus
    attempts: number
    lastAttempt: Date
    _count: UserProgressCountAggregateOutputType | null
    _avg: UserProgressAvgAggregateOutputType | null
    _sum: UserProgressSumAggregateOutputType | null
    _min: UserProgressMinAggregateOutputType | null
    _max: UserProgressMaxAggregateOutputType | null
  }

  type GetUserProgressGroupByPayload<T extends UserProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    lessonId?: boolean
    score?: boolean
    status?: boolean
    attempts?: boolean
    lastAttempt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgress"]>

  export type UserProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    lessonId?: boolean
    score?: boolean
    status?: boolean
    attempts?: boolean
    lastAttempt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgress"]>

  export type UserProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    lessonId?: boolean
    score?: boolean
    status?: boolean
    attempts?: boolean
    lastAttempt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userProgress"]>

  export type UserProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    lessonId?: boolean
    score?: boolean
    status?: boolean
    attempts?: boolean
    lastAttempt?: boolean
  }

  export type UserProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "lessonId" | "score" | "status" | "attempts" | "lastAttempt", ExtArgs["result"]["userProgress"]>
  export type UserProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }
  export type UserProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }
  export type UserProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | LessonDefaultArgs<ExtArgs>
  }

  export type $UserProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      lesson: Prisma.$LessonPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      lessonId: string
      score: number
      status: $Enums.LessonStatus
      attempts: number
      lastAttempt: Date
    }, ExtArgs["result"]["userProgress"]>
    composites: {}
  }

  type UserProgressGetPayload<S extends boolean | null | undefined | UserProgressDefaultArgs> = $Result.GetResult<Prisma.$UserProgressPayload, S>

  type UserProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserProgressCountAggregateInputType | true
    }

  export interface UserProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserProgress'], meta: { name: 'UserProgress' } }
    /**
     * Find zero or one UserProgress that matches the filter.
     * @param {UserProgressFindUniqueArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserProgressFindUniqueArgs>(args: SelectSubset<T, UserProgressFindUniqueArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserProgressFindUniqueOrThrowArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressFindFirstArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserProgressFindFirstArgs>(args?: SelectSubset<T, UserProgressFindFirstArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressFindFirstOrThrowArgs} args - Arguments to find a UserProgress
     * @example
     * // Get one UserProgress
     * const userProgress = await prisma.userProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserProgresses
     * const userProgresses = await prisma.userProgress.findMany()
     * 
     * // Get first 10 UserProgresses
     * const userProgresses = await prisma.userProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userProgressWithIdOnly = await prisma.userProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserProgressFindManyArgs>(args?: SelectSubset<T, UserProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserProgress.
     * @param {UserProgressCreateArgs} args - Arguments to create a UserProgress.
     * @example
     * // Create one UserProgress
     * const UserProgress = await prisma.userProgress.create({
     *   data: {
     *     // ... data to create a UserProgress
     *   }
     * })
     * 
     */
    create<T extends UserProgressCreateArgs>(args: SelectSubset<T, UserProgressCreateArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserProgresses.
     * @param {UserProgressCreateManyArgs} args - Arguments to create many UserProgresses.
     * @example
     * // Create many UserProgresses
     * const userProgress = await prisma.userProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserProgressCreateManyArgs>(args?: SelectSubset<T, UserProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserProgresses and returns the data saved in the database.
     * @param {UserProgressCreateManyAndReturnArgs} args - Arguments to create many UserProgresses.
     * @example
     * // Create many UserProgresses
     * const userProgress = await prisma.userProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserProgresses and only return the `id`
     * const userProgressWithIdOnly = await prisma.userProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserProgress.
     * @param {UserProgressDeleteArgs} args - Arguments to delete one UserProgress.
     * @example
     * // Delete one UserProgress
     * const UserProgress = await prisma.userProgress.delete({
     *   where: {
     *     // ... filter to delete one UserProgress
     *   }
     * })
     * 
     */
    delete<T extends UserProgressDeleteArgs>(args: SelectSubset<T, UserProgressDeleteArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserProgress.
     * @param {UserProgressUpdateArgs} args - Arguments to update one UserProgress.
     * @example
     * // Update one UserProgress
     * const userProgress = await prisma.userProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserProgressUpdateArgs>(args: SelectSubset<T, UserProgressUpdateArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserProgresses.
     * @param {UserProgressDeleteManyArgs} args - Arguments to filter UserProgresses to delete.
     * @example
     * // Delete a few UserProgresses
     * const { count } = await prisma.userProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserProgressDeleteManyArgs>(args?: SelectSubset<T, UserProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserProgresses
     * const userProgress = await prisma.userProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserProgressUpdateManyArgs>(args: SelectSubset<T, UserProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserProgresses and returns the data updated in the database.
     * @param {UserProgressUpdateManyAndReturnArgs} args - Arguments to update many UserProgresses.
     * @example
     * // Update many UserProgresses
     * const userProgress = await prisma.userProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserProgresses and only return the `id`
     * const userProgressWithIdOnly = await prisma.userProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserProgress.
     * @param {UserProgressUpsertArgs} args - Arguments to update or create a UserProgress.
     * @example
     * // Update or create a UserProgress
     * const userProgress = await prisma.userProgress.upsert({
     *   create: {
     *     // ... data to create a UserProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserProgressUpsertArgs>(args: SelectSubset<T, UserProgressUpsertArgs<ExtArgs>>): Prisma__UserProgressClient<$Result.GetResult<Prisma.$UserProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressCountArgs} args - Arguments to filter UserProgresses to count.
     * @example
     * // Count the number of UserProgresses
     * const count = await prisma.userProgress.count({
     *   where: {
     *     // ... the filter for the UserProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserProgressCountArgs>(
      args?: Subset<T, UserProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserProgressAggregateArgs>(args: Subset<T, UserProgressAggregateArgs>): Prisma.PrismaPromise<GetUserProgressAggregateType<T>>

    /**
     * Group by UserProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserProgress model
   */
  readonly fields: UserProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lesson<T extends LessonDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LessonDefaultArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserProgress model
   */
  interface UserProgressFieldRefs {
    readonly id: FieldRef<"UserProgress", 'String'>
    readonly userId: FieldRef<"UserProgress", 'String'>
    readonly lessonId: FieldRef<"UserProgress", 'String'>
    readonly score: FieldRef<"UserProgress", 'Int'>
    readonly status: FieldRef<"UserProgress", 'LessonStatus'>
    readonly attempts: FieldRef<"UserProgress", 'Int'>
    readonly lastAttempt: FieldRef<"UserProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserProgress findUnique
   */
  export type UserProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress findUniqueOrThrow
   */
  export type UserProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress findFirst
   */
  export type UserProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProgresses.
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProgresses.
     */
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * UserProgress findFirstOrThrow
   */
  export type UserProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgress to fetch.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserProgresses.
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserProgresses.
     */
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * UserProgress findMany
   */
  export type UserProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserProgresses to fetch.
     */
    where?: UserProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserProgresses to fetch.
     */
    orderBy?: UserProgressOrderByWithRelationInput | UserProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserProgresses.
     */
    cursor?: UserProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserProgresses.
     */
    skip?: number
    distinct?: UserProgressScalarFieldEnum | UserProgressScalarFieldEnum[]
  }

  /**
   * UserProgress create
   */
  export type UserProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserProgress.
     */
    data: XOR<UserProgressCreateInput, UserProgressUncheckedCreateInput>
  }

  /**
   * UserProgress createMany
   */
  export type UserProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserProgresses.
     */
    data: UserProgressCreateManyInput | UserProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserProgress createManyAndReturn
   */
  export type UserProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserProgresses.
     */
    data: UserProgressCreateManyInput | UserProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProgress update
   */
  export type UserProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserProgress.
     */
    data: XOR<UserProgressUpdateInput, UserProgressUncheckedUpdateInput>
    /**
     * Choose, which UserProgress to update.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress updateMany
   */
  export type UserProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserProgresses.
     */
    data: XOR<UserProgressUpdateManyMutationInput, UserProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserProgresses to update
     */
    where?: UserProgressWhereInput
    /**
     * Limit how many UserProgresses to update.
     */
    limit?: number
  }

  /**
   * UserProgress updateManyAndReturn
   */
  export type UserProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserProgresses.
     */
    data: XOR<UserProgressUpdateManyMutationInput, UserProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserProgresses to update
     */
    where?: UserProgressWhereInput
    /**
     * Limit how many UserProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserProgress upsert
   */
  export type UserProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserProgress to update in case it exists.
     */
    where: UserProgressWhereUniqueInput
    /**
     * In case the UserProgress found by the `where` argument doesn't exist, create a new UserProgress with this data.
     */
    create: XOR<UserProgressCreateInput, UserProgressUncheckedCreateInput>
    /**
     * In case the UserProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserProgressUpdateInput, UserProgressUncheckedUpdateInput>
  }

  /**
   * UserProgress delete
   */
  export type UserProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
    /**
     * Filter which UserProgress to delete.
     */
    where: UserProgressWhereUniqueInput
  }

  /**
   * UserProgress deleteMany
   */
  export type UserProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserProgresses to delete
     */
    where?: UserProgressWhereInput
    /**
     * Limit how many UserProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserProgress without action
   */
  export type UserProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserProgress
     */
    select?: UserProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserProgress
     */
    omit?: UserProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserProgressInclude<ExtArgs> | null
  }


  /**
   * Model ConversationSession
   */

  export type AggregateConversationSession = {
    _count: ConversationSessionCountAggregateOutputType | null
    _min: ConversationSessionMinAggregateOutputType | null
    _max: ConversationSessionMaxAggregateOutputType | null
  }

  export type ConversationSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    mode: $Enums.InteractionMode | null
    lessonId: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type ConversationSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    mode: $Enums.InteractionMode | null
    lessonId: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type ConversationSessionCountAggregateOutputType = {
    id: number
    userId: number
    mode: number
    lessonId: number
    startedAt: number
    endedAt: number
    _all: number
  }


  export type ConversationSessionMinAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    lessonId?: true
    startedAt?: true
    endedAt?: true
  }

  export type ConversationSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    lessonId?: true
    startedAt?: true
    endedAt?: true
  }

  export type ConversationSessionCountAggregateInputType = {
    id?: true
    userId?: true
    mode?: true
    lessonId?: true
    startedAt?: true
    endedAt?: true
    _all?: true
  }

  export type ConversationSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationSession to aggregate.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConversationSessions
    **/
    _count?: true | ConversationSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConversationSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConversationSessionMaxAggregateInputType
  }

  export type GetConversationSessionAggregateType<T extends ConversationSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateConversationSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConversationSession[P]>
      : GetScalarType<T[P], AggregateConversationSession[P]>
  }




  export type ConversationSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConversationSessionWhereInput
    orderBy?: ConversationSessionOrderByWithAggregationInput | ConversationSessionOrderByWithAggregationInput[]
    by: ConversationSessionScalarFieldEnum[] | ConversationSessionScalarFieldEnum
    having?: ConversationSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConversationSessionCountAggregateInputType | true
    _min?: ConversationSessionMinAggregateInputType
    _max?: ConversationSessionMaxAggregateInputType
  }

  export type ConversationSessionGroupByOutputType = {
    id: string
    userId: string
    mode: $Enums.InteractionMode
    lessonId: string | null
    startedAt: Date
    endedAt: Date | null
    _count: ConversationSessionCountAggregateOutputType | null
    _min: ConversationSessionMinAggregateOutputType | null
    _max: ConversationSessionMaxAggregateOutputType | null
  }

  type GetConversationSessionGroupByPayload<T extends ConversationSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConversationSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConversationSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConversationSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ConversationSessionGroupByOutputType[P]>
        }
      >
    >


  export type ConversationSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    lessonId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | ConversationSession$lessonArgs<ExtArgs>
    interactions?: boolean | ConversationSession$interactionsArgs<ExtArgs>
    _count?: boolean | ConversationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["conversationSession"]>

  export type ConversationSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    lessonId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | ConversationSession$lessonArgs<ExtArgs>
  }, ExtArgs["result"]["conversationSession"]>

  export type ConversationSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    mode?: boolean
    lessonId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | ConversationSession$lessonArgs<ExtArgs>
  }, ExtArgs["result"]["conversationSession"]>

  export type ConversationSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    mode?: boolean
    lessonId?: boolean
    startedAt?: boolean
    endedAt?: boolean
  }

  export type ConversationSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "mode" | "lessonId" | "startedAt" | "endedAt", ExtArgs["result"]["conversationSession"]>
  export type ConversationSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | ConversationSession$lessonArgs<ExtArgs>
    interactions?: boolean | ConversationSession$interactionsArgs<ExtArgs>
    _count?: boolean | ConversationSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConversationSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | ConversationSession$lessonArgs<ExtArgs>
  }
  export type ConversationSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    lesson?: boolean | ConversationSession$lessonArgs<ExtArgs>
  }

  export type $ConversationSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConversationSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      lesson: Prisma.$LessonPayload<ExtArgs> | null
      interactions: Prisma.$InteractionLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      mode: $Enums.InteractionMode
      lessonId: string | null
      startedAt: Date
      endedAt: Date | null
    }, ExtArgs["result"]["conversationSession"]>
    composites: {}
  }

  type ConversationSessionGetPayload<S extends boolean | null | undefined | ConversationSessionDefaultArgs> = $Result.GetResult<Prisma.$ConversationSessionPayload, S>

  type ConversationSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConversationSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConversationSessionCountAggregateInputType | true
    }

  export interface ConversationSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConversationSession'], meta: { name: 'ConversationSession' } }
    /**
     * Find zero or one ConversationSession that matches the filter.
     * @param {ConversationSessionFindUniqueArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConversationSessionFindUniqueArgs>(args: SelectSubset<T, ConversationSessionFindUniqueArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConversationSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConversationSessionFindUniqueOrThrowArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConversationSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ConversationSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionFindFirstArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConversationSessionFindFirstArgs>(args?: SelectSubset<T, ConversationSessionFindFirstArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConversationSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionFindFirstOrThrowArgs} args - Arguments to find a ConversationSession
     * @example
     * // Get one ConversationSession
     * const conversationSession = await prisma.conversationSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConversationSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ConversationSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConversationSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConversationSessions
     * const conversationSessions = await prisma.conversationSession.findMany()
     * 
     * // Get first 10 ConversationSessions
     * const conversationSessions = await prisma.conversationSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const conversationSessionWithIdOnly = await prisma.conversationSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConversationSessionFindManyArgs>(args?: SelectSubset<T, ConversationSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConversationSession.
     * @param {ConversationSessionCreateArgs} args - Arguments to create a ConversationSession.
     * @example
     * // Create one ConversationSession
     * const ConversationSession = await prisma.conversationSession.create({
     *   data: {
     *     // ... data to create a ConversationSession
     *   }
     * })
     * 
     */
    create<T extends ConversationSessionCreateArgs>(args: SelectSubset<T, ConversationSessionCreateArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConversationSessions.
     * @param {ConversationSessionCreateManyArgs} args - Arguments to create many ConversationSessions.
     * @example
     * // Create many ConversationSessions
     * const conversationSession = await prisma.conversationSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConversationSessionCreateManyArgs>(args?: SelectSubset<T, ConversationSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConversationSessions and returns the data saved in the database.
     * @param {ConversationSessionCreateManyAndReturnArgs} args - Arguments to create many ConversationSessions.
     * @example
     * // Create many ConversationSessions
     * const conversationSession = await prisma.conversationSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConversationSessions and only return the `id`
     * const conversationSessionWithIdOnly = await prisma.conversationSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConversationSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, ConversationSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConversationSession.
     * @param {ConversationSessionDeleteArgs} args - Arguments to delete one ConversationSession.
     * @example
     * // Delete one ConversationSession
     * const ConversationSession = await prisma.conversationSession.delete({
     *   where: {
     *     // ... filter to delete one ConversationSession
     *   }
     * })
     * 
     */
    delete<T extends ConversationSessionDeleteArgs>(args: SelectSubset<T, ConversationSessionDeleteArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConversationSession.
     * @param {ConversationSessionUpdateArgs} args - Arguments to update one ConversationSession.
     * @example
     * // Update one ConversationSession
     * const conversationSession = await prisma.conversationSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConversationSessionUpdateArgs>(args: SelectSubset<T, ConversationSessionUpdateArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConversationSessions.
     * @param {ConversationSessionDeleteManyArgs} args - Arguments to filter ConversationSessions to delete.
     * @example
     * // Delete a few ConversationSessions
     * const { count } = await prisma.conversationSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConversationSessionDeleteManyArgs>(args?: SelectSubset<T, ConversationSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConversationSessions
     * const conversationSession = await prisma.conversationSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConversationSessionUpdateManyArgs>(args: SelectSubset<T, ConversationSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConversationSessions and returns the data updated in the database.
     * @param {ConversationSessionUpdateManyAndReturnArgs} args - Arguments to update many ConversationSessions.
     * @example
     * // Update many ConversationSessions
     * const conversationSession = await prisma.conversationSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConversationSessions and only return the `id`
     * const conversationSessionWithIdOnly = await prisma.conversationSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConversationSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, ConversationSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConversationSession.
     * @param {ConversationSessionUpsertArgs} args - Arguments to update or create a ConversationSession.
     * @example
     * // Update or create a ConversationSession
     * const conversationSession = await prisma.conversationSession.upsert({
     *   create: {
     *     // ... data to create a ConversationSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConversationSession we want to update
     *   }
     * })
     */
    upsert<T extends ConversationSessionUpsertArgs>(args: SelectSubset<T, ConversationSessionUpsertArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConversationSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionCountArgs} args - Arguments to filter ConversationSessions to count.
     * @example
     * // Count the number of ConversationSessions
     * const count = await prisma.conversationSession.count({
     *   where: {
     *     // ... the filter for the ConversationSessions we want to count
     *   }
     * })
    **/
    count<T extends ConversationSessionCountArgs>(
      args?: Subset<T, ConversationSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConversationSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConversationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConversationSessionAggregateArgs>(args: Subset<T, ConversationSessionAggregateArgs>): Prisma.PrismaPromise<GetConversationSessionAggregateType<T>>

    /**
     * Group by ConversationSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConversationSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConversationSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConversationSessionGroupByArgs['orderBy'] }
        : { orderBy?: ConversationSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConversationSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConversationSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConversationSession model
   */
  readonly fields: ConversationSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConversationSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConversationSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lesson<T extends ConversationSession$lessonArgs<ExtArgs> = {}>(args?: Subset<T, ConversationSession$lessonArgs<ExtArgs>>): Prisma__LessonClient<$Result.GetResult<Prisma.$LessonPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    interactions<T extends ConversationSession$interactionsArgs<ExtArgs> = {}>(args?: Subset<T, ConversationSession$interactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConversationSession model
   */
  interface ConversationSessionFieldRefs {
    readonly id: FieldRef<"ConversationSession", 'String'>
    readonly userId: FieldRef<"ConversationSession", 'String'>
    readonly mode: FieldRef<"ConversationSession", 'InteractionMode'>
    readonly lessonId: FieldRef<"ConversationSession", 'String'>
    readonly startedAt: FieldRef<"ConversationSession", 'DateTime'>
    readonly endedAt: FieldRef<"ConversationSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConversationSession findUnique
   */
  export type ConversationSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession findUniqueOrThrow
   */
  export type ConversationSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession findFirst
   */
  export type ConversationSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationSessions.
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationSessions.
     */
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * ConversationSession findFirstOrThrow
   */
  export type ConversationSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSession to fetch.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConversationSessions.
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConversationSessions.
     */
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * ConversationSession findMany
   */
  export type ConversationSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter, which ConversationSessions to fetch.
     */
    where?: ConversationSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConversationSessions to fetch.
     */
    orderBy?: ConversationSessionOrderByWithRelationInput | ConversationSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConversationSessions.
     */
    cursor?: ConversationSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConversationSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConversationSessions.
     */
    skip?: number
    distinct?: ConversationSessionScalarFieldEnum | ConversationSessionScalarFieldEnum[]
  }

  /**
   * ConversationSession create
   */
  export type ConversationSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ConversationSession.
     */
    data: XOR<ConversationSessionCreateInput, ConversationSessionUncheckedCreateInput>
  }

  /**
   * ConversationSession createMany
   */
  export type ConversationSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConversationSessions.
     */
    data: ConversationSessionCreateManyInput | ConversationSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConversationSession createManyAndReturn
   */
  export type ConversationSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * The data used to create many ConversationSessions.
     */
    data: ConversationSessionCreateManyInput | ConversationSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationSession update
   */
  export type ConversationSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ConversationSession.
     */
    data: XOR<ConversationSessionUpdateInput, ConversationSessionUncheckedUpdateInput>
    /**
     * Choose, which ConversationSession to update.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession updateMany
   */
  export type ConversationSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConversationSessions.
     */
    data: XOR<ConversationSessionUpdateManyMutationInput, ConversationSessionUncheckedUpdateManyInput>
    /**
     * Filter which ConversationSessions to update
     */
    where?: ConversationSessionWhereInput
    /**
     * Limit how many ConversationSessions to update.
     */
    limit?: number
  }

  /**
   * ConversationSession updateManyAndReturn
   */
  export type ConversationSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * The data used to update ConversationSessions.
     */
    data: XOR<ConversationSessionUpdateManyMutationInput, ConversationSessionUncheckedUpdateManyInput>
    /**
     * Filter which ConversationSessions to update
     */
    where?: ConversationSessionWhereInput
    /**
     * Limit how many ConversationSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ConversationSession upsert
   */
  export type ConversationSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ConversationSession to update in case it exists.
     */
    where: ConversationSessionWhereUniqueInput
    /**
     * In case the ConversationSession found by the `where` argument doesn't exist, create a new ConversationSession with this data.
     */
    create: XOR<ConversationSessionCreateInput, ConversationSessionUncheckedCreateInput>
    /**
     * In case the ConversationSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConversationSessionUpdateInput, ConversationSessionUncheckedUpdateInput>
  }

  /**
   * ConversationSession delete
   */
  export type ConversationSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
    /**
     * Filter which ConversationSession to delete.
     */
    where: ConversationSessionWhereUniqueInput
  }

  /**
   * ConversationSession deleteMany
   */
  export type ConversationSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConversationSessions to delete
     */
    where?: ConversationSessionWhereInput
    /**
     * Limit how many ConversationSessions to delete.
     */
    limit?: number
  }

  /**
   * ConversationSession.lesson
   */
  export type ConversationSession$lessonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lesson
     */
    select?: LessonSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lesson
     */
    omit?: LessonOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LessonInclude<ExtArgs> | null
    where?: LessonWhereInput
  }

  /**
   * ConversationSession.interactions
   */
  export type ConversationSession$interactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    where?: InteractionLogWhereInput
    orderBy?: InteractionLogOrderByWithRelationInput | InteractionLogOrderByWithRelationInput[]
    cursor?: InteractionLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InteractionLogScalarFieldEnum | InteractionLogScalarFieldEnum[]
  }

  /**
   * ConversationSession without action
   */
  export type ConversationSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConversationSession
     */
    select?: ConversationSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConversationSession
     */
    omit?: ConversationSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConversationSessionInclude<ExtArgs> | null
  }


  /**
   * Model InteractionLog
   */

  export type AggregateInteractionLog = {
    _count: InteractionLogCountAggregateOutputType | null
    _avg: InteractionLogAvgAggregateOutputType | null
    _sum: InteractionLogSumAggregateOutputType | null
    _min: InteractionLogMinAggregateOutputType | null
    _max: InteractionLogMaxAggregateOutputType | null
  }

  export type InteractionLogAvgAggregateOutputType = {
    sentimentScore: number | null
    taskAchievement: number | null
    grammar: number | null
    vocabulary: number | null
    fluency: number | null
    totalScore: number | null
  }

  export type InteractionLogSumAggregateOutputType = {
    sentimentScore: number | null
    taskAchievement: number | null
    grammar: number | null
    vocabulary: number | null
    fluency: number | null
    totalScore: number | null
  }

  export type InteractionLogMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userAudioTrans: string | null
    leryResponse: string | null
    grammaticalFixes: string | null
    sentimentScore: number | null
    taskAchievement: number | null
    grammar: number | null
    vocabulary: number | null
    fluency: number | null
    totalScore: number | null
    evaluationReasoning: string | null
    isDisputed: boolean | null
    disputeStatus: $Enums.DisputeStatus | null
    createdAt: Date | null
  }

  export type InteractionLogMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    userAudioTrans: string | null
    leryResponse: string | null
    grammaticalFixes: string | null
    sentimentScore: number | null
    taskAchievement: number | null
    grammar: number | null
    vocabulary: number | null
    fluency: number | null
    totalScore: number | null
    evaluationReasoning: string | null
    isDisputed: boolean | null
    disputeStatus: $Enums.DisputeStatus | null
    createdAt: Date | null
  }

  export type InteractionLogCountAggregateOutputType = {
    id: number
    sessionId: number
    userAudioTrans: number
    leryResponse: number
    grammaticalFixes: number
    sentimentScore: number
    taskAchievement: number
    grammar: number
    vocabulary: number
    fluency: number
    totalScore: number
    evaluationReasoning: number
    isDisputed: number
    disputeStatus: number
    createdAt: number
    _all: number
  }


  export type InteractionLogAvgAggregateInputType = {
    sentimentScore?: true
    taskAchievement?: true
    grammar?: true
    vocabulary?: true
    fluency?: true
    totalScore?: true
  }

  export type InteractionLogSumAggregateInputType = {
    sentimentScore?: true
    taskAchievement?: true
    grammar?: true
    vocabulary?: true
    fluency?: true
    totalScore?: true
  }

  export type InteractionLogMinAggregateInputType = {
    id?: true
    sessionId?: true
    userAudioTrans?: true
    leryResponse?: true
    grammaticalFixes?: true
    sentimentScore?: true
    taskAchievement?: true
    grammar?: true
    vocabulary?: true
    fluency?: true
    totalScore?: true
    evaluationReasoning?: true
    isDisputed?: true
    disputeStatus?: true
    createdAt?: true
  }

  export type InteractionLogMaxAggregateInputType = {
    id?: true
    sessionId?: true
    userAudioTrans?: true
    leryResponse?: true
    grammaticalFixes?: true
    sentimentScore?: true
    taskAchievement?: true
    grammar?: true
    vocabulary?: true
    fluency?: true
    totalScore?: true
    evaluationReasoning?: true
    isDisputed?: true
    disputeStatus?: true
    createdAt?: true
  }

  export type InteractionLogCountAggregateInputType = {
    id?: true
    sessionId?: true
    userAudioTrans?: true
    leryResponse?: true
    grammaticalFixes?: true
    sentimentScore?: true
    taskAchievement?: true
    grammar?: true
    vocabulary?: true
    fluency?: true
    totalScore?: true
    evaluationReasoning?: true
    isDisputed?: true
    disputeStatus?: true
    createdAt?: true
    _all?: true
  }

  export type InteractionLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InteractionLog to aggregate.
     */
    where?: InteractionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteractionLogs to fetch.
     */
    orderBy?: InteractionLogOrderByWithRelationInput | InteractionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InteractionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteractionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteractionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InteractionLogs
    **/
    _count?: true | InteractionLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InteractionLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InteractionLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InteractionLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InteractionLogMaxAggregateInputType
  }

  export type GetInteractionLogAggregateType<T extends InteractionLogAggregateArgs> = {
        [P in keyof T & keyof AggregateInteractionLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInteractionLog[P]>
      : GetScalarType<T[P], AggregateInteractionLog[P]>
  }




  export type InteractionLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InteractionLogWhereInput
    orderBy?: InteractionLogOrderByWithAggregationInput | InteractionLogOrderByWithAggregationInput[]
    by: InteractionLogScalarFieldEnum[] | InteractionLogScalarFieldEnum
    having?: InteractionLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InteractionLogCountAggregateInputType | true
    _avg?: InteractionLogAvgAggregateInputType
    _sum?: InteractionLogSumAggregateInputType
    _min?: InteractionLogMinAggregateInputType
    _max?: InteractionLogMaxAggregateInputType
  }

  export type InteractionLogGroupByOutputType = {
    id: string
    sessionId: string
    userAudioTrans: string | null
    leryResponse: string | null
    grammaticalFixes: string | null
    sentimentScore: number | null
    taskAchievement: number | null
    grammar: number | null
    vocabulary: number | null
    fluency: number | null
    totalScore: number | null
    evaluationReasoning: string | null
    isDisputed: boolean
    disputeStatus: $Enums.DisputeStatus | null
    createdAt: Date
    _count: InteractionLogCountAggregateOutputType | null
    _avg: InteractionLogAvgAggregateOutputType | null
    _sum: InteractionLogSumAggregateOutputType | null
    _min: InteractionLogMinAggregateOutputType | null
    _max: InteractionLogMaxAggregateOutputType | null
  }

  type GetInteractionLogGroupByPayload<T extends InteractionLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InteractionLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InteractionLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InteractionLogGroupByOutputType[P]>
            : GetScalarType<T[P], InteractionLogGroupByOutputType[P]>
        }
      >
    >


  export type InteractionLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userAudioTrans?: boolean
    leryResponse?: boolean
    grammaticalFixes?: boolean
    sentimentScore?: boolean
    taskAchievement?: boolean
    grammar?: boolean
    vocabulary?: boolean
    fluency?: boolean
    totalScore?: boolean
    evaluationReasoning?: boolean
    isDisputed?: boolean
    disputeStatus?: boolean
    createdAt?: boolean
    session?: boolean | ConversationSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interactionLog"]>

  export type InteractionLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userAudioTrans?: boolean
    leryResponse?: boolean
    grammaticalFixes?: boolean
    sentimentScore?: boolean
    taskAchievement?: boolean
    grammar?: boolean
    vocabulary?: boolean
    fluency?: boolean
    totalScore?: boolean
    evaluationReasoning?: boolean
    isDisputed?: boolean
    disputeStatus?: boolean
    createdAt?: boolean
    session?: boolean | ConversationSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interactionLog"]>

  export type InteractionLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    userAudioTrans?: boolean
    leryResponse?: boolean
    grammaticalFixes?: boolean
    sentimentScore?: boolean
    taskAchievement?: boolean
    grammar?: boolean
    vocabulary?: boolean
    fluency?: boolean
    totalScore?: boolean
    evaluationReasoning?: boolean
    isDisputed?: boolean
    disputeStatus?: boolean
    createdAt?: boolean
    session?: boolean | ConversationSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interactionLog"]>

  export type InteractionLogSelectScalar = {
    id?: boolean
    sessionId?: boolean
    userAudioTrans?: boolean
    leryResponse?: boolean
    grammaticalFixes?: boolean
    sentimentScore?: boolean
    taskAchievement?: boolean
    grammar?: boolean
    vocabulary?: boolean
    fluency?: boolean
    totalScore?: boolean
    evaluationReasoning?: boolean
    isDisputed?: boolean
    disputeStatus?: boolean
    createdAt?: boolean
  }

  export type InteractionLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionId" | "userAudioTrans" | "leryResponse" | "grammaticalFixes" | "sentimentScore" | "taskAchievement" | "grammar" | "vocabulary" | "fluency" | "totalScore" | "evaluationReasoning" | "isDisputed" | "disputeStatus" | "createdAt", ExtArgs["result"]["interactionLog"]>
  export type InteractionLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ConversationSessionDefaultArgs<ExtArgs>
  }
  export type InteractionLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ConversationSessionDefaultArgs<ExtArgs>
  }
  export type InteractionLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ConversationSessionDefaultArgs<ExtArgs>
  }

  export type $InteractionLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InteractionLog"
    objects: {
      session: Prisma.$ConversationSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      userAudioTrans: string | null
      leryResponse: string | null
      grammaticalFixes: string | null
      sentimentScore: number | null
      taskAchievement: number | null
      grammar: number | null
      vocabulary: number | null
      fluency: number | null
      totalScore: number | null
      evaluationReasoning: string | null
      isDisputed: boolean
      disputeStatus: $Enums.DisputeStatus | null
      createdAt: Date
    }, ExtArgs["result"]["interactionLog"]>
    composites: {}
  }

  type InteractionLogGetPayload<S extends boolean | null | undefined | InteractionLogDefaultArgs> = $Result.GetResult<Prisma.$InteractionLogPayload, S>

  type InteractionLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InteractionLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InteractionLogCountAggregateInputType | true
    }

  export interface InteractionLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InteractionLog'], meta: { name: 'InteractionLog' } }
    /**
     * Find zero or one InteractionLog that matches the filter.
     * @param {InteractionLogFindUniqueArgs} args - Arguments to find a InteractionLog
     * @example
     * // Get one InteractionLog
     * const interactionLog = await prisma.interactionLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InteractionLogFindUniqueArgs>(args: SelectSubset<T, InteractionLogFindUniqueArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InteractionLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InteractionLogFindUniqueOrThrowArgs} args - Arguments to find a InteractionLog
     * @example
     * // Get one InteractionLog
     * const interactionLog = await prisma.interactionLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InteractionLogFindUniqueOrThrowArgs>(args: SelectSubset<T, InteractionLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InteractionLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionLogFindFirstArgs} args - Arguments to find a InteractionLog
     * @example
     * // Get one InteractionLog
     * const interactionLog = await prisma.interactionLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InteractionLogFindFirstArgs>(args?: SelectSubset<T, InteractionLogFindFirstArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InteractionLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionLogFindFirstOrThrowArgs} args - Arguments to find a InteractionLog
     * @example
     * // Get one InteractionLog
     * const interactionLog = await prisma.interactionLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InteractionLogFindFirstOrThrowArgs>(args?: SelectSubset<T, InteractionLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InteractionLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InteractionLogs
     * const interactionLogs = await prisma.interactionLog.findMany()
     * 
     * // Get first 10 InteractionLogs
     * const interactionLogs = await prisma.interactionLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const interactionLogWithIdOnly = await prisma.interactionLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InteractionLogFindManyArgs>(args?: SelectSubset<T, InteractionLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InteractionLog.
     * @param {InteractionLogCreateArgs} args - Arguments to create a InteractionLog.
     * @example
     * // Create one InteractionLog
     * const InteractionLog = await prisma.interactionLog.create({
     *   data: {
     *     // ... data to create a InteractionLog
     *   }
     * })
     * 
     */
    create<T extends InteractionLogCreateArgs>(args: SelectSubset<T, InteractionLogCreateArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InteractionLogs.
     * @param {InteractionLogCreateManyArgs} args - Arguments to create many InteractionLogs.
     * @example
     * // Create many InteractionLogs
     * const interactionLog = await prisma.interactionLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InteractionLogCreateManyArgs>(args?: SelectSubset<T, InteractionLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InteractionLogs and returns the data saved in the database.
     * @param {InteractionLogCreateManyAndReturnArgs} args - Arguments to create many InteractionLogs.
     * @example
     * // Create many InteractionLogs
     * const interactionLog = await prisma.interactionLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InteractionLogs and only return the `id`
     * const interactionLogWithIdOnly = await prisma.interactionLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InteractionLogCreateManyAndReturnArgs>(args?: SelectSubset<T, InteractionLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InteractionLog.
     * @param {InteractionLogDeleteArgs} args - Arguments to delete one InteractionLog.
     * @example
     * // Delete one InteractionLog
     * const InteractionLog = await prisma.interactionLog.delete({
     *   where: {
     *     // ... filter to delete one InteractionLog
     *   }
     * })
     * 
     */
    delete<T extends InteractionLogDeleteArgs>(args: SelectSubset<T, InteractionLogDeleteArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InteractionLog.
     * @param {InteractionLogUpdateArgs} args - Arguments to update one InteractionLog.
     * @example
     * // Update one InteractionLog
     * const interactionLog = await prisma.interactionLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InteractionLogUpdateArgs>(args: SelectSubset<T, InteractionLogUpdateArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InteractionLogs.
     * @param {InteractionLogDeleteManyArgs} args - Arguments to filter InteractionLogs to delete.
     * @example
     * // Delete a few InteractionLogs
     * const { count } = await prisma.interactionLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InteractionLogDeleteManyArgs>(args?: SelectSubset<T, InteractionLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InteractionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InteractionLogs
     * const interactionLog = await prisma.interactionLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InteractionLogUpdateManyArgs>(args: SelectSubset<T, InteractionLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InteractionLogs and returns the data updated in the database.
     * @param {InteractionLogUpdateManyAndReturnArgs} args - Arguments to update many InteractionLogs.
     * @example
     * // Update many InteractionLogs
     * const interactionLog = await prisma.interactionLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InteractionLogs and only return the `id`
     * const interactionLogWithIdOnly = await prisma.interactionLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InteractionLogUpdateManyAndReturnArgs>(args: SelectSubset<T, InteractionLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InteractionLog.
     * @param {InteractionLogUpsertArgs} args - Arguments to update or create a InteractionLog.
     * @example
     * // Update or create a InteractionLog
     * const interactionLog = await prisma.interactionLog.upsert({
     *   create: {
     *     // ... data to create a InteractionLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InteractionLog we want to update
     *   }
     * })
     */
    upsert<T extends InteractionLogUpsertArgs>(args: SelectSubset<T, InteractionLogUpsertArgs<ExtArgs>>): Prisma__InteractionLogClient<$Result.GetResult<Prisma.$InteractionLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InteractionLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionLogCountArgs} args - Arguments to filter InteractionLogs to count.
     * @example
     * // Count the number of InteractionLogs
     * const count = await prisma.interactionLog.count({
     *   where: {
     *     // ... the filter for the InteractionLogs we want to count
     *   }
     * })
    **/
    count<T extends InteractionLogCountArgs>(
      args?: Subset<T, InteractionLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InteractionLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InteractionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InteractionLogAggregateArgs>(args: Subset<T, InteractionLogAggregateArgs>): Prisma.PrismaPromise<GetInteractionLogAggregateType<T>>

    /**
     * Group by InteractionLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InteractionLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InteractionLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InteractionLogGroupByArgs['orderBy'] }
        : { orderBy?: InteractionLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InteractionLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInteractionLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InteractionLog model
   */
  readonly fields: InteractionLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InteractionLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InteractionLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ConversationSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConversationSessionDefaultArgs<ExtArgs>>): Prisma__ConversationSessionClient<$Result.GetResult<Prisma.$ConversationSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InteractionLog model
   */
  interface InteractionLogFieldRefs {
    readonly id: FieldRef<"InteractionLog", 'String'>
    readonly sessionId: FieldRef<"InteractionLog", 'String'>
    readonly userAudioTrans: FieldRef<"InteractionLog", 'String'>
    readonly leryResponse: FieldRef<"InteractionLog", 'String'>
    readonly grammaticalFixes: FieldRef<"InteractionLog", 'String'>
    readonly sentimentScore: FieldRef<"InteractionLog", 'Float'>
    readonly taskAchievement: FieldRef<"InteractionLog", 'Int'>
    readonly grammar: FieldRef<"InteractionLog", 'Int'>
    readonly vocabulary: FieldRef<"InteractionLog", 'Int'>
    readonly fluency: FieldRef<"InteractionLog", 'Int'>
    readonly totalScore: FieldRef<"InteractionLog", 'Int'>
    readonly evaluationReasoning: FieldRef<"InteractionLog", 'String'>
    readonly isDisputed: FieldRef<"InteractionLog", 'Boolean'>
    readonly disputeStatus: FieldRef<"InteractionLog", 'DisputeStatus'>
    readonly createdAt: FieldRef<"InteractionLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InteractionLog findUnique
   */
  export type InteractionLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * Filter, which InteractionLog to fetch.
     */
    where: InteractionLogWhereUniqueInput
  }

  /**
   * InteractionLog findUniqueOrThrow
   */
  export type InteractionLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * Filter, which InteractionLog to fetch.
     */
    where: InteractionLogWhereUniqueInput
  }

  /**
   * InteractionLog findFirst
   */
  export type InteractionLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * Filter, which InteractionLog to fetch.
     */
    where?: InteractionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteractionLogs to fetch.
     */
    orderBy?: InteractionLogOrderByWithRelationInput | InteractionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InteractionLogs.
     */
    cursor?: InteractionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteractionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteractionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InteractionLogs.
     */
    distinct?: InteractionLogScalarFieldEnum | InteractionLogScalarFieldEnum[]
  }

  /**
   * InteractionLog findFirstOrThrow
   */
  export type InteractionLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * Filter, which InteractionLog to fetch.
     */
    where?: InteractionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteractionLogs to fetch.
     */
    orderBy?: InteractionLogOrderByWithRelationInput | InteractionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InteractionLogs.
     */
    cursor?: InteractionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteractionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteractionLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InteractionLogs.
     */
    distinct?: InteractionLogScalarFieldEnum | InteractionLogScalarFieldEnum[]
  }

  /**
   * InteractionLog findMany
   */
  export type InteractionLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * Filter, which InteractionLogs to fetch.
     */
    where?: InteractionLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InteractionLogs to fetch.
     */
    orderBy?: InteractionLogOrderByWithRelationInput | InteractionLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InteractionLogs.
     */
    cursor?: InteractionLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InteractionLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InteractionLogs.
     */
    skip?: number
    distinct?: InteractionLogScalarFieldEnum | InteractionLogScalarFieldEnum[]
  }

  /**
   * InteractionLog create
   */
  export type InteractionLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * The data needed to create a InteractionLog.
     */
    data: XOR<InteractionLogCreateInput, InteractionLogUncheckedCreateInput>
  }

  /**
   * InteractionLog createMany
   */
  export type InteractionLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InteractionLogs.
     */
    data: InteractionLogCreateManyInput | InteractionLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InteractionLog createManyAndReturn
   */
  export type InteractionLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * The data used to create many InteractionLogs.
     */
    data: InteractionLogCreateManyInput | InteractionLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InteractionLog update
   */
  export type InteractionLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * The data needed to update a InteractionLog.
     */
    data: XOR<InteractionLogUpdateInput, InteractionLogUncheckedUpdateInput>
    /**
     * Choose, which InteractionLog to update.
     */
    where: InteractionLogWhereUniqueInput
  }

  /**
   * InteractionLog updateMany
   */
  export type InteractionLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InteractionLogs.
     */
    data: XOR<InteractionLogUpdateManyMutationInput, InteractionLogUncheckedUpdateManyInput>
    /**
     * Filter which InteractionLogs to update
     */
    where?: InteractionLogWhereInput
    /**
     * Limit how many InteractionLogs to update.
     */
    limit?: number
  }

  /**
   * InteractionLog updateManyAndReturn
   */
  export type InteractionLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * The data used to update InteractionLogs.
     */
    data: XOR<InteractionLogUpdateManyMutationInput, InteractionLogUncheckedUpdateManyInput>
    /**
     * Filter which InteractionLogs to update
     */
    where?: InteractionLogWhereInput
    /**
     * Limit how many InteractionLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * InteractionLog upsert
   */
  export type InteractionLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * The filter to search for the InteractionLog to update in case it exists.
     */
    where: InteractionLogWhereUniqueInput
    /**
     * In case the InteractionLog found by the `where` argument doesn't exist, create a new InteractionLog with this data.
     */
    create: XOR<InteractionLogCreateInput, InteractionLogUncheckedCreateInput>
    /**
     * In case the InteractionLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InteractionLogUpdateInput, InteractionLogUncheckedUpdateInput>
  }

  /**
   * InteractionLog delete
   */
  export type InteractionLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
    /**
     * Filter which InteractionLog to delete.
     */
    where: InteractionLogWhereUniqueInput
  }

  /**
   * InteractionLog deleteMany
   */
  export type InteractionLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InteractionLogs to delete
     */
    where?: InteractionLogWhereInput
    /**
     * Limit how many InteractionLogs to delete.
     */
    limit?: number
  }

  /**
   * InteractionLog without action
   */
  export type InteractionLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InteractionLog
     */
    select?: InteractionLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InteractionLog
     */
    omit?: InteractionLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InteractionLogInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LanguageScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type LanguageScalarFieldEnum = (typeof LanguageScalarFieldEnum)[keyof typeof LanguageScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    passwordHash: 'passwordHash',
    name: 'name',
    currentLevel: 'currentLevel',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    targetLanguageId: 'targetLanguageId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    status: 'status',
    planType: 'planType',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const DeviceScalarFieldEnum: {
    id: 'id',
    serialNumber: 'serialNumber',
    nickname: 'nickname',
    isActive: 'isActive',
    userId: 'userId',
    apiKey: 'apiKey'
  };

  export type DeviceScalarFieldEnum = (typeof DeviceScalarFieldEnum)[keyof typeof DeviceScalarFieldEnum]


  export const UserProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    nativeLanguage: 'nativeLanguage',
    interests: 'interests',
    hobbies: 'hobbies',
    occupation: 'occupation',
    ageGroup: 'ageGroup',
    learningGoal: 'learningGoal',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserProfileScalarFieldEnum = (typeof UserProfileScalarFieldEnum)[keyof typeof UserProfileScalarFieldEnum]


  export const LevelScalarFieldEnum: {
    id: 'id',
    code: 'code',
    description: 'description',
    languageId: 'languageId'
  };

  export type LevelScalarFieldEnum = (typeof LevelScalarFieldEnum)[keyof typeof LevelScalarFieldEnum]


  export const ModuleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    order: 'order',
    isGenerated: 'isGenerated',
    levelId: 'levelId',
    userId: 'userId'
  };

  export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum]


  export const LessonScalarFieldEnum: {
    id: 'id',
    title: 'title',
    scenario: 'scenario',
    systemPrompt: 'systemPrompt',
    objectives: 'objectives',
    order: 'order',
    isGenerated: 'isGenerated',
    moduleId: 'moduleId'
  };

  export type LessonScalarFieldEnum = (typeof LessonScalarFieldEnum)[keyof typeof LessonScalarFieldEnum]


  export const UserProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    lessonId: 'lessonId',
    score: 'score',
    status: 'status',
    attempts: 'attempts',
    lastAttempt: 'lastAttempt'
  };

  export type UserProgressScalarFieldEnum = (typeof UserProgressScalarFieldEnum)[keyof typeof UserProgressScalarFieldEnum]


  export const ConversationSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    mode: 'mode',
    lessonId: 'lessonId',
    startedAt: 'startedAt',
    endedAt: 'endedAt'
  };

  export type ConversationSessionScalarFieldEnum = (typeof ConversationSessionScalarFieldEnum)[keyof typeof ConversationSessionScalarFieldEnum]


  export const InteractionLogScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    userAudioTrans: 'userAudioTrans',
    leryResponse: 'leryResponse',
    grammaticalFixes: 'grammaticalFixes',
    sentimentScore: 'sentimentScore',
    taskAchievement: 'taskAchievement',
    grammar: 'grammar',
    vocabulary: 'vocabulary',
    fluency: 'fluency',
    totalScore: 'totalScore',
    evaluationReasoning: 'evaluationReasoning',
    isDisputed: 'isDisputed',
    disputeStatus: 'disputeStatus',
    createdAt: 'createdAt'
  };

  export type InteractionLogScalarFieldEnum = (typeof InteractionLogScalarFieldEnum)[keyof typeof InteractionLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'UserLevel'
   */
  export type EnumUserLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserLevel'>
    


  /**
   * Reference to a field of type 'UserLevel[]'
   */
  export type ListEnumUserLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserLevel[]'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'LessonStatus'
   */
  export type EnumLessonStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LessonStatus'>
    


  /**
   * Reference to a field of type 'LessonStatus[]'
   */
  export type ListEnumLessonStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LessonStatus[]'>
    


  /**
   * Reference to a field of type 'InteractionMode'
   */
  export type EnumInteractionModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InteractionMode'>
    


  /**
   * Reference to a field of type 'InteractionMode[]'
   */
  export type ListEnumInteractionModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InteractionMode[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DisputeStatus'
   */
  export type EnumDisputeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisputeStatus'>
    


  /**
   * Reference to a field of type 'DisputeStatus[]'
   */
  export type ListEnumDisputeStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DisputeStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type LanguageWhereInput = {
    AND?: LanguageWhereInput | LanguageWhereInput[]
    OR?: LanguageWhereInput[]
    NOT?: LanguageWhereInput | LanguageWhereInput[]
    id?: StringFilter<"Language"> | string
    code?: StringFilter<"Language"> | string
    name?: StringFilter<"Language"> | string
    isActive?: BoolFilter<"Language"> | boolean
    createdAt?: DateTimeFilter<"Language"> | Date | string
    levels?: LevelListRelationFilter
    users?: UserListRelationFilter
  }

  export type LanguageOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    levels?: LevelOrderByRelationAggregateInput
    users?: UserOrderByRelationAggregateInput
  }

  export type LanguageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: LanguageWhereInput | LanguageWhereInput[]
    OR?: LanguageWhereInput[]
    NOT?: LanguageWhereInput | LanguageWhereInput[]
    name?: StringFilter<"Language"> | string
    isActive?: BoolFilter<"Language"> | boolean
    createdAt?: DateTimeFilter<"Language"> | Date | string
    levels?: LevelListRelationFilter
    users?: UserListRelationFilter
  }, "id" | "code">

  export type LanguageOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: LanguageCountOrderByAggregateInput
    _max?: LanguageMaxOrderByAggregateInput
    _min?: LanguageMinOrderByAggregateInput
  }

  export type LanguageScalarWhereWithAggregatesInput = {
    AND?: LanguageScalarWhereWithAggregatesInput | LanguageScalarWhereWithAggregatesInput[]
    OR?: LanguageScalarWhereWithAggregatesInput[]
    NOT?: LanguageScalarWhereWithAggregatesInput | LanguageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Language"> | string
    code?: StringWithAggregatesFilter<"Language"> | string
    name?: StringWithAggregatesFilter<"Language"> | string
    isActive?: BoolWithAggregatesFilter<"Language"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Language"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    currentLevel?: EnumUserLevelFilter<"User"> | $Enums.UserLevel
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    targetLanguageId?: StringNullableFilter<"User"> | string | null
    targetLanguage?: XOR<LanguageNullableScalarRelationFilter, LanguageWhereInput> | null
    profile?: XOR<UserProfileNullableScalarRelationFilter, UserProfileWhereInput> | null
    devices?: DeviceListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    progress?: UserProgressListRelationFilter
    sessions?: ConversationSessionListRelationFilter
    modules?: ModuleListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    currentLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    targetLanguageId?: SortOrderInput | SortOrder
    targetLanguage?: LanguageOrderByWithRelationInput
    profile?: UserProfileOrderByWithRelationInput
    devices?: DeviceOrderByRelationAggregateInput
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    progress?: UserProgressOrderByRelationAggregateInput
    sessions?: ConversationSessionOrderByRelationAggregateInput
    modules?: ModuleOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    currentLevel?: EnumUserLevelFilter<"User"> | $Enums.UserLevel
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    targetLanguageId?: StringNullableFilter<"User"> | string | null
    targetLanguage?: XOR<LanguageNullableScalarRelationFilter, LanguageWhereInput> | null
    profile?: XOR<UserProfileNullableScalarRelationFilter, UserProfileWhereInput> | null
    devices?: DeviceListRelationFilter
    subscriptions?: SubscriptionListRelationFilter
    progress?: UserProgressListRelationFilter
    sessions?: ConversationSessionListRelationFilter
    modules?: ModuleListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    currentLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    targetLanguageId?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    currentLevel?: EnumUserLevelWithAggregatesFilter<"User"> | $Enums.UserLevel
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    targetLanguageId?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    planType?: StringFilter<"Subscription"> | string
    expiresAt?: DateTimeFilter<"Subscription"> | Date | string
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planType?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    userId?: StringFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    planType?: StringFilter<"Subscription"> | string
    expiresAt?: DateTimeFilter<"Subscription"> | Date | string
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planType?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    userId?: StringWithAggregatesFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusWithAggregatesFilter<"Subscription"> | $Enums.SubscriptionStatus
    planType?: StringWithAggregatesFilter<"Subscription"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Subscription"> | Date | string
  }

  export type DeviceWhereInput = {
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    id?: StringFilter<"Device"> | string
    serialNumber?: StringFilter<"Device"> | string
    nickname?: StringNullableFilter<"Device"> | string | null
    isActive?: BoolFilter<"Device"> | boolean
    userId?: StringFilter<"Device"> | string
    apiKey?: StringNullableFilter<"Device"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DeviceOrderByWithRelationInput = {
    id?: SortOrder
    serialNumber?: SortOrder
    nickname?: SortOrderInput | SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    apiKey?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DeviceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    serialNumber?: string
    apiKey?: string
    AND?: DeviceWhereInput | DeviceWhereInput[]
    OR?: DeviceWhereInput[]
    NOT?: DeviceWhereInput | DeviceWhereInput[]
    nickname?: StringNullableFilter<"Device"> | string | null
    isActive?: BoolFilter<"Device"> | boolean
    userId?: StringFilter<"Device"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "serialNumber" | "apiKey">

  export type DeviceOrderByWithAggregationInput = {
    id?: SortOrder
    serialNumber?: SortOrder
    nickname?: SortOrderInput | SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    apiKey?: SortOrderInput | SortOrder
    _count?: DeviceCountOrderByAggregateInput
    _max?: DeviceMaxOrderByAggregateInput
    _min?: DeviceMinOrderByAggregateInput
  }

  export type DeviceScalarWhereWithAggregatesInput = {
    AND?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    OR?: DeviceScalarWhereWithAggregatesInput[]
    NOT?: DeviceScalarWhereWithAggregatesInput | DeviceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Device"> | string
    serialNumber?: StringWithAggregatesFilter<"Device"> | string
    nickname?: StringNullableWithAggregatesFilter<"Device"> | string | null
    isActive?: BoolWithAggregatesFilter<"Device"> | boolean
    userId?: StringWithAggregatesFilter<"Device"> | string
    apiKey?: StringNullableWithAggregatesFilter<"Device"> | string | null
  }

  export type UserProfileWhereInput = {
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    id?: StringFilter<"UserProfile"> | string
    userId?: StringFilter<"UserProfile"> | string
    nativeLanguage?: StringFilter<"UserProfile"> | string
    interests?: StringNullableListFilter<"UserProfile">
    hobbies?: StringNullableListFilter<"UserProfile">
    occupation?: StringNullableFilter<"UserProfile"> | string | null
    ageGroup?: StringNullableFilter<"UserProfile"> | string | null
    learningGoal?: StringNullableFilter<"UserProfile"> | string | null
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    nativeLanguage?: SortOrder
    interests?: SortOrder
    hobbies?: SortOrder
    occupation?: SortOrderInput | SortOrder
    ageGroup?: SortOrderInput | SortOrder
    learningGoal?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserProfileWhereInput | UserProfileWhereInput[]
    OR?: UserProfileWhereInput[]
    NOT?: UserProfileWhereInput | UserProfileWhereInput[]
    nativeLanguage?: StringFilter<"UserProfile"> | string
    interests?: StringNullableListFilter<"UserProfile">
    hobbies?: StringNullableListFilter<"UserProfile">
    occupation?: StringNullableFilter<"UserProfile"> | string | null
    ageGroup?: StringNullableFilter<"UserProfile"> | string | null
    learningGoal?: StringNullableFilter<"UserProfile"> | string | null
    createdAt?: DateTimeFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeFilter<"UserProfile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    nativeLanguage?: SortOrder
    interests?: SortOrder
    hobbies?: SortOrder
    occupation?: SortOrderInput | SortOrder
    ageGroup?: SortOrderInput | SortOrder
    learningGoal?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserProfileCountOrderByAggregateInput
    _max?: UserProfileMaxOrderByAggregateInput
    _min?: UserProfileMinOrderByAggregateInput
  }

  export type UserProfileScalarWhereWithAggregatesInput = {
    AND?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    OR?: UserProfileScalarWhereWithAggregatesInput[]
    NOT?: UserProfileScalarWhereWithAggregatesInput | UserProfileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProfile"> | string
    userId?: StringWithAggregatesFilter<"UserProfile"> | string
    nativeLanguage?: StringWithAggregatesFilter<"UserProfile"> | string
    interests?: StringNullableListFilter<"UserProfile">
    hobbies?: StringNullableListFilter<"UserProfile">
    occupation?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    ageGroup?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    learningGoal?: StringNullableWithAggregatesFilter<"UserProfile"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserProfile"> | Date | string
  }

  export type LevelWhereInput = {
    AND?: LevelWhereInput | LevelWhereInput[]
    OR?: LevelWhereInput[]
    NOT?: LevelWhereInput | LevelWhereInput[]
    id?: StringFilter<"Level"> | string
    code?: EnumUserLevelFilter<"Level"> | $Enums.UserLevel
    description?: StringNullableFilter<"Level"> | string | null
    languageId?: StringFilter<"Level"> | string
    language?: XOR<LanguageScalarRelationFilter, LanguageWhereInput>
    modules?: ModuleListRelationFilter
  }

  export type LevelOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    languageId?: SortOrder
    language?: LanguageOrderByWithRelationInput
    modules?: ModuleOrderByRelationAggregateInput
  }

  export type LevelWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code_languageId?: LevelCodeLanguageIdCompoundUniqueInput
    AND?: LevelWhereInput | LevelWhereInput[]
    OR?: LevelWhereInput[]
    NOT?: LevelWhereInput | LevelWhereInput[]
    code?: EnumUserLevelFilter<"Level"> | $Enums.UserLevel
    description?: StringNullableFilter<"Level"> | string | null
    languageId?: StringFilter<"Level"> | string
    language?: XOR<LanguageScalarRelationFilter, LanguageWhereInput>
    modules?: ModuleListRelationFilter
  }, "id" | "code_languageId">

  export type LevelOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrderInput | SortOrder
    languageId?: SortOrder
    _count?: LevelCountOrderByAggregateInput
    _max?: LevelMaxOrderByAggregateInput
    _min?: LevelMinOrderByAggregateInput
  }

  export type LevelScalarWhereWithAggregatesInput = {
    AND?: LevelScalarWhereWithAggregatesInput | LevelScalarWhereWithAggregatesInput[]
    OR?: LevelScalarWhereWithAggregatesInput[]
    NOT?: LevelScalarWhereWithAggregatesInput | LevelScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Level"> | string
    code?: EnumUserLevelWithAggregatesFilter<"Level"> | $Enums.UserLevel
    description?: StringNullableWithAggregatesFilter<"Level"> | string | null
    languageId?: StringWithAggregatesFilter<"Level"> | string
  }

  export type ModuleWhereInput = {
    AND?: ModuleWhereInput | ModuleWhereInput[]
    OR?: ModuleWhereInput[]
    NOT?: ModuleWhereInput | ModuleWhereInput[]
    id?: StringFilter<"Module"> | string
    name?: StringFilter<"Module"> | string
    description?: StringNullableFilter<"Module"> | string | null
    order?: IntFilter<"Module"> | number
    isGenerated?: BoolFilter<"Module"> | boolean
    levelId?: StringFilter<"Module"> | string
    userId?: StringNullableFilter<"Module"> | string | null
    level?: XOR<LevelScalarRelationFilter, LevelWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    lessons?: LessonListRelationFilter
  }

  export type ModuleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    levelId?: SortOrder
    userId?: SortOrderInput | SortOrder
    level?: LevelOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    lessons?: LessonOrderByRelationAggregateInput
  }

  export type ModuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ModuleWhereInput | ModuleWhereInput[]
    OR?: ModuleWhereInput[]
    NOT?: ModuleWhereInput | ModuleWhereInput[]
    name?: StringFilter<"Module"> | string
    description?: StringNullableFilter<"Module"> | string | null
    order?: IntFilter<"Module"> | number
    isGenerated?: BoolFilter<"Module"> | boolean
    levelId?: StringFilter<"Module"> | string
    userId?: StringNullableFilter<"Module"> | string | null
    level?: XOR<LevelScalarRelationFilter, LevelWhereInput>
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    lessons?: LessonListRelationFilter
  }, "id">

  export type ModuleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    levelId?: SortOrder
    userId?: SortOrderInput | SortOrder
    _count?: ModuleCountOrderByAggregateInput
    _avg?: ModuleAvgOrderByAggregateInput
    _max?: ModuleMaxOrderByAggregateInput
    _min?: ModuleMinOrderByAggregateInput
    _sum?: ModuleSumOrderByAggregateInput
  }

  export type ModuleScalarWhereWithAggregatesInput = {
    AND?: ModuleScalarWhereWithAggregatesInput | ModuleScalarWhereWithAggregatesInput[]
    OR?: ModuleScalarWhereWithAggregatesInput[]
    NOT?: ModuleScalarWhereWithAggregatesInput | ModuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Module"> | string
    name?: StringWithAggregatesFilter<"Module"> | string
    description?: StringNullableWithAggregatesFilter<"Module"> | string | null
    order?: IntWithAggregatesFilter<"Module"> | number
    isGenerated?: BoolWithAggregatesFilter<"Module"> | boolean
    levelId?: StringWithAggregatesFilter<"Module"> | string
    userId?: StringNullableWithAggregatesFilter<"Module"> | string | null
  }

  export type LessonWhereInput = {
    AND?: LessonWhereInput | LessonWhereInput[]
    OR?: LessonWhereInput[]
    NOT?: LessonWhereInput | LessonWhereInput[]
    id?: StringFilter<"Lesson"> | string
    title?: StringFilter<"Lesson"> | string
    scenario?: StringFilter<"Lesson"> | string
    systemPrompt?: StringFilter<"Lesson"> | string
    objectives?: StringNullableFilter<"Lesson"> | string | null
    order?: IntFilter<"Lesson"> | number
    isGenerated?: BoolFilter<"Lesson"> | boolean
    moduleId?: StringFilter<"Lesson"> | string
    module?: XOR<ModuleScalarRelationFilter, ModuleWhereInput>
    userProgress?: UserProgressListRelationFilter
    sessions?: ConversationSessionListRelationFilter
  }

  export type LessonOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    scenario?: SortOrder
    systemPrompt?: SortOrder
    objectives?: SortOrderInput | SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    moduleId?: SortOrder
    module?: ModuleOrderByWithRelationInput
    userProgress?: UserProgressOrderByRelationAggregateInput
    sessions?: ConversationSessionOrderByRelationAggregateInput
  }

  export type LessonWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LessonWhereInput | LessonWhereInput[]
    OR?: LessonWhereInput[]
    NOT?: LessonWhereInput | LessonWhereInput[]
    title?: StringFilter<"Lesson"> | string
    scenario?: StringFilter<"Lesson"> | string
    systemPrompt?: StringFilter<"Lesson"> | string
    objectives?: StringNullableFilter<"Lesson"> | string | null
    order?: IntFilter<"Lesson"> | number
    isGenerated?: BoolFilter<"Lesson"> | boolean
    moduleId?: StringFilter<"Lesson"> | string
    module?: XOR<ModuleScalarRelationFilter, ModuleWhereInput>
    userProgress?: UserProgressListRelationFilter
    sessions?: ConversationSessionListRelationFilter
  }, "id">

  export type LessonOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    scenario?: SortOrder
    systemPrompt?: SortOrder
    objectives?: SortOrderInput | SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    moduleId?: SortOrder
    _count?: LessonCountOrderByAggregateInput
    _avg?: LessonAvgOrderByAggregateInput
    _max?: LessonMaxOrderByAggregateInput
    _min?: LessonMinOrderByAggregateInput
    _sum?: LessonSumOrderByAggregateInput
  }

  export type LessonScalarWhereWithAggregatesInput = {
    AND?: LessonScalarWhereWithAggregatesInput | LessonScalarWhereWithAggregatesInput[]
    OR?: LessonScalarWhereWithAggregatesInput[]
    NOT?: LessonScalarWhereWithAggregatesInput | LessonScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lesson"> | string
    title?: StringWithAggregatesFilter<"Lesson"> | string
    scenario?: StringWithAggregatesFilter<"Lesson"> | string
    systemPrompt?: StringWithAggregatesFilter<"Lesson"> | string
    objectives?: StringNullableWithAggregatesFilter<"Lesson"> | string | null
    order?: IntWithAggregatesFilter<"Lesson"> | number
    isGenerated?: BoolWithAggregatesFilter<"Lesson"> | boolean
    moduleId?: StringWithAggregatesFilter<"Lesson"> | string
  }

  export type UserProgressWhereInput = {
    AND?: UserProgressWhereInput | UserProgressWhereInput[]
    OR?: UserProgressWhereInput[]
    NOT?: UserProgressWhereInput | UserProgressWhereInput[]
    id?: StringFilter<"UserProgress"> | string
    userId?: StringFilter<"UserProgress"> | string
    lessonId?: StringFilter<"UserProgress"> | string
    score?: IntFilter<"UserProgress"> | number
    status?: EnumLessonStatusFilter<"UserProgress"> | $Enums.LessonStatus
    attempts?: IntFilter<"UserProgress"> | number
    lastAttempt?: DateTimeFilter<"UserProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    lesson?: XOR<LessonScalarRelationFilter, LessonWhereInput>
  }

  export type UserProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    lessonId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastAttempt?: SortOrder
    user?: UserOrderByWithRelationInput
    lesson?: LessonOrderByWithRelationInput
  }

  export type UserProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_lessonId?: UserProgressUserIdLessonIdCompoundUniqueInput
    AND?: UserProgressWhereInput | UserProgressWhereInput[]
    OR?: UserProgressWhereInput[]
    NOT?: UserProgressWhereInput | UserProgressWhereInput[]
    userId?: StringFilter<"UserProgress"> | string
    lessonId?: StringFilter<"UserProgress"> | string
    score?: IntFilter<"UserProgress"> | number
    status?: EnumLessonStatusFilter<"UserProgress"> | $Enums.LessonStatus
    attempts?: IntFilter<"UserProgress"> | number
    lastAttempt?: DateTimeFilter<"UserProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    lesson?: XOR<LessonScalarRelationFilter, LessonWhereInput>
  }, "id" | "userId_lessonId">

  export type UserProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    lessonId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastAttempt?: SortOrder
    _count?: UserProgressCountOrderByAggregateInput
    _avg?: UserProgressAvgOrderByAggregateInput
    _max?: UserProgressMaxOrderByAggregateInput
    _min?: UserProgressMinOrderByAggregateInput
    _sum?: UserProgressSumOrderByAggregateInput
  }

  export type UserProgressScalarWhereWithAggregatesInput = {
    AND?: UserProgressScalarWhereWithAggregatesInput | UserProgressScalarWhereWithAggregatesInput[]
    OR?: UserProgressScalarWhereWithAggregatesInput[]
    NOT?: UserProgressScalarWhereWithAggregatesInput | UserProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserProgress"> | string
    userId?: StringWithAggregatesFilter<"UserProgress"> | string
    lessonId?: StringWithAggregatesFilter<"UserProgress"> | string
    score?: IntWithAggregatesFilter<"UserProgress"> | number
    status?: EnumLessonStatusWithAggregatesFilter<"UserProgress"> | $Enums.LessonStatus
    attempts?: IntWithAggregatesFilter<"UserProgress"> | number
    lastAttempt?: DateTimeWithAggregatesFilter<"UserProgress"> | Date | string
  }

  export type ConversationSessionWhereInput = {
    AND?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    OR?: ConversationSessionWhereInput[]
    NOT?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    id?: StringFilter<"ConversationSession"> | string
    userId?: StringFilter<"ConversationSession"> | string
    mode?: EnumInteractionModeFilter<"ConversationSession"> | $Enums.InteractionMode
    lessonId?: StringNullableFilter<"ConversationSession"> | string | null
    startedAt?: DateTimeFilter<"ConversationSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"ConversationSession"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    lesson?: XOR<LessonNullableScalarRelationFilter, LessonWhereInput> | null
    interactions?: InteractionLogListRelationFilter
  }

  export type ConversationSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    lessonId?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    lesson?: LessonOrderByWithRelationInput
    interactions?: InteractionLogOrderByRelationAggregateInput
  }

  export type ConversationSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    OR?: ConversationSessionWhereInput[]
    NOT?: ConversationSessionWhereInput | ConversationSessionWhereInput[]
    userId?: StringFilter<"ConversationSession"> | string
    mode?: EnumInteractionModeFilter<"ConversationSession"> | $Enums.InteractionMode
    lessonId?: StringNullableFilter<"ConversationSession"> | string | null
    startedAt?: DateTimeFilter<"ConversationSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"ConversationSession"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    lesson?: XOR<LessonNullableScalarRelationFilter, LessonWhereInput> | null
    interactions?: InteractionLogListRelationFilter
  }, "id">

  export type ConversationSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    lessonId?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    _count?: ConversationSessionCountOrderByAggregateInput
    _max?: ConversationSessionMaxOrderByAggregateInput
    _min?: ConversationSessionMinOrderByAggregateInput
  }

  export type ConversationSessionScalarWhereWithAggregatesInput = {
    AND?: ConversationSessionScalarWhereWithAggregatesInput | ConversationSessionScalarWhereWithAggregatesInput[]
    OR?: ConversationSessionScalarWhereWithAggregatesInput[]
    NOT?: ConversationSessionScalarWhereWithAggregatesInput | ConversationSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConversationSession"> | string
    userId?: StringWithAggregatesFilter<"ConversationSession"> | string
    mode?: EnumInteractionModeWithAggregatesFilter<"ConversationSession"> | $Enums.InteractionMode
    lessonId?: StringNullableWithAggregatesFilter<"ConversationSession"> | string | null
    startedAt?: DateTimeWithAggregatesFilter<"ConversationSession"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"ConversationSession"> | Date | string | null
  }

  export type InteractionLogWhereInput = {
    AND?: InteractionLogWhereInput | InteractionLogWhereInput[]
    OR?: InteractionLogWhereInput[]
    NOT?: InteractionLogWhereInput | InteractionLogWhereInput[]
    id?: StringFilter<"InteractionLog"> | string
    sessionId?: StringFilter<"InteractionLog"> | string
    userAudioTrans?: StringNullableFilter<"InteractionLog"> | string | null
    leryResponse?: StringNullableFilter<"InteractionLog"> | string | null
    grammaticalFixes?: StringNullableFilter<"InteractionLog"> | string | null
    sentimentScore?: FloatNullableFilter<"InteractionLog"> | number | null
    taskAchievement?: IntNullableFilter<"InteractionLog"> | number | null
    grammar?: IntNullableFilter<"InteractionLog"> | number | null
    vocabulary?: IntNullableFilter<"InteractionLog"> | number | null
    fluency?: IntNullableFilter<"InteractionLog"> | number | null
    totalScore?: IntNullableFilter<"InteractionLog"> | number | null
    evaluationReasoning?: StringNullableFilter<"InteractionLog"> | string | null
    isDisputed?: BoolFilter<"InteractionLog"> | boolean
    disputeStatus?: EnumDisputeStatusNullableFilter<"InteractionLog"> | $Enums.DisputeStatus | null
    createdAt?: DateTimeFilter<"InteractionLog"> | Date | string
    session?: XOR<ConversationSessionScalarRelationFilter, ConversationSessionWhereInput>
  }

  export type InteractionLogOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userAudioTrans?: SortOrderInput | SortOrder
    leryResponse?: SortOrderInput | SortOrder
    grammaticalFixes?: SortOrderInput | SortOrder
    sentimentScore?: SortOrderInput | SortOrder
    taskAchievement?: SortOrderInput | SortOrder
    grammar?: SortOrderInput | SortOrder
    vocabulary?: SortOrderInput | SortOrder
    fluency?: SortOrderInput | SortOrder
    totalScore?: SortOrderInput | SortOrder
    evaluationReasoning?: SortOrderInput | SortOrder
    isDisputed?: SortOrder
    disputeStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    session?: ConversationSessionOrderByWithRelationInput
  }

  export type InteractionLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InteractionLogWhereInput | InteractionLogWhereInput[]
    OR?: InteractionLogWhereInput[]
    NOT?: InteractionLogWhereInput | InteractionLogWhereInput[]
    sessionId?: StringFilter<"InteractionLog"> | string
    userAudioTrans?: StringNullableFilter<"InteractionLog"> | string | null
    leryResponse?: StringNullableFilter<"InteractionLog"> | string | null
    grammaticalFixes?: StringNullableFilter<"InteractionLog"> | string | null
    sentimentScore?: FloatNullableFilter<"InteractionLog"> | number | null
    taskAchievement?: IntNullableFilter<"InteractionLog"> | number | null
    grammar?: IntNullableFilter<"InteractionLog"> | number | null
    vocabulary?: IntNullableFilter<"InteractionLog"> | number | null
    fluency?: IntNullableFilter<"InteractionLog"> | number | null
    totalScore?: IntNullableFilter<"InteractionLog"> | number | null
    evaluationReasoning?: StringNullableFilter<"InteractionLog"> | string | null
    isDisputed?: BoolFilter<"InteractionLog"> | boolean
    disputeStatus?: EnumDisputeStatusNullableFilter<"InteractionLog"> | $Enums.DisputeStatus | null
    createdAt?: DateTimeFilter<"InteractionLog"> | Date | string
    session?: XOR<ConversationSessionScalarRelationFilter, ConversationSessionWhereInput>
  }, "id">

  export type InteractionLogOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userAudioTrans?: SortOrderInput | SortOrder
    leryResponse?: SortOrderInput | SortOrder
    grammaticalFixes?: SortOrderInput | SortOrder
    sentimentScore?: SortOrderInput | SortOrder
    taskAchievement?: SortOrderInput | SortOrder
    grammar?: SortOrderInput | SortOrder
    vocabulary?: SortOrderInput | SortOrder
    fluency?: SortOrderInput | SortOrder
    totalScore?: SortOrderInput | SortOrder
    evaluationReasoning?: SortOrderInput | SortOrder
    isDisputed?: SortOrder
    disputeStatus?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: InteractionLogCountOrderByAggregateInput
    _avg?: InteractionLogAvgOrderByAggregateInput
    _max?: InteractionLogMaxOrderByAggregateInput
    _min?: InteractionLogMinOrderByAggregateInput
    _sum?: InteractionLogSumOrderByAggregateInput
  }

  export type InteractionLogScalarWhereWithAggregatesInput = {
    AND?: InteractionLogScalarWhereWithAggregatesInput | InteractionLogScalarWhereWithAggregatesInput[]
    OR?: InteractionLogScalarWhereWithAggregatesInput[]
    NOT?: InteractionLogScalarWhereWithAggregatesInput | InteractionLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InteractionLog"> | string
    sessionId?: StringWithAggregatesFilter<"InteractionLog"> | string
    userAudioTrans?: StringNullableWithAggregatesFilter<"InteractionLog"> | string | null
    leryResponse?: StringNullableWithAggregatesFilter<"InteractionLog"> | string | null
    grammaticalFixes?: StringNullableWithAggregatesFilter<"InteractionLog"> | string | null
    sentimentScore?: FloatNullableWithAggregatesFilter<"InteractionLog"> | number | null
    taskAchievement?: IntNullableWithAggregatesFilter<"InteractionLog"> | number | null
    grammar?: IntNullableWithAggregatesFilter<"InteractionLog"> | number | null
    vocabulary?: IntNullableWithAggregatesFilter<"InteractionLog"> | number | null
    fluency?: IntNullableWithAggregatesFilter<"InteractionLog"> | number | null
    totalScore?: IntNullableWithAggregatesFilter<"InteractionLog"> | number | null
    evaluationReasoning?: StringNullableWithAggregatesFilter<"InteractionLog"> | string | null
    isDisputed?: BoolWithAggregatesFilter<"InteractionLog"> | boolean
    disputeStatus?: EnumDisputeStatusNullableWithAggregatesFilter<"InteractionLog"> | $Enums.DisputeStatus | null
    createdAt?: DateTimeWithAggregatesFilter<"InteractionLog"> | Date | string
  }

  export type LanguageCreateInput = {
    id?: string
    code: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    levels?: LevelCreateNestedManyWithoutLanguageInput
    users?: UserCreateNestedManyWithoutTargetLanguageInput
  }

  export type LanguageUncheckedCreateInput = {
    id?: string
    code: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    levels?: LevelUncheckedCreateNestedManyWithoutLanguageInput
    users?: UserUncheckedCreateNestedManyWithoutTargetLanguageInput
  }

  export type LanguageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    levels?: LevelUpdateManyWithoutLanguageNestedInput
    users?: UserUpdateManyWithoutTargetLanguageNestedInput
  }

  export type LanguageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    levels?: LevelUncheckedUpdateManyWithoutLanguageNestedInput
    users?: UserUncheckedUpdateManyWithoutTargetLanguageNestedInput
  }

  export type LanguageCreateManyInput = {
    id?: string
    code: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type LanguageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LanguageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguage?: LanguageCreateNestedOneWithoutUsersInput
    profile?: UserProfileCreateNestedOneWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    progress?: UserProgressCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionCreateNestedManyWithoutUserInput
    modules?: ModuleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    progress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutUserInput
    modules?: ModuleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: LanguageUpdateOneWithoutUsersNestedInput
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    progress?: UserProgressUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUpdateManyWithoutUserNestedInput
    modules?: ModuleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    progress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutUserNestedInput
    modules?: ModuleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubscriptionCreateInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planType: string
    expiresAt: Date | string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    userId: string
    status?: $Enums.SubscriptionStatus
    planType: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planType?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planType?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    userId: string
    status?: $Enums.SubscriptionStatus
    planType: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planType?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planType?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceCreateInput = {
    id?: string
    serialNumber: string
    nickname?: string | null
    isActive?: boolean
    apiKey?: string | null
    user: UserCreateNestedOneWithoutDevicesInput
  }

  export type DeviceUncheckedCreateInput = {
    id?: string
    serialNumber: string
    nickname?: string | null
    isActive?: boolean
    userId: string
    apiKey?: string | null
  }

  export type DeviceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    apiKey?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutDevicesNestedInput
  }

  export type DeviceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    apiKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeviceCreateManyInput = {
    id?: string
    serialNumber: string
    nickname?: string | null
    isActive?: boolean
    userId: string
    apiKey?: string | null
  }

  export type DeviceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    apiKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeviceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    apiKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserProfileCreateInput = {
    id?: string
    nativeLanguage?: string
    interests?: UserProfileCreateinterestsInput | string[]
    hobbies?: UserProfileCreatehobbiesInput | string[]
    occupation?: string | null
    ageGroup?: string | null
    learningGoal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProfileInput
  }

  export type UserProfileUncheckedCreateInput = {
    id?: string
    userId: string
    nativeLanguage?: string
    interests?: UserProfileCreateinterestsInput | string[]
    hobbies?: UserProfileCreatehobbiesInput | string[]
    occupation?: string | null
    ageGroup?: string | null
    learningGoal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nativeLanguage?: StringFieldUpdateOperationsInput | string
    interests?: UserProfileUpdateinterestsInput | string[]
    hobbies?: UserProfileUpdatehobbiesInput | string[]
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    ageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfileNestedInput
  }

  export type UserProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nativeLanguage?: StringFieldUpdateOperationsInput | string
    interests?: UserProfileUpdateinterestsInput | string[]
    hobbies?: UserProfileUpdatehobbiesInput | string[]
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    ageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileCreateManyInput = {
    id?: string
    userId: string
    nativeLanguage?: string
    interests?: UserProfileCreateinterestsInput | string[]
    hobbies?: UserProfileCreatehobbiesInput | string[]
    occupation?: string | null
    ageGroup?: string | null
    learningGoal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nativeLanguage?: StringFieldUpdateOperationsInput | string
    interests?: UserProfileUpdateinterestsInput | string[]
    hobbies?: UserProfileUpdatehobbiesInput | string[]
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    ageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nativeLanguage?: StringFieldUpdateOperationsInput | string
    interests?: UserProfileUpdateinterestsInput | string[]
    hobbies?: UserProfileUpdatehobbiesInput | string[]
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    ageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LevelCreateInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
    language: LanguageCreateNestedOneWithoutLevelsInput
    modules?: ModuleCreateNestedManyWithoutLevelInput
  }

  export type LevelUncheckedCreateInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
    languageId: string
    modules?: ModuleUncheckedCreateNestedManyWithoutLevelInput
  }

  export type LevelUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
    language?: LanguageUpdateOneRequiredWithoutLevelsNestedInput
    modules?: ModuleUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
    languageId?: StringFieldUpdateOperationsInput | string
    modules?: ModuleUncheckedUpdateManyWithoutLevelNestedInput
  }

  export type LevelCreateManyInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
    languageId: string
  }

  export type LevelUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LevelUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
    languageId?: StringFieldUpdateOperationsInput | string
  }

  export type ModuleCreateInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    level: LevelCreateNestedOneWithoutModulesInput
    user?: UserCreateNestedOneWithoutModulesInput
    lessons?: LessonCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    levelId: string
    userId?: string | null
    lessons?: LessonUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    level?: LevelUpdateOneRequiredWithoutModulesNestedInput
    user?: UserUpdateOneWithoutModulesNestedInput
    lessons?: LessonUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    levelId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    lessons?: LessonUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type ModuleCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    levelId: string
    userId?: string | null
  }

  export type ModuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ModuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    levelId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LessonCreateInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    module: ModuleCreateNestedOneWithoutLessonsInput
    userProgress?: UserProgressCreateNestedManyWithoutLessonInput
    sessions?: ConversationSessionCreateNestedManyWithoutLessonInput
  }

  export type LessonUncheckedCreateInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    moduleId: string
    userProgress?: UserProgressUncheckedCreateNestedManyWithoutLessonInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutLessonInput
  }

  export type LessonUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    module?: ModuleUpdateOneRequiredWithoutLessonsNestedInput
    userProgress?: UserProgressUpdateManyWithoutLessonNestedInput
    sessions?: ConversationSessionUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    moduleId?: StringFieldUpdateOperationsInput | string
    userProgress?: UserProgressUncheckedUpdateManyWithoutLessonNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutLessonNestedInput
  }

  export type LessonCreateManyInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    moduleId: string
  }

  export type LessonUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LessonUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    moduleId?: StringFieldUpdateOperationsInput | string
  }

  export type UserProgressCreateInput = {
    id?: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
    user: UserCreateNestedOneWithoutProgressInput
    lesson: LessonCreateNestedOneWithoutUserProgressInput
  }

  export type UserProgressUncheckedCreateInput = {
    id?: string
    userId: string
    lessonId: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
  }

  export type UserProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProgressNestedInput
    lesson?: LessonUpdateOneRequiredWithoutUserProgressNestedInput
  }

  export type UserProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressCreateManyInput = {
    id?: string
    userId: string
    lessonId: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
  }

  export type UserProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationSessionCreateInput = {
    id?: string
    mode: $Enums.InteractionMode
    startedAt?: Date | string
    endedAt?: Date | string | null
    user: UserCreateNestedOneWithoutSessionsInput
    lesson?: LessonCreateNestedOneWithoutSessionsInput
    interactions?: InteractionLogCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionUncheckedCreateInput = {
    id?: string
    userId: string
    mode: $Enums.InteractionMode
    lessonId?: string | null
    startedAt?: Date | string
    endedAt?: Date | string | null
    interactions?: InteractionLogUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    lesson?: LessonUpdateOneWithoutSessionsNestedInput
    interactions?: InteractionLogUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    interactions?: InteractionLogUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionCreateManyInput = {
    id?: string
    userId: string
    mode: $Enums.InteractionMode
    lessonId?: string | null
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ConversationSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ConversationSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InteractionLogCreateInput = {
    id?: string
    userAudioTrans?: string | null
    leryResponse?: string | null
    grammaticalFixes?: string | null
    sentimentScore?: number | null
    taskAchievement?: number | null
    grammar?: number | null
    vocabulary?: number | null
    fluency?: number | null
    totalScore?: number | null
    evaluationReasoning?: string | null
    isDisputed?: boolean
    disputeStatus?: $Enums.DisputeStatus | null
    createdAt?: Date | string
    session: ConversationSessionCreateNestedOneWithoutInteractionsInput
  }

  export type InteractionLogUncheckedCreateInput = {
    id?: string
    sessionId: string
    userAudioTrans?: string | null
    leryResponse?: string | null
    grammaticalFixes?: string | null
    sentimentScore?: number | null
    taskAchievement?: number | null
    grammar?: number | null
    vocabulary?: number | null
    fluency?: number | null
    totalScore?: number | null
    evaluationReasoning?: string | null
    isDisputed?: boolean
    disputeStatus?: $Enums.DisputeStatus | null
    createdAt?: Date | string
  }

  export type InteractionLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAudioTrans?: NullableStringFieldUpdateOperationsInput | string | null
    leryResponse?: NullableStringFieldUpdateOperationsInput | string | null
    grammaticalFixes?: NullableStringFieldUpdateOperationsInput | string | null
    sentimentScore?: NullableFloatFieldUpdateOperationsInput | number | null
    taskAchievement?: NullableIntFieldUpdateOperationsInput | number | null
    grammar?: NullableIntFieldUpdateOperationsInput | number | null
    vocabulary?: NullableIntFieldUpdateOperationsInput | number | null
    fluency?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationReasoning?: NullableStringFieldUpdateOperationsInput | string | null
    isDisputed?: BoolFieldUpdateOperationsInput | boolean
    disputeStatus?: NullableEnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ConversationSessionUpdateOneRequiredWithoutInteractionsNestedInput
  }

  export type InteractionLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userAudioTrans?: NullableStringFieldUpdateOperationsInput | string | null
    leryResponse?: NullableStringFieldUpdateOperationsInput | string | null
    grammaticalFixes?: NullableStringFieldUpdateOperationsInput | string | null
    sentimentScore?: NullableFloatFieldUpdateOperationsInput | number | null
    taskAchievement?: NullableIntFieldUpdateOperationsInput | number | null
    grammar?: NullableIntFieldUpdateOperationsInput | number | null
    vocabulary?: NullableIntFieldUpdateOperationsInput | number | null
    fluency?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationReasoning?: NullableStringFieldUpdateOperationsInput | string | null
    isDisputed?: BoolFieldUpdateOperationsInput | boolean
    disputeStatus?: NullableEnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionLogCreateManyInput = {
    id?: string
    sessionId: string
    userAudioTrans?: string | null
    leryResponse?: string | null
    grammaticalFixes?: string | null
    sentimentScore?: number | null
    taskAchievement?: number | null
    grammar?: number | null
    vocabulary?: number | null
    fluency?: number | null
    totalScore?: number | null
    evaluationReasoning?: string | null
    isDisputed?: boolean
    disputeStatus?: $Enums.DisputeStatus | null
    createdAt?: Date | string
  }

  export type InteractionLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAudioTrans?: NullableStringFieldUpdateOperationsInput | string | null
    leryResponse?: NullableStringFieldUpdateOperationsInput | string | null
    grammaticalFixes?: NullableStringFieldUpdateOperationsInput | string | null
    sentimentScore?: NullableFloatFieldUpdateOperationsInput | number | null
    taskAchievement?: NullableIntFieldUpdateOperationsInput | number | null
    grammar?: NullableIntFieldUpdateOperationsInput | number | null
    vocabulary?: NullableIntFieldUpdateOperationsInput | number | null
    fluency?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationReasoning?: NullableStringFieldUpdateOperationsInput | string | null
    isDisputed?: BoolFieldUpdateOperationsInput | boolean
    disputeStatus?: NullableEnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    userAudioTrans?: NullableStringFieldUpdateOperationsInput | string | null
    leryResponse?: NullableStringFieldUpdateOperationsInput | string | null
    grammaticalFixes?: NullableStringFieldUpdateOperationsInput | string | null
    sentimentScore?: NullableFloatFieldUpdateOperationsInput | number | null
    taskAchievement?: NullableIntFieldUpdateOperationsInput | number | null
    grammar?: NullableIntFieldUpdateOperationsInput | number | null
    vocabulary?: NullableIntFieldUpdateOperationsInput | number | null
    fluency?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationReasoning?: NullableStringFieldUpdateOperationsInput | string | null
    isDisputed?: BoolFieldUpdateOperationsInput | boolean
    disputeStatus?: NullableEnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LevelListRelationFilter = {
    every?: LevelWhereInput
    some?: LevelWhereInput
    none?: LevelWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type LevelOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LanguageCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type LanguageMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type LanguageMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumUserLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLevel | EnumUserLevelFieldRefInput<$PrismaModel>
    in?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumUserLevelFilter<$PrismaModel> | $Enums.UserLevel
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type LanguageNullableScalarRelationFilter = {
    is?: LanguageWhereInput | null
    isNot?: LanguageWhereInput | null
  }

  export type UserProfileNullableScalarRelationFilter = {
    is?: UserProfileWhereInput | null
    isNot?: UserProfileWhereInput | null
  }

  export type DeviceListRelationFilter = {
    every?: DeviceWhereInput
    some?: DeviceWhereInput
    none?: DeviceWhereInput
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type UserProgressListRelationFilter = {
    every?: UserProgressWhereInput
    some?: UserProgressWhereInput
    none?: UserProgressWhereInput
  }

  export type ConversationSessionListRelationFilter = {
    every?: ConversationSessionWhereInput
    some?: ConversationSessionWhereInput
    none?: ConversationSessionWhereInput
  }

  export type ModuleListRelationFilter = {
    every?: ModuleWhereInput
    some?: ModuleWhereInput
    none?: ModuleWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DeviceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ModuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    currentLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    targetLanguageId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    currentLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    targetLanguageId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    currentLevel?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    targetLanguageId?: SortOrder
  }

  export type EnumUserLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLevel | EnumUserLevelFieldRefInput<$PrismaModel>
    in?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumUserLevelWithAggregatesFilter<$PrismaModel> | $Enums.UserLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserLevelFilter<$PrismaModel>
    _max?: NestedEnumUserLevelFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planType?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planType?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    status?: SortOrder
    planType?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type DeviceCountOrderByAggregateInput = {
    id?: SortOrder
    serialNumber?: SortOrder
    nickname?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    apiKey?: SortOrder
  }

  export type DeviceMaxOrderByAggregateInput = {
    id?: SortOrder
    serialNumber?: SortOrder
    nickname?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    apiKey?: SortOrder
  }

  export type DeviceMinOrderByAggregateInput = {
    id?: SortOrder
    serialNumber?: SortOrder
    nickname?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    apiKey?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type UserProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nativeLanguage?: SortOrder
    interests?: SortOrder
    hobbies?: SortOrder
    occupation?: SortOrder
    ageGroup?: SortOrder
    learningGoal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nativeLanguage?: SortOrder
    occupation?: SortOrder
    ageGroup?: SortOrder
    learningGoal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nativeLanguage?: SortOrder
    occupation?: SortOrder
    ageGroup?: SortOrder
    learningGoal?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LanguageScalarRelationFilter = {
    is?: LanguageWhereInput
    isNot?: LanguageWhereInput
  }

  export type LevelCodeLanguageIdCompoundUniqueInput = {
    code: $Enums.UserLevel
    languageId: string
  }

  export type LevelCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrder
    languageId?: SortOrder
  }

  export type LevelMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrder
    languageId?: SortOrder
  }

  export type LevelMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    description?: SortOrder
    languageId?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type LevelScalarRelationFilter = {
    is?: LevelWhereInput
    isNot?: LevelWhereInput
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type LessonListRelationFilter = {
    every?: LessonWhereInput
    some?: LessonWhereInput
    none?: LessonWhereInput
  }

  export type LessonOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ModuleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    levelId?: SortOrder
    userId?: SortOrder
  }

  export type ModuleAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type ModuleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    levelId?: SortOrder
    userId?: SortOrder
  }

  export type ModuleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    levelId?: SortOrder
    userId?: SortOrder
  }

  export type ModuleSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ModuleScalarRelationFilter = {
    is?: ModuleWhereInput
    isNot?: ModuleWhereInput
  }

  export type LessonCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    scenario?: SortOrder
    systemPrompt?: SortOrder
    objectives?: SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    moduleId?: SortOrder
  }

  export type LessonAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type LessonMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    scenario?: SortOrder
    systemPrompt?: SortOrder
    objectives?: SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    moduleId?: SortOrder
  }

  export type LessonMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    scenario?: SortOrder
    systemPrompt?: SortOrder
    objectives?: SortOrder
    order?: SortOrder
    isGenerated?: SortOrder
    moduleId?: SortOrder
  }

  export type LessonSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type EnumLessonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLessonStatusFilter<$PrismaModel> | $Enums.LessonStatus
  }

  export type LessonScalarRelationFilter = {
    is?: LessonWhereInput
    isNot?: LessonWhereInput
  }

  export type UserProgressUserIdLessonIdCompoundUniqueInput = {
    userId: string
    lessonId: string
  }

  export type UserProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    lessonId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastAttempt?: SortOrder
  }

  export type UserProgressAvgOrderByAggregateInput = {
    score?: SortOrder
    attempts?: SortOrder
  }

  export type UserProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    lessonId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastAttempt?: SortOrder
  }

  export type UserProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    lessonId?: SortOrder
    score?: SortOrder
    status?: SortOrder
    attempts?: SortOrder
    lastAttempt?: SortOrder
  }

  export type UserProgressSumOrderByAggregateInput = {
    score?: SortOrder
    attempts?: SortOrder
  }

  export type EnumLessonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLessonStatusWithAggregatesFilter<$PrismaModel> | $Enums.LessonStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLessonStatusFilter<$PrismaModel>
    _max?: NestedEnumLessonStatusFilter<$PrismaModel>
  }

  export type EnumInteractionModeFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionMode | EnumInteractionModeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionModeFilter<$PrismaModel> | $Enums.InteractionMode
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type LessonNullableScalarRelationFilter = {
    is?: LessonWhereInput | null
    isNot?: LessonWhereInput | null
  }

  export type InteractionLogListRelationFilter = {
    every?: InteractionLogWhereInput
    some?: InteractionLogWhereInput
    none?: InteractionLogWhereInput
  }

  export type InteractionLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConversationSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    lessonId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type ConversationSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    lessonId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type ConversationSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    mode?: SortOrder
    lessonId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type EnumInteractionModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionMode | EnumInteractionModeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionModeWithAggregatesFilter<$PrismaModel> | $Enums.InteractionMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInteractionModeFilter<$PrismaModel>
    _max?: NestedEnumInteractionModeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumDisputeStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisputeStatusNullableFilter<$PrismaModel> | $Enums.DisputeStatus | null
  }

  export type ConversationSessionScalarRelationFilter = {
    is?: ConversationSessionWhereInput
    isNot?: ConversationSessionWhereInput
  }

  export type InteractionLogCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userAudioTrans?: SortOrder
    leryResponse?: SortOrder
    grammaticalFixes?: SortOrder
    sentimentScore?: SortOrder
    taskAchievement?: SortOrder
    grammar?: SortOrder
    vocabulary?: SortOrder
    fluency?: SortOrder
    totalScore?: SortOrder
    evaluationReasoning?: SortOrder
    isDisputed?: SortOrder
    disputeStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type InteractionLogAvgOrderByAggregateInput = {
    sentimentScore?: SortOrder
    taskAchievement?: SortOrder
    grammar?: SortOrder
    vocabulary?: SortOrder
    fluency?: SortOrder
    totalScore?: SortOrder
  }

  export type InteractionLogMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userAudioTrans?: SortOrder
    leryResponse?: SortOrder
    grammaticalFixes?: SortOrder
    sentimentScore?: SortOrder
    taskAchievement?: SortOrder
    grammar?: SortOrder
    vocabulary?: SortOrder
    fluency?: SortOrder
    totalScore?: SortOrder
    evaluationReasoning?: SortOrder
    isDisputed?: SortOrder
    disputeStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type InteractionLogMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    userAudioTrans?: SortOrder
    leryResponse?: SortOrder
    grammaticalFixes?: SortOrder
    sentimentScore?: SortOrder
    taskAchievement?: SortOrder
    grammar?: SortOrder
    vocabulary?: SortOrder
    fluency?: SortOrder
    totalScore?: SortOrder
    evaluationReasoning?: SortOrder
    isDisputed?: SortOrder
    disputeStatus?: SortOrder
    createdAt?: SortOrder
  }

  export type InteractionLogSumOrderByAggregateInput = {
    sentimentScore?: SortOrder
    taskAchievement?: SortOrder
    grammar?: SortOrder
    vocabulary?: SortOrder
    fluency?: SortOrder
    totalScore?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumDisputeStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisputeStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.DisputeStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDisputeStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumDisputeStatusNullableFilter<$PrismaModel>
  }

  export type LevelCreateNestedManyWithoutLanguageInput = {
    create?: XOR<LevelCreateWithoutLanguageInput, LevelUncheckedCreateWithoutLanguageInput> | LevelCreateWithoutLanguageInput[] | LevelUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: LevelCreateOrConnectWithoutLanguageInput | LevelCreateOrConnectWithoutLanguageInput[]
    createMany?: LevelCreateManyLanguageInputEnvelope
    connect?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutTargetLanguageInput = {
    create?: XOR<UserCreateWithoutTargetLanguageInput, UserUncheckedCreateWithoutTargetLanguageInput> | UserCreateWithoutTargetLanguageInput[] | UserUncheckedCreateWithoutTargetLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTargetLanguageInput | UserCreateOrConnectWithoutTargetLanguageInput[]
    createMany?: UserCreateManyTargetLanguageInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type LevelUncheckedCreateNestedManyWithoutLanguageInput = {
    create?: XOR<LevelCreateWithoutLanguageInput, LevelUncheckedCreateWithoutLanguageInput> | LevelCreateWithoutLanguageInput[] | LevelUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: LevelCreateOrConnectWithoutLanguageInput | LevelCreateOrConnectWithoutLanguageInput[]
    createMany?: LevelCreateManyLanguageInputEnvelope
    connect?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutTargetLanguageInput = {
    create?: XOR<UserCreateWithoutTargetLanguageInput, UserUncheckedCreateWithoutTargetLanguageInput> | UserCreateWithoutTargetLanguageInput[] | UserUncheckedCreateWithoutTargetLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTargetLanguageInput | UserCreateOrConnectWithoutTargetLanguageInput[]
    createMany?: UserCreateManyTargetLanguageInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LevelUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<LevelCreateWithoutLanguageInput, LevelUncheckedCreateWithoutLanguageInput> | LevelCreateWithoutLanguageInput[] | LevelUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: LevelCreateOrConnectWithoutLanguageInput | LevelCreateOrConnectWithoutLanguageInput[]
    upsert?: LevelUpsertWithWhereUniqueWithoutLanguageInput | LevelUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: LevelCreateManyLanguageInputEnvelope
    set?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    disconnect?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    delete?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    connect?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    update?: LevelUpdateWithWhereUniqueWithoutLanguageInput | LevelUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: LevelUpdateManyWithWhereWithoutLanguageInput | LevelUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: LevelScalarWhereInput | LevelScalarWhereInput[]
  }

  export type UserUpdateManyWithoutTargetLanguageNestedInput = {
    create?: XOR<UserCreateWithoutTargetLanguageInput, UserUncheckedCreateWithoutTargetLanguageInput> | UserCreateWithoutTargetLanguageInput[] | UserUncheckedCreateWithoutTargetLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTargetLanguageInput | UserCreateOrConnectWithoutTargetLanguageInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTargetLanguageInput | UserUpsertWithWhereUniqueWithoutTargetLanguageInput[]
    createMany?: UserCreateManyTargetLanguageInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTargetLanguageInput | UserUpdateWithWhereUniqueWithoutTargetLanguageInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTargetLanguageInput | UserUpdateManyWithWhereWithoutTargetLanguageInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type LevelUncheckedUpdateManyWithoutLanguageNestedInput = {
    create?: XOR<LevelCreateWithoutLanguageInput, LevelUncheckedCreateWithoutLanguageInput> | LevelCreateWithoutLanguageInput[] | LevelUncheckedCreateWithoutLanguageInput[]
    connectOrCreate?: LevelCreateOrConnectWithoutLanguageInput | LevelCreateOrConnectWithoutLanguageInput[]
    upsert?: LevelUpsertWithWhereUniqueWithoutLanguageInput | LevelUpsertWithWhereUniqueWithoutLanguageInput[]
    createMany?: LevelCreateManyLanguageInputEnvelope
    set?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    disconnect?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    delete?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    connect?: LevelWhereUniqueInput | LevelWhereUniqueInput[]
    update?: LevelUpdateWithWhereUniqueWithoutLanguageInput | LevelUpdateWithWhereUniqueWithoutLanguageInput[]
    updateMany?: LevelUpdateManyWithWhereWithoutLanguageInput | LevelUpdateManyWithWhereWithoutLanguageInput[]
    deleteMany?: LevelScalarWhereInput | LevelScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutTargetLanguageNestedInput = {
    create?: XOR<UserCreateWithoutTargetLanguageInput, UserUncheckedCreateWithoutTargetLanguageInput> | UserCreateWithoutTargetLanguageInput[] | UserUncheckedCreateWithoutTargetLanguageInput[]
    connectOrCreate?: UserCreateOrConnectWithoutTargetLanguageInput | UserCreateOrConnectWithoutTargetLanguageInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutTargetLanguageInput | UserUpsertWithWhereUniqueWithoutTargetLanguageInput[]
    createMany?: UserCreateManyTargetLanguageInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutTargetLanguageInput | UserUpdateWithWhereUniqueWithoutTargetLanguageInput[]
    updateMany?: UserUpdateManyWithWhereWithoutTargetLanguageInput | UserUpdateManyWithWhereWithoutTargetLanguageInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type LanguageCreateNestedOneWithoutUsersInput = {
    create?: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutUsersInput
    connect?: LanguageWhereUniqueInput
  }

  export type UserProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    connect?: UserProfileWhereUniqueInput
  }

  export type DeviceCreateNestedManyWithoutUserInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type SubscriptionCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type UserProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
  }

  export type ConversationSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ConversationSessionCreateWithoutUserInput, ConversationSessionUncheckedCreateWithoutUserInput> | ConversationSessionCreateWithoutUserInput[] | ConversationSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutUserInput | ConversationSessionCreateOrConnectWithoutUserInput[]
    createMany?: ConversationSessionCreateManyUserInputEnvelope
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
  }

  export type ModuleCreateNestedManyWithoutUserInput = {
    create?: XOR<ModuleCreateWithoutUserInput, ModuleUncheckedCreateWithoutUserInput> | ModuleCreateWithoutUserInput[] | ModuleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutUserInput | ModuleCreateOrConnectWithoutUserInput[]
    createMany?: ModuleCreateManyUserInputEnvelope
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
  }

  export type UserProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    connect?: UserProfileWhereUniqueInput
  }

  export type DeviceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type UserProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
  }

  export type ConversationSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ConversationSessionCreateWithoutUserInput, ConversationSessionUncheckedCreateWithoutUserInput> | ConversationSessionCreateWithoutUserInput[] | ConversationSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutUserInput | ConversationSessionCreateOrConnectWithoutUserInput[]
    createMany?: ConversationSessionCreateManyUserInputEnvelope
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
  }

  export type ModuleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ModuleCreateWithoutUserInput, ModuleUncheckedCreateWithoutUserInput> | ModuleCreateWithoutUserInput[] | ModuleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutUserInput | ModuleCreateOrConnectWithoutUserInput[]
    createMany?: ModuleCreateManyUserInputEnvelope
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
  }

  export type EnumUserLevelFieldUpdateOperationsInput = {
    set?: $Enums.UserLevel
  }

  export type LanguageUpdateOneWithoutUsersNestedInput = {
    create?: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutUsersInput
    upsert?: LanguageUpsertWithoutUsersInput
    disconnect?: LanguageWhereInput | boolean
    delete?: LanguageWhereInput | boolean
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutUsersInput, LanguageUpdateWithoutUsersInput>, LanguageUncheckedUpdateWithoutUsersInput>
  }

  export type UserProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    upsert?: UserProfileUpsertWithoutUserInput
    disconnect?: UserProfileWhereInput | boolean
    delete?: UserProfileWhereInput | boolean
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutUserInput, UserProfileUpdateWithoutUserInput>, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type DeviceUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutUserInput | DeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutUserInput | DeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutUserInput | DeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type SubscriptionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type UserProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserProgressUpsertWithWhereUniqueWithoutUserInput | UserProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    set?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    disconnect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    delete?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    update?: UserProgressUpdateWithWhereUniqueWithoutUserInput | UserProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgressUpdateManyWithWhereWithoutUserInput | UserProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
  }

  export type ConversationSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutUserInput, ConversationSessionUncheckedCreateWithoutUserInput> | ConversationSessionCreateWithoutUserInput[] | ConversationSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutUserInput | ConversationSessionCreateOrConnectWithoutUserInput[]
    upsert?: ConversationSessionUpsertWithWhereUniqueWithoutUserInput | ConversationSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConversationSessionCreateManyUserInputEnvelope
    set?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    disconnect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    delete?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    update?: ConversationSessionUpdateWithWhereUniqueWithoutUserInput | ConversationSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConversationSessionUpdateManyWithWhereWithoutUserInput | ConversationSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
  }

  export type ModuleUpdateManyWithoutUserNestedInput = {
    create?: XOR<ModuleCreateWithoutUserInput, ModuleUncheckedCreateWithoutUserInput> | ModuleCreateWithoutUserInput[] | ModuleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutUserInput | ModuleCreateOrConnectWithoutUserInput[]
    upsert?: ModuleUpsertWithWhereUniqueWithoutUserInput | ModuleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ModuleCreateManyUserInputEnvelope
    set?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    disconnect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    delete?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    update?: ModuleUpdateWithWhereUniqueWithoutUserInput | ModuleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ModuleUpdateManyWithWhereWithoutUserInput | ModuleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserProfileCreateOrConnectWithoutUserInput
    upsert?: UserProfileUpsertWithoutUserInput
    disconnect?: UserProfileWhereInput | boolean
    delete?: UserProfileWhereInput | boolean
    connect?: UserProfileWhereUniqueInput
    update?: XOR<XOR<UserProfileUpdateToOneWithWhereWithoutUserInput, UserProfileUpdateWithoutUserInput>, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type DeviceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput> | DeviceCreateWithoutUserInput[] | DeviceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeviceCreateOrConnectWithoutUserInput | DeviceCreateOrConnectWithoutUserInput[]
    upsert?: DeviceUpsertWithWhereUniqueWithoutUserInput | DeviceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeviceCreateManyUserInputEnvelope
    set?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    disconnect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    delete?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    connect?: DeviceWhereUniqueInput | DeviceWhereUniqueInput[]
    update?: DeviceUpdateWithWhereUniqueWithoutUserInput | DeviceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeviceUpdateManyWithWhereWithoutUserInput | DeviceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput> | SubscriptionCreateWithoutUserInput[] | SubscriptionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutUserInput | SubscriptionCreateOrConnectWithoutUserInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutUserInput | SubscriptionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SubscriptionCreateManyUserInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutUserInput | SubscriptionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutUserInput | SubscriptionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type UserProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput> | UserProgressCreateWithoutUserInput[] | UserProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutUserInput | UserProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserProgressUpsertWithWhereUniqueWithoutUserInput | UserProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserProgressCreateManyUserInputEnvelope
    set?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    disconnect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    delete?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    update?: UserProgressUpdateWithWhereUniqueWithoutUserInput | UserProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserProgressUpdateManyWithWhereWithoutUserInput | UserProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
  }

  export type ConversationSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutUserInput, ConversationSessionUncheckedCreateWithoutUserInput> | ConversationSessionCreateWithoutUserInput[] | ConversationSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutUserInput | ConversationSessionCreateOrConnectWithoutUserInput[]
    upsert?: ConversationSessionUpsertWithWhereUniqueWithoutUserInput | ConversationSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ConversationSessionCreateManyUserInputEnvelope
    set?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    disconnect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    delete?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    update?: ConversationSessionUpdateWithWhereUniqueWithoutUserInput | ConversationSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ConversationSessionUpdateManyWithWhereWithoutUserInput | ConversationSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
  }

  export type ModuleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ModuleCreateWithoutUserInput, ModuleUncheckedCreateWithoutUserInput> | ModuleCreateWithoutUserInput[] | ModuleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutUserInput | ModuleCreateOrConnectWithoutUserInput[]
    upsert?: ModuleUpsertWithWhereUniqueWithoutUserInput | ModuleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ModuleCreateManyUserInputEnvelope
    set?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    disconnect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    delete?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    update?: ModuleUpdateWithWhereUniqueWithoutUserInput | ModuleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ModuleUpdateManyWithWhereWithoutUserInput | ModuleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type UserUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubscriptionsInput
    upsert?: UserUpsertWithoutSubscriptionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubscriptionsInput, UserUpdateWithoutSubscriptionsInput>, UserUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UserCreateNestedOneWithoutDevicesInput = {
    create?: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDevicesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDevicesNestedInput = {
    create?: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDevicesInput
    upsert?: UserUpsertWithoutDevicesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDevicesInput, UserUpdateWithoutDevicesInput>, UserUncheckedUpdateWithoutDevicesInput>
  }

  export type UserProfileCreateinterestsInput = {
    set: string[]
  }

  export type UserProfileCreatehobbiesInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutProfileInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserProfileUpdateinterestsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserProfileUpdatehobbiesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    upsert?: UserUpsertWithoutProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProfileInput, UserUpdateWithoutProfileInput>, UserUncheckedUpdateWithoutProfileInput>
  }

  export type LanguageCreateNestedOneWithoutLevelsInput = {
    create?: XOR<LanguageCreateWithoutLevelsInput, LanguageUncheckedCreateWithoutLevelsInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutLevelsInput
    connect?: LanguageWhereUniqueInput
  }

  export type ModuleCreateNestedManyWithoutLevelInput = {
    create?: XOR<ModuleCreateWithoutLevelInput, ModuleUncheckedCreateWithoutLevelInput> | ModuleCreateWithoutLevelInput[] | ModuleUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutLevelInput | ModuleCreateOrConnectWithoutLevelInput[]
    createMany?: ModuleCreateManyLevelInputEnvelope
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
  }

  export type ModuleUncheckedCreateNestedManyWithoutLevelInput = {
    create?: XOR<ModuleCreateWithoutLevelInput, ModuleUncheckedCreateWithoutLevelInput> | ModuleCreateWithoutLevelInput[] | ModuleUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutLevelInput | ModuleCreateOrConnectWithoutLevelInput[]
    createMany?: ModuleCreateManyLevelInputEnvelope
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
  }

  export type LanguageUpdateOneRequiredWithoutLevelsNestedInput = {
    create?: XOR<LanguageCreateWithoutLevelsInput, LanguageUncheckedCreateWithoutLevelsInput>
    connectOrCreate?: LanguageCreateOrConnectWithoutLevelsInput
    upsert?: LanguageUpsertWithoutLevelsInput
    connect?: LanguageWhereUniqueInput
    update?: XOR<XOR<LanguageUpdateToOneWithWhereWithoutLevelsInput, LanguageUpdateWithoutLevelsInput>, LanguageUncheckedUpdateWithoutLevelsInput>
  }

  export type ModuleUpdateManyWithoutLevelNestedInput = {
    create?: XOR<ModuleCreateWithoutLevelInput, ModuleUncheckedCreateWithoutLevelInput> | ModuleCreateWithoutLevelInput[] | ModuleUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutLevelInput | ModuleCreateOrConnectWithoutLevelInput[]
    upsert?: ModuleUpsertWithWhereUniqueWithoutLevelInput | ModuleUpsertWithWhereUniqueWithoutLevelInput[]
    createMany?: ModuleCreateManyLevelInputEnvelope
    set?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    disconnect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    delete?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    update?: ModuleUpdateWithWhereUniqueWithoutLevelInput | ModuleUpdateWithWhereUniqueWithoutLevelInput[]
    updateMany?: ModuleUpdateManyWithWhereWithoutLevelInput | ModuleUpdateManyWithWhereWithoutLevelInput[]
    deleteMany?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
  }

  export type ModuleUncheckedUpdateManyWithoutLevelNestedInput = {
    create?: XOR<ModuleCreateWithoutLevelInput, ModuleUncheckedCreateWithoutLevelInput> | ModuleCreateWithoutLevelInput[] | ModuleUncheckedCreateWithoutLevelInput[]
    connectOrCreate?: ModuleCreateOrConnectWithoutLevelInput | ModuleCreateOrConnectWithoutLevelInput[]
    upsert?: ModuleUpsertWithWhereUniqueWithoutLevelInput | ModuleUpsertWithWhereUniqueWithoutLevelInput[]
    createMany?: ModuleCreateManyLevelInputEnvelope
    set?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    disconnect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    delete?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    connect?: ModuleWhereUniqueInput | ModuleWhereUniqueInput[]
    update?: ModuleUpdateWithWhereUniqueWithoutLevelInput | ModuleUpdateWithWhereUniqueWithoutLevelInput[]
    updateMany?: ModuleUpdateManyWithWhereWithoutLevelInput | ModuleUpdateManyWithWhereWithoutLevelInput[]
    deleteMany?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
  }

  export type LevelCreateNestedOneWithoutModulesInput = {
    create?: XOR<LevelCreateWithoutModulesInput, LevelUncheckedCreateWithoutModulesInput>
    connectOrCreate?: LevelCreateOrConnectWithoutModulesInput
    connect?: LevelWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutModulesInput = {
    create?: XOR<UserCreateWithoutModulesInput, UserUncheckedCreateWithoutModulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutModulesInput
    connect?: UserWhereUniqueInput
  }

  export type LessonCreateNestedManyWithoutModuleInput = {
    create?: XOR<LessonCreateWithoutModuleInput, LessonUncheckedCreateWithoutModuleInput> | LessonCreateWithoutModuleInput[] | LessonUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutModuleInput | LessonCreateOrConnectWithoutModuleInput[]
    createMany?: LessonCreateManyModuleInputEnvelope
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
  }

  export type LessonUncheckedCreateNestedManyWithoutModuleInput = {
    create?: XOR<LessonCreateWithoutModuleInput, LessonUncheckedCreateWithoutModuleInput> | LessonCreateWithoutModuleInput[] | LessonUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutModuleInput | LessonCreateOrConnectWithoutModuleInput[]
    createMany?: LessonCreateManyModuleInputEnvelope
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LevelUpdateOneRequiredWithoutModulesNestedInput = {
    create?: XOR<LevelCreateWithoutModulesInput, LevelUncheckedCreateWithoutModulesInput>
    connectOrCreate?: LevelCreateOrConnectWithoutModulesInput
    upsert?: LevelUpsertWithoutModulesInput
    connect?: LevelWhereUniqueInput
    update?: XOR<XOR<LevelUpdateToOneWithWhereWithoutModulesInput, LevelUpdateWithoutModulesInput>, LevelUncheckedUpdateWithoutModulesInput>
  }

  export type UserUpdateOneWithoutModulesNestedInput = {
    create?: XOR<UserCreateWithoutModulesInput, UserUncheckedCreateWithoutModulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutModulesInput
    upsert?: UserUpsertWithoutModulesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutModulesInput, UserUpdateWithoutModulesInput>, UserUncheckedUpdateWithoutModulesInput>
  }

  export type LessonUpdateManyWithoutModuleNestedInput = {
    create?: XOR<LessonCreateWithoutModuleInput, LessonUncheckedCreateWithoutModuleInput> | LessonCreateWithoutModuleInput[] | LessonUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutModuleInput | LessonCreateOrConnectWithoutModuleInput[]
    upsert?: LessonUpsertWithWhereUniqueWithoutModuleInput | LessonUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: LessonCreateManyModuleInputEnvelope
    set?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    disconnect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    delete?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    update?: LessonUpdateWithWhereUniqueWithoutModuleInput | LessonUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: LessonUpdateManyWithWhereWithoutModuleInput | LessonUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: LessonScalarWhereInput | LessonScalarWhereInput[]
  }

  export type LessonUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: XOR<LessonCreateWithoutModuleInput, LessonUncheckedCreateWithoutModuleInput> | LessonCreateWithoutModuleInput[] | LessonUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: LessonCreateOrConnectWithoutModuleInput | LessonCreateOrConnectWithoutModuleInput[]
    upsert?: LessonUpsertWithWhereUniqueWithoutModuleInput | LessonUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: LessonCreateManyModuleInputEnvelope
    set?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    disconnect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    delete?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    connect?: LessonWhereUniqueInput | LessonWhereUniqueInput[]
    update?: LessonUpdateWithWhereUniqueWithoutModuleInput | LessonUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: LessonUpdateManyWithWhereWithoutModuleInput | LessonUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: LessonScalarWhereInput | LessonScalarWhereInput[]
  }

  export type ModuleCreateNestedOneWithoutLessonsInput = {
    create?: XOR<ModuleCreateWithoutLessonsInput, ModuleUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutLessonsInput
    connect?: ModuleWhereUniqueInput
  }

  export type UserProgressCreateNestedManyWithoutLessonInput = {
    create?: XOR<UserProgressCreateWithoutLessonInput, UserProgressUncheckedCreateWithoutLessonInput> | UserProgressCreateWithoutLessonInput[] | UserProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutLessonInput | UserProgressCreateOrConnectWithoutLessonInput[]
    createMany?: UserProgressCreateManyLessonInputEnvelope
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
  }

  export type ConversationSessionCreateNestedManyWithoutLessonInput = {
    create?: XOR<ConversationSessionCreateWithoutLessonInput, ConversationSessionUncheckedCreateWithoutLessonInput> | ConversationSessionCreateWithoutLessonInput[] | ConversationSessionUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutLessonInput | ConversationSessionCreateOrConnectWithoutLessonInput[]
    createMany?: ConversationSessionCreateManyLessonInputEnvelope
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
  }

  export type UserProgressUncheckedCreateNestedManyWithoutLessonInput = {
    create?: XOR<UserProgressCreateWithoutLessonInput, UserProgressUncheckedCreateWithoutLessonInput> | UserProgressCreateWithoutLessonInput[] | UserProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutLessonInput | UserProgressCreateOrConnectWithoutLessonInput[]
    createMany?: UserProgressCreateManyLessonInputEnvelope
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
  }

  export type ConversationSessionUncheckedCreateNestedManyWithoutLessonInput = {
    create?: XOR<ConversationSessionCreateWithoutLessonInput, ConversationSessionUncheckedCreateWithoutLessonInput> | ConversationSessionCreateWithoutLessonInput[] | ConversationSessionUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutLessonInput | ConversationSessionCreateOrConnectWithoutLessonInput[]
    createMany?: ConversationSessionCreateManyLessonInputEnvelope
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
  }

  export type ModuleUpdateOneRequiredWithoutLessonsNestedInput = {
    create?: XOR<ModuleCreateWithoutLessonsInput, ModuleUncheckedCreateWithoutLessonsInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutLessonsInput
    upsert?: ModuleUpsertWithoutLessonsInput
    connect?: ModuleWhereUniqueInput
    update?: XOR<XOR<ModuleUpdateToOneWithWhereWithoutLessonsInput, ModuleUpdateWithoutLessonsInput>, ModuleUncheckedUpdateWithoutLessonsInput>
  }

  export type UserProgressUpdateManyWithoutLessonNestedInput = {
    create?: XOR<UserProgressCreateWithoutLessonInput, UserProgressUncheckedCreateWithoutLessonInput> | UserProgressCreateWithoutLessonInput[] | UserProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutLessonInput | UserProgressCreateOrConnectWithoutLessonInput[]
    upsert?: UserProgressUpsertWithWhereUniqueWithoutLessonInput | UserProgressUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: UserProgressCreateManyLessonInputEnvelope
    set?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    disconnect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    delete?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    update?: UserProgressUpdateWithWhereUniqueWithoutLessonInput | UserProgressUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: UserProgressUpdateManyWithWhereWithoutLessonInput | UserProgressUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
  }

  export type ConversationSessionUpdateManyWithoutLessonNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutLessonInput, ConversationSessionUncheckedCreateWithoutLessonInput> | ConversationSessionCreateWithoutLessonInput[] | ConversationSessionUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutLessonInput | ConversationSessionCreateOrConnectWithoutLessonInput[]
    upsert?: ConversationSessionUpsertWithWhereUniqueWithoutLessonInput | ConversationSessionUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: ConversationSessionCreateManyLessonInputEnvelope
    set?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    disconnect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    delete?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    update?: ConversationSessionUpdateWithWhereUniqueWithoutLessonInput | ConversationSessionUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: ConversationSessionUpdateManyWithWhereWithoutLessonInput | ConversationSessionUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
  }

  export type UserProgressUncheckedUpdateManyWithoutLessonNestedInput = {
    create?: XOR<UserProgressCreateWithoutLessonInput, UserProgressUncheckedCreateWithoutLessonInput> | UserProgressCreateWithoutLessonInput[] | UserProgressUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: UserProgressCreateOrConnectWithoutLessonInput | UserProgressCreateOrConnectWithoutLessonInput[]
    upsert?: UserProgressUpsertWithWhereUniqueWithoutLessonInput | UserProgressUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: UserProgressCreateManyLessonInputEnvelope
    set?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    disconnect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    delete?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    connect?: UserProgressWhereUniqueInput | UserProgressWhereUniqueInput[]
    update?: UserProgressUpdateWithWhereUniqueWithoutLessonInput | UserProgressUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: UserProgressUpdateManyWithWhereWithoutLessonInput | UserProgressUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
  }

  export type ConversationSessionUncheckedUpdateManyWithoutLessonNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutLessonInput, ConversationSessionUncheckedCreateWithoutLessonInput> | ConversationSessionCreateWithoutLessonInput[] | ConversationSessionUncheckedCreateWithoutLessonInput[]
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutLessonInput | ConversationSessionCreateOrConnectWithoutLessonInput[]
    upsert?: ConversationSessionUpsertWithWhereUniqueWithoutLessonInput | ConversationSessionUpsertWithWhereUniqueWithoutLessonInput[]
    createMany?: ConversationSessionCreateManyLessonInputEnvelope
    set?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    disconnect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    delete?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    connect?: ConversationSessionWhereUniqueInput | ConversationSessionWhereUniqueInput[]
    update?: ConversationSessionUpdateWithWhereUniqueWithoutLessonInput | ConversationSessionUpdateWithWhereUniqueWithoutLessonInput[]
    updateMany?: ConversationSessionUpdateManyWithWhereWithoutLessonInput | ConversationSessionUpdateManyWithWhereWithoutLessonInput[]
    deleteMany?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProgressInput = {
    create?: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressInput
    connect?: UserWhereUniqueInput
  }

  export type LessonCreateNestedOneWithoutUserProgressInput = {
    create?: XOR<LessonCreateWithoutUserProgressInput, LessonUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: LessonCreateOrConnectWithoutUserProgressInput
    connect?: LessonWhereUniqueInput
  }

  export type EnumLessonStatusFieldUpdateOperationsInput = {
    set?: $Enums.LessonStatus
  }

  export type UserUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutProgressInput
    upsert?: UserUpsertWithoutProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProgressInput, UserUpdateWithoutProgressInput>, UserUncheckedUpdateWithoutProgressInput>
  }

  export type LessonUpdateOneRequiredWithoutUserProgressNestedInput = {
    create?: XOR<LessonCreateWithoutUserProgressInput, LessonUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: LessonCreateOrConnectWithoutUserProgressInput
    upsert?: LessonUpsertWithoutUserProgressInput
    connect?: LessonWhereUniqueInput
    update?: XOR<XOR<LessonUpdateToOneWithWhereWithoutUserProgressInput, LessonUpdateWithoutUserProgressInput>, LessonUncheckedUpdateWithoutUserProgressInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type LessonCreateNestedOneWithoutSessionsInput = {
    create?: XOR<LessonCreateWithoutSessionsInput, LessonUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: LessonCreateOrConnectWithoutSessionsInput
    connect?: LessonWhereUniqueInput
  }

  export type InteractionLogCreateNestedManyWithoutSessionInput = {
    create?: XOR<InteractionLogCreateWithoutSessionInput, InteractionLogUncheckedCreateWithoutSessionInput> | InteractionLogCreateWithoutSessionInput[] | InteractionLogUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: InteractionLogCreateOrConnectWithoutSessionInput | InteractionLogCreateOrConnectWithoutSessionInput[]
    createMany?: InteractionLogCreateManySessionInputEnvelope
    connect?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
  }

  export type InteractionLogUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<InteractionLogCreateWithoutSessionInput, InteractionLogUncheckedCreateWithoutSessionInput> | InteractionLogCreateWithoutSessionInput[] | InteractionLogUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: InteractionLogCreateOrConnectWithoutSessionInput | InteractionLogCreateOrConnectWithoutSessionInput[]
    createMany?: InteractionLogCreateManySessionInputEnvelope
    connect?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
  }

  export type EnumInteractionModeFieldUpdateOperationsInput = {
    set?: $Enums.InteractionMode
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type LessonUpdateOneWithoutSessionsNestedInput = {
    create?: XOR<LessonCreateWithoutSessionsInput, LessonUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: LessonCreateOrConnectWithoutSessionsInput
    upsert?: LessonUpsertWithoutSessionsInput
    disconnect?: LessonWhereInput | boolean
    delete?: LessonWhereInput | boolean
    connect?: LessonWhereUniqueInput
    update?: XOR<XOR<LessonUpdateToOneWithWhereWithoutSessionsInput, LessonUpdateWithoutSessionsInput>, LessonUncheckedUpdateWithoutSessionsInput>
  }

  export type InteractionLogUpdateManyWithoutSessionNestedInput = {
    create?: XOR<InteractionLogCreateWithoutSessionInput, InteractionLogUncheckedCreateWithoutSessionInput> | InteractionLogCreateWithoutSessionInput[] | InteractionLogUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: InteractionLogCreateOrConnectWithoutSessionInput | InteractionLogCreateOrConnectWithoutSessionInput[]
    upsert?: InteractionLogUpsertWithWhereUniqueWithoutSessionInput | InteractionLogUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: InteractionLogCreateManySessionInputEnvelope
    set?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    disconnect?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    delete?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    connect?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    update?: InteractionLogUpdateWithWhereUniqueWithoutSessionInput | InteractionLogUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: InteractionLogUpdateManyWithWhereWithoutSessionInput | InteractionLogUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: InteractionLogScalarWhereInput | InteractionLogScalarWhereInput[]
  }

  export type InteractionLogUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<InteractionLogCreateWithoutSessionInput, InteractionLogUncheckedCreateWithoutSessionInput> | InteractionLogCreateWithoutSessionInput[] | InteractionLogUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: InteractionLogCreateOrConnectWithoutSessionInput | InteractionLogCreateOrConnectWithoutSessionInput[]
    upsert?: InteractionLogUpsertWithWhereUniqueWithoutSessionInput | InteractionLogUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: InteractionLogCreateManySessionInputEnvelope
    set?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    disconnect?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    delete?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    connect?: InteractionLogWhereUniqueInput | InteractionLogWhereUniqueInput[]
    update?: InteractionLogUpdateWithWhereUniqueWithoutSessionInput | InteractionLogUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: InteractionLogUpdateManyWithWhereWithoutSessionInput | InteractionLogUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: InteractionLogScalarWhereInput | InteractionLogScalarWhereInput[]
  }

  export type ConversationSessionCreateNestedOneWithoutInteractionsInput = {
    create?: XOR<ConversationSessionCreateWithoutInteractionsInput, ConversationSessionUncheckedCreateWithoutInteractionsInput>
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutInteractionsInput
    connect?: ConversationSessionWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumDisputeStatusFieldUpdateOperationsInput = {
    set?: $Enums.DisputeStatus | null
  }

  export type ConversationSessionUpdateOneRequiredWithoutInteractionsNestedInput = {
    create?: XOR<ConversationSessionCreateWithoutInteractionsInput, ConversationSessionUncheckedCreateWithoutInteractionsInput>
    connectOrCreate?: ConversationSessionCreateOrConnectWithoutInteractionsInput
    upsert?: ConversationSessionUpsertWithoutInteractionsInput
    connect?: ConversationSessionWhereUniqueInput
    update?: XOR<XOR<ConversationSessionUpdateToOneWithWhereWithoutInteractionsInput, ConversationSessionUpdateWithoutInteractionsInput>, ConversationSessionUncheckedUpdateWithoutInteractionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumUserLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLevel | EnumUserLevelFieldRefInput<$PrismaModel>
    in?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumUserLevelFilter<$PrismaModel> | $Enums.UserLevel
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLevel | EnumUserLevelFieldRefInput<$PrismaModel>
    in?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserLevel[] | ListEnumUserLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumUserLevelWithAggregatesFilter<$PrismaModel> | $Enums.UserLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserLevelFilter<$PrismaModel>
    _max?: NestedEnumUserLevelFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumLessonStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLessonStatusFilter<$PrismaModel> | $Enums.LessonStatus
  }

  export type NestedEnumLessonStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LessonStatus | EnumLessonStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LessonStatus[] | ListEnumLessonStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLessonStatusWithAggregatesFilter<$PrismaModel> | $Enums.LessonStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLessonStatusFilter<$PrismaModel>
    _max?: NestedEnumLessonStatusFilter<$PrismaModel>
  }

  export type NestedEnumInteractionModeFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionMode | EnumInteractionModeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionModeFilter<$PrismaModel> | $Enums.InteractionMode
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumInteractionModeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InteractionMode | EnumInteractionModeFieldRefInput<$PrismaModel>
    in?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    notIn?: $Enums.InteractionMode[] | ListEnumInteractionModeFieldRefInput<$PrismaModel>
    not?: NestedEnumInteractionModeWithAggregatesFilter<$PrismaModel> | $Enums.InteractionMode
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInteractionModeFilter<$PrismaModel>
    _max?: NestedEnumInteractionModeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumDisputeStatusNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisputeStatusNullableFilter<$PrismaModel> | $Enums.DisputeStatus | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedEnumDisputeStatusNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DisputeStatus | EnumDisputeStatusFieldRefInput<$PrismaModel> | null
    in?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.DisputeStatus[] | ListEnumDisputeStatusFieldRefInput<$PrismaModel> | null
    not?: NestedEnumDisputeStatusNullableWithAggregatesFilter<$PrismaModel> | $Enums.DisputeStatus | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumDisputeStatusNullableFilter<$PrismaModel>
    _max?: NestedEnumDisputeStatusNullableFilter<$PrismaModel>
  }

  export type LevelCreateWithoutLanguageInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
    modules?: ModuleCreateNestedManyWithoutLevelInput
  }

  export type LevelUncheckedCreateWithoutLanguageInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
    modules?: ModuleUncheckedCreateNestedManyWithoutLevelInput
  }

  export type LevelCreateOrConnectWithoutLanguageInput = {
    where: LevelWhereUniqueInput
    create: XOR<LevelCreateWithoutLanguageInput, LevelUncheckedCreateWithoutLanguageInput>
  }

  export type LevelCreateManyLanguageInputEnvelope = {
    data: LevelCreateManyLanguageInput | LevelCreateManyLanguageInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutTargetLanguageInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileCreateNestedOneWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    progress?: UserProgressCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionCreateNestedManyWithoutUserInput
    modules?: ModuleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTargetLanguageInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    progress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutUserInput
    modules?: ModuleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTargetLanguageInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTargetLanguageInput, UserUncheckedCreateWithoutTargetLanguageInput>
  }

  export type UserCreateManyTargetLanguageInputEnvelope = {
    data: UserCreateManyTargetLanguageInput | UserCreateManyTargetLanguageInput[]
    skipDuplicates?: boolean
  }

  export type LevelUpsertWithWhereUniqueWithoutLanguageInput = {
    where: LevelWhereUniqueInput
    update: XOR<LevelUpdateWithoutLanguageInput, LevelUncheckedUpdateWithoutLanguageInput>
    create: XOR<LevelCreateWithoutLanguageInput, LevelUncheckedCreateWithoutLanguageInput>
  }

  export type LevelUpdateWithWhereUniqueWithoutLanguageInput = {
    where: LevelWhereUniqueInput
    data: XOR<LevelUpdateWithoutLanguageInput, LevelUncheckedUpdateWithoutLanguageInput>
  }

  export type LevelUpdateManyWithWhereWithoutLanguageInput = {
    where: LevelScalarWhereInput
    data: XOR<LevelUpdateManyMutationInput, LevelUncheckedUpdateManyWithoutLanguageInput>
  }

  export type LevelScalarWhereInput = {
    AND?: LevelScalarWhereInput | LevelScalarWhereInput[]
    OR?: LevelScalarWhereInput[]
    NOT?: LevelScalarWhereInput | LevelScalarWhereInput[]
    id?: StringFilter<"Level"> | string
    code?: EnumUserLevelFilter<"Level"> | $Enums.UserLevel
    description?: StringNullableFilter<"Level"> | string | null
    languageId?: StringFilter<"Level"> | string
  }

  export type UserUpsertWithWhereUniqueWithoutTargetLanguageInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutTargetLanguageInput, UserUncheckedUpdateWithoutTargetLanguageInput>
    create: XOR<UserCreateWithoutTargetLanguageInput, UserUncheckedCreateWithoutTargetLanguageInput>
  }

  export type UserUpdateWithWhereUniqueWithoutTargetLanguageInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutTargetLanguageInput, UserUncheckedUpdateWithoutTargetLanguageInput>
  }

  export type UserUpdateManyWithWhereWithoutTargetLanguageInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutTargetLanguageInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    currentLevel?: EnumUserLevelFilter<"User"> | $Enums.UserLevel
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    targetLanguageId?: StringNullableFilter<"User"> | string | null
  }

  export type LanguageCreateWithoutUsersInput = {
    id?: string
    code: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    levels?: LevelCreateNestedManyWithoutLanguageInput
  }

  export type LanguageUncheckedCreateWithoutUsersInput = {
    id?: string
    code: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    levels?: LevelUncheckedCreateNestedManyWithoutLanguageInput
  }

  export type LanguageCreateOrConnectWithoutUsersInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
  }

  export type UserProfileCreateWithoutUserInput = {
    id?: string
    nativeLanguage?: string
    interests?: UserProfileCreateinterestsInput | string[]
    hobbies?: UserProfileCreatehobbiesInput | string[]
    occupation?: string | null
    ageGroup?: string | null
    learningGoal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileUncheckedCreateWithoutUserInput = {
    id?: string
    nativeLanguage?: string
    interests?: UserProfileCreateinterestsInput | string[]
    hobbies?: UserProfileCreatehobbiesInput | string[]
    occupation?: string | null
    ageGroup?: string | null
    learningGoal?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserProfileCreateOrConnectWithoutUserInput = {
    where: UserProfileWhereUniqueInput
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
  }

  export type DeviceCreateWithoutUserInput = {
    id?: string
    serialNumber: string
    nickname?: string | null
    isActive?: boolean
    apiKey?: string | null
  }

  export type DeviceUncheckedCreateWithoutUserInput = {
    id?: string
    serialNumber: string
    nickname?: string | null
    isActive?: boolean
    apiKey?: string | null
  }

  export type DeviceCreateOrConnectWithoutUserInput = {
    where: DeviceWhereUniqueInput
    create: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput>
  }

  export type DeviceCreateManyUserInputEnvelope = {
    data: DeviceCreateManyUserInput | DeviceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionCreateWithoutUserInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planType: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SubscriptionUncheckedCreateWithoutUserInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planType: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type SubscriptionCreateOrConnectWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionCreateManyUserInputEnvelope = {
    data: SubscriptionCreateManyUserInput | SubscriptionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserProgressCreateWithoutUserInput = {
    id?: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
    lesson: LessonCreateNestedOneWithoutUserProgressInput
  }

  export type UserProgressUncheckedCreateWithoutUserInput = {
    id?: string
    lessonId: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
  }

  export type UserProgressCreateOrConnectWithoutUserInput = {
    where: UserProgressWhereUniqueInput
    create: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput>
  }

  export type UserProgressCreateManyUserInputEnvelope = {
    data: UserProgressCreateManyUserInput | UserProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ConversationSessionCreateWithoutUserInput = {
    id?: string
    mode: $Enums.InteractionMode
    startedAt?: Date | string
    endedAt?: Date | string | null
    lesson?: LessonCreateNestedOneWithoutSessionsInput
    interactions?: InteractionLogCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionUncheckedCreateWithoutUserInput = {
    id?: string
    mode: $Enums.InteractionMode
    lessonId?: string | null
    startedAt?: Date | string
    endedAt?: Date | string | null
    interactions?: InteractionLogUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionCreateOrConnectWithoutUserInput = {
    where: ConversationSessionWhereUniqueInput
    create: XOR<ConversationSessionCreateWithoutUserInput, ConversationSessionUncheckedCreateWithoutUserInput>
  }

  export type ConversationSessionCreateManyUserInputEnvelope = {
    data: ConversationSessionCreateManyUserInput | ConversationSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ModuleCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    level: LevelCreateNestedOneWithoutModulesInput
    lessons?: LessonCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    levelId: string
    lessons?: LessonUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleCreateOrConnectWithoutUserInput = {
    where: ModuleWhereUniqueInput
    create: XOR<ModuleCreateWithoutUserInput, ModuleUncheckedCreateWithoutUserInput>
  }

  export type ModuleCreateManyUserInputEnvelope = {
    data: ModuleCreateManyUserInput | ModuleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LanguageUpsertWithoutUsersInput = {
    update: XOR<LanguageUpdateWithoutUsersInput, LanguageUncheckedUpdateWithoutUsersInput>
    create: XOR<LanguageCreateWithoutUsersInput, LanguageUncheckedCreateWithoutUsersInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutUsersInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutUsersInput, LanguageUncheckedUpdateWithoutUsersInput>
  }

  export type LanguageUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    levels?: LevelUpdateManyWithoutLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    levels?: LevelUncheckedUpdateManyWithoutLanguageNestedInput
  }

  export type UserProfileUpsertWithoutUserInput = {
    update: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
    create: XOR<UserProfileCreateWithoutUserInput, UserProfileUncheckedCreateWithoutUserInput>
    where?: UserProfileWhereInput
  }

  export type UserProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: UserProfileWhereInput
    data: XOR<UserProfileUpdateWithoutUserInput, UserProfileUncheckedUpdateWithoutUserInput>
  }

  export type UserProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nativeLanguage?: StringFieldUpdateOperationsInput | string
    interests?: UserProfileUpdateinterestsInput | string[]
    hobbies?: UserProfileUpdatehobbiesInput | string[]
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    ageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    nativeLanguage?: StringFieldUpdateOperationsInput | string
    interests?: UserProfileUpdateinterestsInput | string[]
    hobbies?: UserProfileUpdatehobbiesInput | string[]
    occupation?: NullableStringFieldUpdateOperationsInput | string | null
    ageGroup?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoal?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceUpsertWithWhereUniqueWithoutUserInput = {
    where: DeviceWhereUniqueInput
    update: XOR<DeviceUpdateWithoutUserInput, DeviceUncheckedUpdateWithoutUserInput>
    create: XOR<DeviceCreateWithoutUserInput, DeviceUncheckedCreateWithoutUserInput>
  }

  export type DeviceUpdateWithWhereUniqueWithoutUserInput = {
    where: DeviceWhereUniqueInput
    data: XOR<DeviceUpdateWithoutUserInput, DeviceUncheckedUpdateWithoutUserInput>
  }

  export type DeviceUpdateManyWithWhereWithoutUserInput = {
    where: DeviceScalarWhereInput
    data: XOR<DeviceUpdateManyMutationInput, DeviceUncheckedUpdateManyWithoutUserInput>
  }

  export type DeviceScalarWhereInput = {
    AND?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    OR?: DeviceScalarWhereInput[]
    NOT?: DeviceScalarWhereInput | DeviceScalarWhereInput[]
    id?: StringFilter<"Device"> | string
    serialNumber?: StringFilter<"Device"> | string
    nickname?: StringNullableFilter<"Device"> | string | null
    isActive?: BoolFilter<"Device"> | boolean
    userId?: StringFilter<"Device"> | string
    apiKey?: StringNullableFilter<"Device"> | string | null
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
    create: XOR<SubscriptionCreateWithoutUserInput, SubscriptionUncheckedCreateWithoutUserInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutUserInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutUserInput, SubscriptionUncheckedUpdateWithoutUserInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutUserInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutUserInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    userId?: StringFilter<"Subscription"> | string
    status?: EnumSubscriptionStatusFilter<"Subscription"> | $Enums.SubscriptionStatus
    planType?: StringFilter<"Subscription"> | string
    expiresAt?: DateTimeFilter<"Subscription"> | Date | string
    createdAt?: DateTimeFilter<"Subscription"> | Date | string
  }

  export type UserProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: UserProgressWhereUniqueInput
    update: XOR<UserProgressUpdateWithoutUserInput, UserProgressUncheckedUpdateWithoutUserInput>
    create: XOR<UserProgressCreateWithoutUserInput, UserProgressUncheckedCreateWithoutUserInput>
  }

  export type UserProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: UserProgressWhereUniqueInput
    data: XOR<UserProgressUpdateWithoutUserInput, UserProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserProgressUpdateManyWithWhereWithoutUserInput = {
    where: UserProgressScalarWhereInput
    data: XOR<UserProgressUpdateManyMutationInput, UserProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type UserProgressScalarWhereInput = {
    AND?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
    OR?: UserProgressScalarWhereInput[]
    NOT?: UserProgressScalarWhereInput | UserProgressScalarWhereInput[]
    id?: StringFilter<"UserProgress"> | string
    userId?: StringFilter<"UserProgress"> | string
    lessonId?: StringFilter<"UserProgress"> | string
    score?: IntFilter<"UserProgress"> | number
    status?: EnumLessonStatusFilter<"UserProgress"> | $Enums.LessonStatus
    attempts?: IntFilter<"UserProgress"> | number
    lastAttempt?: DateTimeFilter<"UserProgress"> | Date | string
  }

  export type ConversationSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ConversationSessionWhereUniqueInput
    update: XOR<ConversationSessionUpdateWithoutUserInput, ConversationSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ConversationSessionCreateWithoutUserInput, ConversationSessionUncheckedCreateWithoutUserInput>
  }

  export type ConversationSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ConversationSessionWhereUniqueInput
    data: XOR<ConversationSessionUpdateWithoutUserInput, ConversationSessionUncheckedUpdateWithoutUserInput>
  }

  export type ConversationSessionUpdateManyWithWhereWithoutUserInput = {
    where: ConversationSessionScalarWhereInput
    data: XOR<ConversationSessionUpdateManyMutationInput, ConversationSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ConversationSessionScalarWhereInput = {
    AND?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
    OR?: ConversationSessionScalarWhereInput[]
    NOT?: ConversationSessionScalarWhereInput | ConversationSessionScalarWhereInput[]
    id?: StringFilter<"ConversationSession"> | string
    userId?: StringFilter<"ConversationSession"> | string
    mode?: EnumInteractionModeFilter<"ConversationSession"> | $Enums.InteractionMode
    lessonId?: StringNullableFilter<"ConversationSession"> | string | null
    startedAt?: DateTimeFilter<"ConversationSession"> | Date | string
    endedAt?: DateTimeNullableFilter<"ConversationSession"> | Date | string | null
  }

  export type ModuleUpsertWithWhereUniqueWithoutUserInput = {
    where: ModuleWhereUniqueInput
    update: XOR<ModuleUpdateWithoutUserInput, ModuleUncheckedUpdateWithoutUserInput>
    create: XOR<ModuleCreateWithoutUserInput, ModuleUncheckedCreateWithoutUserInput>
  }

  export type ModuleUpdateWithWhereUniqueWithoutUserInput = {
    where: ModuleWhereUniqueInput
    data: XOR<ModuleUpdateWithoutUserInput, ModuleUncheckedUpdateWithoutUserInput>
  }

  export type ModuleUpdateManyWithWhereWithoutUserInput = {
    where: ModuleScalarWhereInput
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyWithoutUserInput>
  }

  export type ModuleScalarWhereInput = {
    AND?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
    OR?: ModuleScalarWhereInput[]
    NOT?: ModuleScalarWhereInput | ModuleScalarWhereInput[]
    id?: StringFilter<"Module"> | string
    name?: StringFilter<"Module"> | string
    description?: StringNullableFilter<"Module"> | string | null
    order?: IntFilter<"Module"> | number
    isGenerated?: BoolFilter<"Module"> | boolean
    levelId?: StringFilter<"Module"> | string
    userId?: StringNullableFilter<"Module"> | string | null
  }

  export type UserCreateWithoutSubscriptionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguage?: LanguageCreateNestedOneWithoutUsersInput
    profile?: UserProfileCreateNestedOneWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    progress?: UserProgressCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionCreateNestedManyWithoutUserInput
    modules?: ModuleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    progress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutUserInput
    modules?: ModuleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSubscriptionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
  }

  export type UserUpsertWithoutSubscriptionsInput = {
    update: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<UserCreateWithoutSubscriptionsInput, UserUncheckedCreateWithoutSubscriptionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubscriptionsInput, UserUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type UserUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: LanguageUpdateOneWithoutUsersNestedInput
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    progress?: UserProgressUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUpdateManyWithoutUserNestedInput
    modules?: ModuleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    progress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutUserNestedInput
    modules?: ModuleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDevicesInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguage?: LanguageCreateNestedOneWithoutUsersInput
    profile?: UserProfileCreateNestedOneWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    progress?: UserProgressCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionCreateNestedManyWithoutUserInput
    modules?: ModuleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDevicesInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    progress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutUserInput
    modules?: ModuleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDevicesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
  }

  export type UserUpsertWithoutDevicesInput = {
    update: XOR<UserUpdateWithoutDevicesInput, UserUncheckedUpdateWithoutDevicesInput>
    create: XOR<UserCreateWithoutDevicesInput, UserUncheckedCreateWithoutDevicesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDevicesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDevicesInput, UserUncheckedUpdateWithoutDevicesInput>
  }

  export type UserUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: LanguageUpdateOneWithoutUsersNestedInput
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    progress?: UserProgressUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUpdateManyWithoutUserNestedInput
    modules?: ModuleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDevicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    progress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutUserNestedInput
    modules?: ModuleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutProfileInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguage?: LanguageCreateNestedOneWithoutUsersInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    progress?: UserProgressCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionCreateNestedManyWithoutUserInput
    modules?: ModuleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProfileInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    progress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutUserInput
    modules?: ModuleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
  }

  export type UserUpsertWithoutProfileInput = {
    update: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: LanguageUpdateOneWithoutUsersNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    progress?: UserProgressUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUpdateManyWithoutUserNestedInput
    modules?: ModuleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    progress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutUserNestedInput
    modules?: ModuleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LanguageCreateWithoutLevelsInput = {
    id?: string
    code: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutTargetLanguageInput
  }

  export type LanguageUncheckedCreateWithoutLevelsInput = {
    id?: string
    code: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutTargetLanguageInput
  }

  export type LanguageCreateOrConnectWithoutLevelsInput = {
    where: LanguageWhereUniqueInput
    create: XOR<LanguageCreateWithoutLevelsInput, LanguageUncheckedCreateWithoutLevelsInput>
  }

  export type ModuleCreateWithoutLevelInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    user?: UserCreateNestedOneWithoutModulesInput
    lessons?: LessonCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateWithoutLevelInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    userId?: string | null
    lessons?: LessonUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleCreateOrConnectWithoutLevelInput = {
    where: ModuleWhereUniqueInput
    create: XOR<ModuleCreateWithoutLevelInput, ModuleUncheckedCreateWithoutLevelInput>
  }

  export type ModuleCreateManyLevelInputEnvelope = {
    data: ModuleCreateManyLevelInput | ModuleCreateManyLevelInput[]
    skipDuplicates?: boolean
  }

  export type LanguageUpsertWithoutLevelsInput = {
    update: XOR<LanguageUpdateWithoutLevelsInput, LanguageUncheckedUpdateWithoutLevelsInput>
    create: XOR<LanguageCreateWithoutLevelsInput, LanguageUncheckedCreateWithoutLevelsInput>
    where?: LanguageWhereInput
  }

  export type LanguageUpdateToOneWithWhereWithoutLevelsInput = {
    where?: LanguageWhereInput
    data: XOR<LanguageUpdateWithoutLevelsInput, LanguageUncheckedUpdateWithoutLevelsInput>
  }

  export type LanguageUpdateWithoutLevelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutTargetLanguageNestedInput
  }

  export type LanguageUncheckedUpdateWithoutLevelsInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutTargetLanguageNestedInput
  }

  export type ModuleUpsertWithWhereUniqueWithoutLevelInput = {
    where: ModuleWhereUniqueInput
    update: XOR<ModuleUpdateWithoutLevelInput, ModuleUncheckedUpdateWithoutLevelInput>
    create: XOR<ModuleCreateWithoutLevelInput, ModuleUncheckedCreateWithoutLevelInput>
  }

  export type ModuleUpdateWithWhereUniqueWithoutLevelInput = {
    where: ModuleWhereUniqueInput
    data: XOR<ModuleUpdateWithoutLevelInput, ModuleUncheckedUpdateWithoutLevelInput>
  }

  export type ModuleUpdateManyWithWhereWithoutLevelInput = {
    where: ModuleScalarWhereInput
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyWithoutLevelInput>
  }

  export type LevelCreateWithoutModulesInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
    language: LanguageCreateNestedOneWithoutLevelsInput
  }

  export type LevelUncheckedCreateWithoutModulesInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
    languageId: string
  }

  export type LevelCreateOrConnectWithoutModulesInput = {
    where: LevelWhereUniqueInput
    create: XOR<LevelCreateWithoutModulesInput, LevelUncheckedCreateWithoutModulesInput>
  }

  export type UserCreateWithoutModulesInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguage?: LanguageCreateNestedOneWithoutUsersInput
    profile?: UserProfileCreateNestedOneWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    progress?: UserProgressCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutModulesInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    progress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutModulesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutModulesInput, UserUncheckedCreateWithoutModulesInput>
  }

  export type LessonCreateWithoutModuleInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    userProgress?: UserProgressCreateNestedManyWithoutLessonInput
    sessions?: ConversationSessionCreateNestedManyWithoutLessonInput
  }

  export type LessonUncheckedCreateWithoutModuleInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    userProgress?: UserProgressUncheckedCreateNestedManyWithoutLessonInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutLessonInput
  }

  export type LessonCreateOrConnectWithoutModuleInput = {
    where: LessonWhereUniqueInput
    create: XOR<LessonCreateWithoutModuleInput, LessonUncheckedCreateWithoutModuleInput>
  }

  export type LessonCreateManyModuleInputEnvelope = {
    data: LessonCreateManyModuleInput | LessonCreateManyModuleInput[]
    skipDuplicates?: boolean
  }

  export type LevelUpsertWithoutModulesInput = {
    update: XOR<LevelUpdateWithoutModulesInput, LevelUncheckedUpdateWithoutModulesInput>
    create: XOR<LevelCreateWithoutModulesInput, LevelUncheckedCreateWithoutModulesInput>
    where?: LevelWhereInput
  }

  export type LevelUpdateToOneWithWhereWithoutModulesInput = {
    where?: LevelWhereInput
    data: XOR<LevelUpdateWithoutModulesInput, LevelUncheckedUpdateWithoutModulesInput>
  }

  export type LevelUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
    language?: LanguageUpdateOneRequiredWithoutLevelsNestedInput
  }

  export type LevelUncheckedUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
    languageId?: StringFieldUpdateOperationsInput | string
  }

  export type UserUpsertWithoutModulesInput = {
    update: XOR<UserUpdateWithoutModulesInput, UserUncheckedUpdateWithoutModulesInput>
    create: XOR<UserCreateWithoutModulesInput, UserUncheckedCreateWithoutModulesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutModulesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutModulesInput, UserUncheckedUpdateWithoutModulesInput>
  }

  export type UserUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: LanguageUpdateOneWithoutUsersNestedInput
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    progress?: UserProgressUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    progress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LessonUpsertWithWhereUniqueWithoutModuleInput = {
    where: LessonWhereUniqueInput
    update: XOR<LessonUpdateWithoutModuleInput, LessonUncheckedUpdateWithoutModuleInput>
    create: XOR<LessonCreateWithoutModuleInput, LessonUncheckedCreateWithoutModuleInput>
  }

  export type LessonUpdateWithWhereUniqueWithoutModuleInput = {
    where: LessonWhereUniqueInput
    data: XOR<LessonUpdateWithoutModuleInput, LessonUncheckedUpdateWithoutModuleInput>
  }

  export type LessonUpdateManyWithWhereWithoutModuleInput = {
    where: LessonScalarWhereInput
    data: XOR<LessonUpdateManyMutationInput, LessonUncheckedUpdateManyWithoutModuleInput>
  }

  export type LessonScalarWhereInput = {
    AND?: LessonScalarWhereInput | LessonScalarWhereInput[]
    OR?: LessonScalarWhereInput[]
    NOT?: LessonScalarWhereInput | LessonScalarWhereInput[]
    id?: StringFilter<"Lesson"> | string
    title?: StringFilter<"Lesson"> | string
    scenario?: StringFilter<"Lesson"> | string
    systemPrompt?: StringFilter<"Lesson"> | string
    objectives?: StringNullableFilter<"Lesson"> | string | null
    order?: IntFilter<"Lesson"> | number
    isGenerated?: BoolFilter<"Lesson"> | boolean
    moduleId?: StringFilter<"Lesson"> | string
  }

  export type ModuleCreateWithoutLessonsInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    level: LevelCreateNestedOneWithoutModulesInput
    user?: UserCreateNestedOneWithoutModulesInput
  }

  export type ModuleUncheckedCreateWithoutLessonsInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    levelId: string
    userId?: string | null
  }

  export type ModuleCreateOrConnectWithoutLessonsInput = {
    where: ModuleWhereUniqueInput
    create: XOR<ModuleCreateWithoutLessonsInput, ModuleUncheckedCreateWithoutLessonsInput>
  }

  export type UserProgressCreateWithoutLessonInput = {
    id?: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
    user: UserCreateNestedOneWithoutProgressInput
  }

  export type UserProgressUncheckedCreateWithoutLessonInput = {
    id?: string
    userId: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
  }

  export type UserProgressCreateOrConnectWithoutLessonInput = {
    where: UserProgressWhereUniqueInput
    create: XOR<UserProgressCreateWithoutLessonInput, UserProgressUncheckedCreateWithoutLessonInput>
  }

  export type UserProgressCreateManyLessonInputEnvelope = {
    data: UserProgressCreateManyLessonInput | UserProgressCreateManyLessonInput[]
    skipDuplicates?: boolean
  }

  export type ConversationSessionCreateWithoutLessonInput = {
    id?: string
    mode: $Enums.InteractionMode
    startedAt?: Date | string
    endedAt?: Date | string | null
    user: UserCreateNestedOneWithoutSessionsInput
    interactions?: InteractionLogCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionUncheckedCreateWithoutLessonInput = {
    id?: string
    userId: string
    mode: $Enums.InteractionMode
    startedAt?: Date | string
    endedAt?: Date | string | null
    interactions?: InteractionLogUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ConversationSessionCreateOrConnectWithoutLessonInput = {
    where: ConversationSessionWhereUniqueInput
    create: XOR<ConversationSessionCreateWithoutLessonInput, ConversationSessionUncheckedCreateWithoutLessonInput>
  }

  export type ConversationSessionCreateManyLessonInputEnvelope = {
    data: ConversationSessionCreateManyLessonInput | ConversationSessionCreateManyLessonInput[]
    skipDuplicates?: boolean
  }

  export type ModuleUpsertWithoutLessonsInput = {
    update: XOR<ModuleUpdateWithoutLessonsInput, ModuleUncheckedUpdateWithoutLessonsInput>
    create: XOR<ModuleCreateWithoutLessonsInput, ModuleUncheckedCreateWithoutLessonsInput>
    where?: ModuleWhereInput
  }

  export type ModuleUpdateToOneWithWhereWithoutLessonsInput = {
    where?: ModuleWhereInput
    data: XOR<ModuleUpdateWithoutLessonsInput, ModuleUncheckedUpdateWithoutLessonsInput>
  }

  export type ModuleUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    level?: LevelUpdateOneRequiredWithoutModulesNestedInput
    user?: UserUpdateOneWithoutModulesNestedInput
  }

  export type ModuleUncheckedUpdateWithoutLessonsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    levelId?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserProgressUpsertWithWhereUniqueWithoutLessonInput = {
    where: UserProgressWhereUniqueInput
    update: XOR<UserProgressUpdateWithoutLessonInput, UserProgressUncheckedUpdateWithoutLessonInput>
    create: XOR<UserProgressCreateWithoutLessonInput, UserProgressUncheckedCreateWithoutLessonInput>
  }

  export type UserProgressUpdateWithWhereUniqueWithoutLessonInput = {
    where: UserProgressWhereUniqueInput
    data: XOR<UserProgressUpdateWithoutLessonInput, UserProgressUncheckedUpdateWithoutLessonInput>
  }

  export type UserProgressUpdateManyWithWhereWithoutLessonInput = {
    where: UserProgressScalarWhereInput
    data: XOR<UserProgressUpdateManyMutationInput, UserProgressUncheckedUpdateManyWithoutLessonInput>
  }

  export type ConversationSessionUpsertWithWhereUniqueWithoutLessonInput = {
    where: ConversationSessionWhereUniqueInput
    update: XOR<ConversationSessionUpdateWithoutLessonInput, ConversationSessionUncheckedUpdateWithoutLessonInput>
    create: XOR<ConversationSessionCreateWithoutLessonInput, ConversationSessionUncheckedCreateWithoutLessonInput>
  }

  export type ConversationSessionUpdateWithWhereUniqueWithoutLessonInput = {
    where: ConversationSessionWhereUniqueInput
    data: XOR<ConversationSessionUpdateWithoutLessonInput, ConversationSessionUncheckedUpdateWithoutLessonInput>
  }

  export type ConversationSessionUpdateManyWithWhereWithoutLessonInput = {
    where: ConversationSessionScalarWhereInput
    data: XOR<ConversationSessionUpdateManyMutationInput, ConversationSessionUncheckedUpdateManyWithoutLessonInput>
  }

  export type UserCreateWithoutProgressInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguage?: LanguageCreateNestedOneWithoutUsersInput
    profile?: UserProfileCreateNestedOneWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionCreateNestedManyWithoutUserInput
    modules?: ModuleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProgressInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutUserInput
    modules?: ModuleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
  }

  export type LessonCreateWithoutUserProgressInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    module: ModuleCreateNestedOneWithoutLessonsInput
    sessions?: ConversationSessionCreateNestedManyWithoutLessonInput
  }

  export type LessonUncheckedCreateWithoutUserProgressInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    moduleId: string
    sessions?: ConversationSessionUncheckedCreateNestedManyWithoutLessonInput
  }

  export type LessonCreateOrConnectWithoutUserProgressInput = {
    where: LessonWhereUniqueInput
    create: XOR<LessonCreateWithoutUserProgressInput, LessonUncheckedCreateWithoutUserProgressInput>
  }

  export type UserUpsertWithoutProgressInput = {
    update: XOR<UserUpdateWithoutProgressInput, UserUncheckedUpdateWithoutProgressInput>
    create: XOR<UserCreateWithoutProgressInput, UserUncheckedCreateWithoutProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProgressInput, UserUncheckedUpdateWithoutProgressInput>
  }

  export type UserUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: LanguageUpdateOneWithoutUsersNestedInput
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUpdateManyWithoutUserNestedInput
    modules?: ModuleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutUserNestedInput
    modules?: ModuleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LessonUpsertWithoutUserProgressInput = {
    update: XOR<LessonUpdateWithoutUserProgressInput, LessonUncheckedUpdateWithoutUserProgressInput>
    create: XOR<LessonCreateWithoutUserProgressInput, LessonUncheckedCreateWithoutUserProgressInput>
    where?: LessonWhereInput
  }

  export type LessonUpdateToOneWithWhereWithoutUserProgressInput = {
    where?: LessonWhereInput
    data: XOR<LessonUpdateWithoutUserProgressInput, LessonUncheckedUpdateWithoutUserProgressInput>
  }

  export type LessonUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    module?: ModuleUpdateOneRequiredWithoutLessonsNestedInput
    sessions?: ConversationSessionUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    moduleId?: StringFieldUpdateOperationsInput | string
    sessions?: ConversationSessionUncheckedUpdateManyWithoutLessonNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguage?: LanguageCreateNestedOneWithoutUsersInput
    profile?: UserProfileCreateNestedOneWithoutUserInput
    devices?: DeviceCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionCreateNestedManyWithoutUserInput
    progress?: UserProgressCreateNestedManyWithoutUserInput
    modules?: ModuleCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
    targetLanguageId?: string | null
    profile?: UserProfileUncheckedCreateNestedOneWithoutUserInput
    devices?: DeviceUncheckedCreateNestedManyWithoutUserInput
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutUserInput
    progress?: UserProgressUncheckedCreateNestedManyWithoutUserInput
    modules?: ModuleUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type LessonCreateWithoutSessionsInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    module: ModuleCreateNestedOneWithoutLessonsInput
    userProgress?: UserProgressCreateNestedManyWithoutLessonInput
  }

  export type LessonUncheckedCreateWithoutSessionsInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
    moduleId: string
    userProgress?: UserProgressUncheckedCreateNestedManyWithoutLessonInput
  }

  export type LessonCreateOrConnectWithoutSessionsInput = {
    where: LessonWhereUniqueInput
    create: XOR<LessonCreateWithoutSessionsInput, LessonUncheckedCreateWithoutSessionsInput>
  }

  export type InteractionLogCreateWithoutSessionInput = {
    id?: string
    userAudioTrans?: string | null
    leryResponse?: string | null
    grammaticalFixes?: string | null
    sentimentScore?: number | null
    taskAchievement?: number | null
    grammar?: number | null
    vocabulary?: number | null
    fluency?: number | null
    totalScore?: number | null
    evaluationReasoning?: string | null
    isDisputed?: boolean
    disputeStatus?: $Enums.DisputeStatus | null
    createdAt?: Date | string
  }

  export type InteractionLogUncheckedCreateWithoutSessionInput = {
    id?: string
    userAudioTrans?: string | null
    leryResponse?: string | null
    grammaticalFixes?: string | null
    sentimentScore?: number | null
    taskAchievement?: number | null
    grammar?: number | null
    vocabulary?: number | null
    fluency?: number | null
    totalScore?: number | null
    evaluationReasoning?: string | null
    isDisputed?: boolean
    disputeStatus?: $Enums.DisputeStatus | null
    createdAt?: Date | string
  }

  export type InteractionLogCreateOrConnectWithoutSessionInput = {
    where: InteractionLogWhereUniqueInput
    create: XOR<InteractionLogCreateWithoutSessionInput, InteractionLogUncheckedCreateWithoutSessionInput>
  }

  export type InteractionLogCreateManySessionInputEnvelope = {
    data: InteractionLogCreateManySessionInput | InteractionLogCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguage?: LanguageUpdateOneWithoutUsersNestedInput
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    progress?: UserProgressUpdateManyWithoutUserNestedInput
    modules?: ModuleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    targetLanguageId?: NullableStringFieldUpdateOperationsInput | string | null
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    progress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
    modules?: ModuleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LessonUpsertWithoutSessionsInput = {
    update: XOR<LessonUpdateWithoutSessionsInput, LessonUncheckedUpdateWithoutSessionsInput>
    create: XOR<LessonCreateWithoutSessionsInput, LessonUncheckedCreateWithoutSessionsInput>
    where?: LessonWhereInput
  }

  export type LessonUpdateToOneWithWhereWithoutSessionsInput = {
    where?: LessonWhereInput
    data: XOR<LessonUpdateWithoutSessionsInput, LessonUncheckedUpdateWithoutSessionsInput>
  }

  export type LessonUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    module?: ModuleUpdateOneRequiredWithoutLessonsNestedInput
    userProgress?: UserProgressUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    moduleId?: StringFieldUpdateOperationsInput | string
    userProgress?: UserProgressUncheckedUpdateManyWithoutLessonNestedInput
  }

  export type InteractionLogUpsertWithWhereUniqueWithoutSessionInput = {
    where: InteractionLogWhereUniqueInput
    update: XOR<InteractionLogUpdateWithoutSessionInput, InteractionLogUncheckedUpdateWithoutSessionInput>
    create: XOR<InteractionLogCreateWithoutSessionInput, InteractionLogUncheckedCreateWithoutSessionInput>
  }

  export type InteractionLogUpdateWithWhereUniqueWithoutSessionInput = {
    where: InteractionLogWhereUniqueInput
    data: XOR<InteractionLogUpdateWithoutSessionInput, InteractionLogUncheckedUpdateWithoutSessionInput>
  }

  export type InteractionLogUpdateManyWithWhereWithoutSessionInput = {
    where: InteractionLogScalarWhereInput
    data: XOR<InteractionLogUpdateManyMutationInput, InteractionLogUncheckedUpdateManyWithoutSessionInput>
  }

  export type InteractionLogScalarWhereInput = {
    AND?: InteractionLogScalarWhereInput | InteractionLogScalarWhereInput[]
    OR?: InteractionLogScalarWhereInput[]
    NOT?: InteractionLogScalarWhereInput | InteractionLogScalarWhereInput[]
    id?: StringFilter<"InteractionLog"> | string
    sessionId?: StringFilter<"InteractionLog"> | string
    userAudioTrans?: StringNullableFilter<"InteractionLog"> | string | null
    leryResponse?: StringNullableFilter<"InteractionLog"> | string | null
    grammaticalFixes?: StringNullableFilter<"InteractionLog"> | string | null
    sentimentScore?: FloatNullableFilter<"InteractionLog"> | number | null
    taskAchievement?: IntNullableFilter<"InteractionLog"> | number | null
    grammar?: IntNullableFilter<"InteractionLog"> | number | null
    vocabulary?: IntNullableFilter<"InteractionLog"> | number | null
    fluency?: IntNullableFilter<"InteractionLog"> | number | null
    totalScore?: IntNullableFilter<"InteractionLog"> | number | null
    evaluationReasoning?: StringNullableFilter<"InteractionLog"> | string | null
    isDisputed?: BoolFilter<"InteractionLog"> | boolean
    disputeStatus?: EnumDisputeStatusNullableFilter<"InteractionLog"> | $Enums.DisputeStatus | null
    createdAt?: DateTimeFilter<"InteractionLog"> | Date | string
  }

  export type ConversationSessionCreateWithoutInteractionsInput = {
    id?: string
    mode: $Enums.InteractionMode
    startedAt?: Date | string
    endedAt?: Date | string | null
    user: UserCreateNestedOneWithoutSessionsInput
    lesson?: LessonCreateNestedOneWithoutSessionsInput
  }

  export type ConversationSessionUncheckedCreateWithoutInteractionsInput = {
    id?: string
    userId: string
    mode: $Enums.InteractionMode
    lessonId?: string | null
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ConversationSessionCreateOrConnectWithoutInteractionsInput = {
    where: ConversationSessionWhereUniqueInput
    create: XOR<ConversationSessionCreateWithoutInteractionsInput, ConversationSessionUncheckedCreateWithoutInteractionsInput>
  }

  export type ConversationSessionUpsertWithoutInteractionsInput = {
    update: XOR<ConversationSessionUpdateWithoutInteractionsInput, ConversationSessionUncheckedUpdateWithoutInteractionsInput>
    create: XOR<ConversationSessionCreateWithoutInteractionsInput, ConversationSessionUncheckedCreateWithoutInteractionsInput>
    where?: ConversationSessionWhereInput
  }

  export type ConversationSessionUpdateToOneWithWhereWithoutInteractionsInput = {
    where?: ConversationSessionWhereInput
    data: XOR<ConversationSessionUpdateWithoutInteractionsInput, ConversationSessionUncheckedUpdateWithoutInteractionsInput>
  }

  export type ConversationSessionUpdateWithoutInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    lesson?: LessonUpdateOneWithoutSessionsNestedInput
  }

  export type ConversationSessionUncheckedUpdateWithoutInteractionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type LevelCreateManyLanguageInput = {
    id?: string
    code: $Enums.UserLevel
    description?: string | null
  }

  export type UserCreateManyTargetLanguageInput = {
    id?: string
    email: string
    username: string
    passwordHash: string
    name: string
    currentLevel?: $Enums.UserLevel
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LevelUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ModuleUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: ModuleUncheckedUpdateManyWithoutLevelNestedInput
  }

  export type LevelUncheckedUpdateManyWithoutLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUpdateWithoutTargetLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUpdateOneWithoutUserNestedInput
    devices?: DeviceUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUpdateManyWithoutUserNestedInput
    progress?: UserProgressUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUpdateManyWithoutUserNestedInput
    modules?: ModuleUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTargetLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: UserProfileUncheckedUpdateOneWithoutUserNestedInput
    devices?: DeviceUncheckedUpdateManyWithoutUserNestedInput
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutUserNestedInput
    progress?: UserProgressUncheckedUpdateManyWithoutUserNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutUserNestedInput
    modules?: ModuleUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutTargetLanguageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    currentLevel?: EnumUserLevelFieldUpdateOperationsInput | $Enums.UserLevel
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeviceCreateManyUserInput = {
    id?: string
    serialNumber: string
    nickname?: string | null
    isActive?: boolean
    apiKey?: string | null
  }

  export type SubscriptionCreateManyUserInput = {
    id?: string
    status?: $Enums.SubscriptionStatus
    planType: string
    expiresAt: Date | string
    createdAt?: Date | string
  }

  export type UserProgressCreateManyUserInput = {
    id?: string
    lessonId: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
  }

  export type ConversationSessionCreateManyUserInput = {
    id?: string
    mode: $Enums.InteractionMode
    lessonId?: string | null
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type ModuleCreateManyUserInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    levelId: string
  }

  export type DeviceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    apiKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeviceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    apiKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DeviceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    serialNumber?: StringFieldUpdateOperationsInput | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    apiKey?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubscriptionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planType?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planType?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubscriptionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    planType?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
    lesson?: LessonUpdateOneRequiredWithoutUserProgressNestedInput
  }

  export type UserProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    lessonId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lesson?: LessonUpdateOneWithoutSessionsNestedInput
    interactions?: InteractionLogUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    interactions?: InteractionLogUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    lessonId?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ModuleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    level?: LevelUpdateOneRequiredWithoutModulesNestedInput
    lessons?: LessonUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    levelId?: StringFieldUpdateOperationsInput | string
    lessons?: LessonUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    levelId?: StringFieldUpdateOperationsInput | string
  }

  export type ModuleCreateManyLevelInput = {
    id?: string
    name: string
    description?: string | null
    order: number
    isGenerated?: boolean
    userId?: string | null
  }

  export type ModuleUpdateWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneWithoutModulesNestedInput
    lessons?: LessonUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    lessons?: LessonUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateManyWithoutLevelInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    userId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LessonCreateManyModuleInput = {
    id?: string
    title: string
    scenario: string
    systemPrompt: string
    objectives?: string | null
    order: number
    isGenerated?: boolean
  }

  export type LessonUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    userProgress?: UserProgressUpdateManyWithoutLessonNestedInput
    sessions?: ConversationSessionUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
    userProgress?: UserProgressUncheckedUpdateManyWithoutLessonNestedInput
    sessions?: ConversationSessionUncheckedUpdateManyWithoutLessonNestedInput
  }

  export type LessonUncheckedUpdateManyWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    scenario?: StringFieldUpdateOperationsInput | string
    systemPrompt?: StringFieldUpdateOperationsInput | string
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    isGenerated?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserProgressCreateManyLessonInput = {
    id?: string
    userId: string
    score?: number
    status?: $Enums.LessonStatus
    attempts?: number
    lastAttempt?: Date | string
  }

  export type ConversationSessionCreateManyLessonInput = {
    id?: string
    userId: string
    mode: $Enums.InteractionMode
    startedAt?: Date | string
    endedAt?: Date | string | null
  }

  export type UserProgressUpdateWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProgressNestedInput
  }

  export type UserProgressUncheckedUpdateWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserProgressUncheckedUpdateManyWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    status?: EnumLessonStatusFieldUpdateOperationsInput | $Enums.LessonStatus
    attempts?: IntFieldUpdateOperationsInput | number
    lastAttempt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConversationSessionUpdateWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
    interactions?: InteractionLogUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    interactions?: InteractionLogUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ConversationSessionUncheckedUpdateManyWithoutLessonInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    mode?: EnumInteractionModeFieldUpdateOperationsInput | $Enums.InteractionMode
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type InteractionLogCreateManySessionInput = {
    id?: string
    userAudioTrans?: string | null
    leryResponse?: string | null
    grammaticalFixes?: string | null
    sentimentScore?: number | null
    taskAchievement?: number | null
    grammar?: number | null
    vocabulary?: number | null
    fluency?: number | null
    totalScore?: number | null
    evaluationReasoning?: string | null
    isDisputed?: boolean
    disputeStatus?: $Enums.DisputeStatus | null
    createdAt?: Date | string
  }

  export type InteractionLogUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAudioTrans?: NullableStringFieldUpdateOperationsInput | string | null
    leryResponse?: NullableStringFieldUpdateOperationsInput | string | null
    grammaticalFixes?: NullableStringFieldUpdateOperationsInput | string | null
    sentimentScore?: NullableFloatFieldUpdateOperationsInput | number | null
    taskAchievement?: NullableIntFieldUpdateOperationsInput | number | null
    grammar?: NullableIntFieldUpdateOperationsInput | number | null
    vocabulary?: NullableIntFieldUpdateOperationsInput | number | null
    fluency?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationReasoning?: NullableStringFieldUpdateOperationsInput | string | null
    isDisputed?: BoolFieldUpdateOperationsInput | boolean
    disputeStatus?: NullableEnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionLogUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAudioTrans?: NullableStringFieldUpdateOperationsInput | string | null
    leryResponse?: NullableStringFieldUpdateOperationsInput | string | null
    grammaticalFixes?: NullableStringFieldUpdateOperationsInput | string | null
    sentimentScore?: NullableFloatFieldUpdateOperationsInput | number | null
    taskAchievement?: NullableIntFieldUpdateOperationsInput | number | null
    grammar?: NullableIntFieldUpdateOperationsInput | number | null
    vocabulary?: NullableIntFieldUpdateOperationsInput | number | null
    fluency?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationReasoning?: NullableStringFieldUpdateOperationsInput | string | null
    isDisputed?: BoolFieldUpdateOperationsInput | boolean
    disputeStatus?: NullableEnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InteractionLogUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAudioTrans?: NullableStringFieldUpdateOperationsInput | string | null
    leryResponse?: NullableStringFieldUpdateOperationsInput | string | null
    grammaticalFixes?: NullableStringFieldUpdateOperationsInput | string | null
    sentimentScore?: NullableFloatFieldUpdateOperationsInput | number | null
    taskAchievement?: NullableIntFieldUpdateOperationsInput | number | null
    grammar?: NullableIntFieldUpdateOperationsInput | number | null
    vocabulary?: NullableIntFieldUpdateOperationsInput | number | null
    fluency?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableIntFieldUpdateOperationsInput | number | null
    evaluationReasoning?: NullableStringFieldUpdateOperationsInput | string | null
    isDisputed?: BoolFieldUpdateOperationsInput | boolean
    disputeStatus?: NullableEnumDisputeStatusFieldUpdateOperationsInput | $Enums.DisputeStatus | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}