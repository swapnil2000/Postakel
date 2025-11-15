
/**
 * Client
**/

import * as runtime from './runtime/library';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions

export type PrismaPromise<T> = $Public.PrismaPromise<T>


export type TenantPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "Tenant"
  objects: {
    tenantPlans: TenantPlanPayload<ExtArgs>[]
    modules: TenantModulePayload<ExtArgs>[]
    usageSnapshots: TenantUsageSnapshotPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt: Date
    updatedAt: Date
    restaurantId: string
    useRedis: boolean
    posType: PosType
    status: TenantStatus
    country: string | null
    city: string | null
    timezone: string | null
    contactName: string | null
    contactPhone: string | null
    billingEmail: string | null
    onboardingCompleted: boolean
    lastSeenAt: Date | null
    notes: string | null
  }, ExtArgs["result"]["tenant"]>
  composites: {}
}

/**
 * Model Tenant
 * 
 */
export type Tenant = runtime.Types.DefaultSelection<TenantPayload>
export type ServicePlanPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "ServicePlan"
  objects: {
    tenantPlans: TenantPlanPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    name: string
    code: string
    posType: PosType
    description: string | null
    featureHighlights: string[]
    allowedModules: string[]
    monthlyPriceCents: number
    annualPriceCents: number
    currency: string
    defaultBillingCycle: BillingCycle
    trialPeriodDays: number
    isFeatured: boolean
    isActive: boolean
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["servicePlan"]>
  composites: {}
}

/**
 * Model ServicePlan
 * 
 */
export type ServicePlan = runtime.Types.DefaultSelection<ServicePlanPayload>
export type TenantPlanPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "TenantPlan"
  objects: {
    tenant: TenantPayload<ExtArgs>
    plan: ServicePlanPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    tenantId: string
    planId: string
    status: TenantPlanStatus
    billingCycle: BillingCycle
    startDate: Date
    endDate: Date | null
    renewalDate: Date | null
    monthlyRevenueCents: number
    totalRevenueCents: number
    transactionsCount: number
    lastActive: Date | null
    allowedModulesSnapshot: string[]
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["tenantPlan"]>
  composites: {}
}

/**
 * Model TenantPlan
 * 
 */
export type TenantPlan = runtime.Types.DefaultSelection<TenantPlanPayload>
export type TenantModulePayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "TenantModule"
  objects: {
    tenant: TenantPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    tenantId: string
    moduleKey: string
    moduleName: string | null
    status: TenantModuleStatus
    assignedAt: Date
    expiresAt: Date | null
    lastUsedAt: Date | null
  }, ExtArgs["result"]["tenantModule"]>
  composites: {}
}

/**
 * Model TenantModule
 * 
 */
export type TenantModule = runtime.Types.DefaultSelection<TenantModulePayload>
export type TenantUsageSnapshotPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "TenantUsageSnapshot"
  objects: {
    tenant: TenantPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    tenantId: string
    snapshotDate: Date
    metricType: UsageMetricType
    value: number
    currency: string | null
    metadata: Prisma.JsonValue | null
  }, ExtArgs["result"]["tenantUsageSnapshot"]>
  composites: {}
}

/**
 * Model TenantUsageSnapshot
 * 
 */
export type TenantUsageSnapshot = runtime.Types.DefaultSelection<TenantUsageSnapshotPayload>
export type AdminUserPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "AdminUser"
  objects: {
    refreshTokens: AdminRefreshTokenPayload<ExtArgs>[]
    auditLogs: AdminAuditLogPayload<ExtArgs>[]
  }
  scalars: $Extensions.GetResult<{
    id: string
    email: string
    passwordHash: string
    name: string | null
    role: AdminRole
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["adminUser"]>
  composites: {}
}

/**
 * Model AdminUser
 * 
 */
export type AdminUser = runtime.Types.DefaultSelection<AdminUserPayload>
export type AdminRefreshTokenPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "AdminRefreshToken"
  objects: {
    admin: AdminUserPayload<ExtArgs>
  }
  scalars: $Extensions.GetResult<{
    id: string
    adminId: string
    token: string
    expiresAt: Date
    createdAt: Date
    revokedAt: Date | null
  }, ExtArgs["result"]["adminRefreshToken"]>
  composites: {}
}

/**
 * Model AdminRefreshToken
 * 
 */
export type AdminRefreshToken = runtime.Types.DefaultSelection<AdminRefreshTokenPayload>
export type AdminAuditLogPayload<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
  name: "AdminAuditLog"
  objects: {
    admin: AdminUserPayload<ExtArgs> | null
  }
  scalars: $Extensions.GetResult<{
    id: string
    adminId: string | null
    action: string
    targetType: string
    targetId: string | null
    metadata: Prisma.JsonValue | null
    createdAt: Date
  }, ExtArgs["result"]["adminAuditLog"]>
  composites: {}
}

/**
 * Model AdminAuditLog
 * 
 */
export type AdminAuditLog = runtime.Types.DefaultSelection<AdminAuditLogPayload>

/**
 * Enums
 */

export const PosType: {
  RESTAURANT: 'RESTAURANT',
  ARTIST: 'ARTIST',
  BUSINESS: 'BUSINESS'
};

export type PosType = (typeof PosType)[keyof typeof PosType]


export const TenantStatus: {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  CANCELLED: 'CANCELLED'
};

export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus]


export const BillingCycle: {
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL'
};

export type BillingCycle = (typeof BillingCycle)[keyof typeof BillingCycle]


export const TenantPlanStatus: {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  IN_GRACE_PERIOD: 'IN_GRACE_PERIOD',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

export type TenantPlanStatus = (typeof TenantPlanStatus)[keyof typeof TenantPlanStatus]


export const TenantModuleStatus: {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
  PENDING: 'PENDING'
};

export type TenantModuleStatus = (typeof TenantModuleStatus)[keyof typeof TenantModuleStatus]


export const UsageMetricType: {
  REVENUE: 'REVENUE',
  TRANSACTIONS: 'TRANSACTIONS',
  ACTIVE_USERS: 'ACTIVE_USERS'
};

export type UsageMetricType = (typeof UsageMetricType)[keyof typeof UsageMetricType]


export const AdminRole: {
  SUPER: 'SUPER',
  SUPPORT: 'SUPPORT',
  VIEWER: 'VIEWER'
};

export type AdminRole = (typeof AdminRole)[keyof typeof AdminRole]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false,
  ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.servicePlan`: Exposes CRUD operations for the **ServicePlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServicePlans
    * const servicePlans = await prisma.servicePlan.findMany()
    * ```
    */
  get servicePlan(): Prisma.ServicePlanDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.tenantPlan`: Exposes CRUD operations for the **TenantPlan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantPlans
    * const tenantPlans = await prisma.tenantPlan.findMany()
    * ```
    */
  get tenantPlan(): Prisma.TenantPlanDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.tenantModule`: Exposes CRUD operations for the **TenantModule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantModules
    * const tenantModules = await prisma.tenantModule.findMany()
    * ```
    */
  get tenantModule(): Prisma.TenantModuleDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.tenantUsageSnapshot`: Exposes CRUD operations for the **TenantUsageSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantUsageSnapshots
    * const tenantUsageSnapshots = await prisma.tenantUsageSnapshot.findMany()
    * ```
    */
  get tenantUsageSnapshot(): Prisma.TenantUsageSnapshotDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.adminUser`: Exposes CRUD operations for the **AdminUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminUsers
    * const adminUsers = await prisma.adminUser.findMany()
    * ```
    */
  get adminUser(): Prisma.AdminUserDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.adminRefreshToken`: Exposes CRUD operations for the **AdminRefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminRefreshTokens
    * const adminRefreshTokens = await prisma.adminRefreshToken.findMany()
    * ```
    */
  get adminRefreshToken(): Prisma.AdminRefreshTokenDelegate<GlobalReject, ExtArgs>;

  /**
   * `prisma.adminAuditLog`: Exposes CRUD operations for the **AdminAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminAuditLogs
    * const adminAuditLogs = await prisma.adminAuditLog.findMany()
    * ```
    */
  get adminAuditLog(): Prisma.AdminAuditLogDelegate<GlobalReject, ExtArgs>;
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
  export import NotFoundError = runtime.NotFoundError

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
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export type Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export type Args<T, F extends $Public.Operation> = $Public.Args<T, F>
  export type Payload<T, F extends $Public.Operation> = $Public.Payload<T, F>
  export type Result<T, A, F extends $Public.Operation> = $Public.Result<T, A, F>
  export type Exact<T, W> = $Public.Exact<T, W>

  /**
   * Prisma Client JS version: 4.16.2
   * Query Engine version: 4bc8b6e1b66cb932731fb1bdbbc550d1e010de81
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

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
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

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
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
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
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    ServicePlan: 'ServicePlan',
    TenantPlan: 'TenantPlan',
    TenantModule: 'TenantModule',
    TenantUsageSnapshot: 'TenantUsageSnapshot',
    AdminUser: 'AdminUser',
    AdminRefreshToken: 'AdminRefreshToken',
    AdminAuditLog: 'AdminAuditLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.Args}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'tenant' | 'servicePlan' | 'tenantPlan' | 'tenantModule' | 'tenantUsageSnapshot' | 'adminUser' | 'adminRefreshToken' | 'adminAuditLog'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      Tenant: {
        payload: TenantPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      ServicePlan: {
        payload: ServicePlanPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.ServicePlanFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServicePlanFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload>
          }
          findFirst: {
            args: Prisma.ServicePlanFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServicePlanFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload>
          }
          findMany: {
            args: Prisma.ServicePlanFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload>[]
          }
          create: {
            args: Prisma.ServicePlanCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload>
          }
          createMany: {
            args: Prisma.ServicePlanCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.ServicePlanDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload>
          }
          update: {
            args: Prisma.ServicePlanUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload>
          }
          deleteMany: {
            args: Prisma.ServicePlanDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.ServicePlanUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.ServicePlanUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<ServicePlanPayload>
          }
          aggregate: {
            args: Prisma.ServicePlanAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateServicePlan>
          }
          groupBy: {
            args: Prisma.ServicePlanGroupByArgs<ExtArgs>,
            result: $Utils.Optional<ServicePlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServicePlanCountArgs<ExtArgs>,
            result: $Utils.Optional<ServicePlanCountAggregateOutputType> | number
          }
        }
      }
      TenantPlan: {
        payload: TenantPlanPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.TenantPlanFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantPlanFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload>
          }
          findFirst: {
            args: Prisma.TenantPlanFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantPlanFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload>
          }
          findMany: {
            args: Prisma.TenantPlanFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload>[]
          }
          create: {
            args: Prisma.TenantPlanCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload>
          }
          createMany: {
            args: Prisma.TenantPlanCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TenantPlanDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload>
          }
          update: {
            args: Prisma.TenantPlanUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload>
          }
          deleteMany: {
            args: Prisma.TenantPlanDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantPlanUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantPlanUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantPlanPayload>
          }
          aggregate: {
            args: Prisma.TenantPlanAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenantPlan>
          }
          groupBy: {
            args: Prisma.TenantPlanGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantPlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantPlanCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantPlanCountAggregateOutputType> | number
          }
        }
      }
      TenantModule: {
        payload: TenantModulePayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.TenantModuleFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantModuleFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload>
          }
          findFirst: {
            args: Prisma.TenantModuleFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantModuleFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload>
          }
          findMany: {
            args: Prisma.TenantModuleFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload>[]
          }
          create: {
            args: Prisma.TenantModuleCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload>
          }
          createMany: {
            args: Prisma.TenantModuleCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TenantModuleDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload>
          }
          update: {
            args: Prisma.TenantModuleUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload>
          }
          deleteMany: {
            args: Prisma.TenantModuleDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantModuleUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantModuleUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantModulePayload>
          }
          aggregate: {
            args: Prisma.TenantModuleAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenantModule>
          }
          groupBy: {
            args: Prisma.TenantModuleGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantModuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantModuleCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantModuleCountAggregateOutputType> | number
          }
        }
      }
      TenantUsageSnapshot: {
        payload: TenantUsageSnapshotPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.TenantUsageSnapshotFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantUsageSnapshotFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload>
          }
          findFirst: {
            args: Prisma.TenantUsageSnapshotFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantUsageSnapshotFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload>
          }
          findMany: {
            args: Prisma.TenantUsageSnapshotFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload>[]
          }
          create: {
            args: Prisma.TenantUsageSnapshotCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload>
          }
          createMany: {
            args: Prisma.TenantUsageSnapshotCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.TenantUsageSnapshotDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload>
          }
          update: {
            args: Prisma.TenantUsageSnapshotUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.TenantUsageSnapshotDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUsageSnapshotUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantUsageSnapshotUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<TenantUsageSnapshotPayload>
          }
          aggregate: {
            args: Prisma.TenantUsageSnapshotAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenantUsageSnapshot>
          }
          groupBy: {
            args: Prisma.TenantUsageSnapshotGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantUsageSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantUsageSnapshotCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantUsageSnapshotCountAggregateOutputType> | number
          }
        }
      }
      AdminUser: {
        payload: AdminUserPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.AdminUserFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminUserFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload>
          }
          findFirst: {
            args: Prisma.AdminUserFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminUserFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload>
          }
          findMany: {
            args: Prisma.AdminUserFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload>[]
          }
          create: {
            args: Prisma.AdminUserCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload>
          }
          createMany: {
            args: Prisma.AdminUserCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.AdminUserDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload>
          }
          update: {
            args: Prisma.AdminUserUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload>
          }
          deleteMany: {
            args: Prisma.AdminUserDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUserUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AdminUserUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminUserPayload>
          }
          aggregate: {
            args: Prisma.AdminUserAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAdminUser>
          }
          groupBy: {
            args: Prisma.AdminUserGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AdminUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminUserCountArgs<ExtArgs>,
            result: $Utils.Optional<AdminUserCountAggregateOutputType> | number
          }
        }
      }
      AdminRefreshToken: {
        payload: AdminRefreshTokenPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.AdminRefreshTokenFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminRefreshTokenFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.AdminRefreshTokenFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminRefreshTokenFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload>
          }
          findMany: {
            args: Prisma.AdminRefreshTokenFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload>[]
          }
          create: {
            args: Prisma.AdminRefreshTokenCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload>
          }
          createMany: {
            args: Prisma.AdminRefreshTokenCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.AdminRefreshTokenDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload>
          }
          update: {
            args: Prisma.AdminRefreshTokenUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.AdminRefreshTokenDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AdminRefreshTokenUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AdminRefreshTokenUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminRefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.AdminRefreshTokenAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAdminRefreshToken>
          }
          groupBy: {
            args: Prisma.AdminRefreshTokenGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AdminRefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminRefreshTokenCountArgs<ExtArgs>,
            result: $Utils.Optional<AdminRefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      AdminAuditLog: {
        payload: AdminAuditLogPayload<ExtArgs>
        operations: {
          findUnique: {
            args: Prisma.AdminAuditLogFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminAuditLogFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload>
          }
          findFirst: {
            args: Prisma.AdminAuditLogFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminAuditLogFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload>
          }
          findMany: {
            args: Prisma.AdminAuditLogFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload>[]
          }
          create: {
            args: Prisma.AdminAuditLogCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload>
          }
          createMany: {
            args: Prisma.AdminAuditLogCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.AdminAuditLogDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload>
          }
          update: {
            args: Prisma.AdminAuditLogUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AdminAuditLogDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.AdminAuditLogUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.AdminAuditLogUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<AdminAuditLogPayload>
          }
          aggregate: {
            args: Prisma.AdminAuditLogAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateAdminAuditLog>
          }
          groupBy: {
            args: Prisma.AdminAuditLogGroupByArgs<ExtArgs>,
            result: $Utils.Optional<AdminAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminAuditLogCountArgs<ExtArgs>,
            result: $Utils.Optional<AdminAuditLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

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
   * Count Type TenantCountOutputType
   */


  export type TenantCountOutputType = {
    tenantPlans: number
    modules: number
    usageSnapshots: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tenantPlans?: boolean | TenantCountOutputTypeCountTenantPlansArgs
    modules?: boolean | TenantCountOutputTypeCountModulesArgs
    usageSnapshots?: boolean | TenantCountOutputTypeCountUsageSnapshotsArgs
  }

  // Custom InputTypes

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountTenantPlansArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantPlanWhereInput
  }


  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountModulesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantModuleWhereInput
  }


  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsageSnapshotsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantUsageSnapshotWhereInput
  }



  /**
   * Count Type ServicePlanCountOutputType
   */


  export type ServicePlanCountOutputType = {
    tenantPlans: number
  }

  export type ServicePlanCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tenantPlans?: boolean | ServicePlanCountOutputTypeCountTenantPlansArgs
  }

  // Custom InputTypes

  /**
   * ServicePlanCountOutputType without action
   */
  export type ServicePlanCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlanCountOutputType
     */
    select?: ServicePlanCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * ServicePlanCountOutputType without action
   */
  export type ServicePlanCountOutputTypeCountTenantPlansArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantPlanWhereInput
  }



  /**
   * Count Type AdminUserCountOutputType
   */


  export type AdminUserCountOutputType = {
    refreshTokens: number
    auditLogs: number
  }

  export type AdminUserCountOutputTypeSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    refreshTokens?: boolean | AdminUserCountOutputTypeCountRefreshTokensArgs
    auditLogs?: boolean | AdminUserCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes

  /**
   * AdminUserCountOutputType without action
   */
  export type AdminUserCountOutputTypeArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUserCountOutputType
     */
    select?: AdminUserCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * AdminUserCountOutputType without action
   */
  export type AdminUserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AdminRefreshTokenWhereInput
  }


  /**
   * AdminUserCountOutputType without action
   */
  export type AdminUserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AdminAuditLogWhereInput
  }



  /**
   * Models
   */

  /**
   * Model Tenant
   */


  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    dbName: string | null
    dbUser: string | null
    dbPassword: string | null
    createdAt: Date | null
    updatedAt: Date | null
    restaurantId: string | null
    useRedis: boolean | null
    posType: PosType | null
    status: TenantStatus | null
    country: string | null
    city: string | null
    timezone: string | null
    contactName: string | null
    contactPhone: string | null
    billingEmail: string | null
    onboardingCompleted: boolean | null
    lastSeenAt: Date | null
    notes: string | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    dbName: string | null
    dbUser: string | null
    dbPassword: string | null
    createdAt: Date | null
    updatedAt: Date | null
    restaurantId: string | null
    useRedis: boolean | null
    posType: PosType | null
    status: TenantStatus | null
    country: string | null
    city: string | null
    timezone: string | null
    contactName: string | null
    contactPhone: string | null
    billingEmail: string | null
    onboardingCompleted: boolean | null
    lastSeenAt: Date | null
    notes: string | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    name: number
    email: number
    dbName: number
    dbUser: number
    dbPassword: number
    createdAt: number
    updatedAt: number
    restaurantId: number
    useRedis: number
    posType: number
    status: number
    country: number
    city: number
    timezone: number
    contactName: number
    contactPhone: number
    billingEmail: number
    onboardingCompleted: number
    lastSeenAt: number
    notes: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    dbName?: true
    dbUser?: true
    dbPassword?: true
    createdAt?: true
    updatedAt?: true
    restaurantId?: true
    useRedis?: true
    posType?: true
    status?: true
    country?: true
    city?: true
    timezone?: true
    contactName?: true
    contactPhone?: true
    billingEmail?: true
    onboardingCompleted?: true
    lastSeenAt?: true
    notes?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    dbName?: true
    dbUser?: true
    dbPassword?: true
    createdAt?: true
    updatedAt?: true
    restaurantId?: true
    useRedis?: true
    posType?: true
    status?: true
    country?: true
    city?: true
    timezone?: true
    contactName?: true
    contactPhone?: true
    billingEmail?: true
    onboardingCompleted?: true
    lastSeenAt?: true
    notes?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    dbName?: true
    dbUser?: true
    dbPassword?: true
    createdAt?: true
    updatedAt?: true
    restaurantId?: true
    useRedis?: true
    posType?: true
    status?: true
    country?: true
    city?: true
    timezone?: true
    contactName?: true
    contactPhone?: true
    billingEmail?: true
    onboardingCompleted?: true
    lastSeenAt?: true
    notes?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: Enumerable<TenantOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: Enumerable<TenantOrderByWithAggregationInput>
    by: TenantScalarFieldEnum[]
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }


  export type TenantGroupByOutputType = {
    id: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt: Date
    updatedAt: Date
    restaurantId: string
    useRedis: boolean
    posType: PosType
    status: TenantStatus
    country: string | null
    city: string | null
    timezone: string | null
    contactName: string | null
    contactPhone: string | null
    billingEmail: string | null
    onboardingCompleted: boolean
    lastSeenAt: Date | null
    notes: string | null
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    dbName?: boolean
    dbUser?: boolean
    dbPassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    restaurantId?: boolean
    useRedis?: boolean
    posType?: boolean
    status?: boolean
    country?: boolean
    city?: boolean
    timezone?: boolean
    contactName?: boolean
    contactPhone?: boolean
    billingEmail?: boolean
    onboardingCompleted?: boolean
    lastSeenAt?: boolean
    notes?: boolean
    tenantPlans?: boolean | Tenant$tenantPlansArgs<ExtArgs>
    modules?: boolean | Tenant$modulesArgs<ExtArgs>
    usageSnapshots?: boolean | Tenant$usageSnapshotsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    dbName?: boolean
    dbUser?: boolean
    dbPassword?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    restaurantId?: boolean
    useRedis?: boolean
    posType?: boolean
    status?: boolean
    country?: boolean
    city?: boolean
    timezone?: boolean
    contactName?: boolean
    contactPhone?: boolean
    billingEmail?: boolean
    onboardingCompleted?: boolean
    lastSeenAt?: boolean
    notes?: boolean
  }

  export type TenantInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tenantPlans?: boolean | Tenant$tenantPlansArgs<ExtArgs>
    modules?: boolean | Tenant$modulesArgs<ExtArgs>
    usageSnapshots?: boolean | Tenant$usageSnapshotsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeArgs<ExtArgs>
  }


  type TenantGetPayload<S extends boolean | null | undefined | TenantArgs> = $Types.GetResult<TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<TenantFindManyArgs, 'select' | 'include'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Tenant'> extends True ? Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one Tenant that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Tenant'> extends True ? Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first Tenant that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
    **/
    create<T extends TenantCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantCreateArgs<ExtArgs>>
    ): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many Tenants.
     *     @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     *     @example
     *     // Create many Tenants
     *     const tenant = await prisma.tenant.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TenantCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
    **/
    delete<T extends TenantDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>
    ): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>
    ): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
    **/
    upsert<T extends TenantUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>
    ): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
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
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    tenantPlans<T extends Tenant$tenantPlansArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$tenantPlansArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findMany', never>| Null>;

    modules<T extends Tenant$modulesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$modulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findMany', never>| Null>;

    usageSnapshots<T extends Tenant$usageSnapshotsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usageSnapshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Tenant base type for findUnique actions
   */
  export type TenantFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUnique
   */
  export interface TenantFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }


  /**
   * Tenant base type for findFirst actions
   */
  export type TenantFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: Enumerable<TenantOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: Enumerable<TenantScalarFieldEnum>
  }

  /**
   * Tenant findFirst
   */
  export interface TenantFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: Enumerable<TenantOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: Enumerable<TenantScalarFieldEnum>
  }


  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: Enumerable<TenantOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: Enumerable<TenantScalarFieldEnum>
  }


  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }


  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: Enumerable<TenantCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }


  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
  }


  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }


  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }


  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
  }


  /**
   * Tenant.tenantPlans
   */
  export type Tenant$tenantPlansArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    where?: TenantPlanWhereInput
    orderBy?: Enumerable<TenantPlanOrderByWithRelationInput>
    cursor?: TenantPlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<TenantPlanScalarFieldEnum>
  }


  /**
   * Tenant.modules
   */
  export type Tenant$modulesArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    where?: TenantModuleWhereInput
    orderBy?: Enumerable<TenantModuleOrderByWithRelationInput>
    cursor?: TenantModuleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<TenantModuleScalarFieldEnum>
  }


  /**
   * Tenant.usageSnapshots
   */
  export type Tenant$usageSnapshotsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    where?: TenantUsageSnapshotWhereInput
    orderBy?: Enumerable<TenantUsageSnapshotOrderByWithRelationInput>
    cursor?: TenantUsageSnapshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<TenantUsageSnapshotScalarFieldEnum>
  }


  /**
   * Tenant without action
   */
  export type TenantArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantInclude<ExtArgs> | null
  }



  /**
   * Model ServicePlan
   */


  export type AggregateServicePlan = {
    _count: ServicePlanCountAggregateOutputType | null
    _avg: ServicePlanAvgAggregateOutputType | null
    _sum: ServicePlanSumAggregateOutputType | null
    _min: ServicePlanMinAggregateOutputType | null
    _max: ServicePlanMaxAggregateOutputType | null
  }

  export type ServicePlanAvgAggregateOutputType = {
    monthlyPriceCents: number | null
    annualPriceCents: number | null
    trialPeriodDays: number | null
  }

  export type ServicePlanSumAggregateOutputType = {
    monthlyPriceCents: number | null
    annualPriceCents: number | null
    trialPeriodDays: number | null
  }

  export type ServicePlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    posType: PosType | null
    description: string | null
    monthlyPriceCents: number | null
    annualPriceCents: number | null
    currency: string | null
    defaultBillingCycle: BillingCycle | null
    trialPeriodDays: number | null
    isFeatured: boolean | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServicePlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    code: string | null
    posType: PosType | null
    description: string | null
    monthlyPriceCents: number | null
    annualPriceCents: number | null
    currency: string | null
    defaultBillingCycle: BillingCycle | null
    trialPeriodDays: number | null
    isFeatured: boolean | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ServicePlanCountAggregateOutputType = {
    id: number
    name: number
    code: number
    posType: number
    description: number
    featureHighlights: number
    allowedModules: number
    monthlyPriceCents: number
    annualPriceCents: number
    currency: number
    defaultBillingCycle: number
    trialPeriodDays: number
    isFeatured: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ServicePlanAvgAggregateInputType = {
    monthlyPriceCents?: true
    annualPriceCents?: true
    trialPeriodDays?: true
  }

  export type ServicePlanSumAggregateInputType = {
    monthlyPriceCents?: true
    annualPriceCents?: true
    trialPeriodDays?: true
  }

  export type ServicePlanMinAggregateInputType = {
    id?: true
    name?: true
    code?: true
    posType?: true
    description?: true
    monthlyPriceCents?: true
    annualPriceCents?: true
    currency?: true
    defaultBillingCycle?: true
    trialPeriodDays?: true
    isFeatured?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServicePlanMaxAggregateInputType = {
    id?: true
    name?: true
    code?: true
    posType?: true
    description?: true
    monthlyPriceCents?: true
    annualPriceCents?: true
    currency?: true
    defaultBillingCycle?: true
    trialPeriodDays?: true
    isFeatured?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ServicePlanCountAggregateInputType = {
    id?: true
    name?: true
    code?: true
    posType?: true
    description?: true
    featureHighlights?: true
    allowedModules?: true
    monthlyPriceCents?: true
    annualPriceCents?: true
    currency?: true
    defaultBillingCycle?: true
    trialPeriodDays?: true
    isFeatured?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ServicePlanAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServicePlan to aggregate.
     */
    where?: ServicePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePlans to fetch.
     */
    orderBy?: Enumerable<ServicePlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServicePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServicePlans
    **/
    _count?: true | ServicePlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServicePlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServicePlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServicePlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServicePlanMaxAggregateInputType
  }

  export type GetServicePlanAggregateType<T extends ServicePlanAggregateArgs> = {
        [P in keyof T & keyof AggregateServicePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServicePlan[P]>
      : GetScalarType<T[P], AggregateServicePlan[P]>
  }




  export type ServicePlanGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: ServicePlanWhereInput
    orderBy?: Enumerable<ServicePlanOrderByWithAggregationInput>
    by: ServicePlanScalarFieldEnum[]
    having?: ServicePlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServicePlanCountAggregateInputType | true
    _avg?: ServicePlanAvgAggregateInputType
    _sum?: ServicePlanSumAggregateInputType
    _min?: ServicePlanMinAggregateInputType
    _max?: ServicePlanMaxAggregateInputType
  }


  export type ServicePlanGroupByOutputType = {
    id: string
    name: string
    code: string
    posType: PosType
    description: string | null
    featureHighlights: string[]
    allowedModules: string[]
    monthlyPriceCents: number
    annualPriceCents: number
    currency: string
    defaultBillingCycle: BillingCycle
    trialPeriodDays: number
    isFeatured: boolean
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: ServicePlanCountAggregateOutputType | null
    _avg: ServicePlanAvgAggregateOutputType | null
    _sum: ServicePlanSumAggregateOutputType | null
    _min: ServicePlanMinAggregateOutputType | null
    _max: ServicePlanMaxAggregateOutputType | null
  }

  type GetServicePlanGroupByPayload<T extends ServicePlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<ServicePlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServicePlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServicePlanGroupByOutputType[P]>
            : GetScalarType<T[P], ServicePlanGroupByOutputType[P]>
        }
      >
    >


  export type ServicePlanSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    code?: boolean
    posType?: boolean
    description?: boolean
    featureHighlights?: boolean
    allowedModules?: boolean
    monthlyPriceCents?: boolean
    annualPriceCents?: boolean
    currency?: boolean
    defaultBillingCycle?: boolean
    trialPeriodDays?: boolean
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenantPlans?: boolean | ServicePlan$tenantPlansArgs<ExtArgs>
    _count?: boolean | ServicePlanCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["servicePlan"]>

  export type ServicePlanSelectScalar = {
    id?: boolean
    name?: boolean
    code?: boolean
    posType?: boolean
    description?: boolean
    featureHighlights?: boolean
    allowedModules?: boolean
    monthlyPriceCents?: boolean
    annualPriceCents?: boolean
    currency?: boolean
    defaultBillingCycle?: boolean
    trialPeriodDays?: boolean
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ServicePlanInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tenantPlans?: boolean | ServicePlan$tenantPlansArgs<ExtArgs>
    _count?: boolean | ServicePlanCountOutputTypeArgs<ExtArgs>
  }


  type ServicePlanGetPayload<S extends boolean | null | undefined | ServicePlanArgs> = $Types.GetResult<ServicePlanPayload, S>

  type ServicePlanCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<ServicePlanFindManyArgs, 'select' | 'include'> & {
      select?: ServicePlanCountAggregateInputType | true
    }

  export interface ServicePlanDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServicePlan'], meta: { name: 'ServicePlan' } }
    /**
     * Find zero or one ServicePlan that matches the filter.
     * @param {ServicePlanFindUniqueArgs} args - Arguments to find a ServicePlan
     * @example
     * // Get one ServicePlan
     * const servicePlan = await prisma.servicePlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ServicePlanFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ServicePlanFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'ServicePlan'> extends True ? Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one ServicePlan that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {ServicePlanFindUniqueOrThrowArgs} args - Arguments to find a ServicePlan
     * @example
     * // Get one ServicePlan
     * const servicePlan = await prisma.servicePlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ServicePlanFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicePlanFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first ServicePlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePlanFindFirstArgs} args - Arguments to find a ServicePlan
     * @example
     * // Get one ServicePlan
     * const servicePlan = await prisma.servicePlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ServicePlanFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ServicePlanFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'ServicePlan'> extends True ? Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first ServicePlan that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePlanFindFirstOrThrowArgs} args - Arguments to find a ServicePlan
     * @example
     * // Get one ServicePlan
     * const servicePlan = await prisma.servicePlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ServicePlanFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicePlanFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more ServicePlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePlanFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServicePlans
     * const servicePlans = await prisma.servicePlan.findMany()
     * 
     * // Get first 10 ServicePlans
     * const servicePlans = await prisma.servicePlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const servicePlanWithIdOnly = await prisma.servicePlan.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ServicePlanFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicePlanFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a ServicePlan.
     * @param {ServicePlanCreateArgs} args - Arguments to create a ServicePlan.
     * @example
     * // Create one ServicePlan
     * const ServicePlan = await prisma.servicePlan.create({
     *   data: {
     *     // ... data to create a ServicePlan
     *   }
     * })
     * 
    **/
    create<T extends ServicePlanCreateArgs<ExtArgs>>(
      args: SelectSubset<T, ServicePlanCreateArgs<ExtArgs>>
    ): Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many ServicePlans.
     *     @param {ServicePlanCreateManyArgs} args - Arguments to create many ServicePlans.
     *     @example
     *     // Create many ServicePlans
     *     const servicePlan = await prisma.servicePlan.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends ServicePlanCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicePlanCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ServicePlan.
     * @param {ServicePlanDeleteArgs} args - Arguments to delete one ServicePlan.
     * @example
     * // Delete one ServicePlan
     * const ServicePlan = await prisma.servicePlan.delete({
     *   where: {
     *     // ... filter to delete one ServicePlan
     *   }
     * })
     * 
    **/
    delete<T extends ServicePlanDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, ServicePlanDeleteArgs<ExtArgs>>
    ): Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one ServicePlan.
     * @param {ServicePlanUpdateArgs} args - Arguments to update one ServicePlan.
     * @example
     * // Update one ServicePlan
     * const servicePlan = await prisma.servicePlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ServicePlanUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, ServicePlanUpdateArgs<ExtArgs>>
    ): Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more ServicePlans.
     * @param {ServicePlanDeleteManyArgs} args - Arguments to filter ServicePlans to delete.
     * @example
     * // Delete a few ServicePlans
     * const { count } = await prisma.servicePlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ServicePlanDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, ServicePlanDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServicePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServicePlans
     * const servicePlan = await prisma.servicePlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ServicePlanUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, ServicePlanUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ServicePlan.
     * @param {ServicePlanUpsertArgs} args - Arguments to update or create a ServicePlan.
     * @example
     * // Update or create a ServicePlan
     * const servicePlan = await prisma.servicePlan.upsert({
     *   create: {
     *     // ... data to create a ServicePlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServicePlan we want to update
     *   }
     * })
    **/
    upsert<T extends ServicePlanUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, ServicePlanUpsertArgs<ExtArgs>>
    ): Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of ServicePlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePlanCountArgs} args - Arguments to filter ServicePlans to count.
     * @example
     * // Count the number of ServicePlans
     * const count = await prisma.servicePlan.count({
     *   where: {
     *     // ... the filter for the ServicePlans we want to count
     *   }
     * })
    **/
    count<T extends ServicePlanCountArgs>(
      args?: Subset<T, ServicePlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServicePlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServicePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ServicePlanAggregateArgs>(args: Subset<T, ServicePlanAggregateArgs>): Prisma.PrismaPromise<GetServicePlanAggregateType<T>>

    /**
     * Group by ServicePlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServicePlanGroupByArgs} args - Group by arguments.
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
      T extends ServicePlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServicePlanGroupByArgs['orderBy'] }
        : { orderBy?: ServicePlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, ServicePlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServicePlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for ServicePlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ServicePlanClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    tenantPlans<T extends ServicePlan$tenantPlansArgs<ExtArgs> = {}>(args?: Subset<T, ServicePlan$tenantPlansArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * ServicePlan base type for findUnique actions
   */
  export type ServicePlanFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * Filter, which ServicePlan to fetch.
     */
    where: ServicePlanWhereUniqueInput
  }

  /**
   * ServicePlan findUnique
   */
  export interface ServicePlanFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ServicePlanFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ServicePlan findUniqueOrThrow
   */
  export type ServicePlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * Filter, which ServicePlan to fetch.
     */
    where: ServicePlanWhereUniqueInput
  }


  /**
   * ServicePlan base type for findFirst actions
   */
  export type ServicePlanFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * Filter, which ServicePlan to fetch.
     */
    where?: ServicePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePlans to fetch.
     */
    orderBy?: Enumerable<ServicePlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServicePlans.
     */
    cursor?: ServicePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServicePlans.
     */
    distinct?: Enumerable<ServicePlanScalarFieldEnum>
  }

  /**
   * ServicePlan findFirst
   */
  export interface ServicePlanFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends ServicePlanFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * ServicePlan findFirstOrThrow
   */
  export type ServicePlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * Filter, which ServicePlan to fetch.
     */
    where?: ServicePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePlans to fetch.
     */
    orderBy?: Enumerable<ServicePlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServicePlans.
     */
    cursor?: ServicePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServicePlans.
     */
    distinct?: Enumerable<ServicePlanScalarFieldEnum>
  }


  /**
   * ServicePlan findMany
   */
  export type ServicePlanFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * Filter, which ServicePlans to fetch.
     */
    where?: ServicePlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServicePlans to fetch.
     */
    orderBy?: Enumerable<ServicePlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServicePlans.
     */
    cursor?: ServicePlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServicePlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServicePlans.
     */
    skip?: number
    distinct?: Enumerable<ServicePlanScalarFieldEnum>
  }


  /**
   * ServicePlan create
   */
  export type ServicePlanCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * The data needed to create a ServicePlan.
     */
    data: XOR<ServicePlanCreateInput, ServicePlanUncheckedCreateInput>
  }


  /**
   * ServicePlan createMany
   */
  export type ServicePlanCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServicePlans.
     */
    data: Enumerable<ServicePlanCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * ServicePlan update
   */
  export type ServicePlanUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * The data needed to update a ServicePlan.
     */
    data: XOR<ServicePlanUpdateInput, ServicePlanUncheckedUpdateInput>
    /**
     * Choose, which ServicePlan to update.
     */
    where: ServicePlanWhereUniqueInput
  }


  /**
   * ServicePlan updateMany
   */
  export type ServicePlanUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServicePlans.
     */
    data: XOR<ServicePlanUpdateManyMutationInput, ServicePlanUncheckedUpdateManyInput>
    /**
     * Filter which ServicePlans to update
     */
    where?: ServicePlanWhereInput
  }


  /**
   * ServicePlan upsert
   */
  export type ServicePlanUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * The filter to search for the ServicePlan to update in case it exists.
     */
    where: ServicePlanWhereUniqueInput
    /**
     * In case the ServicePlan found by the `where` argument doesn't exist, create a new ServicePlan with this data.
     */
    create: XOR<ServicePlanCreateInput, ServicePlanUncheckedCreateInput>
    /**
     * In case the ServicePlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServicePlanUpdateInput, ServicePlanUncheckedUpdateInput>
  }


  /**
   * ServicePlan delete
   */
  export type ServicePlanDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
    /**
     * Filter which ServicePlan to delete.
     */
    where: ServicePlanWhereUniqueInput
  }


  /**
   * ServicePlan deleteMany
   */
  export type ServicePlanDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServicePlans to delete
     */
    where?: ServicePlanWhereInput
  }


  /**
   * ServicePlan.tenantPlans
   */
  export type ServicePlan$tenantPlansArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    where?: TenantPlanWhereInput
    orderBy?: Enumerable<TenantPlanOrderByWithRelationInput>
    cursor?: TenantPlanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<TenantPlanScalarFieldEnum>
  }


  /**
   * ServicePlan without action
   */
  export type ServicePlanArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServicePlan
     */
    select?: ServicePlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: ServicePlanInclude<ExtArgs> | null
  }



  /**
   * Model TenantPlan
   */


  export type AggregateTenantPlan = {
    _count: TenantPlanCountAggregateOutputType | null
    _avg: TenantPlanAvgAggregateOutputType | null
    _sum: TenantPlanSumAggregateOutputType | null
    _min: TenantPlanMinAggregateOutputType | null
    _max: TenantPlanMaxAggregateOutputType | null
  }

  export type TenantPlanAvgAggregateOutputType = {
    monthlyRevenueCents: number | null
    totalRevenueCents: number | null
    transactionsCount: number | null
  }

  export type TenantPlanSumAggregateOutputType = {
    monthlyRevenueCents: number | null
    totalRevenueCents: number | null
    transactionsCount: number | null
  }

  export type TenantPlanMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    status: TenantPlanStatus | null
    billingCycle: BillingCycle | null
    startDate: Date | null
    endDate: Date | null
    renewalDate: Date | null
    monthlyRevenueCents: number | null
    totalRevenueCents: number | null
    transactionsCount: number | null
    lastActive: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantPlanMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    status: TenantPlanStatus | null
    billingCycle: BillingCycle | null
    startDate: Date | null
    endDate: Date | null
    renewalDate: Date | null
    monthlyRevenueCents: number | null
    totalRevenueCents: number | null
    transactionsCount: number | null
    lastActive: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantPlanCountAggregateOutputType = {
    id: number
    tenantId: number
    planId: number
    status: number
    billingCycle: number
    startDate: number
    endDate: number
    renewalDate: number
    monthlyRevenueCents: number
    totalRevenueCents: number
    transactionsCount: number
    lastActive: number
    allowedModulesSnapshot: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantPlanAvgAggregateInputType = {
    monthlyRevenueCents?: true
    totalRevenueCents?: true
    transactionsCount?: true
  }

  export type TenantPlanSumAggregateInputType = {
    monthlyRevenueCents?: true
    totalRevenueCents?: true
    transactionsCount?: true
  }

  export type TenantPlanMinAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    billingCycle?: true
    startDate?: true
    endDate?: true
    renewalDate?: true
    monthlyRevenueCents?: true
    totalRevenueCents?: true
    transactionsCount?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantPlanMaxAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    billingCycle?: true
    startDate?: true
    endDate?: true
    renewalDate?: true
    monthlyRevenueCents?: true
    totalRevenueCents?: true
    transactionsCount?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantPlanCountAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    status?: true
    billingCycle?: true
    startDate?: true
    endDate?: true
    renewalDate?: true
    monthlyRevenueCents?: true
    totalRevenueCents?: true
    transactionsCount?: true
    lastActive?: true
    allowedModulesSnapshot?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantPlanAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantPlan to aggregate.
     */
    where?: TenantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantPlans to fetch.
     */
    orderBy?: Enumerable<TenantPlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantPlans
    **/
    _count?: true | TenantPlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantPlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantPlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantPlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantPlanMaxAggregateInputType
  }

  export type GetTenantPlanAggregateType<T extends TenantPlanAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantPlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantPlan[P]>
      : GetScalarType<T[P], AggregateTenantPlan[P]>
  }




  export type TenantPlanGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantPlanWhereInput
    orderBy?: Enumerable<TenantPlanOrderByWithAggregationInput>
    by: TenantPlanScalarFieldEnum[]
    having?: TenantPlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantPlanCountAggregateInputType | true
    _avg?: TenantPlanAvgAggregateInputType
    _sum?: TenantPlanSumAggregateInputType
    _min?: TenantPlanMinAggregateInputType
    _max?: TenantPlanMaxAggregateInputType
  }


  export type TenantPlanGroupByOutputType = {
    id: string
    tenantId: string
    planId: string
    status: TenantPlanStatus
    billingCycle: BillingCycle
    startDate: Date
    endDate: Date | null
    renewalDate: Date | null
    monthlyRevenueCents: number
    totalRevenueCents: number
    transactionsCount: number
    lastActive: Date | null
    allowedModulesSnapshot: string[]
    createdAt: Date
    updatedAt: Date
    _count: TenantPlanCountAggregateOutputType | null
    _avg: TenantPlanAvgAggregateOutputType | null
    _sum: TenantPlanSumAggregateOutputType | null
    _min: TenantPlanMinAggregateOutputType | null
    _max: TenantPlanMaxAggregateOutputType | null
  }

  type GetTenantPlanGroupByPayload<T extends TenantPlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<TenantPlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantPlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantPlanGroupByOutputType[P]>
            : GetScalarType<T[P], TenantPlanGroupByOutputType[P]>
        }
      >
    >


  export type TenantPlanSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    billingCycle?: boolean
    startDate?: boolean
    endDate?: boolean
    renewalDate?: boolean
    monthlyRevenueCents?: boolean
    totalRevenueCents?: boolean
    transactionsCount?: boolean
    lastActive?: boolean
    allowedModulesSnapshot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tenant?: boolean | TenantArgs<ExtArgs>
    plan?: boolean | ServicePlanArgs<ExtArgs>
  }, ExtArgs["result"]["tenantPlan"]>

  export type TenantPlanSelectScalar = {
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    status?: boolean
    billingCycle?: boolean
    startDate?: boolean
    endDate?: boolean
    renewalDate?: boolean
    monthlyRevenueCents?: boolean
    totalRevenueCents?: boolean
    transactionsCount?: boolean
    lastActive?: boolean
    allowedModulesSnapshot?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantPlanInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantArgs<ExtArgs>
    plan?: boolean | ServicePlanArgs<ExtArgs>
  }


  type TenantPlanGetPayload<S extends boolean | null | undefined | TenantPlanArgs> = $Types.GetResult<TenantPlanPayload, S>

  type TenantPlanCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<TenantPlanFindManyArgs, 'select' | 'include'> & {
      select?: TenantPlanCountAggregateInputType | true
    }

  export interface TenantPlanDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantPlan'], meta: { name: 'TenantPlan' } }
    /**
     * Find zero or one TenantPlan that matches the filter.
     * @param {TenantPlanFindUniqueArgs} args - Arguments to find a TenantPlan
     * @example
     * // Get one TenantPlan
     * const tenantPlan = await prisma.tenantPlan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantPlanFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TenantPlanFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TenantPlan'> extends True ? Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one TenantPlan that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TenantPlanFindUniqueOrThrowArgs} args - Arguments to find a TenantPlan
     * @example
     * // Get one TenantPlan
     * const tenantPlan = await prisma.tenantPlan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantPlanFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantPlanFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first TenantPlan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantPlanFindFirstArgs} args - Arguments to find a TenantPlan
     * @example
     * // Get one TenantPlan
     * const tenantPlan = await prisma.tenantPlan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantPlanFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TenantPlanFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TenantPlan'> extends True ? Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first TenantPlan that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantPlanFindFirstOrThrowArgs} args - Arguments to find a TenantPlan
     * @example
     * // Get one TenantPlan
     * const tenantPlan = await prisma.tenantPlan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantPlanFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantPlanFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more TenantPlans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantPlanFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantPlans
     * const tenantPlans = await prisma.tenantPlan.findMany()
     * 
     * // Get first 10 TenantPlans
     * const tenantPlans = await prisma.tenantPlan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantPlanWithIdOnly = await prisma.tenantPlan.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantPlanFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantPlanFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a TenantPlan.
     * @param {TenantPlanCreateArgs} args - Arguments to create a TenantPlan.
     * @example
     * // Create one TenantPlan
     * const TenantPlan = await prisma.tenantPlan.create({
     *   data: {
     *     // ... data to create a TenantPlan
     *   }
     * })
     * 
    **/
    create<T extends TenantPlanCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantPlanCreateArgs<ExtArgs>>
    ): Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many TenantPlans.
     *     @param {TenantPlanCreateManyArgs} args - Arguments to create many TenantPlans.
     *     @example
     *     // Create many TenantPlans
     *     const tenantPlan = await prisma.tenantPlan.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TenantPlanCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantPlanCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TenantPlan.
     * @param {TenantPlanDeleteArgs} args - Arguments to delete one TenantPlan.
     * @example
     * // Delete one TenantPlan
     * const TenantPlan = await prisma.tenantPlan.delete({
     *   where: {
     *     // ... filter to delete one TenantPlan
     *   }
     * })
     * 
    **/
    delete<T extends TenantPlanDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantPlanDeleteArgs<ExtArgs>>
    ): Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one TenantPlan.
     * @param {TenantPlanUpdateArgs} args - Arguments to update one TenantPlan.
     * @example
     * // Update one TenantPlan
     * const tenantPlan = await prisma.tenantPlan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantPlanUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantPlanUpdateArgs<ExtArgs>>
    ): Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more TenantPlans.
     * @param {TenantPlanDeleteManyArgs} args - Arguments to filter TenantPlans to delete.
     * @example
     * // Delete a few TenantPlans
     * const { count } = await prisma.tenantPlan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantPlanDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantPlanDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantPlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantPlans
     * const tenantPlan = await prisma.tenantPlan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantPlanUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantPlanUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantPlan.
     * @param {TenantPlanUpsertArgs} args - Arguments to update or create a TenantPlan.
     * @example
     * // Update or create a TenantPlan
     * const tenantPlan = await prisma.tenantPlan.upsert({
     *   create: {
     *     // ... data to create a TenantPlan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantPlan we want to update
     *   }
     * })
    **/
    upsert<T extends TenantPlanUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantPlanUpsertArgs<ExtArgs>>
    ): Prisma__TenantPlanClient<$Types.GetResult<TenantPlanPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of TenantPlans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantPlanCountArgs} args - Arguments to filter TenantPlans to count.
     * @example
     * // Count the number of TenantPlans
     * const count = await prisma.tenantPlan.count({
     *   where: {
     *     // ... the filter for the TenantPlans we want to count
     *   }
     * })
    **/
    count<T extends TenantPlanCountArgs>(
      args?: Subset<T, TenantPlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantPlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantPlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TenantPlanAggregateArgs>(args: Subset<T, TenantPlanAggregateArgs>): Prisma.PrismaPromise<GetTenantPlanAggregateType<T>>

    /**
     * Group by TenantPlan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantPlanGroupByArgs} args - Group by arguments.
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
      T extends TenantPlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantPlanGroupByArgs['orderBy'] }
        : { orderBy?: TenantPlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, TenantPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantPlan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TenantPlanClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    tenant<T extends TenantArgs<ExtArgs> = {}>(args?: Subset<T, TenantArgs<ExtArgs>>): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    plan<T extends ServicePlanArgs<ExtArgs> = {}>(args?: Subset<T, ServicePlanArgs<ExtArgs>>): Prisma__ServicePlanClient<$Types.GetResult<ServicePlanPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * TenantPlan base type for findUnique actions
   */
  export type TenantPlanFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * Filter, which TenantPlan to fetch.
     */
    where: TenantPlanWhereUniqueInput
  }

  /**
   * TenantPlan findUnique
   */
  export interface TenantPlanFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantPlanFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * TenantPlan findUniqueOrThrow
   */
  export type TenantPlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * Filter, which TenantPlan to fetch.
     */
    where: TenantPlanWhereUniqueInput
  }


  /**
   * TenantPlan base type for findFirst actions
   */
  export type TenantPlanFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * Filter, which TenantPlan to fetch.
     */
    where?: TenantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantPlans to fetch.
     */
    orderBy?: Enumerable<TenantPlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantPlans.
     */
    cursor?: TenantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantPlans.
     */
    distinct?: Enumerable<TenantPlanScalarFieldEnum>
  }

  /**
   * TenantPlan findFirst
   */
  export interface TenantPlanFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantPlanFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * TenantPlan findFirstOrThrow
   */
  export type TenantPlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * Filter, which TenantPlan to fetch.
     */
    where?: TenantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantPlans to fetch.
     */
    orderBy?: Enumerable<TenantPlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantPlans.
     */
    cursor?: TenantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantPlans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantPlans.
     */
    distinct?: Enumerable<TenantPlanScalarFieldEnum>
  }


  /**
   * TenantPlan findMany
   */
  export type TenantPlanFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * Filter, which TenantPlans to fetch.
     */
    where?: TenantPlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantPlans to fetch.
     */
    orderBy?: Enumerable<TenantPlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantPlans.
     */
    cursor?: TenantPlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantPlans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantPlans.
     */
    skip?: number
    distinct?: Enumerable<TenantPlanScalarFieldEnum>
  }


  /**
   * TenantPlan create
   */
  export type TenantPlanCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantPlan.
     */
    data: XOR<TenantPlanCreateInput, TenantPlanUncheckedCreateInput>
  }


  /**
   * TenantPlan createMany
   */
  export type TenantPlanCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantPlans.
     */
    data: Enumerable<TenantPlanCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * TenantPlan update
   */
  export type TenantPlanUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantPlan.
     */
    data: XOR<TenantPlanUpdateInput, TenantPlanUncheckedUpdateInput>
    /**
     * Choose, which TenantPlan to update.
     */
    where: TenantPlanWhereUniqueInput
  }


  /**
   * TenantPlan updateMany
   */
  export type TenantPlanUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantPlans.
     */
    data: XOR<TenantPlanUpdateManyMutationInput, TenantPlanUncheckedUpdateManyInput>
    /**
     * Filter which TenantPlans to update
     */
    where?: TenantPlanWhereInput
  }


  /**
   * TenantPlan upsert
   */
  export type TenantPlanUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantPlan to update in case it exists.
     */
    where: TenantPlanWhereUniqueInput
    /**
     * In case the TenantPlan found by the `where` argument doesn't exist, create a new TenantPlan with this data.
     */
    create: XOR<TenantPlanCreateInput, TenantPlanUncheckedCreateInput>
    /**
     * In case the TenantPlan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantPlanUpdateInput, TenantPlanUncheckedUpdateInput>
  }


  /**
   * TenantPlan delete
   */
  export type TenantPlanDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
    /**
     * Filter which TenantPlan to delete.
     */
    where: TenantPlanWhereUniqueInput
  }


  /**
   * TenantPlan deleteMany
   */
  export type TenantPlanDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantPlans to delete
     */
    where?: TenantPlanWhereInput
  }


  /**
   * TenantPlan without action
   */
  export type TenantPlanArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantPlan
     */
    select?: TenantPlanSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantPlanInclude<ExtArgs> | null
  }



  /**
   * Model TenantModule
   */


  export type AggregateTenantModule = {
    _count: TenantModuleCountAggregateOutputType | null
    _min: TenantModuleMinAggregateOutputType | null
    _max: TenantModuleMaxAggregateOutputType | null
  }

  export type TenantModuleMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    moduleKey: string | null
    moduleName: string | null
    status: TenantModuleStatus | null
    assignedAt: Date | null
    expiresAt: Date | null
    lastUsedAt: Date | null
  }

  export type TenantModuleMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    moduleKey: string | null
    moduleName: string | null
    status: TenantModuleStatus | null
    assignedAt: Date | null
    expiresAt: Date | null
    lastUsedAt: Date | null
  }

  export type TenantModuleCountAggregateOutputType = {
    id: number
    tenantId: number
    moduleKey: number
    moduleName: number
    status: number
    assignedAt: number
    expiresAt: number
    lastUsedAt: number
    _all: number
  }


  export type TenantModuleMinAggregateInputType = {
    id?: true
    tenantId?: true
    moduleKey?: true
    moduleName?: true
    status?: true
    assignedAt?: true
    expiresAt?: true
    lastUsedAt?: true
  }

  export type TenantModuleMaxAggregateInputType = {
    id?: true
    tenantId?: true
    moduleKey?: true
    moduleName?: true
    status?: true
    assignedAt?: true
    expiresAt?: true
    lastUsedAt?: true
  }

  export type TenantModuleCountAggregateInputType = {
    id?: true
    tenantId?: true
    moduleKey?: true
    moduleName?: true
    status?: true
    assignedAt?: true
    expiresAt?: true
    lastUsedAt?: true
    _all?: true
  }

  export type TenantModuleAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantModule to aggregate.
     */
    where?: TenantModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantModules to fetch.
     */
    orderBy?: Enumerable<TenantModuleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantModules
    **/
    _count?: true | TenantModuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantModuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantModuleMaxAggregateInputType
  }

  export type GetTenantModuleAggregateType<T extends TenantModuleAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantModule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantModule[P]>
      : GetScalarType<T[P], AggregateTenantModule[P]>
  }




  export type TenantModuleGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantModuleWhereInput
    orderBy?: Enumerable<TenantModuleOrderByWithAggregationInput>
    by: TenantModuleScalarFieldEnum[]
    having?: TenantModuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantModuleCountAggregateInputType | true
    _min?: TenantModuleMinAggregateInputType
    _max?: TenantModuleMaxAggregateInputType
  }


  export type TenantModuleGroupByOutputType = {
    id: string
    tenantId: string
    moduleKey: string
    moduleName: string | null
    status: TenantModuleStatus
    assignedAt: Date
    expiresAt: Date | null
    lastUsedAt: Date | null
    _count: TenantModuleCountAggregateOutputType | null
    _min: TenantModuleMinAggregateOutputType | null
    _max: TenantModuleMaxAggregateOutputType | null
  }

  type GetTenantModuleGroupByPayload<T extends TenantModuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<TenantModuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantModuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantModuleGroupByOutputType[P]>
            : GetScalarType<T[P], TenantModuleGroupByOutputType[P]>
        }
      >
    >


  export type TenantModuleSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    moduleKey?: boolean
    moduleName?: boolean
    status?: boolean
    assignedAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    tenant?: boolean | TenantArgs<ExtArgs>
  }, ExtArgs["result"]["tenantModule"]>

  export type TenantModuleSelectScalar = {
    id?: boolean
    tenantId?: boolean
    moduleKey?: boolean
    moduleName?: boolean
    status?: boolean
    assignedAt?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
  }

  export type TenantModuleInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantArgs<ExtArgs>
  }


  type TenantModuleGetPayload<S extends boolean | null | undefined | TenantModuleArgs> = $Types.GetResult<TenantModulePayload, S>

  type TenantModuleCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<TenantModuleFindManyArgs, 'select' | 'include'> & {
      select?: TenantModuleCountAggregateInputType | true
    }

  export interface TenantModuleDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantModule'], meta: { name: 'TenantModule' } }
    /**
     * Find zero or one TenantModule that matches the filter.
     * @param {TenantModuleFindUniqueArgs} args - Arguments to find a TenantModule
     * @example
     * // Get one TenantModule
     * const tenantModule = await prisma.tenantModule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantModuleFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TenantModuleFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TenantModule'> extends True ? Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one TenantModule that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TenantModuleFindUniqueOrThrowArgs} args - Arguments to find a TenantModule
     * @example
     * // Get one TenantModule
     * const tenantModule = await prisma.tenantModule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantModuleFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantModuleFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first TenantModule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantModuleFindFirstArgs} args - Arguments to find a TenantModule
     * @example
     * // Get one TenantModule
     * const tenantModule = await prisma.tenantModule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantModuleFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TenantModuleFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TenantModule'> extends True ? Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first TenantModule that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantModuleFindFirstOrThrowArgs} args - Arguments to find a TenantModule
     * @example
     * // Get one TenantModule
     * const tenantModule = await prisma.tenantModule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantModuleFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantModuleFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more TenantModules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantModuleFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantModules
     * const tenantModules = await prisma.tenantModule.findMany()
     * 
     * // Get first 10 TenantModules
     * const tenantModules = await prisma.tenantModule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantModuleWithIdOnly = await prisma.tenantModule.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantModuleFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantModuleFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a TenantModule.
     * @param {TenantModuleCreateArgs} args - Arguments to create a TenantModule.
     * @example
     * // Create one TenantModule
     * const TenantModule = await prisma.tenantModule.create({
     *   data: {
     *     // ... data to create a TenantModule
     *   }
     * })
     * 
    **/
    create<T extends TenantModuleCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantModuleCreateArgs<ExtArgs>>
    ): Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many TenantModules.
     *     @param {TenantModuleCreateManyArgs} args - Arguments to create many TenantModules.
     *     @example
     *     // Create many TenantModules
     *     const tenantModule = await prisma.tenantModule.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TenantModuleCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantModuleCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TenantModule.
     * @param {TenantModuleDeleteArgs} args - Arguments to delete one TenantModule.
     * @example
     * // Delete one TenantModule
     * const TenantModule = await prisma.tenantModule.delete({
     *   where: {
     *     // ... filter to delete one TenantModule
     *   }
     * })
     * 
    **/
    delete<T extends TenantModuleDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantModuleDeleteArgs<ExtArgs>>
    ): Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one TenantModule.
     * @param {TenantModuleUpdateArgs} args - Arguments to update one TenantModule.
     * @example
     * // Update one TenantModule
     * const tenantModule = await prisma.tenantModule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantModuleUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantModuleUpdateArgs<ExtArgs>>
    ): Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more TenantModules.
     * @param {TenantModuleDeleteManyArgs} args - Arguments to filter TenantModules to delete.
     * @example
     * // Delete a few TenantModules
     * const { count } = await prisma.tenantModule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantModuleDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantModuleDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantModules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantModuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantModules
     * const tenantModule = await prisma.tenantModule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantModuleUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantModuleUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantModule.
     * @param {TenantModuleUpsertArgs} args - Arguments to update or create a TenantModule.
     * @example
     * // Update or create a TenantModule
     * const tenantModule = await prisma.tenantModule.upsert({
     *   create: {
     *     // ... data to create a TenantModule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantModule we want to update
     *   }
     * })
    **/
    upsert<T extends TenantModuleUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantModuleUpsertArgs<ExtArgs>>
    ): Prisma__TenantModuleClient<$Types.GetResult<TenantModulePayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of TenantModules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantModuleCountArgs} args - Arguments to filter TenantModules to count.
     * @example
     * // Count the number of TenantModules
     * const count = await prisma.tenantModule.count({
     *   where: {
     *     // ... the filter for the TenantModules we want to count
     *   }
     * })
    **/
    count<T extends TenantModuleCountArgs>(
      args?: Subset<T, TenantModuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantModuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantModule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantModuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TenantModuleAggregateArgs>(args: Subset<T, TenantModuleAggregateArgs>): Prisma.PrismaPromise<GetTenantModuleAggregateType<T>>

    /**
     * Group by TenantModule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantModuleGroupByArgs} args - Group by arguments.
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
      T extends TenantModuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantModuleGroupByArgs['orderBy'] }
        : { orderBy?: TenantModuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, TenantModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantModule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TenantModuleClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    tenant<T extends TenantArgs<ExtArgs> = {}>(args?: Subset<T, TenantArgs<ExtArgs>>): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * TenantModule base type for findUnique actions
   */
  export type TenantModuleFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * Filter, which TenantModule to fetch.
     */
    where: TenantModuleWhereUniqueInput
  }

  /**
   * TenantModule findUnique
   */
  export interface TenantModuleFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantModuleFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * TenantModule findUniqueOrThrow
   */
  export type TenantModuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * Filter, which TenantModule to fetch.
     */
    where: TenantModuleWhereUniqueInput
  }


  /**
   * TenantModule base type for findFirst actions
   */
  export type TenantModuleFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * Filter, which TenantModule to fetch.
     */
    where?: TenantModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantModules to fetch.
     */
    orderBy?: Enumerable<TenantModuleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantModules.
     */
    cursor?: TenantModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantModules.
     */
    distinct?: Enumerable<TenantModuleScalarFieldEnum>
  }

  /**
   * TenantModule findFirst
   */
  export interface TenantModuleFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantModuleFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * TenantModule findFirstOrThrow
   */
  export type TenantModuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * Filter, which TenantModule to fetch.
     */
    where?: TenantModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantModules to fetch.
     */
    orderBy?: Enumerable<TenantModuleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantModules.
     */
    cursor?: TenantModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantModules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantModules.
     */
    distinct?: Enumerable<TenantModuleScalarFieldEnum>
  }


  /**
   * TenantModule findMany
   */
  export type TenantModuleFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * Filter, which TenantModules to fetch.
     */
    where?: TenantModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantModules to fetch.
     */
    orderBy?: Enumerable<TenantModuleOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantModules.
     */
    cursor?: TenantModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantModules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantModules.
     */
    skip?: number
    distinct?: Enumerable<TenantModuleScalarFieldEnum>
  }


  /**
   * TenantModule create
   */
  export type TenantModuleCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantModule.
     */
    data: XOR<TenantModuleCreateInput, TenantModuleUncheckedCreateInput>
  }


  /**
   * TenantModule createMany
   */
  export type TenantModuleCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantModules.
     */
    data: Enumerable<TenantModuleCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * TenantModule update
   */
  export type TenantModuleUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantModule.
     */
    data: XOR<TenantModuleUpdateInput, TenantModuleUncheckedUpdateInput>
    /**
     * Choose, which TenantModule to update.
     */
    where: TenantModuleWhereUniqueInput
  }


  /**
   * TenantModule updateMany
   */
  export type TenantModuleUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantModules.
     */
    data: XOR<TenantModuleUpdateManyMutationInput, TenantModuleUncheckedUpdateManyInput>
    /**
     * Filter which TenantModules to update
     */
    where?: TenantModuleWhereInput
  }


  /**
   * TenantModule upsert
   */
  export type TenantModuleUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantModule to update in case it exists.
     */
    where: TenantModuleWhereUniqueInput
    /**
     * In case the TenantModule found by the `where` argument doesn't exist, create a new TenantModule with this data.
     */
    create: XOR<TenantModuleCreateInput, TenantModuleUncheckedCreateInput>
    /**
     * In case the TenantModule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantModuleUpdateInput, TenantModuleUncheckedUpdateInput>
  }


  /**
   * TenantModule delete
   */
  export type TenantModuleDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
    /**
     * Filter which TenantModule to delete.
     */
    where: TenantModuleWhereUniqueInput
  }


  /**
   * TenantModule deleteMany
   */
  export type TenantModuleDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantModules to delete
     */
    where?: TenantModuleWhereInput
  }


  /**
   * TenantModule without action
   */
  export type TenantModuleArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantModule
     */
    select?: TenantModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantModuleInclude<ExtArgs> | null
  }



  /**
   * Model TenantUsageSnapshot
   */


  export type AggregateTenantUsageSnapshot = {
    _count: TenantUsageSnapshotCountAggregateOutputType | null
    _avg: TenantUsageSnapshotAvgAggregateOutputType | null
    _sum: TenantUsageSnapshotSumAggregateOutputType | null
    _min: TenantUsageSnapshotMinAggregateOutputType | null
    _max: TenantUsageSnapshotMaxAggregateOutputType | null
  }

  export type TenantUsageSnapshotAvgAggregateOutputType = {
    value: number | null
  }

  export type TenantUsageSnapshotSumAggregateOutputType = {
    value: number | null
  }

  export type TenantUsageSnapshotMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    snapshotDate: Date | null
    metricType: UsageMetricType | null
    value: number | null
    currency: string | null
  }

  export type TenantUsageSnapshotMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    snapshotDate: Date | null
    metricType: UsageMetricType | null
    value: number | null
    currency: string | null
  }

  export type TenantUsageSnapshotCountAggregateOutputType = {
    id: number
    tenantId: number
    snapshotDate: number
    metricType: number
    value: number
    currency: number
    metadata: number
    _all: number
  }


  export type TenantUsageSnapshotAvgAggregateInputType = {
    value?: true
  }

  export type TenantUsageSnapshotSumAggregateInputType = {
    value?: true
  }

  export type TenantUsageSnapshotMinAggregateInputType = {
    id?: true
    tenantId?: true
    snapshotDate?: true
    metricType?: true
    value?: true
    currency?: true
  }

  export type TenantUsageSnapshotMaxAggregateInputType = {
    id?: true
    tenantId?: true
    snapshotDate?: true
    metricType?: true
    value?: true
    currency?: true
  }

  export type TenantUsageSnapshotCountAggregateInputType = {
    id?: true
    tenantId?: true
    snapshotDate?: true
    metricType?: true
    value?: true
    currency?: true
    metadata?: true
    _all?: true
  }

  export type TenantUsageSnapshotAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUsageSnapshot to aggregate.
     */
    where?: TenantUsageSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsageSnapshots to fetch.
     */
    orderBy?: Enumerable<TenantUsageSnapshotOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantUsageSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsageSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsageSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantUsageSnapshots
    **/
    _count?: true | TenantUsageSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantUsageSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantUsageSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantUsageSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantUsageSnapshotMaxAggregateInputType
  }

  export type GetTenantUsageSnapshotAggregateType<T extends TenantUsageSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantUsageSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantUsageSnapshot[P]>
      : GetScalarType<T[P], AggregateTenantUsageSnapshot[P]>
  }




  export type TenantUsageSnapshotGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: TenantUsageSnapshotWhereInput
    orderBy?: Enumerable<TenantUsageSnapshotOrderByWithAggregationInput>
    by: TenantUsageSnapshotScalarFieldEnum[]
    having?: TenantUsageSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantUsageSnapshotCountAggregateInputType | true
    _avg?: TenantUsageSnapshotAvgAggregateInputType
    _sum?: TenantUsageSnapshotSumAggregateInputType
    _min?: TenantUsageSnapshotMinAggregateInputType
    _max?: TenantUsageSnapshotMaxAggregateInputType
  }


  export type TenantUsageSnapshotGroupByOutputType = {
    id: string
    tenantId: string
    snapshotDate: Date
    metricType: UsageMetricType
    value: number
    currency: string | null
    metadata: JsonValue | null
    _count: TenantUsageSnapshotCountAggregateOutputType | null
    _avg: TenantUsageSnapshotAvgAggregateOutputType | null
    _sum: TenantUsageSnapshotSumAggregateOutputType | null
    _min: TenantUsageSnapshotMinAggregateOutputType | null
    _max: TenantUsageSnapshotMaxAggregateOutputType | null
  }

  type GetTenantUsageSnapshotGroupByPayload<T extends TenantUsageSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<TenantUsageSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantUsageSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantUsageSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], TenantUsageSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type TenantUsageSnapshotSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    snapshotDate?: boolean
    metricType?: boolean
    value?: boolean
    currency?: boolean
    metadata?: boolean
    tenant?: boolean | TenantArgs<ExtArgs>
  }, ExtArgs["result"]["tenantUsageSnapshot"]>

  export type TenantUsageSnapshotSelectScalar = {
    id?: boolean
    tenantId?: boolean
    snapshotDate?: boolean
    metricType?: boolean
    value?: boolean
    currency?: boolean
    metadata?: boolean
  }

  export type TenantUsageSnapshotInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantArgs<ExtArgs>
  }


  type TenantUsageSnapshotGetPayload<S extends boolean | null | undefined | TenantUsageSnapshotArgs> = $Types.GetResult<TenantUsageSnapshotPayload, S>

  type TenantUsageSnapshotCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<TenantUsageSnapshotFindManyArgs, 'select' | 'include'> & {
      select?: TenantUsageSnapshotCountAggregateInputType | true
    }

  export interface TenantUsageSnapshotDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantUsageSnapshot'], meta: { name: 'TenantUsageSnapshot' } }
    /**
     * Find zero or one TenantUsageSnapshot that matches the filter.
     * @param {TenantUsageSnapshotFindUniqueArgs} args - Arguments to find a TenantUsageSnapshot
     * @example
     * // Get one TenantUsageSnapshot
     * const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantUsageSnapshotFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TenantUsageSnapshotFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'TenantUsageSnapshot'> extends True ? Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one TenantUsageSnapshot that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TenantUsageSnapshotFindUniqueOrThrowArgs} args - Arguments to find a TenantUsageSnapshot
     * @example
     * // Get one TenantUsageSnapshot
     * const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantUsageSnapshotFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageSnapshotFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first TenantUsageSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageSnapshotFindFirstArgs} args - Arguments to find a TenantUsageSnapshot
     * @example
     * // Get one TenantUsageSnapshot
     * const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantUsageSnapshotFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TenantUsageSnapshotFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'TenantUsageSnapshot'> extends True ? Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first TenantUsageSnapshot that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageSnapshotFindFirstOrThrowArgs} args - Arguments to find a TenantUsageSnapshot
     * @example
     * // Get one TenantUsageSnapshot
     * const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantUsageSnapshotFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageSnapshotFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more TenantUsageSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageSnapshotFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantUsageSnapshots
     * const tenantUsageSnapshots = await prisma.tenantUsageSnapshot.findMany()
     * 
     * // Get first 10 TenantUsageSnapshots
     * const tenantUsageSnapshots = await prisma.tenantUsageSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantUsageSnapshotWithIdOnly = await prisma.tenantUsageSnapshot.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantUsageSnapshotFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageSnapshotFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a TenantUsageSnapshot.
     * @param {TenantUsageSnapshotCreateArgs} args - Arguments to create a TenantUsageSnapshot.
     * @example
     * // Create one TenantUsageSnapshot
     * const TenantUsageSnapshot = await prisma.tenantUsageSnapshot.create({
     *   data: {
     *     // ... data to create a TenantUsageSnapshot
     *   }
     * })
     * 
    **/
    create<T extends TenantUsageSnapshotCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageSnapshotCreateArgs<ExtArgs>>
    ): Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many TenantUsageSnapshots.
     *     @param {TenantUsageSnapshotCreateManyArgs} args - Arguments to create many TenantUsageSnapshots.
     *     @example
     *     // Create many TenantUsageSnapshots
     *     const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TenantUsageSnapshotCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageSnapshotCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TenantUsageSnapshot.
     * @param {TenantUsageSnapshotDeleteArgs} args - Arguments to delete one TenantUsageSnapshot.
     * @example
     * // Delete one TenantUsageSnapshot
     * const TenantUsageSnapshot = await prisma.tenantUsageSnapshot.delete({
     *   where: {
     *     // ... filter to delete one TenantUsageSnapshot
     *   }
     * })
     * 
    **/
    delete<T extends TenantUsageSnapshotDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageSnapshotDeleteArgs<ExtArgs>>
    ): Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one TenantUsageSnapshot.
     * @param {TenantUsageSnapshotUpdateArgs} args - Arguments to update one TenantUsageSnapshot.
     * @example
     * // Update one TenantUsageSnapshot
     * const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantUsageSnapshotUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageSnapshotUpdateArgs<ExtArgs>>
    ): Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more TenantUsageSnapshots.
     * @param {TenantUsageSnapshotDeleteManyArgs} args - Arguments to filter TenantUsageSnapshots to delete.
     * @example
     * // Delete a few TenantUsageSnapshots
     * const { count } = await prisma.tenantUsageSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantUsageSnapshotDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageSnapshotDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantUsageSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantUsageSnapshots
     * const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantUsageSnapshotUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageSnapshotUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantUsageSnapshot.
     * @param {TenantUsageSnapshotUpsertArgs} args - Arguments to update or create a TenantUsageSnapshot.
     * @example
     * // Update or create a TenantUsageSnapshot
     * const tenantUsageSnapshot = await prisma.tenantUsageSnapshot.upsert({
     *   create: {
     *     // ... data to create a TenantUsageSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantUsageSnapshot we want to update
     *   }
     * })
    **/
    upsert<T extends TenantUsageSnapshotUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageSnapshotUpsertArgs<ExtArgs>>
    ): Prisma__TenantUsageSnapshotClient<$Types.GetResult<TenantUsageSnapshotPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of TenantUsageSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageSnapshotCountArgs} args - Arguments to filter TenantUsageSnapshots to count.
     * @example
     * // Count the number of TenantUsageSnapshots
     * const count = await prisma.tenantUsageSnapshot.count({
     *   where: {
     *     // ... the filter for the TenantUsageSnapshots we want to count
     *   }
     * })
    **/
    count<T extends TenantUsageSnapshotCountArgs>(
      args?: Subset<T, TenantUsageSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantUsageSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantUsageSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TenantUsageSnapshotAggregateArgs>(args: Subset<T, TenantUsageSnapshotAggregateArgs>): Prisma.PrismaPromise<GetTenantUsageSnapshotAggregateType<T>>

    /**
     * Group by TenantUsageSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageSnapshotGroupByArgs} args - Group by arguments.
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
      T extends TenantUsageSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantUsageSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: TenantUsageSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, TenantUsageSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantUsageSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantUsageSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TenantUsageSnapshotClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    tenant<T extends TenantArgs<ExtArgs> = {}>(args?: Subset<T, TenantArgs<ExtArgs>>): Prisma__TenantClient<$Types.GetResult<TenantPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * TenantUsageSnapshot base type for findUnique actions
   */
  export type TenantUsageSnapshotFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsageSnapshot to fetch.
     */
    where: TenantUsageSnapshotWhereUniqueInput
  }

  /**
   * TenantUsageSnapshot findUnique
   */
  export interface TenantUsageSnapshotFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantUsageSnapshotFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * TenantUsageSnapshot findUniqueOrThrow
   */
  export type TenantUsageSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsageSnapshot to fetch.
     */
    where: TenantUsageSnapshotWhereUniqueInput
  }


  /**
   * TenantUsageSnapshot base type for findFirst actions
   */
  export type TenantUsageSnapshotFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsageSnapshot to fetch.
     */
    where?: TenantUsageSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsageSnapshots to fetch.
     */
    orderBy?: Enumerable<TenantUsageSnapshotOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsageSnapshots.
     */
    cursor?: TenantUsageSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsageSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsageSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsageSnapshots.
     */
    distinct?: Enumerable<TenantUsageSnapshotScalarFieldEnum>
  }

  /**
   * TenantUsageSnapshot findFirst
   */
  export interface TenantUsageSnapshotFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends TenantUsageSnapshotFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * TenantUsageSnapshot findFirstOrThrow
   */
  export type TenantUsageSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsageSnapshot to fetch.
     */
    where?: TenantUsageSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsageSnapshots to fetch.
     */
    orderBy?: Enumerable<TenantUsageSnapshotOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsageSnapshots.
     */
    cursor?: TenantUsageSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsageSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsageSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsageSnapshots.
     */
    distinct?: Enumerable<TenantUsageSnapshotScalarFieldEnum>
  }


  /**
   * TenantUsageSnapshot findMany
   */
  export type TenantUsageSnapshotFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsageSnapshots to fetch.
     */
    where?: TenantUsageSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsageSnapshots to fetch.
     */
    orderBy?: Enumerable<TenantUsageSnapshotOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantUsageSnapshots.
     */
    cursor?: TenantUsageSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsageSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsageSnapshots.
     */
    skip?: number
    distinct?: Enumerable<TenantUsageSnapshotScalarFieldEnum>
  }


  /**
   * TenantUsageSnapshot create
   */
  export type TenantUsageSnapshotCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantUsageSnapshot.
     */
    data: XOR<TenantUsageSnapshotCreateInput, TenantUsageSnapshotUncheckedCreateInput>
  }


  /**
   * TenantUsageSnapshot createMany
   */
  export type TenantUsageSnapshotCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantUsageSnapshots.
     */
    data: Enumerable<TenantUsageSnapshotCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * TenantUsageSnapshot update
   */
  export type TenantUsageSnapshotUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantUsageSnapshot.
     */
    data: XOR<TenantUsageSnapshotUpdateInput, TenantUsageSnapshotUncheckedUpdateInput>
    /**
     * Choose, which TenantUsageSnapshot to update.
     */
    where: TenantUsageSnapshotWhereUniqueInput
  }


  /**
   * TenantUsageSnapshot updateMany
   */
  export type TenantUsageSnapshotUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantUsageSnapshots.
     */
    data: XOR<TenantUsageSnapshotUpdateManyMutationInput, TenantUsageSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which TenantUsageSnapshots to update
     */
    where?: TenantUsageSnapshotWhereInput
  }


  /**
   * TenantUsageSnapshot upsert
   */
  export type TenantUsageSnapshotUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantUsageSnapshot to update in case it exists.
     */
    where: TenantUsageSnapshotWhereUniqueInput
    /**
     * In case the TenantUsageSnapshot found by the `where` argument doesn't exist, create a new TenantUsageSnapshot with this data.
     */
    create: XOR<TenantUsageSnapshotCreateInput, TenantUsageSnapshotUncheckedCreateInput>
    /**
     * In case the TenantUsageSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUsageSnapshotUpdateInput, TenantUsageSnapshotUncheckedUpdateInput>
  }


  /**
   * TenantUsageSnapshot delete
   */
  export type TenantUsageSnapshotDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
    /**
     * Filter which TenantUsageSnapshot to delete.
     */
    where: TenantUsageSnapshotWhereUniqueInput
  }


  /**
   * TenantUsageSnapshot deleteMany
   */
  export type TenantUsageSnapshotDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUsageSnapshots to delete
     */
    where?: TenantUsageSnapshotWhereInput
  }


  /**
   * TenantUsageSnapshot without action
   */
  export type TenantUsageSnapshotArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsageSnapshot
     */
    select?: TenantUsageSnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TenantUsageSnapshotInclude<ExtArgs> | null
  }



  /**
   * Model AdminUser
   */


  export type AggregateAdminUser = {
    _count: AdminUserCountAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  export type AdminUserMinAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: AdminRole | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminUserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    passwordHash: string | null
    name: string | null
    role: AdminRole | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminUserCountAggregateOutputType = {
    id: number
    email: number
    passwordHash: number
    name: number
    role: number
    isActive: number
    lastLoginAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminUserMinAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminUserMaxAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminUserCountAggregateInputType = {
    id?: true
    email?: true
    passwordHash?: true
    name?: true
    role?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminUserAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUser to aggregate.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: Enumerable<AdminUserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminUsers
    **/
    _count?: true | AdminUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminUserMaxAggregateInputType
  }

  export type GetAdminUserAggregateType<T extends AdminUserAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminUser[P]>
      : GetScalarType<T[P], AggregateAdminUser[P]>
  }




  export type AdminUserGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AdminUserWhereInput
    orderBy?: Enumerable<AdminUserOrderByWithAggregationInput>
    by: AdminUserScalarFieldEnum[]
    having?: AdminUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminUserCountAggregateInputType | true
    _min?: AdminUserMinAggregateInputType
    _max?: AdminUserMaxAggregateInputType
  }


  export type AdminUserGroupByOutputType = {
    id: string
    email: string
    passwordHash: string
    name: string | null
    role: AdminRole
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AdminUserCountAggregateOutputType | null
    _min: AdminUserMinAggregateOutputType | null
    _max: AdminUserMaxAggregateOutputType | null
  }

  type GetAdminUserGroupByPayload<T extends AdminUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<AdminUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
            : GetScalarType<T[P], AdminUserGroupByOutputType[P]>
        }
      >
    >


  export type AdminUserSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    refreshTokens?: boolean | AdminUser$refreshTokensArgs<ExtArgs>
    auditLogs?: boolean | AdminUser$auditLogsArgs<ExtArgs>
    _count?: boolean | AdminUserCountOutputTypeArgs<ExtArgs>
  }, ExtArgs["result"]["adminUser"]>

  export type AdminUserSelectScalar = {
    id?: boolean
    email?: boolean
    passwordHash?: boolean
    name?: boolean
    role?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AdminUserInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    refreshTokens?: boolean | AdminUser$refreshTokensArgs<ExtArgs>
    auditLogs?: boolean | AdminUser$auditLogsArgs<ExtArgs>
    _count?: boolean | AdminUserCountOutputTypeArgs<ExtArgs>
  }


  type AdminUserGetPayload<S extends boolean | null | undefined | AdminUserArgs> = $Types.GetResult<AdminUserPayload, S>

  type AdminUserCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<AdminUserFindManyArgs, 'select' | 'include'> & {
      select?: AdminUserCountAggregateInputType | true
    }

  export interface AdminUserDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminUser'], meta: { name: 'AdminUser' } }
    /**
     * Find zero or one AdminUser that matches the filter.
     * @param {AdminUserFindUniqueArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AdminUserFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, AdminUserFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'AdminUser'> extends True ? Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one AdminUser that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {AdminUserFindUniqueOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AdminUserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminUserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first AdminUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AdminUserFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, AdminUserFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'AdminUser'> extends True ? Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first AdminUser that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindFirstOrThrowArgs} args - Arguments to find a AdminUser
     * @example
     * // Get one AdminUser
     * const adminUser = await prisma.adminUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AdminUserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminUserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more AdminUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminUsers
     * const adminUsers = await prisma.adminUser.findMany()
     * 
     * // Get first 10 AdminUsers
     * const adminUsers = await prisma.adminUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminUserWithIdOnly = await prisma.adminUser.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AdminUserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminUserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a AdminUser.
     * @param {AdminUserCreateArgs} args - Arguments to create a AdminUser.
     * @example
     * // Create one AdminUser
     * const AdminUser = await prisma.adminUser.create({
     *   data: {
     *     // ... data to create a AdminUser
     *   }
     * })
     * 
    **/
    create<T extends AdminUserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AdminUserCreateArgs<ExtArgs>>
    ): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many AdminUsers.
     *     @param {AdminUserCreateManyArgs} args - Arguments to create many AdminUsers.
     *     @example
     *     // Create many AdminUsers
     *     const adminUser = await prisma.adminUser.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends AdminUserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminUserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AdminUser.
     * @param {AdminUserDeleteArgs} args - Arguments to delete one AdminUser.
     * @example
     * // Delete one AdminUser
     * const AdminUser = await prisma.adminUser.delete({
     *   where: {
     *     // ... filter to delete one AdminUser
     *   }
     * })
     * 
    **/
    delete<T extends AdminUserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AdminUserDeleteArgs<ExtArgs>>
    ): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one AdminUser.
     * @param {AdminUserUpdateArgs} args - Arguments to update one AdminUser.
     * @example
     * // Update one AdminUser
     * const adminUser = await prisma.adminUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AdminUserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AdminUserUpdateArgs<ExtArgs>>
    ): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more AdminUsers.
     * @param {AdminUserDeleteManyArgs} args - Arguments to filter AdminUsers to delete.
     * @example
     * // Delete a few AdminUsers
     * const { count } = await prisma.adminUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AdminUserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminUserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminUsers
     * const adminUser = await prisma.adminUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AdminUserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AdminUserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminUser.
     * @param {AdminUserUpsertArgs} args - Arguments to update or create a AdminUser.
     * @example
     * // Update or create a AdminUser
     * const adminUser = await prisma.adminUser.upsert({
     *   create: {
     *     // ... data to create a AdminUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminUser we want to update
     *   }
     * })
    **/
    upsert<T extends AdminUserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AdminUserUpsertArgs<ExtArgs>>
    ): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of AdminUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserCountArgs} args - Arguments to filter AdminUsers to count.
     * @example
     * // Count the number of AdminUsers
     * const count = await prisma.adminUser.count({
     *   where: {
     *     // ... the filter for the AdminUsers we want to count
     *   }
     * })
    **/
    count<T extends AdminUserCountArgs>(
      args?: Subset<T, AdminUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AdminUserAggregateArgs>(args: Subset<T, AdminUserAggregateArgs>): Prisma.PrismaPromise<GetAdminUserAggregateType<T>>

    /**
     * Group by AdminUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUserGroupByArgs} args - Group by arguments.
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
      T extends AdminUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminUserGroupByArgs['orderBy'] }
        : { orderBy?: AdminUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, AdminUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AdminUserClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    refreshTokens<T extends AdminUser$refreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, AdminUser$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findMany', never>| Null>;

    auditLogs<T extends AdminUser$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, AdminUser$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findMany', never>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * AdminUser base type for findUnique actions
   */
  export type AdminUserFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }

  /**
   * AdminUser findUnique
   */
  export interface AdminUserFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AdminUserFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AdminUser findUniqueOrThrow
   */
  export type AdminUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where: AdminUserWhereUniqueInput
  }


  /**
   * AdminUser base type for findFirst actions
   */
  export type AdminUserFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: Enumerable<AdminUserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: Enumerable<AdminUserScalarFieldEnum>
  }

  /**
   * AdminUser findFirst
   */
  export interface AdminUserFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AdminUserFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AdminUser findFirstOrThrow
   */
  export type AdminUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * Filter, which AdminUser to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: Enumerable<AdminUserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminUsers.
     */
    distinct?: Enumerable<AdminUserScalarFieldEnum>
  }


  /**
   * AdminUser findMany
   */
  export type AdminUserFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * Filter, which AdminUsers to fetch.
     */
    where?: AdminUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminUsers to fetch.
     */
    orderBy?: Enumerable<AdminUserOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminUsers.
     */
    cursor?: AdminUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminUsers.
     */
    skip?: number
    distinct?: Enumerable<AdminUserScalarFieldEnum>
  }


  /**
   * AdminUser create
   */
  export type AdminUserCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * The data needed to create a AdminUser.
     */
    data: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
  }


  /**
   * AdminUser createMany
   */
  export type AdminUserCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminUsers.
     */
    data: Enumerable<AdminUserCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * AdminUser update
   */
  export type AdminUserUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * The data needed to update a AdminUser.
     */
    data: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
    /**
     * Choose, which AdminUser to update.
     */
    where: AdminUserWhereUniqueInput
  }


  /**
   * AdminUser updateMany
   */
  export type AdminUserUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminUsers.
     */
    data: XOR<AdminUserUpdateManyMutationInput, AdminUserUncheckedUpdateManyInput>
    /**
     * Filter which AdminUsers to update
     */
    where?: AdminUserWhereInput
  }


  /**
   * AdminUser upsert
   */
  export type AdminUserUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * The filter to search for the AdminUser to update in case it exists.
     */
    where: AdminUserWhereUniqueInput
    /**
     * In case the AdminUser found by the `where` argument doesn't exist, create a new AdminUser with this data.
     */
    create: XOR<AdminUserCreateInput, AdminUserUncheckedCreateInput>
    /**
     * In case the AdminUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUserUpdateInput, AdminUserUncheckedUpdateInput>
  }


  /**
   * AdminUser delete
   */
  export type AdminUserDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
    /**
     * Filter which AdminUser to delete.
     */
    where: AdminUserWhereUniqueInput
  }


  /**
   * AdminUser deleteMany
   */
  export type AdminUserDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminUsers to delete
     */
    where?: AdminUserWhereInput
  }


  /**
   * AdminUser.refreshTokens
   */
  export type AdminUser$refreshTokensArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    where?: AdminRefreshTokenWhereInput
    orderBy?: Enumerable<AdminRefreshTokenOrderByWithRelationInput>
    cursor?: AdminRefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<AdminRefreshTokenScalarFieldEnum>
  }


  /**
   * AdminUser.auditLogs
   */
  export type AdminUser$auditLogsArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    where?: AdminAuditLogWhereInput
    orderBy?: Enumerable<AdminAuditLogOrderByWithRelationInput>
    cursor?: AdminAuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<AdminAuditLogScalarFieldEnum>
  }


  /**
   * AdminUser without action
   */
  export type AdminUserArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminUser
     */
    select?: AdminUserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminUserInclude<ExtArgs> | null
  }



  /**
   * Model AdminRefreshToken
   */


  export type AggregateAdminRefreshToken = {
    _count: AdminRefreshTokenCountAggregateOutputType | null
    _min: AdminRefreshTokenMinAggregateOutputType | null
    _max: AdminRefreshTokenMaxAggregateOutputType | null
  }

  export type AdminRefreshTokenMinAggregateOutputType = {
    id: string | null
    adminId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
    revokedAt: Date | null
  }

  export type AdminRefreshTokenMaxAggregateOutputType = {
    id: string | null
    adminId: string | null
    token: string | null
    expiresAt: Date | null
    createdAt: Date | null
    revokedAt: Date | null
  }

  export type AdminRefreshTokenCountAggregateOutputType = {
    id: number
    adminId: number
    token: number
    expiresAt: number
    createdAt: number
    revokedAt: number
    _all: number
  }


  export type AdminRefreshTokenMinAggregateInputType = {
    id?: true
    adminId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    revokedAt?: true
  }

  export type AdminRefreshTokenMaxAggregateInputType = {
    id?: true
    adminId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    revokedAt?: true
  }

  export type AdminRefreshTokenCountAggregateInputType = {
    id?: true
    adminId?: true
    token?: true
    expiresAt?: true
    createdAt?: true
    revokedAt?: true
    _all?: true
  }

  export type AdminRefreshTokenAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminRefreshToken to aggregate.
     */
    where?: AdminRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminRefreshTokens to fetch.
     */
    orderBy?: Enumerable<AdminRefreshTokenOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminRefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminRefreshTokens
    **/
    _count?: true | AdminRefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminRefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminRefreshTokenMaxAggregateInputType
  }

  export type GetAdminRefreshTokenAggregateType<T extends AdminRefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminRefreshToken[P]>
      : GetScalarType<T[P], AggregateAdminRefreshToken[P]>
  }




  export type AdminRefreshTokenGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AdminRefreshTokenWhereInput
    orderBy?: Enumerable<AdminRefreshTokenOrderByWithAggregationInput>
    by: AdminRefreshTokenScalarFieldEnum[]
    having?: AdminRefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminRefreshTokenCountAggregateInputType | true
    _min?: AdminRefreshTokenMinAggregateInputType
    _max?: AdminRefreshTokenMaxAggregateInputType
  }


  export type AdminRefreshTokenGroupByOutputType = {
    id: string
    adminId: string
    token: string
    expiresAt: Date
    createdAt: Date
    revokedAt: Date | null
    _count: AdminRefreshTokenCountAggregateOutputType | null
    _min: AdminRefreshTokenMinAggregateOutputType | null
    _max: AdminRefreshTokenMaxAggregateOutputType | null
  }

  type GetAdminRefreshTokenGroupByPayload<T extends AdminRefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<AdminRefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminRefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminRefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], AdminRefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type AdminRefreshTokenSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    adminId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    revokedAt?: boolean
    admin?: boolean | AdminUserArgs<ExtArgs>
  }, ExtArgs["result"]["adminRefreshToken"]>

  export type AdminRefreshTokenSelectScalar = {
    id?: boolean
    adminId?: boolean
    token?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    revokedAt?: boolean
  }

  export type AdminRefreshTokenInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    admin?: boolean | AdminUserArgs<ExtArgs>
  }


  type AdminRefreshTokenGetPayload<S extends boolean | null | undefined | AdminRefreshTokenArgs> = $Types.GetResult<AdminRefreshTokenPayload, S>

  type AdminRefreshTokenCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<AdminRefreshTokenFindManyArgs, 'select' | 'include'> & {
      select?: AdminRefreshTokenCountAggregateInputType | true
    }

  export interface AdminRefreshTokenDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminRefreshToken'], meta: { name: 'AdminRefreshToken' } }
    /**
     * Find zero or one AdminRefreshToken that matches the filter.
     * @param {AdminRefreshTokenFindUniqueArgs} args - Arguments to find a AdminRefreshToken
     * @example
     * // Get one AdminRefreshToken
     * const adminRefreshToken = await prisma.adminRefreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AdminRefreshTokenFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, AdminRefreshTokenFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'AdminRefreshToken'> extends True ? Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one AdminRefreshToken that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {AdminRefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a AdminRefreshToken
     * @example
     * // Get one AdminRefreshToken
     * const adminRefreshToken = await prisma.adminRefreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AdminRefreshTokenFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminRefreshTokenFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first AdminRefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminRefreshTokenFindFirstArgs} args - Arguments to find a AdminRefreshToken
     * @example
     * // Get one AdminRefreshToken
     * const adminRefreshToken = await prisma.adminRefreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AdminRefreshTokenFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, AdminRefreshTokenFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'AdminRefreshToken'> extends True ? Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first AdminRefreshToken that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminRefreshTokenFindFirstOrThrowArgs} args - Arguments to find a AdminRefreshToken
     * @example
     * // Get one AdminRefreshToken
     * const adminRefreshToken = await prisma.adminRefreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AdminRefreshTokenFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminRefreshTokenFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more AdminRefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminRefreshTokenFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminRefreshTokens
     * const adminRefreshTokens = await prisma.adminRefreshToken.findMany()
     * 
     * // Get first 10 AdminRefreshTokens
     * const adminRefreshTokens = await prisma.adminRefreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminRefreshTokenWithIdOnly = await prisma.adminRefreshToken.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AdminRefreshTokenFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminRefreshTokenFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a AdminRefreshToken.
     * @param {AdminRefreshTokenCreateArgs} args - Arguments to create a AdminRefreshToken.
     * @example
     * // Create one AdminRefreshToken
     * const AdminRefreshToken = await prisma.adminRefreshToken.create({
     *   data: {
     *     // ... data to create a AdminRefreshToken
     *   }
     * })
     * 
    **/
    create<T extends AdminRefreshTokenCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AdminRefreshTokenCreateArgs<ExtArgs>>
    ): Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many AdminRefreshTokens.
     *     @param {AdminRefreshTokenCreateManyArgs} args - Arguments to create many AdminRefreshTokens.
     *     @example
     *     // Create many AdminRefreshTokens
     *     const adminRefreshToken = await prisma.adminRefreshToken.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends AdminRefreshTokenCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminRefreshTokenCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AdminRefreshToken.
     * @param {AdminRefreshTokenDeleteArgs} args - Arguments to delete one AdminRefreshToken.
     * @example
     * // Delete one AdminRefreshToken
     * const AdminRefreshToken = await prisma.adminRefreshToken.delete({
     *   where: {
     *     // ... filter to delete one AdminRefreshToken
     *   }
     * })
     * 
    **/
    delete<T extends AdminRefreshTokenDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AdminRefreshTokenDeleteArgs<ExtArgs>>
    ): Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one AdminRefreshToken.
     * @param {AdminRefreshTokenUpdateArgs} args - Arguments to update one AdminRefreshToken.
     * @example
     * // Update one AdminRefreshToken
     * const adminRefreshToken = await prisma.adminRefreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AdminRefreshTokenUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AdminRefreshTokenUpdateArgs<ExtArgs>>
    ): Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more AdminRefreshTokens.
     * @param {AdminRefreshTokenDeleteManyArgs} args - Arguments to filter AdminRefreshTokens to delete.
     * @example
     * // Delete a few AdminRefreshTokens
     * const { count } = await prisma.adminRefreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AdminRefreshTokenDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminRefreshTokenDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminRefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminRefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminRefreshTokens
     * const adminRefreshToken = await prisma.adminRefreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AdminRefreshTokenUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AdminRefreshTokenUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminRefreshToken.
     * @param {AdminRefreshTokenUpsertArgs} args - Arguments to update or create a AdminRefreshToken.
     * @example
     * // Update or create a AdminRefreshToken
     * const adminRefreshToken = await prisma.adminRefreshToken.upsert({
     *   create: {
     *     // ... data to create a AdminRefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminRefreshToken we want to update
     *   }
     * })
    **/
    upsert<T extends AdminRefreshTokenUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AdminRefreshTokenUpsertArgs<ExtArgs>>
    ): Prisma__AdminRefreshTokenClient<$Types.GetResult<AdminRefreshTokenPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of AdminRefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminRefreshTokenCountArgs} args - Arguments to filter AdminRefreshTokens to count.
     * @example
     * // Count the number of AdminRefreshTokens
     * const count = await prisma.adminRefreshToken.count({
     *   where: {
     *     // ... the filter for the AdminRefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends AdminRefreshTokenCountArgs>(
      args?: Subset<T, AdminRefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminRefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminRefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminRefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AdminRefreshTokenAggregateArgs>(args: Subset<T, AdminRefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetAdminRefreshTokenAggregateType<T>>

    /**
     * Group by AdminRefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminRefreshTokenGroupByArgs} args - Group by arguments.
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
      T extends AdminRefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminRefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: AdminRefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, AdminRefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminRefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AdminRefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    admin<T extends AdminUserArgs<ExtArgs> = {}>(args?: Subset<T, AdminUserArgs<ExtArgs>>): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * AdminRefreshToken base type for findUnique actions
   */
  export type AdminRefreshTokenFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which AdminRefreshToken to fetch.
     */
    where: AdminRefreshTokenWhereUniqueInput
  }

  /**
   * AdminRefreshToken findUnique
   */
  export interface AdminRefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AdminRefreshTokenFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AdminRefreshToken findUniqueOrThrow
   */
  export type AdminRefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which AdminRefreshToken to fetch.
     */
    where: AdminRefreshTokenWhereUniqueInput
  }


  /**
   * AdminRefreshToken base type for findFirst actions
   */
  export type AdminRefreshTokenFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which AdminRefreshToken to fetch.
     */
    where?: AdminRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminRefreshTokens to fetch.
     */
    orderBy?: Enumerable<AdminRefreshTokenOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminRefreshTokens.
     */
    cursor?: AdminRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminRefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminRefreshTokens.
     */
    distinct?: Enumerable<AdminRefreshTokenScalarFieldEnum>
  }

  /**
   * AdminRefreshToken findFirst
   */
  export interface AdminRefreshTokenFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AdminRefreshTokenFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AdminRefreshToken findFirstOrThrow
   */
  export type AdminRefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which AdminRefreshToken to fetch.
     */
    where?: AdminRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminRefreshTokens to fetch.
     */
    orderBy?: Enumerable<AdminRefreshTokenOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminRefreshTokens.
     */
    cursor?: AdminRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminRefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminRefreshTokens.
     */
    distinct?: Enumerable<AdminRefreshTokenScalarFieldEnum>
  }


  /**
   * AdminRefreshToken findMany
   */
  export type AdminRefreshTokenFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which AdminRefreshTokens to fetch.
     */
    where?: AdminRefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminRefreshTokens to fetch.
     */
    orderBy?: Enumerable<AdminRefreshTokenOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminRefreshTokens.
     */
    cursor?: AdminRefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminRefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminRefreshTokens.
     */
    skip?: number
    distinct?: Enumerable<AdminRefreshTokenScalarFieldEnum>
  }


  /**
   * AdminRefreshToken create
   */
  export type AdminRefreshTokenCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a AdminRefreshToken.
     */
    data: XOR<AdminRefreshTokenCreateInput, AdminRefreshTokenUncheckedCreateInput>
  }


  /**
   * AdminRefreshToken createMany
   */
  export type AdminRefreshTokenCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminRefreshTokens.
     */
    data: Enumerable<AdminRefreshTokenCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * AdminRefreshToken update
   */
  export type AdminRefreshTokenUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a AdminRefreshToken.
     */
    data: XOR<AdminRefreshTokenUpdateInput, AdminRefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which AdminRefreshToken to update.
     */
    where: AdminRefreshTokenWhereUniqueInput
  }


  /**
   * AdminRefreshToken updateMany
   */
  export type AdminRefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminRefreshTokens.
     */
    data: XOR<AdminRefreshTokenUpdateManyMutationInput, AdminRefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which AdminRefreshTokens to update
     */
    where?: AdminRefreshTokenWhereInput
  }


  /**
   * AdminRefreshToken upsert
   */
  export type AdminRefreshTokenUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the AdminRefreshToken to update in case it exists.
     */
    where: AdminRefreshTokenWhereUniqueInput
    /**
     * In case the AdminRefreshToken found by the `where` argument doesn't exist, create a new AdminRefreshToken with this data.
     */
    create: XOR<AdminRefreshTokenCreateInput, AdminRefreshTokenUncheckedCreateInput>
    /**
     * In case the AdminRefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminRefreshTokenUpdateInput, AdminRefreshTokenUncheckedUpdateInput>
  }


  /**
   * AdminRefreshToken delete
   */
  export type AdminRefreshTokenDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which AdminRefreshToken to delete.
     */
    where: AdminRefreshTokenWhereUniqueInput
  }


  /**
   * AdminRefreshToken deleteMany
   */
  export type AdminRefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminRefreshTokens to delete
     */
    where?: AdminRefreshTokenWhereInput
  }


  /**
   * AdminRefreshToken without action
   */
  export type AdminRefreshTokenArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminRefreshToken
     */
    select?: AdminRefreshTokenSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminRefreshTokenInclude<ExtArgs> | null
  }



  /**
   * Model AdminAuditLog
   */


  export type AggregateAdminAuditLog = {
    _count: AdminAuditLogCountAggregateOutputType | null
    _min: AdminAuditLogMinAggregateOutputType | null
    _max: AdminAuditLogMaxAggregateOutputType | null
  }

  export type AdminAuditLogMinAggregateOutputType = {
    id: string | null
    adminId: string | null
    action: string | null
    targetType: string | null
    targetId: string | null
    createdAt: Date | null
  }

  export type AdminAuditLogMaxAggregateOutputType = {
    id: string | null
    adminId: string | null
    action: string | null
    targetType: string | null
    targetId: string | null
    createdAt: Date | null
  }

  export type AdminAuditLogCountAggregateOutputType = {
    id: number
    adminId: number
    action: number
    targetType: number
    targetId: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AdminAuditLogMinAggregateInputType = {
    id?: true
    adminId?: true
    action?: true
    targetType?: true
    targetId?: true
    createdAt?: true
  }

  export type AdminAuditLogMaxAggregateInputType = {
    id?: true
    adminId?: true
    action?: true
    targetType?: true
    targetId?: true
    createdAt?: true
  }

  export type AdminAuditLogCountAggregateInputType = {
    id?: true
    adminId?: true
    action?: true
    targetType?: true
    targetId?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AdminAuditLogAggregateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminAuditLog to aggregate.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: Enumerable<AdminAuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminAuditLogs
    **/
    _count?: true | AdminAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminAuditLogMaxAggregateInputType
  }

  export type GetAdminAuditLogAggregateType<T extends AdminAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminAuditLog[P]>
      : GetScalarType<T[P], AggregateAdminAuditLog[P]>
  }




  export type AdminAuditLogGroupByArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    where?: AdminAuditLogWhereInput
    orderBy?: Enumerable<AdminAuditLogOrderByWithAggregationInput>
    by: AdminAuditLogScalarFieldEnum[]
    having?: AdminAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminAuditLogCountAggregateInputType | true
    _min?: AdminAuditLogMinAggregateInputType
    _max?: AdminAuditLogMaxAggregateInputType
  }


  export type AdminAuditLogGroupByOutputType = {
    id: string
    adminId: string | null
    action: string
    targetType: string
    targetId: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AdminAuditLogCountAggregateOutputType | null
    _min: AdminAuditLogMinAggregateOutputType | null
    _max: AdminAuditLogMaxAggregateOutputType | null
  }

  type GetAdminAuditLogGroupByPayload<T extends AdminAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickArray<AdminAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AdminAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AdminAuditLogSelect<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    adminId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    metadata?: boolean
    createdAt?: boolean
    admin?: boolean | AdminUserArgs<ExtArgs>
  }, ExtArgs["result"]["adminAuditLog"]>

  export type AdminAuditLogSelectScalar = {
    id?: boolean
    adminId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type AdminAuditLogInclude<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    admin?: boolean | AdminUserArgs<ExtArgs>
  }


  type AdminAuditLogGetPayload<S extends boolean | null | undefined | AdminAuditLogArgs> = $Types.GetResult<AdminAuditLogPayload, S>

  type AdminAuditLogCountArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = 
    Omit<AdminAuditLogFindManyArgs, 'select' | 'include'> & {
      select?: AdminAuditLogCountAggregateInputType | true
    }

  export interface AdminAuditLogDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminAuditLog'], meta: { name: 'AdminAuditLog' } }
    /**
     * Find zero or one AdminAuditLog that matches the filter.
     * @param {AdminAuditLogFindUniqueArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AdminAuditLogFindUniqueArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, AdminAuditLogFindUniqueArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'AdminAuditLog'> extends True ? Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findUnique', never>, never, ExtArgs> : Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findUnique', never> | null, null, ExtArgs>

    /**
     * Find one AdminAuditLog that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {AdminAuditLogFindUniqueOrThrowArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AdminAuditLogFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminAuditLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findUniqueOrThrow', never>, never, ExtArgs>

    /**
     * Find the first AdminAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindFirstArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AdminAuditLogFindFirstArgs<ExtArgs>, LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, AdminAuditLogFindFirstArgs<ExtArgs>>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'AdminAuditLog'> extends True ? Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findFirst', never>, never, ExtArgs> : Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findFirst', never> | null, null, ExtArgs>

    /**
     * Find the first AdminAuditLog that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindFirstOrThrowArgs} args - Arguments to find a AdminAuditLog
     * @example
     * // Get one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AdminAuditLogFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminAuditLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findFirstOrThrow', never>, never, ExtArgs>

    /**
     * Find zero or more AdminAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminAuditLogs
     * const adminAuditLogs = await prisma.adminAuditLog.findMany()
     * 
     * // Get first 10 AdminAuditLogs
     * const adminAuditLogs = await prisma.adminAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminAuditLogWithIdOnly = await prisma.adminAuditLog.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AdminAuditLogFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminAuditLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'findMany', never>>

    /**
     * Create a AdminAuditLog.
     * @param {AdminAuditLogCreateArgs} args - Arguments to create a AdminAuditLog.
     * @example
     * // Create one AdminAuditLog
     * const AdminAuditLog = await prisma.adminAuditLog.create({
     *   data: {
     *     // ... data to create a AdminAuditLog
     *   }
     * })
     * 
    **/
    create<T extends AdminAuditLogCreateArgs<ExtArgs>>(
      args: SelectSubset<T, AdminAuditLogCreateArgs<ExtArgs>>
    ): Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'create', never>, never, ExtArgs>

    /**
     * Create many AdminAuditLogs.
     *     @param {AdminAuditLogCreateManyArgs} args - Arguments to create many AdminAuditLogs.
     *     @example
     *     // Create many AdminAuditLogs
     *     const adminAuditLog = await prisma.adminAuditLog.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends AdminAuditLogCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminAuditLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AdminAuditLog.
     * @param {AdminAuditLogDeleteArgs} args - Arguments to delete one AdminAuditLog.
     * @example
     * // Delete one AdminAuditLog
     * const AdminAuditLog = await prisma.adminAuditLog.delete({
     *   where: {
     *     // ... filter to delete one AdminAuditLog
     *   }
     * })
     * 
    **/
    delete<T extends AdminAuditLogDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, AdminAuditLogDeleteArgs<ExtArgs>>
    ): Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'delete', never>, never, ExtArgs>

    /**
     * Update one AdminAuditLog.
     * @param {AdminAuditLogUpdateArgs} args - Arguments to update one AdminAuditLog.
     * @example
     * // Update one AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AdminAuditLogUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, AdminAuditLogUpdateArgs<ExtArgs>>
    ): Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'update', never>, never, ExtArgs>

    /**
     * Delete zero or more AdminAuditLogs.
     * @param {AdminAuditLogDeleteManyArgs} args - Arguments to filter AdminAuditLogs to delete.
     * @example
     * // Delete a few AdminAuditLogs
     * const { count } = await prisma.adminAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AdminAuditLogDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, AdminAuditLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminAuditLogs
     * const adminAuditLog = await prisma.adminAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AdminAuditLogUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, AdminAuditLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AdminAuditLog.
     * @param {AdminAuditLogUpsertArgs} args - Arguments to update or create a AdminAuditLog.
     * @example
     * // Update or create a AdminAuditLog
     * const adminAuditLog = await prisma.adminAuditLog.upsert({
     *   create: {
     *     // ... data to create a AdminAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminAuditLog we want to update
     *   }
     * })
    **/
    upsert<T extends AdminAuditLogUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, AdminAuditLogUpsertArgs<ExtArgs>>
    ): Prisma__AdminAuditLogClient<$Types.GetResult<AdminAuditLogPayload<ExtArgs>, T, 'upsert', never>, never, ExtArgs>

    /**
     * Count the number of AdminAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogCountArgs} args - Arguments to filter AdminAuditLogs to count.
     * @example
     * // Count the number of AdminAuditLogs
     * const count = await prisma.adminAuditLog.count({
     *   where: {
     *     // ... the filter for the AdminAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AdminAuditLogCountArgs>(
      args?: Subset<T, AdminAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AdminAuditLogAggregateArgs>(args: Subset<T, AdminAuditLogAggregateArgs>): Prisma.PrismaPromise<GetAdminAuditLogAggregateType<T>>

    /**
     * Group by AdminAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAuditLogGroupByArgs} args - Group by arguments.
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
      T extends AdminAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AdminAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, AdminAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AdminAuditLogClient<T, Null = never, ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> implements Prisma.PrismaPromise<T> {
    private readonly _dmmf;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    constructor(_dmmf: runtime.DMMFClass, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);

    admin<T extends AdminUserArgs<ExtArgs> = {}>(args?: Subset<T, AdminUserArgs<ExtArgs>>): Prisma__AdminUserClient<$Types.GetResult<AdminUserPayload<ExtArgs>, T, 'findUnique', never> | Null, never, ExtArgs>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * AdminAuditLog base type for findUnique actions
   */
  export type AdminAuditLogFindUniqueArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where: AdminAuditLogWhereUniqueInput
  }

  /**
   * AdminAuditLog findUnique
   */
  export interface AdminAuditLogFindUniqueArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AdminAuditLogFindUniqueArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AdminAuditLog findUniqueOrThrow
   */
  export type AdminAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where: AdminAuditLogWhereUniqueInput
  }


  /**
   * AdminAuditLog base type for findFirst actions
   */
  export type AdminAuditLogFindFirstArgsBase<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: Enumerable<AdminAuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminAuditLogs.
     */
    distinct?: Enumerable<AdminAuditLogScalarFieldEnum>
  }

  /**
   * AdminAuditLog findFirst
   */
  export interface AdminAuditLogFindFirstArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> extends AdminAuditLogFindFirstArgsBase<ExtArgs> {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * AdminAuditLog findFirstOrThrow
   */
  export type AdminAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AdminAuditLog to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: Enumerable<AdminAuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminAuditLogs.
     */
    distinct?: Enumerable<AdminAuditLogScalarFieldEnum>
  }


  /**
   * AdminAuditLog findMany
   */
  export type AdminAuditLogFindManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AdminAuditLogs to fetch.
     */
    where?: AdminAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminAuditLogs to fetch.
     */
    orderBy?: Enumerable<AdminAuditLogOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminAuditLogs.
     */
    cursor?: AdminAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminAuditLogs.
     */
    skip?: number
    distinct?: Enumerable<AdminAuditLogScalarFieldEnum>
  }


  /**
   * AdminAuditLog create
   */
  export type AdminAuditLogCreateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AdminAuditLog.
     */
    data: XOR<AdminAuditLogCreateInput, AdminAuditLogUncheckedCreateInput>
  }


  /**
   * AdminAuditLog createMany
   */
  export type AdminAuditLogCreateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminAuditLogs.
     */
    data: Enumerable<AdminAuditLogCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * AdminAuditLog update
   */
  export type AdminAuditLogUpdateArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AdminAuditLog.
     */
    data: XOR<AdminAuditLogUpdateInput, AdminAuditLogUncheckedUpdateInput>
    /**
     * Choose, which AdminAuditLog to update.
     */
    where: AdminAuditLogWhereUniqueInput
  }


  /**
   * AdminAuditLog updateMany
   */
  export type AdminAuditLogUpdateManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminAuditLogs.
     */
    data: XOR<AdminAuditLogUpdateManyMutationInput, AdminAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AdminAuditLogs to update
     */
    where?: AdminAuditLogWhereInput
  }


  /**
   * AdminAuditLog upsert
   */
  export type AdminAuditLogUpsertArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AdminAuditLog to update in case it exists.
     */
    where: AdminAuditLogWhereUniqueInput
    /**
     * In case the AdminAuditLog found by the `where` argument doesn't exist, create a new AdminAuditLog with this data.
     */
    create: XOR<AdminAuditLogCreateInput, AdminAuditLogUncheckedCreateInput>
    /**
     * In case the AdminAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminAuditLogUpdateInput, AdminAuditLogUncheckedUpdateInput>
  }


  /**
   * AdminAuditLog delete
   */
  export type AdminAuditLogDeleteArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
    /**
     * Filter which AdminAuditLog to delete.
     */
    where: AdminAuditLogWhereUniqueInput
  }


  /**
   * AdminAuditLog deleteMany
   */
  export type AdminAuditLogDeleteManyArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminAuditLogs to delete
     */
    where?: AdminAuditLogWhereInput
  }


  /**
   * AdminAuditLog without action
   */
  export type AdminAuditLogArgs<ExtArgs extends $Extensions.Args = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAuditLog
     */
    select?: AdminAuditLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: AdminAuditLogInclude<ExtArgs> | null
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


  export const TenantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    dbName: 'dbName',
    dbUser: 'dbUser',
    dbPassword: 'dbPassword',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    restaurantId: 'restaurantId',
    useRedis: 'useRedis',
    posType: 'posType',
    status: 'status',
    country: 'country',
    city: 'city',
    timezone: 'timezone',
    contactName: 'contactName',
    contactPhone: 'contactPhone',
    billingEmail: 'billingEmail',
    onboardingCompleted: 'onboardingCompleted',
    lastSeenAt: 'lastSeenAt',
    notes: 'notes'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const ServicePlanScalarFieldEnum: {
    id: 'id',
    name: 'name',
    code: 'code',
    posType: 'posType',
    description: 'description',
    featureHighlights: 'featureHighlights',
    allowedModules: 'allowedModules',
    monthlyPriceCents: 'monthlyPriceCents',
    annualPriceCents: 'annualPriceCents',
    currency: 'currency',
    defaultBillingCycle: 'defaultBillingCycle',
    trialPeriodDays: 'trialPeriodDays',
    isFeatured: 'isFeatured',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ServicePlanScalarFieldEnum = (typeof ServicePlanScalarFieldEnum)[keyof typeof ServicePlanScalarFieldEnum]


  export const TenantPlanScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planId: 'planId',
    status: 'status',
    billingCycle: 'billingCycle',
    startDate: 'startDate',
    endDate: 'endDate',
    renewalDate: 'renewalDate',
    monthlyRevenueCents: 'monthlyRevenueCents',
    totalRevenueCents: 'totalRevenueCents',
    transactionsCount: 'transactionsCount',
    lastActive: 'lastActive',
    allowedModulesSnapshot: 'allowedModulesSnapshot',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantPlanScalarFieldEnum = (typeof TenantPlanScalarFieldEnum)[keyof typeof TenantPlanScalarFieldEnum]


  export const TenantModuleScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    moduleKey: 'moduleKey',
    moduleName: 'moduleName',
    status: 'status',
    assignedAt: 'assignedAt',
    expiresAt: 'expiresAt',
    lastUsedAt: 'lastUsedAt'
  };

  export type TenantModuleScalarFieldEnum = (typeof TenantModuleScalarFieldEnum)[keyof typeof TenantModuleScalarFieldEnum]


  export const TenantUsageSnapshotScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    snapshotDate: 'snapshotDate',
    metricType: 'metricType',
    value: 'value',
    currency: 'currency',
    metadata: 'metadata'
  };

  export type TenantUsageSnapshotScalarFieldEnum = (typeof TenantUsageSnapshotScalarFieldEnum)[keyof typeof TenantUsageSnapshotScalarFieldEnum]


  export const AdminUserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    role: 'role',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminUserScalarFieldEnum = (typeof AdminUserScalarFieldEnum)[keyof typeof AdminUserScalarFieldEnum]


  export const AdminRefreshTokenScalarFieldEnum: {
    id: 'id',
    adminId: 'adminId',
    token: 'token',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    revokedAt: 'revokedAt'
  };

  export type AdminRefreshTokenScalarFieldEnum = (typeof AdminRefreshTokenScalarFieldEnum)[keyof typeof AdminRefreshTokenScalarFieldEnum]


  export const AdminAuditLogScalarFieldEnum: {
    id: 'id',
    adminId: 'adminId',
    action: 'action',
    targetType: 'targetType',
    targetId: 'targetId',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type AdminAuditLogScalarFieldEnum = (typeof AdminAuditLogScalarFieldEnum)[keyof typeof AdminAuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: Enumerable<TenantWhereInput>
    OR?: Enumerable<TenantWhereInput>
    NOT?: Enumerable<TenantWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    email?: StringFilter | string
    dbName?: StringFilter | string
    dbUser?: StringFilter | string
    dbPassword?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    restaurantId?: StringFilter | string
    useRedis?: BoolFilter | boolean
    posType?: EnumPosTypeFilter | PosType
    status?: EnumTenantStatusFilter | TenantStatus
    country?: StringNullableFilter | string | null
    city?: StringNullableFilter | string | null
    timezone?: StringNullableFilter | string | null
    contactName?: StringNullableFilter | string | null
    contactPhone?: StringNullableFilter | string | null
    billingEmail?: StringNullableFilter | string | null
    onboardingCompleted?: BoolFilter | boolean
    lastSeenAt?: DateTimeNullableFilter | Date | string | null
    notes?: StringNullableFilter | string | null
    tenantPlans?: TenantPlanListRelationFilter
    modules?: TenantModuleListRelationFilter
    usageSnapshots?: TenantUsageSnapshotListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    restaurantId?: SortOrder
    useRedis?: SortOrder
    posType?: SortOrder
    status?: SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    timezone?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    billingEmail?: SortOrderInput | SortOrder
    onboardingCompleted?: SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    tenantPlans?: TenantPlanOrderByRelationAggregateInput
    modules?: TenantModuleOrderByRelationAggregateInput
    usageSnapshots?: TenantUsageSnapshotOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = {
    id?: string
    email?: string
    dbName?: string
    restaurantId?: string
  }

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    restaurantId?: SortOrder
    useRedis?: SortOrder
    posType?: SortOrder
    status?: SortOrder
    country?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    timezone?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    contactPhone?: SortOrderInput | SortOrder
    billingEmail?: SortOrderInput | SortOrder
    onboardingCompleted?: SortOrder
    lastSeenAt?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TenantScalarWhereWithAggregatesInput>
    OR?: Enumerable<TenantScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TenantScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    email?: StringWithAggregatesFilter | string
    dbName?: StringWithAggregatesFilter | string
    dbUser?: StringWithAggregatesFilter | string
    dbPassword?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    restaurantId?: StringWithAggregatesFilter | string
    useRedis?: BoolWithAggregatesFilter | boolean
    posType?: EnumPosTypeWithAggregatesFilter | PosType
    status?: EnumTenantStatusWithAggregatesFilter | TenantStatus
    country?: StringNullableWithAggregatesFilter | string | null
    city?: StringNullableWithAggregatesFilter | string | null
    timezone?: StringNullableWithAggregatesFilter | string | null
    contactName?: StringNullableWithAggregatesFilter | string | null
    contactPhone?: StringNullableWithAggregatesFilter | string | null
    billingEmail?: StringNullableWithAggregatesFilter | string | null
    onboardingCompleted?: BoolWithAggregatesFilter | boolean
    lastSeenAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    notes?: StringNullableWithAggregatesFilter | string | null
  }

  export type ServicePlanWhereInput = {
    AND?: Enumerable<ServicePlanWhereInput>
    OR?: Enumerable<ServicePlanWhereInput>
    NOT?: Enumerable<ServicePlanWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    code?: StringFilter | string
    posType?: EnumPosTypeFilter | PosType
    description?: StringNullableFilter | string | null
    featureHighlights?: StringNullableListFilter
    allowedModules?: StringNullableListFilter
    monthlyPriceCents?: IntFilter | number
    annualPriceCents?: IntFilter | number
    currency?: StringFilter | string
    defaultBillingCycle?: EnumBillingCycleFilter | BillingCycle
    trialPeriodDays?: IntFilter | number
    isFeatured?: BoolFilter | boolean
    isActive?: BoolFilter | boolean
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    tenantPlans?: TenantPlanListRelationFilter
  }

  export type ServicePlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    posType?: SortOrder
    description?: SortOrderInput | SortOrder
    featureHighlights?: SortOrder
    allowedModules?: SortOrder
    monthlyPriceCents?: SortOrder
    annualPriceCents?: SortOrder
    currency?: SortOrder
    defaultBillingCycle?: SortOrder
    trialPeriodDays?: SortOrder
    isFeatured?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenantPlans?: TenantPlanOrderByRelationAggregateInput
  }

  export type ServicePlanWhereUniqueInput = {
    id?: string
    code?: string
  }

  export type ServicePlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    posType?: SortOrder
    description?: SortOrderInput | SortOrder
    featureHighlights?: SortOrder
    allowedModules?: SortOrder
    monthlyPriceCents?: SortOrder
    annualPriceCents?: SortOrder
    currency?: SortOrder
    defaultBillingCycle?: SortOrder
    trialPeriodDays?: SortOrder
    isFeatured?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ServicePlanCountOrderByAggregateInput
    _avg?: ServicePlanAvgOrderByAggregateInput
    _max?: ServicePlanMaxOrderByAggregateInput
    _min?: ServicePlanMinOrderByAggregateInput
    _sum?: ServicePlanSumOrderByAggregateInput
  }

  export type ServicePlanScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ServicePlanScalarWhereWithAggregatesInput>
    OR?: Enumerable<ServicePlanScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ServicePlanScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
    code?: StringWithAggregatesFilter | string
    posType?: EnumPosTypeWithAggregatesFilter | PosType
    description?: StringNullableWithAggregatesFilter | string | null
    featureHighlights?: StringNullableListFilter
    allowedModules?: StringNullableListFilter
    monthlyPriceCents?: IntWithAggregatesFilter | number
    annualPriceCents?: IntWithAggregatesFilter | number
    currency?: StringWithAggregatesFilter | string
    defaultBillingCycle?: EnumBillingCycleWithAggregatesFilter | BillingCycle
    trialPeriodDays?: IntWithAggregatesFilter | number
    isFeatured?: BoolWithAggregatesFilter | boolean
    isActive?: BoolWithAggregatesFilter | boolean
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type TenantPlanWhereInput = {
    AND?: Enumerable<TenantPlanWhereInput>
    OR?: Enumerable<TenantPlanWhereInput>
    NOT?: Enumerable<TenantPlanWhereInput>
    id?: StringFilter | string
    tenantId?: StringFilter | string
    planId?: StringFilter | string
    status?: EnumTenantPlanStatusFilter | TenantPlanStatus
    billingCycle?: EnumBillingCycleFilter | BillingCycle
    startDate?: DateTimeFilter | Date | string
    endDate?: DateTimeNullableFilter | Date | string | null
    renewalDate?: DateTimeNullableFilter | Date | string | null
    monthlyRevenueCents?: IntFilter | number
    totalRevenueCents?: IntFilter | number
    transactionsCount?: IntFilter | number
    lastActive?: DateTimeNullableFilter | Date | string | null
    allowedModulesSnapshot?: StringNullableListFilter
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    plan?: XOR<ServicePlanRelationFilter, ServicePlanWhereInput>
  }

  export type TenantPlanOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingCycle?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    renewalDate?: SortOrderInput | SortOrder
    monthlyRevenueCents?: SortOrder
    totalRevenueCents?: SortOrder
    transactionsCount?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    allowedModulesSnapshot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    plan?: ServicePlanOrderByWithRelationInput
  }

  export type TenantPlanWhereUniqueInput = {
    id?: string
  }

  export type TenantPlanOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingCycle?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrderInput | SortOrder
    renewalDate?: SortOrderInput | SortOrder
    monthlyRevenueCents?: SortOrder
    totalRevenueCents?: SortOrder
    transactionsCount?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    allowedModulesSnapshot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantPlanCountOrderByAggregateInput
    _avg?: TenantPlanAvgOrderByAggregateInput
    _max?: TenantPlanMaxOrderByAggregateInput
    _min?: TenantPlanMinOrderByAggregateInput
    _sum?: TenantPlanSumOrderByAggregateInput
  }

  export type TenantPlanScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TenantPlanScalarWhereWithAggregatesInput>
    OR?: Enumerable<TenantPlanScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TenantPlanScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    tenantId?: StringWithAggregatesFilter | string
    planId?: StringWithAggregatesFilter | string
    status?: EnumTenantPlanStatusWithAggregatesFilter | TenantPlanStatus
    billingCycle?: EnumBillingCycleWithAggregatesFilter | BillingCycle
    startDate?: DateTimeWithAggregatesFilter | Date | string
    endDate?: DateTimeNullableWithAggregatesFilter | Date | string | null
    renewalDate?: DateTimeNullableWithAggregatesFilter | Date | string | null
    monthlyRevenueCents?: IntWithAggregatesFilter | number
    totalRevenueCents?: IntWithAggregatesFilter | number
    transactionsCount?: IntWithAggregatesFilter | number
    lastActive?: DateTimeNullableWithAggregatesFilter | Date | string | null
    allowedModulesSnapshot?: StringNullableListFilter
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type TenantModuleWhereInput = {
    AND?: Enumerable<TenantModuleWhereInput>
    OR?: Enumerable<TenantModuleWhereInput>
    NOT?: Enumerable<TenantModuleWhereInput>
    id?: StringFilter | string
    tenantId?: StringFilter | string
    moduleKey?: StringFilter | string
    moduleName?: StringNullableFilter | string | null
    status?: EnumTenantModuleStatusFilter | TenantModuleStatus
    assignedAt?: DateTimeFilter | Date | string
    expiresAt?: DateTimeNullableFilter | Date | string | null
    lastUsedAt?: DateTimeNullableFilter | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type TenantModuleOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    moduleKey?: SortOrder
    moduleName?: SortOrderInput | SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantModuleWhereUniqueInput = {
    id?: string
    tenantId_moduleKey?: TenantModuleTenantIdModuleKeyCompoundUniqueInput
  }

  export type TenantModuleOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    moduleKey?: SortOrder
    moduleName?: SortOrderInput | SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    _count?: TenantModuleCountOrderByAggregateInput
    _max?: TenantModuleMaxOrderByAggregateInput
    _min?: TenantModuleMinOrderByAggregateInput
  }

  export type TenantModuleScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TenantModuleScalarWhereWithAggregatesInput>
    OR?: Enumerable<TenantModuleScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TenantModuleScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    tenantId?: StringWithAggregatesFilter | string
    moduleKey?: StringWithAggregatesFilter | string
    moduleName?: StringNullableWithAggregatesFilter | string | null
    status?: EnumTenantModuleStatusWithAggregatesFilter | TenantModuleStatus
    assignedAt?: DateTimeWithAggregatesFilter | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    lastUsedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
  }

  export type TenantUsageSnapshotWhereInput = {
    AND?: Enumerable<TenantUsageSnapshotWhereInput>
    OR?: Enumerable<TenantUsageSnapshotWhereInput>
    NOT?: Enumerable<TenantUsageSnapshotWhereInput>
    id?: StringFilter | string
    tenantId?: StringFilter | string
    snapshotDate?: DateTimeFilter | Date | string
    metricType?: EnumUsageMetricTypeFilter | UsageMetricType
    value?: IntFilter | number
    currency?: StringNullableFilter | string | null
    metadata?: JsonNullableFilter
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type TenantUsageSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    snapshotDate?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    currency?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantUsageSnapshotWhereUniqueInput = {
    id?: string
    tenantId_metricType_snapshotDate?: TenantUsageSnapshotTenantIdMetricTypeSnapshotDateCompoundUniqueInput
  }

  export type TenantUsageSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    snapshotDate?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    currency?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: TenantUsageSnapshotCountOrderByAggregateInput
    _avg?: TenantUsageSnapshotAvgOrderByAggregateInput
    _max?: TenantUsageSnapshotMaxOrderByAggregateInput
    _min?: TenantUsageSnapshotMinOrderByAggregateInput
    _sum?: TenantUsageSnapshotSumOrderByAggregateInput
  }

  export type TenantUsageSnapshotScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TenantUsageSnapshotScalarWhereWithAggregatesInput>
    OR?: Enumerable<TenantUsageSnapshotScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TenantUsageSnapshotScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    tenantId?: StringWithAggregatesFilter | string
    snapshotDate?: DateTimeWithAggregatesFilter | Date | string
    metricType?: EnumUsageMetricTypeWithAggregatesFilter | UsageMetricType
    value?: IntWithAggregatesFilter | number
    currency?: StringNullableWithAggregatesFilter | string | null
    metadata?: JsonNullableWithAggregatesFilter
  }

  export type AdminUserWhereInput = {
    AND?: Enumerable<AdminUserWhereInput>
    OR?: Enumerable<AdminUserWhereInput>
    NOT?: Enumerable<AdminUserWhereInput>
    id?: StringFilter | string
    email?: StringFilter | string
    passwordHash?: StringFilter | string
    name?: StringNullableFilter | string | null
    role?: EnumAdminRoleFilter | AdminRole
    isActive?: BoolFilter | boolean
    lastLoginAt?: DateTimeNullableFilter | Date | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    refreshTokens?: AdminRefreshTokenListRelationFilter
    auditLogs?: AdminAuditLogListRelationFilter
  }

  export type AdminUserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    refreshTokens?: AdminRefreshTokenOrderByRelationAggregateInput
    auditLogs?: AdminAuditLogOrderByRelationAggregateInput
  }

  export type AdminUserWhereUniqueInput = {
    id?: string
    email?: string
  }

  export type AdminUserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrderInput | SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminUserCountOrderByAggregateInput
    _max?: AdminUserMaxOrderByAggregateInput
    _min?: AdminUserMinOrderByAggregateInput
  }

  export type AdminUserScalarWhereWithAggregatesInput = {
    AND?: Enumerable<AdminUserScalarWhereWithAggregatesInput>
    OR?: Enumerable<AdminUserScalarWhereWithAggregatesInput>
    NOT?: Enumerable<AdminUserScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    email?: StringWithAggregatesFilter | string
    passwordHash?: StringWithAggregatesFilter | string
    name?: StringNullableWithAggregatesFilter | string | null
    role?: EnumAdminRoleWithAggregatesFilter | AdminRole
    isActive?: BoolWithAggregatesFilter | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type AdminRefreshTokenWhereInput = {
    AND?: Enumerable<AdminRefreshTokenWhereInput>
    OR?: Enumerable<AdminRefreshTokenWhereInput>
    NOT?: Enumerable<AdminRefreshTokenWhereInput>
    id?: StringFilter | string
    adminId?: StringFilter | string
    token?: StringFilter | string
    expiresAt?: DateTimeFilter | Date | string
    createdAt?: DateTimeFilter | Date | string
    revokedAt?: DateTimeNullableFilter | Date | string | null
    admin?: XOR<AdminUserRelationFilter, AdminUserWhereInput>
  }

  export type AdminRefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    adminId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    admin?: AdminUserOrderByWithRelationInput
  }

  export type AdminRefreshTokenWhereUniqueInput = {
    id?: string
    token?: string
  }

  export type AdminRefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    adminId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    _count?: AdminRefreshTokenCountOrderByAggregateInput
    _max?: AdminRefreshTokenMaxOrderByAggregateInput
    _min?: AdminRefreshTokenMinOrderByAggregateInput
  }

  export type AdminRefreshTokenScalarWhereWithAggregatesInput = {
    AND?: Enumerable<AdminRefreshTokenScalarWhereWithAggregatesInput>
    OR?: Enumerable<AdminRefreshTokenScalarWhereWithAggregatesInput>
    NOT?: Enumerable<AdminRefreshTokenScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    adminId?: StringWithAggregatesFilter | string
    token?: StringWithAggregatesFilter | string
    expiresAt?: DateTimeWithAggregatesFilter | Date | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
  }

  export type AdminAuditLogWhereInput = {
    AND?: Enumerable<AdminAuditLogWhereInput>
    OR?: Enumerable<AdminAuditLogWhereInput>
    NOT?: Enumerable<AdminAuditLogWhereInput>
    id?: StringFilter | string
    adminId?: StringNullableFilter | string | null
    action?: StringFilter | string
    targetType?: StringFilter | string
    targetId?: StringNullableFilter | string | null
    metadata?: JsonNullableFilter
    createdAt?: DateTimeFilter | Date | string
    admin?: XOR<AdminUserRelationFilter, AdminUserWhereInput> | null
  }

  export type AdminAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    adminId?: SortOrderInput | SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    admin?: AdminUserOrderByWithRelationInput
  }

  export type AdminAuditLogWhereUniqueInput = {
    id?: string
  }

  export type AdminAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    adminId?: SortOrderInput | SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AdminAuditLogCountOrderByAggregateInput
    _max?: AdminAuditLogMaxOrderByAggregateInput
    _min?: AdminAuditLogMinOrderByAggregateInput
  }

  export type AdminAuditLogScalarWhereWithAggregatesInput = {
    AND?: Enumerable<AdminAuditLogScalarWhereWithAggregatesInput>
    OR?: Enumerable<AdminAuditLogScalarWhereWithAggregatesInput>
    NOT?: Enumerable<AdminAuditLogScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    adminId?: StringNullableWithAggregatesFilter | string | null
    action?: StringWithAggregatesFilter | string
    targetType?: StringWithAggregatesFilter | string
    targetId?: StringNullableWithAggregatesFilter | string | null
    metadata?: JsonNullableWithAggregatesFilter
    createdAt?: DateTimeWithAggregatesFilter | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    tenantPlans?: TenantPlanCreateNestedManyWithoutTenantInput
    modules?: TenantModuleCreateNestedManyWithoutTenantInput
    usageSnapshots?: TenantUsageSnapshotCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    tenantPlans?: TenantPlanUncheckedCreateNestedManyWithoutTenantInput
    modules?: TenantModuleUncheckedCreateNestedManyWithoutTenantInput
    usageSnapshots?: TenantUsageSnapshotUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tenantPlans?: TenantPlanUpdateManyWithoutTenantNestedInput
    modules?: TenantModuleUpdateManyWithoutTenantNestedInput
    usageSnapshots?: TenantUsageSnapshotUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tenantPlans?: TenantPlanUncheckedUpdateManyWithoutTenantNestedInput
    modules?: TenantModuleUncheckedUpdateManyWithoutTenantNestedInput
    usageSnapshots?: TenantUsageSnapshotUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ServicePlanCreateInput = {
    id?: string
    name: string
    code: string
    posType: PosType
    description?: string | null
    featureHighlights?: ServicePlanCreatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanCreateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: number
    annualPriceCents?: number
    currency?: string
    defaultBillingCycle?: BillingCycle
    trialPeriodDays?: number
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantPlans?: TenantPlanCreateNestedManyWithoutPlanInput
  }

  export type ServicePlanUncheckedCreateInput = {
    id?: string
    name: string
    code: string
    posType: PosType
    description?: string | null
    featureHighlights?: ServicePlanCreatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanCreateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: number
    annualPriceCents?: number
    currency?: string
    defaultBillingCycle?: BillingCycle
    trialPeriodDays?: number
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tenantPlans?: TenantPlanUncheckedCreateNestedManyWithoutPlanInput
  }

  export type ServicePlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    featureHighlights?: ServicePlanUpdatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanUpdateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: IntFieldUpdateOperationsInput | number
    annualPriceCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    defaultBillingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    trialPeriodDays?: IntFieldUpdateOperationsInput | number
    isFeatured?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantPlans?: TenantPlanUpdateManyWithoutPlanNestedInput
  }

  export type ServicePlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    featureHighlights?: ServicePlanUpdatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanUpdateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: IntFieldUpdateOperationsInput | number
    annualPriceCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    defaultBillingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    trialPeriodDays?: IntFieldUpdateOperationsInput | number
    isFeatured?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantPlans?: TenantPlanUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type ServicePlanCreateManyInput = {
    id?: string
    name: string
    code: string
    posType: PosType
    description?: string | null
    featureHighlights?: ServicePlanCreatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanCreateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: number
    annualPriceCents?: number
    currency?: string
    defaultBillingCycle?: BillingCycle
    trialPeriodDays?: number
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServicePlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    featureHighlights?: ServicePlanUpdatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanUpdateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: IntFieldUpdateOperationsInput | number
    annualPriceCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    defaultBillingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    trialPeriodDays?: IntFieldUpdateOperationsInput | number
    isFeatured?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicePlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    featureHighlights?: ServicePlanUpdatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanUpdateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: IntFieldUpdateOperationsInput | number
    annualPriceCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    defaultBillingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    trialPeriodDays?: IntFieldUpdateOperationsInput | number
    isFeatured?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantPlanCreateInput = {
    id?: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutTenantPlansInput
    plan: ServicePlanCreateNestedOneWithoutTenantPlansInput
  }

  export type TenantPlanUncheckedCreateInput = {
    id?: string
    tenantId: string
    planId: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantPlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutTenantPlansNestedInput
    plan?: ServicePlanUpdateOneRequiredWithoutTenantPlansNestedInput
  }

  export type TenantPlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantPlanCreateManyInput = {
    id?: string
    tenantId: string
    planId: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantPlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantPlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantModuleCreateInput = {
    id?: string
    moduleKey: string
    moduleName?: string | null
    status?: TenantModuleStatus
    assignedAt?: Date | string
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutModulesInput
  }

  export type TenantModuleUncheckedCreateInput = {
    id?: string
    tenantId: string
    moduleKey: string
    moduleName?: string | null
    status?: TenantModuleStatus
    assignedAt?: Date | string
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
  }

  export type TenantModuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleKey?: StringFieldUpdateOperationsInput | string
    moduleName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantModuleStatusFieldUpdateOperationsInput | TenantModuleStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutModulesNestedInput
  }

  export type TenantModuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    moduleKey?: StringFieldUpdateOperationsInput | string
    moduleName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantModuleStatusFieldUpdateOperationsInput | TenantModuleStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantModuleCreateManyInput = {
    id?: string
    tenantId: string
    moduleKey: string
    moduleName?: string | null
    status?: TenantModuleStatus
    assignedAt?: Date | string
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
  }

  export type TenantModuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleKey?: StringFieldUpdateOperationsInput | string
    moduleName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantModuleStatusFieldUpdateOperationsInput | TenantModuleStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantModuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    moduleKey?: StringFieldUpdateOperationsInput | string
    moduleName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantModuleStatusFieldUpdateOperationsInput | TenantModuleStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUsageSnapshotCreateInput = {
    id?: string
    snapshotDate: Date | string
    metricType: UsageMetricType
    value?: number
    currency?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tenant: TenantCreateNestedOneWithoutUsageSnapshotsInput
  }

  export type TenantUsageSnapshotUncheckedCreateInput = {
    id?: string
    tenantId: string
    snapshotDate: Date | string
    metricType: UsageMetricType
    value?: number
    currency?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | UsageMetricType
    value?: IntFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    tenant?: TenantUpdateOneRequiredWithoutUsageSnapshotsNestedInput
  }

  export type TenantUsageSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | UsageMetricType
    value?: IntFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotCreateManyInput = {
    id?: string
    tenantId: string
    snapshotDate: Date | string
    metricType: UsageMetricType
    value?: number
    currency?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | UsageMetricType
    value?: IntFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | UsageMetricType
    value?: IntFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AdminUserCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: AdminRole
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: AdminRefreshTokenCreateNestedManyWithoutAdminInput
    auditLogs?: AdminAuditLogCreateNestedManyWithoutAdminInput
  }

  export type AdminUserUncheckedCreateInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: AdminRole
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: AdminRefreshTokenUncheckedCreateNestedManyWithoutAdminInput
    auditLogs?: AdminAuditLogUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AdminUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: AdminRefreshTokenUpdateManyWithoutAdminNestedInput
    auditLogs?: AdminAuditLogUpdateManyWithoutAdminNestedInput
  }

  export type AdminUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: AdminRefreshTokenUncheckedUpdateManyWithoutAdminNestedInput
    auditLogs?: AdminAuditLogUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type AdminUserCreateManyInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: AdminRole
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminRefreshTokenCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
    admin: AdminUserCreateNestedOneWithoutRefreshTokensInput
  }

  export type AdminRefreshTokenUncheckedCreateInput = {
    id?: string
    adminId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type AdminRefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    admin?: AdminUserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type AdminRefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminRefreshTokenCreateManyInput = {
    id?: string
    adminId: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type AdminRefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminRefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminAuditLogCreateInput = {
    id?: string
    action: string
    targetType: string
    targetId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    admin?: AdminUserCreateNestedOneWithoutAuditLogsInput
  }

  export type AdminAuditLogUncheckedCreateInput = {
    id?: string
    adminId?: string | null
    action: string
    targetType: string
    targetId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    admin?: AdminUserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AdminAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogCreateManyInput = {
    id?: string
    adminId?: string | null
    action: string
    targetType: string
    targetId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    adminId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type EnumPosTypeFilter = {
    equals?: PosType
    in?: Enumerable<PosType>
    notIn?: Enumerable<PosType>
    not?: NestedEnumPosTypeFilter | PosType
  }

  export type EnumTenantStatusFilter = {
    equals?: TenantStatus
    in?: Enumerable<TenantStatus>
    notIn?: Enumerable<TenantStatus>
    not?: NestedEnumTenantStatusFilter | TenantStatus
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type TenantPlanListRelationFilter = {
    every?: TenantPlanWhereInput
    some?: TenantPlanWhereInput
    none?: TenantPlanWhereInput
  }

  export type TenantModuleListRelationFilter = {
    every?: TenantModuleWhereInput
    some?: TenantModuleWhereInput
    none?: TenantModuleWhereInput
  }

  export type TenantUsageSnapshotListRelationFilter = {
    every?: TenantUsageSnapshotWhereInput
    some?: TenantUsageSnapshotWhereInput
    none?: TenantUsageSnapshotWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TenantPlanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantModuleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantUsageSnapshotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    restaurantId?: SortOrder
    useRedis?: SortOrder
    posType?: SortOrder
    status?: SortOrder
    country?: SortOrder
    city?: SortOrder
    timezone?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    billingEmail?: SortOrder
    onboardingCompleted?: SortOrder
    lastSeenAt?: SortOrder
    notes?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    restaurantId?: SortOrder
    useRedis?: SortOrder
    posType?: SortOrder
    status?: SortOrder
    country?: SortOrder
    city?: SortOrder
    timezone?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    billingEmail?: SortOrder
    onboardingCompleted?: SortOrder
    lastSeenAt?: SortOrder
    notes?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPassword?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    restaurantId?: SortOrder
    useRedis?: SortOrder
    posType?: SortOrder
    status?: SortOrder
    country?: SortOrder
    city?: SortOrder
    timezone?: SortOrder
    contactName?: SortOrder
    contactPhone?: SortOrder
    billingEmail?: SortOrder
    onboardingCompleted?: SortOrder
    lastSeenAt?: SortOrder
    notes?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type EnumPosTypeWithAggregatesFilter = {
    equals?: PosType
    in?: Enumerable<PosType>
    notIn?: Enumerable<PosType>
    not?: NestedEnumPosTypeWithAggregatesFilter | PosType
    _count?: NestedIntFilter
    _min?: NestedEnumPosTypeFilter
    _max?: NestedEnumPosTypeFilter
  }

  export type EnumTenantStatusWithAggregatesFilter = {
    equals?: TenantStatus
    in?: Enumerable<TenantStatus>
    notIn?: Enumerable<TenantStatus>
    not?: NestedEnumTenantStatusWithAggregatesFilter | TenantStatus
    _count?: NestedIntFilter
    _min?: NestedEnumTenantStatusFilter
    _max?: NestedEnumTenantStatusFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type StringNullableListFilter = {
    equals?: Enumerable<string> | null
    has?: string | null
    hasEvery?: Enumerable<string>
    hasSome?: Enumerable<string>
    isEmpty?: boolean
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type EnumBillingCycleFilter = {
    equals?: BillingCycle
    in?: Enumerable<BillingCycle>
    notIn?: Enumerable<BillingCycle>
    not?: NestedEnumBillingCycleFilter | BillingCycle
  }

  export type ServicePlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    posType?: SortOrder
    description?: SortOrder
    featureHighlights?: SortOrder
    allowedModules?: SortOrder
    monthlyPriceCents?: SortOrder
    annualPriceCents?: SortOrder
    currency?: SortOrder
    defaultBillingCycle?: SortOrder
    trialPeriodDays?: SortOrder
    isFeatured?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServicePlanAvgOrderByAggregateInput = {
    monthlyPriceCents?: SortOrder
    annualPriceCents?: SortOrder
    trialPeriodDays?: SortOrder
  }

  export type ServicePlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    posType?: SortOrder
    description?: SortOrder
    monthlyPriceCents?: SortOrder
    annualPriceCents?: SortOrder
    currency?: SortOrder
    defaultBillingCycle?: SortOrder
    trialPeriodDays?: SortOrder
    isFeatured?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServicePlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    code?: SortOrder
    posType?: SortOrder
    description?: SortOrder
    monthlyPriceCents?: SortOrder
    annualPriceCents?: SortOrder
    currency?: SortOrder
    defaultBillingCycle?: SortOrder
    trialPeriodDays?: SortOrder
    isFeatured?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ServicePlanSumOrderByAggregateInput = {
    monthlyPriceCents?: SortOrder
    annualPriceCents?: SortOrder
    trialPeriodDays?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type EnumBillingCycleWithAggregatesFilter = {
    equals?: BillingCycle
    in?: Enumerable<BillingCycle>
    notIn?: Enumerable<BillingCycle>
    not?: NestedEnumBillingCycleWithAggregatesFilter | BillingCycle
    _count?: NestedIntFilter
    _min?: NestedEnumBillingCycleFilter
    _max?: NestedEnumBillingCycleFilter
  }

  export type EnumTenantPlanStatusFilter = {
    equals?: TenantPlanStatus
    in?: Enumerable<TenantPlanStatus>
    notIn?: Enumerable<TenantPlanStatus>
    not?: NestedEnumTenantPlanStatusFilter | TenantPlanStatus
  }

  export type TenantRelationFilter = {
    is?: TenantWhereInput | null
    isNot?: TenantWhereInput | null
  }

  export type ServicePlanRelationFilter = {
    is?: ServicePlanWhereInput | null
    isNot?: ServicePlanWhereInput | null
  }

  export type TenantPlanCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingCycle?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    renewalDate?: SortOrder
    monthlyRevenueCents?: SortOrder
    totalRevenueCents?: SortOrder
    transactionsCount?: SortOrder
    lastActive?: SortOrder
    allowedModulesSnapshot?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantPlanAvgOrderByAggregateInput = {
    monthlyRevenueCents?: SortOrder
    totalRevenueCents?: SortOrder
    transactionsCount?: SortOrder
  }

  export type TenantPlanMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingCycle?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    renewalDate?: SortOrder
    monthlyRevenueCents?: SortOrder
    totalRevenueCents?: SortOrder
    transactionsCount?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantPlanMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    status?: SortOrder
    billingCycle?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    renewalDate?: SortOrder
    monthlyRevenueCents?: SortOrder
    totalRevenueCents?: SortOrder
    transactionsCount?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantPlanSumOrderByAggregateInput = {
    monthlyRevenueCents?: SortOrder
    totalRevenueCents?: SortOrder
    transactionsCount?: SortOrder
  }

  export type EnumTenantPlanStatusWithAggregatesFilter = {
    equals?: TenantPlanStatus
    in?: Enumerable<TenantPlanStatus>
    notIn?: Enumerable<TenantPlanStatus>
    not?: NestedEnumTenantPlanStatusWithAggregatesFilter | TenantPlanStatus
    _count?: NestedIntFilter
    _min?: NestedEnumTenantPlanStatusFilter
    _max?: NestedEnumTenantPlanStatusFilter
  }

  export type EnumTenantModuleStatusFilter = {
    equals?: TenantModuleStatus
    in?: Enumerable<TenantModuleStatus>
    notIn?: Enumerable<TenantModuleStatus>
    not?: NestedEnumTenantModuleStatusFilter | TenantModuleStatus
  }

  export type TenantModuleTenantIdModuleKeyCompoundUniqueInput = {
    tenantId: string
    moduleKey: string
  }

  export type TenantModuleCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    moduleKey?: SortOrder
    moduleName?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type TenantModuleMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    moduleKey?: SortOrder
    moduleName?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type TenantModuleMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    moduleKey?: SortOrder
    moduleName?: SortOrder
    status?: SortOrder
    assignedAt?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
  }

  export type EnumTenantModuleStatusWithAggregatesFilter = {
    equals?: TenantModuleStatus
    in?: Enumerable<TenantModuleStatus>
    notIn?: Enumerable<TenantModuleStatus>
    not?: NestedEnumTenantModuleStatusWithAggregatesFilter | TenantModuleStatus
    _count?: NestedIntFilter
    _min?: NestedEnumTenantModuleStatusFilter
    _max?: NestedEnumTenantModuleStatusFilter
  }

  export type EnumUsageMetricTypeFilter = {
    equals?: UsageMetricType
    in?: Enumerable<UsageMetricType>
    notIn?: Enumerable<UsageMetricType>
    not?: NestedEnumUsageMetricTypeFilter | UsageMetricType
  }
  export type JsonNullableFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase>, Exclude<keyof Required<JsonNullableFilterBase>, 'path'>>,
        Required<JsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase>, 'path'>>

  export type JsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type TenantUsageSnapshotTenantIdMetricTypeSnapshotDateCompoundUniqueInput = {
    tenantId: string
    metricType: UsageMetricType
    snapshotDate: Date | string
  }

  export type TenantUsageSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    snapshotDate?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    currency?: SortOrder
    metadata?: SortOrder
  }

  export type TenantUsageSnapshotAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type TenantUsageSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    snapshotDate?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    currency?: SortOrder
  }

  export type TenantUsageSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    snapshotDate?: SortOrder
    metricType?: SortOrder
    value?: SortOrder
    currency?: SortOrder
  }

  export type TenantUsageSnapshotSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type EnumUsageMetricTypeWithAggregatesFilter = {
    equals?: UsageMetricType
    in?: Enumerable<UsageMetricType>
    notIn?: Enumerable<UsageMetricType>
    not?: NestedEnumUsageMetricTypeWithAggregatesFilter | UsageMetricType
    _count?: NestedIntFilter
    _min?: NestedEnumUsageMetricTypeFilter
    _max?: NestedEnumUsageMetricTypeFilter
  }
  export type JsonNullableWithAggregatesFilter = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
    _count?: NestedIntNullableFilter
    _min?: NestedJsonNullableFilter
    _max?: NestedJsonNullableFilter
  }

  export type EnumAdminRoleFilter = {
    equals?: AdminRole
    in?: Enumerable<AdminRole>
    notIn?: Enumerable<AdminRole>
    not?: NestedEnumAdminRoleFilter | AdminRole
  }

  export type AdminRefreshTokenListRelationFilter = {
    every?: AdminRefreshTokenWhereInput
    some?: AdminRefreshTokenWhereInput
    none?: AdminRefreshTokenWhereInput
  }

  export type AdminAuditLogListRelationFilter = {
    every?: AdminAuditLogWhereInput
    some?: AdminAuditLogWhereInput
    none?: AdminAuditLogWhereInput
  }

  export type AdminRefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AdminAuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AdminUserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminUserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAdminRoleWithAggregatesFilter = {
    equals?: AdminRole
    in?: Enumerable<AdminRole>
    notIn?: Enumerable<AdminRole>
    not?: NestedEnumAdminRoleWithAggregatesFilter | AdminRole
    _count?: NestedIntFilter
    _min?: NestedEnumAdminRoleFilter
    _max?: NestedEnumAdminRoleFilter
  }

  export type AdminUserRelationFilter = {
    is?: AdminUserWhereInput | null
    isNot?: AdminUserWhereInput | null
  }

  export type AdminRefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type AdminRefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type AdminRefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    revokedAt?: SortOrder
  }

  export type AdminAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    adminId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantPlanCreateNestedManyWithoutTenantInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutTenantInput>, Enumerable<TenantPlanUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutTenantInput>
    createMany?: TenantPlanCreateManyTenantInputEnvelope
    connect?: Enumerable<TenantPlanWhereUniqueInput>
  }

  export type TenantModuleCreateNestedManyWithoutTenantInput = {
    create?: XOR<Enumerable<TenantModuleCreateWithoutTenantInput>, Enumerable<TenantModuleUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantModuleCreateOrConnectWithoutTenantInput>
    createMany?: TenantModuleCreateManyTenantInputEnvelope
    connect?: Enumerable<TenantModuleWhereUniqueInput>
  }

  export type TenantUsageSnapshotCreateNestedManyWithoutTenantInput = {
    create?: XOR<Enumerable<TenantUsageSnapshotCreateWithoutTenantInput>, Enumerable<TenantUsageSnapshotUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantUsageSnapshotCreateOrConnectWithoutTenantInput>
    createMany?: TenantUsageSnapshotCreateManyTenantInputEnvelope
    connect?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
  }

  export type TenantPlanUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutTenantInput>, Enumerable<TenantPlanUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutTenantInput>
    createMany?: TenantPlanCreateManyTenantInputEnvelope
    connect?: Enumerable<TenantPlanWhereUniqueInput>
  }

  export type TenantModuleUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<Enumerable<TenantModuleCreateWithoutTenantInput>, Enumerable<TenantModuleUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantModuleCreateOrConnectWithoutTenantInput>
    createMany?: TenantModuleCreateManyTenantInputEnvelope
    connect?: Enumerable<TenantModuleWhereUniqueInput>
  }

  export type TenantUsageSnapshotUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<Enumerable<TenantUsageSnapshotCreateWithoutTenantInput>, Enumerable<TenantUsageSnapshotUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantUsageSnapshotCreateOrConnectWithoutTenantInput>
    createMany?: TenantUsageSnapshotCreateManyTenantInputEnvelope
    connect?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumPosTypeFieldUpdateOperationsInput = {
    set?: PosType
  }

  export type EnumTenantStatusFieldUpdateOperationsInput = {
    set?: TenantStatus
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantPlanUpdateManyWithoutTenantNestedInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutTenantInput>, Enumerable<TenantPlanUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutTenantInput>
    upsert?: Enumerable<TenantPlanUpsertWithWhereUniqueWithoutTenantInput>
    createMany?: TenantPlanCreateManyTenantInputEnvelope
    set?: Enumerable<TenantPlanWhereUniqueInput>
    disconnect?: Enumerable<TenantPlanWhereUniqueInput>
    delete?: Enumerable<TenantPlanWhereUniqueInput>
    connect?: Enumerable<TenantPlanWhereUniqueInput>
    update?: Enumerable<TenantPlanUpdateWithWhereUniqueWithoutTenantInput>
    updateMany?: Enumerable<TenantPlanUpdateManyWithWhereWithoutTenantInput>
    deleteMany?: Enumerable<TenantPlanScalarWhereInput>
  }

  export type TenantModuleUpdateManyWithoutTenantNestedInput = {
    create?: XOR<Enumerable<TenantModuleCreateWithoutTenantInput>, Enumerable<TenantModuleUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantModuleCreateOrConnectWithoutTenantInput>
    upsert?: Enumerable<TenantModuleUpsertWithWhereUniqueWithoutTenantInput>
    createMany?: TenantModuleCreateManyTenantInputEnvelope
    set?: Enumerable<TenantModuleWhereUniqueInput>
    disconnect?: Enumerable<TenantModuleWhereUniqueInput>
    delete?: Enumerable<TenantModuleWhereUniqueInput>
    connect?: Enumerable<TenantModuleWhereUniqueInput>
    update?: Enumerable<TenantModuleUpdateWithWhereUniqueWithoutTenantInput>
    updateMany?: Enumerable<TenantModuleUpdateManyWithWhereWithoutTenantInput>
    deleteMany?: Enumerable<TenantModuleScalarWhereInput>
  }

  export type TenantUsageSnapshotUpdateManyWithoutTenantNestedInput = {
    create?: XOR<Enumerable<TenantUsageSnapshotCreateWithoutTenantInput>, Enumerable<TenantUsageSnapshotUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantUsageSnapshotCreateOrConnectWithoutTenantInput>
    upsert?: Enumerable<TenantUsageSnapshotUpsertWithWhereUniqueWithoutTenantInput>
    createMany?: TenantUsageSnapshotCreateManyTenantInputEnvelope
    set?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    disconnect?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    delete?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    connect?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    update?: Enumerable<TenantUsageSnapshotUpdateWithWhereUniqueWithoutTenantInput>
    updateMany?: Enumerable<TenantUsageSnapshotUpdateManyWithWhereWithoutTenantInput>
    deleteMany?: Enumerable<TenantUsageSnapshotScalarWhereInput>
  }

  export type TenantPlanUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutTenantInput>, Enumerable<TenantPlanUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutTenantInput>
    upsert?: Enumerable<TenantPlanUpsertWithWhereUniqueWithoutTenantInput>
    createMany?: TenantPlanCreateManyTenantInputEnvelope
    set?: Enumerable<TenantPlanWhereUniqueInput>
    disconnect?: Enumerable<TenantPlanWhereUniqueInput>
    delete?: Enumerable<TenantPlanWhereUniqueInput>
    connect?: Enumerable<TenantPlanWhereUniqueInput>
    update?: Enumerable<TenantPlanUpdateWithWhereUniqueWithoutTenantInput>
    updateMany?: Enumerable<TenantPlanUpdateManyWithWhereWithoutTenantInput>
    deleteMany?: Enumerable<TenantPlanScalarWhereInput>
  }

  export type TenantModuleUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<Enumerable<TenantModuleCreateWithoutTenantInput>, Enumerable<TenantModuleUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantModuleCreateOrConnectWithoutTenantInput>
    upsert?: Enumerable<TenantModuleUpsertWithWhereUniqueWithoutTenantInput>
    createMany?: TenantModuleCreateManyTenantInputEnvelope
    set?: Enumerable<TenantModuleWhereUniqueInput>
    disconnect?: Enumerable<TenantModuleWhereUniqueInput>
    delete?: Enumerable<TenantModuleWhereUniqueInput>
    connect?: Enumerable<TenantModuleWhereUniqueInput>
    update?: Enumerable<TenantModuleUpdateWithWhereUniqueWithoutTenantInput>
    updateMany?: Enumerable<TenantModuleUpdateManyWithWhereWithoutTenantInput>
    deleteMany?: Enumerable<TenantModuleScalarWhereInput>
  }

  export type TenantUsageSnapshotUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<Enumerable<TenantUsageSnapshotCreateWithoutTenantInput>, Enumerable<TenantUsageSnapshotUncheckedCreateWithoutTenantInput>>
    connectOrCreate?: Enumerable<TenantUsageSnapshotCreateOrConnectWithoutTenantInput>
    upsert?: Enumerable<TenantUsageSnapshotUpsertWithWhereUniqueWithoutTenantInput>
    createMany?: TenantUsageSnapshotCreateManyTenantInputEnvelope
    set?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    disconnect?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    delete?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    connect?: Enumerable<TenantUsageSnapshotWhereUniqueInput>
    update?: Enumerable<TenantUsageSnapshotUpdateWithWhereUniqueWithoutTenantInput>
    updateMany?: Enumerable<TenantUsageSnapshotUpdateManyWithWhereWithoutTenantInput>
    deleteMany?: Enumerable<TenantUsageSnapshotScalarWhereInput>
  }

  export type ServicePlanCreatefeatureHighlightsInput = {
    set: Enumerable<string>
  }

  export type ServicePlanCreateallowedModulesInput = {
    set: Enumerable<string>
  }

  export type TenantPlanCreateNestedManyWithoutPlanInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutPlanInput>, Enumerable<TenantPlanUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutPlanInput>
    createMany?: TenantPlanCreateManyPlanInputEnvelope
    connect?: Enumerable<TenantPlanWhereUniqueInput>
  }

  export type TenantPlanUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutPlanInput>, Enumerable<TenantPlanUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutPlanInput>
    createMany?: TenantPlanCreateManyPlanInputEnvelope
    connect?: Enumerable<TenantPlanWhereUniqueInput>
  }

  export type ServicePlanUpdatefeatureHighlightsInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type ServicePlanUpdateallowedModulesInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumBillingCycleFieldUpdateOperationsInput = {
    set?: BillingCycle
  }

  export type TenantPlanUpdateManyWithoutPlanNestedInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutPlanInput>, Enumerable<TenantPlanUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutPlanInput>
    upsert?: Enumerable<TenantPlanUpsertWithWhereUniqueWithoutPlanInput>
    createMany?: TenantPlanCreateManyPlanInputEnvelope
    set?: Enumerable<TenantPlanWhereUniqueInput>
    disconnect?: Enumerable<TenantPlanWhereUniqueInput>
    delete?: Enumerable<TenantPlanWhereUniqueInput>
    connect?: Enumerable<TenantPlanWhereUniqueInput>
    update?: Enumerable<TenantPlanUpdateWithWhereUniqueWithoutPlanInput>
    updateMany?: Enumerable<TenantPlanUpdateManyWithWhereWithoutPlanInput>
    deleteMany?: Enumerable<TenantPlanScalarWhereInput>
  }

  export type TenantPlanUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<Enumerable<TenantPlanCreateWithoutPlanInput>, Enumerable<TenantPlanUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<TenantPlanCreateOrConnectWithoutPlanInput>
    upsert?: Enumerable<TenantPlanUpsertWithWhereUniqueWithoutPlanInput>
    createMany?: TenantPlanCreateManyPlanInputEnvelope
    set?: Enumerable<TenantPlanWhereUniqueInput>
    disconnect?: Enumerable<TenantPlanWhereUniqueInput>
    delete?: Enumerable<TenantPlanWhereUniqueInput>
    connect?: Enumerable<TenantPlanWhereUniqueInput>
    update?: Enumerable<TenantPlanUpdateWithWhereUniqueWithoutPlanInput>
    updateMany?: Enumerable<TenantPlanUpdateManyWithWhereWithoutPlanInput>
    deleteMany?: Enumerable<TenantPlanScalarWhereInput>
  }

  export type TenantPlanCreateallowedModulesSnapshotInput = {
    set: Enumerable<string>
  }

  export type TenantCreateNestedOneWithoutTenantPlansInput = {
    create?: XOR<TenantCreateWithoutTenantPlansInput, TenantUncheckedCreateWithoutTenantPlansInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTenantPlansInput
    connect?: TenantWhereUniqueInput
  }

  export type ServicePlanCreateNestedOneWithoutTenantPlansInput = {
    create?: XOR<ServicePlanCreateWithoutTenantPlansInput, ServicePlanUncheckedCreateWithoutTenantPlansInput>
    connectOrCreate?: ServicePlanCreateOrConnectWithoutTenantPlansInput
    connect?: ServicePlanWhereUniqueInput
  }

  export type EnumTenantPlanStatusFieldUpdateOperationsInput = {
    set?: TenantPlanStatus
  }

  export type TenantPlanUpdateallowedModulesSnapshotInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type TenantUpdateOneRequiredWithoutTenantPlansNestedInput = {
    create?: XOR<TenantCreateWithoutTenantPlansInput, TenantUncheckedCreateWithoutTenantPlansInput>
    connectOrCreate?: TenantCreateOrConnectWithoutTenantPlansInput
    upsert?: TenantUpsertWithoutTenantPlansInput
    connect?: TenantWhereUniqueInput
    update?: XOR<TenantUpdateWithoutTenantPlansInput, TenantUncheckedUpdateWithoutTenantPlansInput>
  }

  export type ServicePlanUpdateOneRequiredWithoutTenantPlansNestedInput = {
    create?: XOR<ServicePlanCreateWithoutTenantPlansInput, ServicePlanUncheckedCreateWithoutTenantPlansInput>
    connectOrCreate?: ServicePlanCreateOrConnectWithoutTenantPlansInput
    upsert?: ServicePlanUpsertWithoutTenantPlansInput
    connect?: ServicePlanWhereUniqueInput
    update?: XOR<ServicePlanUpdateWithoutTenantPlansInput, ServicePlanUncheckedUpdateWithoutTenantPlansInput>
  }

  export type TenantCreateNestedOneWithoutModulesInput = {
    create?: XOR<TenantCreateWithoutModulesInput, TenantUncheckedCreateWithoutModulesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutModulesInput
    connect?: TenantWhereUniqueInput
  }

  export type EnumTenantModuleStatusFieldUpdateOperationsInput = {
    set?: TenantModuleStatus
  }

  export type TenantUpdateOneRequiredWithoutModulesNestedInput = {
    create?: XOR<TenantCreateWithoutModulesInput, TenantUncheckedCreateWithoutModulesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutModulesInput
    upsert?: TenantUpsertWithoutModulesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<TenantUpdateWithoutModulesInput, TenantUncheckedUpdateWithoutModulesInput>
  }

  export type TenantCreateNestedOneWithoutUsageSnapshotsInput = {
    create?: XOR<TenantCreateWithoutUsageSnapshotsInput, TenantUncheckedCreateWithoutUsageSnapshotsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsageSnapshotsInput
    connect?: TenantWhereUniqueInput
  }

  export type EnumUsageMetricTypeFieldUpdateOperationsInput = {
    set?: UsageMetricType
  }

  export type TenantUpdateOneRequiredWithoutUsageSnapshotsNestedInput = {
    create?: XOR<TenantCreateWithoutUsageSnapshotsInput, TenantUncheckedCreateWithoutUsageSnapshotsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsageSnapshotsInput
    upsert?: TenantUpsertWithoutUsageSnapshotsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<TenantUpdateWithoutUsageSnapshotsInput, TenantUncheckedUpdateWithoutUsageSnapshotsInput>
  }

  export type AdminRefreshTokenCreateNestedManyWithoutAdminInput = {
    create?: XOR<Enumerable<AdminRefreshTokenCreateWithoutAdminInput>, Enumerable<AdminRefreshTokenUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminRefreshTokenCreateOrConnectWithoutAdminInput>
    createMany?: AdminRefreshTokenCreateManyAdminInputEnvelope
    connect?: Enumerable<AdminRefreshTokenWhereUniqueInput>
  }

  export type AdminAuditLogCreateNestedManyWithoutAdminInput = {
    create?: XOR<Enumerable<AdminAuditLogCreateWithoutAdminInput>, Enumerable<AdminAuditLogUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminAuditLogCreateOrConnectWithoutAdminInput>
    createMany?: AdminAuditLogCreateManyAdminInputEnvelope
    connect?: Enumerable<AdminAuditLogWhereUniqueInput>
  }

  export type AdminRefreshTokenUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<Enumerable<AdminRefreshTokenCreateWithoutAdminInput>, Enumerable<AdminRefreshTokenUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminRefreshTokenCreateOrConnectWithoutAdminInput>
    createMany?: AdminRefreshTokenCreateManyAdminInputEnvelope
    connect?: Enumerable<AdminRefreshTokenWhereUniqueInput>
  }

  export type AdminAuditLogUncheckedCreateNestedManyWithoutAdminInput = {
    create?: XOR<Enumerable<AdminAuditLogCreateWithoutAdminInput>, Enumerable<AdminAuditLogUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminAuditLogCreateOrConnectWithoutAdminInput>
    createMany?: AdminAuditLogCreateManyAdminInputEnvelope
    connect?: Enumerable<AdminAuditLogWhereUniqueInput>
  }

  export type EnumAdminRoleFieldUpdateOperationsInput = {
    set?: AdminRole
  }

  export type AdminRefreshTokenUpdateManyWithoutAdminNestedInput = {
    create?: XOR<Enumerable<AdminRefreshTokenCreateWithoutAdminInput>, Enumerable<AdminRefreshTokenUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminRefreshTokenCreateOrConnectWithoutAdminInput>
    upsert?: Enumerable<AdminRefreshTokenUpsertWithWhereUniqueWithoutAdminInput>
    createMany?: AdminRefreshTokenCreateManyAdminInputEnvelope
    set?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    disconnect?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    delete?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    connect?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    update?: Enumerable<AdminRefreshTokenUpdateWithWhereUniqueWithoutAdminInput>
    updateMany?: Enumerable<AdminRefreshTokenUpdateManyWithWhereWithoutAdminInput>
    deleteMany?: Enumerable<AdminRefreshTokenScalarWhereInput>
  }

  export type AdminAuditLogUpdateManyWithoutAdminNestedInput = {
    create?: XOR<Enumerable<AdminAuditLogCreateWithoutAdminInput>, Enumerable<AdminAuditLogUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminAuditLogCreateOrConnectWithoutAdminInput>
    upsert?: Enumerable<AdminAuditLogUpsertWithWhereUniqueWithoutAdminInput>
    createMany?: AdminAuditLogCreateManyAdminInputEnvelope
    set?: Enumerable<AdminAuditLogWhereUniqueInput>
    disconnect?: Enumerable<AdminAuditLogWhereUniqueInput>
    delete?: Enumerable<AdminAuditLogWhereUniqueInput>
    connect?: Enumerable<AdminAuditLogWhereUniqueInput>
    update?: Enumerable<AdminAuditLogUpdateWithWhereUniqueWithoutAdminInput>
    updateMany?: Enumerable<AdminAuditLogUpdateManyWithWhereWithoutAdminInput>
    deleteMany?: Enumerable<AdminAuditLogScalarWhereInput>
  }

  export type AdminRefreshTokenUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<Enumerable<AdminRefreshTokenCreateWithoutAdminInput>, Enumerable<AdminRefreshTokenUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminRefreshTokenCreateOrConnectWithoutAdminInput>
    upsert?: Enumerable<AdminRefreshTokenUpsertWithWhereUniqueWithoutAdminInput>
    createMany?: AdminRefreshTokenCreateManyAdminInputEnvelope
    set?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    disconnect?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    delete?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    connect?: Enumerable<AdminRefreshTokenWhereUniqueInput>
    update?: Enumerable<AdminRefreshTokenUpdateWithWhereUniqueWithoutAdminInput>
    updateMany?: Enumerable<AdminRefreshTokenUpdateManyWithWhereWithoutAdminInput>
    deleteMany?: Enumerable<AdminRefreshTokenScalarWhereInput>
  }

  export type AdminAuditLogUncheckedUpdateManyWithoutAdminNestedInput = {
    create?: XOR<Enumerable<AdminAuditLogCreateWithoutAdminInput>, Enumerable<AdminAuditLogUncheckedCreateWithoutAdminInput>>
    connectOrCreate?: Enumerable<AdminAuditLogCreateOrConnectWithoutAdminInput>
    upsert?: Enumerable<AdminAuditLogUpsertWithWhereUniqueWithoutAdminInput>
    createMany?: AdminAuditLogCreateManyAdminInputEnvelope
    set?: Enumerable<AdminAuditLogWhereUniqueInput>
    disconnect?: Enumerable<AdminAuditLogWhereUniqueInput>
    delete?: Enumerable<AdminAuditLogWhereUniqueInput>
    connect?: Enumerable<AdminAuditLogWhereUniqueInput>
    update?: Enumerable<AdminAuditLogUpdateWithWhereUniqueWithoutAdminInput>
    updateMany?: Enumerable<AdminAuditLogUpdateManyWithWhereWithoutAdminInput>
    deleteMany?: Enumerable<AdminAuditLogScalarWhereInput>
  }

  export type AdminUserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<AdminUserCreateWithoutRefreshTokensInput, AdminUserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: AdminUserCreateOrConnectWithoutRefreshTokensInput
    connect?: AdminUserWhereUniqueInput
  }

  export type AdminUserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<AdminUserCreateWithoutRefreshTokensInput, AdminUserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: AdminUserCreateOrConnectWithoutRefreshTokensInput
    upsert?: AdminUserUpsertWithoutRefreshTokensInput
    connect?: AdminUserWhereUniqueInput
    update?: XOR<AdminUserUpdateWithoutRefreshTokensInput, AdminUserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type AdminUserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<AdminUserCreateWithoutAuditLogsInput, AdminUserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: AdminUserCreateOrConnectWithoutAuditLogsInput
    connect?: AdminUserWhereUniqueInput
  }

  export type AdminUserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<AdminUserCreateWithoutAuditLogsInput, AdminUserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: AdminUserCreateOrConnectWithoutAuditLogsInput
    upsert?: AdminUserUpsertWithoutAuditLogsInput
    disconnect?: boolean
    delete?: boolean
    connect?: AdminUserWhereUniqueInput
    update?: XOR<AdminUserUpdateWithoutAuditLogsInput, AdminUserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedEnumPosTypeFilter = {
    equals?: PosType
    in?: Enumerable<PosType>
    notIn?: Enumerable<PosType>
    not?: NestedEnumPosTypeFilter | PosType
  }

  export type NestedEnumTenantStatusFilter = {
    equals?: TenantStatus
    in?: Enumerable<TenantStatus>
    notIn?: Enumerable<TenantStatus>
    not?: NestedEnumTenantStatusFilter | TenantStatus
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string> | string
    notIn?: Enumerable<string> | string
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string> | Date | string
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedEnumPosTypeWithAggregatesFilter = {
    equals?: PosType
    in?: Enumerable<PosType>
    notIn?: Enumerable<PosType>
    not?: NestedEnumPosTypeWithAggregatesFilter | PosType
    _count?: NestedIntFilter
    _min?: NestedEnumPosTypeFilter
    _max?: NestedEnumPosTypeFilter
  }

  export type NestedEnumTenantStatusWithAggregatesFilter = {
    equals?: TenantStatus
    in?: Enumerable<TenantStatus>
    notIn?: Enumerable<TenantStatus>
    not?: NestedEnumTenantStatusWithAggregatesFilter | TenantStatus
    _count?: NestedIntFilter
    _min?: NestedEnumTenantStatusFilter
    _max?: NestedEnumTenantStatusFilter
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | string | null
    notIn?: Enumerable<string> | string | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | number | null
    notIn?: Enumerable<number> | number | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | Date | string | null
    notIn?: Enumerable<Date> | Enumerable<string> | Date | string | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedEnumBillingCycleFilter = {
    equals?: BillingCycle
    in?: Enumerable<BillingCycle>
    notIn?: Enumerable<BillingCycle>
    not?: NestedEnumBillingCycleFilter | BillingCycle
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number> | number
    notIn?: Enumerable<number> | number
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedEnumBillingCycleWithAggregatesFilter = {
    equals?: BillingCycle
    in?: Enumerable<BillingCycle>
    notIn?: Enumerable<BillingCycle>
    not?: NestedEnumBillingCycleWithAggregatesFilter | BillingCycle
    _count?: NestedIntFilter
    _min?: NestedEnumBillingCycleFilter
    _max?: NestedEnumBillingCycleFilter
  }

  export type NestedEnumTenantPlanStatusFilter = {
    equals?: TenantPlanStatus
    in?: Enumerable<TenantPlanStatus>
    notIn?: Enumerable<TenantPlanStatus>
    not?: NestedEnumTenantPlanStatusFilter | TenantPlanStatus
  }

  export type NestedEnumTenantPlanStatusWithAggregatesFilter = {
    equals?: TenantPlanStatus
    in?: Enumerable<TenantPlanStatus>
    notIn?: Enumerable<TenantPlanStatus>
    not?: NestedEnumTenantPlanStatusWithAggregatesFilter | TenantPlanStatus
    _count?: NestedIntFilter
    _min?: NestedEnumTenantPlanStatusFilter
    _max?: NestedEnumTenantPlanStatusFilter
  }

  export type NestedEnumTenantModuleStatusFilter = {
    equals?: TenantModuleStatus
    in?: Enumerable<TenantModuleStatus>
    notIn?: Enumerable<TenantModuleStatus>
    not?: NestedEnumTenantModuleStatusFilter | TenantModuleStatus
  }

  export type NestedEnumTenantModuleStatusWithAggregatesFilter = {
    equals?: TenantModuleStatus
    in?: Enumerable<TenantModuleStatus>
    notIn?: Enumerable<TenantModuleStatus>
    not?: NestedEnumTenantModuleStatusWithAggregatesFilter | TenantModuleStatus
    _count?: NestedIntFilter
    _min?: NestedEnumTenantModuleStatusFilter
    _max?: NestedEnumTenantModuleStatusFilter
  }

  export type NestedEnumUsageMetricTypeFilter = {
    equals?: UsageMetricType
    in?: Enumerable<UsageMetricType>
    notIn?: Enumerable<UsageMetricType>
    not?: NestedEnumUsageMetricTypeFilter | UsageMetricType
  }

  export type NestedEnumUsageMetricTypeWithAggregatesFilter = {
    equals?: UsageMetricType
    in?: Enumerable<UsageMetricType>
    notIn?: Enumerable<UsageMetricType>
    not?: NestedEnumUsageMetricTypeWithAggregatesFilter | UsageMetricType
    _count?: NestedIntFilter
    _min?: NestedEnumUsageMetricTypeFilter
    _max?: NestedEnumUsageMetricTypeFilter
  }
  export type NestedJsonNullableFilter = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase>, Exclude<keyof Required<NestedJsonNullableFilterBase>, 'path'>>,
        Required<NestedJsonNullableFilterBase>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase>, 'path'>>

  export type NestedJsonNullableFilterBase = {
    equals?: InputJsonValue | JsonNullValueFilter
    path?: string[]
    string_contains?: string
    string_starts_with?: string
    string_ends_with?: string
    array_contains?: InputJsonValue | null
    array_starts_with?: InputJsonValue | null
    array_ends_with?: InputJsonValue | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonNullValueFilter
  }

  export type NestedEnumAdminRoleFilter = {
    equals?: AdminRole
    in?: Enumerable<AdminRole>
    notIn?: Enumerable<AdminRole>
    not?: NestedEnumAdminRoleFilter | AdminRole
  }

  export type NestedEnumAdminRoleWithAggregatesFilter = {
    equals?: AdminRole
    in?: Enumerable<AdminRole>
    notIn?: Enumerable<AdminRole>
    not?: NestedEnumAdminRoleWithAggregatesFilter | AdminRole
    _count?: NestedIntFilter
    _min?: NestedEnumAdminRoleFilter
    _max?: NestedEnumAdminRoleFilter
  }

  export type TenantPlanCreateWithoutTenantInput = {
    id?: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: ServicePlanCreateNestedOneWithoutTenantPlansInput
  }

  export type TenantPlanUncheckedCreateWithoutTenantInput = {
    id?: string
    planId: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantPlanCreateOrConnectWithoutTenantInput = {
    where: TenantPlanWhereUniqueInput
    create: XOR<TenantPlanCreateWithoutTenantInput, TenantPlanUncheckedCreateWithoutTenantInput>
  }

  export type TenantPlanCreateManyTenantInputEnvelope = {
    data: Enumerable<TenantPlanCreateManyTenantInput>
    skipDuplicates?: boolean
  }

  export type TenantModuleCreateWithoutTenantInput = {
    id?: string
    moduleKey: string
    moduleName?: string | null
    status?: TenantModuleStatus
    assignedAt?: Date | string
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
  }

  export type TenantModuleUncheckedCreateWithoutTenantInput = {
    id?: string
    moduleKey: string
    moduleName?: string | null
    status?: TenantModuleStatus
    assignedAt?: Date | string
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
  }

  export type TenantModuleCreateOrConnectWithoutTenantInput = {
    where: TenantModuleWhereUniqueInput
    create: XOR<TenantModuleCreateWithoutTenantInput, TenantModuleUncheckedCreateWithoutTenantInput>
  }

  export type TenantModuleCreateManyTenantInputEnvelope = {
    data: Enumerable<TenantModuleCreateManyTenantInput>
    skipDuplicates?: boolean
  }

  export type TenantUsageSnapshotCreateWithoutTenantInput = {
    id?: string
    snapshotDate: Date | string
    metricType: UsageMetricType
    value?: number
    currency?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotUncheckedCreateWithoutTenantInput = {
    id?: string
    snapshotDate: Date | string
    metricType: UsageMetricType
    value?: number
    currency?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotCreateOrConnectWithoutTenantInput = {
    where: TenantUsageSnapshotWhereUniqueInput
    create: XOR<TenantUsageSnapshotCreateWithoutTenantInput, TenantUsageSnapshotUncheckedCreateWithoutTenantInput>
  }

  export type TenantUsageSnapshotCreateManyTenantInputEnvelope = {
    data: Enumerable<TenantUsageSnapshotCreateManyTenantInput>
    skipDuplicates?: boolean
  }

  export type TenantPlanUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantPlanWhereUniqueInput
    update: XOR<TenantPlanUpdateWithoutTenantInput, TenantPlanUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantPlanCreateWithoutTenantInput, TenantPlanUncheckedCreateWithoutTenantInput>
  }

  export type TenantPlanUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantPlanWhereUniqueInput
    data: XOR<TenantPlanUpdateWithoutTenantInput, TenantPlanUncheckedUpdateWithoutTenantInput>
  }

  export type TenantPlanUpdateManyWithWhereWithoutTenantInput = {
    where: TenantPlanScalarWhereInput
    data: XOR<TenantPlanUpdateManyMutationInput, TenantPlanUncheckedUpdateManyWithoutTenantPlansInput>
  }

  export type TenantPlanScalarWhereInput = {
    AND?: Enumerable<TenantPlanScalarWhereInput>
    OR?: Enumerable<TenantPlanScalarWhereInput>
    NOT?: Enumerable<TenantPlanScalarWhereInput>
    id?: StringFilter | string
    tenantId?: StringFilter | string
    planId?: StringFilter | string
    status?: EnumTenantPlanStatusFilter | TenantPlanStatus
    billingCycle?: EnumBillingCycleFilter | BillingCycle
    startDate?: DateTimeFilter | Date | string
    endDate?: DateTimeNullableFilter | Date | string | null
    renewalDate?: DateTimeNullableFilter | Date | string | null
    monthlyRevenueCents?: IntFilter | number
    totalRevenueCents?: IntFilter | number
    transactionsCount?: IntFilter | number
    lastActive?: DateTimeNullableFilter | Date | string | null
    allowedModulesSnapshot?: StringNullableListFilter
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
  }

  export type TenantModuleUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantModuleWhereUniqueInput
    update: XOR<TenantModuleUpdateWithoutTenantInput, TenantModuleUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantModuleCreateWithoutTenantInput, TenantModuleUncheckedCreateWithoutTenantInput>
  }

  export type TenantModuleUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantModuleWhereUniqueInput
    data: XOR<TenantModuleUpdateWithoutTenantInput, TenantModuleUncheckedUpdateWithoutTenantInput>
  }

  export type TenantModuleUpdateManyWithWhereWithoutTenantInput = {
    where: TenantModuleScalarWhereInput
    data: XOR<TenantModuleUpdateManyMutationInput, TenantModuleUncheckedUpdateManyWithoutModulesInput>
  }

  export type TenantModuleScalarWhereInput = {
    AND?: Enumerable<TenantModuleScalarWhereInput>
    OR?: Enumerable<TenantModuleScalarWhereInput>
    NOT?: Enumerable<TenantModuleScalarWhereInput>
    id?: StringFilter | string
    tenantId?: StringFilter | string
    moduleKey?: StringFilter | string
    moduleName?: StringNullableFilter | string | null
    status?: EnumTenantModuleStatusFilter | TenantModuleStatus
    assignedAt?: DateTimeFilter | Date | string
    expiresAt?: DateTimeNullableFilter | Date | string | null
    lastUsedAt?: DateTimeNullableFilter | Date | string | null
  }

  export type TenantUsageSnapshotUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantUsageSnapshotWhereUniqueInput
    update: XOR<TenantUsageSnapshotUpdateWithoutTenantInput, TenantUsageSnapshotUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantUsageSnapshotCreateWithoutTenantInput, TenantUsageSnapshotUncheckedCreateWithoutTenantInput>
  }

  export type TenantUsageSnapshotUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantUsageSnapshotWhereUniqueInput
    data: XOR<TenantUsageSnapshotUpdateWithoutTenantInput, TenantUsageSnapshotUncheckedUpdateWithoutTenantInput>
  }

  export type TenantUsageSnapshotUpdateManyWithWhereWithoutTenantInput = {
    where: TenantUsageSnapshotScalarWhereInput
    data: XOR<TenantUsageSnapshotUpdateManyMutationInput, TenantUsageSnapshotUncheckedUpdateManyWithoutUsageSnapshotsInput>
  }

  export type TenantUsageSnapshotScalarWhereInput = {
    AND?: Enumerable<TenantUsageSnapshotScalarWhereInput>
    OR?: Enumerable<TenantUsageSnapshotScalarWhereInput>
    NOT?: Enumerable<TenantUsageSnapshotScalarWhereInput>
    id?: StringFilter | string
    tenantId?: StringFilter | string
    snapshotDate?: DateTimeFilter | Date | string
    metricType?: EnumUsageMetricTypeFilter | UsageMetricType
    value?: IntFilter | number
    currency?: StringNullableFilter | string | null
    metadata?: JsonNullableFilter
  }

  export type TenantPlanCreateWithoutPlanInput = {
    id?: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
    tenant: TenantCreateNestedOneWithoutTenantPlansInput
  }

  export type TenantPlanUncheckedCreateWithoutPlanInput = {
    id?: string
    tenantId: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantPlanCreateOrConnectWithoutPlanInput = {
    where: TenantPlanWhereUniqueInput
    create: XOR<TenantPlanCreateWithoutPlanInput, TenantPlanUncheckedCreateWithoutPlanInput>
  }

  export type TenantPlanCreateManyPlanInputEnvelope = {
    data: Enumerable<TenantPlanCreateManyPlanInput>
    skipDuplicates?: boolean
  }

  export type TenantPlanUpsertWithWhereUniqueWithoutPlanInput = {
    where: TenantPlanWhereUniqueInput
    update: XOR<TenantPlanUpdateWithoutPlanInput, TenantPlanUncheckedUpdateWithoutPlanInput>
    create: XOR<TenantPlanCreateWithoutPlanInput, TenantPlanUncheckedCreateWithoutPlanInput>
  }

  export type TenantPlanUpdateWithWhereUniqueWithoutPlanInput = {
    where: TenantPlanWhereUniqueInput
    data: XOR<TenantPlanUpdateWithoutPlanInput, TenantPlanUncheckedUpdateWithoutPlanInput>
  }

  export type TenantPlanUpdateManyWithWhereWithoutPlanInput = {
    where: TenantPlanScalarWhereInput
    data: XOR<TenantPlanUpdateManyMutationInput, TenantPlanUncheckedUpdateManyWithoutTenantPlansInput>
  }

  export type TenantCreateWithoutTenantPlansInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    modules?: TenantModuleCreateNestedManyWithoutTenantInput
    usageSnapshots?: TenantUsageSnapshotCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutTenantPlansInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    modules?: TenantModuleUncheckedCreateNestedManyWithoutTenantInput
    usageSnapshots?: TenantUsageSnapshotUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutTenantPlansInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutTenantPlansInput, TenantUncheckedCreateWithoutTenantPlansInput>
  }

  export type ServicePlanCreateWithoutTenantPlansInput = {
    id?: string
    name: string
    code: string
    posType: PosType
    description?: string | null
    featureHighlights?: ServicePlanCreatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanCreateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: number
    annualPriceCents?: number
    currency?: string
    defaultBillingCycle?: BillingCycle
    trialPeriodDays?: number
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServicePlanUncheckedCreateWithoutTenantPlansInput = {
    id?: string
    name: string
    code: string
    posType: PosType
    description?: string | null
    featureHighlights?: ServicePlanCreatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanCreateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: number
    annualPriceCents?: number
    currency?: string
    defaultBillingCycle?: BillingCycle
    trialPeriodDays?: number
    isFeatured?: boolean
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ServicePlanCreateOrConnectWithoutTenantPlansInput = {
    where: ServicePlanWhereUniqueInput
    create: XOR<ServicePlanCreateWithoutTenantPlansInput, ServicePlanUncheckedCreateWithoutTenantPlansInput>
  }

  export type TenantUpsertWithoutTenantPlansInput = {
    update: XOR<TenantUpdateWithoutTenantPlansInput, TenantUncheckedUpdateWithoutTenantPlansInput>
    create: XOR<TenantCreateWithoutTenantPlansInput, TenantUncheckedCreateWithoutTenantPlansInput>
  }

  export type TenantUpdateWithoutTenantPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: TenantModuleUpdateManyWithoutTenantNestedInput
    usageSnapshots?: TenantUsageSnapshotUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutTenantPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    modules?: TenantModuleUncheckedUpdateManyWithoutTenantNestedInput
    usageSnapshots?: TenantUsageSnapshotUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type ServicePlanUpsertWithoutTenantPlansInput = {
    update: XOR<ServicePlanUpdateWithoutTenantPlansInput, ServicePlanUncheckedUpdateWithoutTenantPlansInput>
    create: XOR<ServicePlanCreateWithoutTenantPlansInput, ServicePlanUncheckedCreateWithoutTenantPlansInput>
  }

  export type ServicePlanUpdateWithoutTenantPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    featureHighlights?: ServicePlanUpdatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanUpdateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: IntFieldUpdateOperationsInput | number
    annualPriceCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    defaultBillingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    trialPeriodDays?: IntFieldUpdateOperationsInput | number
    isFeatured?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServicePlanUncheckedUpdateWithoutTenantPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    description?: NullableStringFieldUpdateOperationsInput | string | null
    featureHighlights?: ServicePlanUpdatefeatureHighlightsInput | Enumerable<string>
    allowedModules?: ServicePlanUpdateallowedModulesInput | Enumerable<string>
    monthlyPriceCents?: IntFieldUpdateOperationsInput | number
    annualPriceCents?: IntFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    defaultBillingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    trialPeriodDays?: IntFieldUpdateOperationsInput | number
    isFeatured?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateWithoutModulesInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    tenantPlans?: TenantPlanCreateNestedManyWithoutTenantInput
    usageSnapshots?: TenantUsageSnapshotCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutModulesInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    tenantPlans?: TenantPlanUncheckedCreateNestedManyWithoutTenantInput
    usageSnapshots?: TenantUsageSnapshotUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutModulesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutModulesInput, TenantUncheckedCreateWithoutModulesInput>
  }

  export type TenantUpsertWithoutModulesInput = {
    update: XOR<TenantUpdateWithoutModulesInput, TenantUncheckedUpdateWithoutModulesInput>
    create: XOR<TenantCreateWithoutModulesInput, TenantUncheckedCreateWithoutModulesInput>
  }

  export type TenantUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tenantPlans?: TenantPlanUpdateManyWithoutTenantNestedInput
    usageSnapshots?: TenantUsageSnapshotUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tenantPlans?: TenantPlanUncheckedUpdateManyWithoutTenantNestedInput
    usageSnapshots?: TenantUsageSnapshotUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutUsageSnapshotsInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    tenantPlans?: TenantPlanCreateNestedManyWithoutTenantInput
    modules?: TenantModuleCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsageSnapshotsInput = {
    id?: string
    name: string
    email: string
    dbName: string
    dbUser: string
    dbPassword: string
    createdAt?: Date | string
    updatedAt?: Date | string
    restaurantId: string
    useRedis?: boolean
    posType?: PosType
    status?: TenantStatus
    country?: string | null
    city?: string | null
    timezone?: string | null
    contactName?: string | null
    contactPhone?: string | null
    billingEmail?: string | null
    onboardingCompleted?: boolean
    lastSeenAt?: Date | string | null
    notes?: string | null
    tenantPlans?: TenantPlanUncheckedCreateNestedManyWithoutTenantInput
    modules?: TenantModuleUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsageSnapshotsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsageSnapshotsInput, TenantUncheckedCreateWithoutUsageSnapshotsInput>
  }

  export type TenantUpsertWithoutUsageSnapshotsInput = {
    update: XOR<TenantUpdateWithoutUsageSnapshotsInput, TenantUncheckedUpdateWithoutUsageSnapshotsInput>
    create: XOR<TenantCreateWithoutUsageSnapshotsInput, TenantUncheckedCreateWithoutUsageSnapshotsInput>
  }

  export type TenantUpdateWithoutUsageSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tenantPlans?: TenantPlanUpdateManyWithoutTenantNestedInput
    modules?: TenantModuleUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsageSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPassword?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantId?: StringFieldUpdateOperationsInput | string
    useRedis?: BoolFieldUpdateOperationsInput | boolean
    posType?: EnumPosTypeFieldUpdateOperationsInput | PosType
    status?: EnumTenantStatusFieldUpdateOperationsInput | TenantStatus
    country?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    billingEmail?: NullableStringFieldUpdateOperationsInput | string | null
    onboardingCompleted?: BoolFieldUpdateOperationsInput | boolean
    lastSeenAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    tenantPlans?: TenantPlanUncheckedUpdateManyWithoutTenantNestedInput
    modules?: TenantModuleUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type AdminRefreshTokenCreateWithoutAdminInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type AdminRefreshTokenUncheckedCreateWithoutAdminInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type AdminRefreshTokenCreateOrConnectWithoutAdminInput = {
    where: AdminRefreshTokenWhereUniqueInput
    create: XOR<AdminRefreshTokenCreateWithoutAdminInput, AdminRefreshTokenUncheckedCreateWithoutAdminInput>
  }

  export type AdminRefreshTokenCreateManyAdminInputEnvelope = {
    data: Enumerable<AdminRefreshTokenCreateManyAdminInput>
    skipDuplicates?: boolean
  }

  export type AdminAuditLogCreateWithoutAdminInput = {
    id?: string
    action: string
    targetType: string
    targetId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminAuditLogUncheckedCreateWithoutAdminInput = {
    id?: string
    action: string
    targetType: string
    targetId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminAuditLogCreateOrConnectWithoutAdminInput = {
    where: AdminAuditLogWhereUniqueInput
    create: XOR<AdminAuditLogCreateWithoutAdminInput, AdminAuditLogUncheckedCreateWithoutAdminInput>
  }

  export type AdminAuditLogCreateManyAdminInputEnvelope = {
    data: Enumerable<AdminAuditLogCreateManyAdminInput>
    skipDuplicates?: boolean
  }

  export type AdminRefreshTokenUpsertWithWhereUniqueWithoutAdminInput = {
    where: AdminRefreshTokenWhereUniqueInput
    update: XOR<AdminRefreshTokenUpdateWithoutAdminInput, AdminRefreshTokenUncheckedUpdateWithoutAdminInput>
    create: XOR<AdminRefreshTokenCreateWithoutAdminInput, AdminRefreshTokenUncheckedCreateWithoutAdminInput>
  }

  export type AdminRefreshTokenUpdateWithWhereUniqueWithoutAdminInput = {
    where: AdminRefreshTokenWhereUniqueInput
    data: XOR<AdminRefreshTokenUpdateWithoutAdminInput, AdminRefreshTokenUncheckedUpdateWithoutAdminInput>
  }

  export type AdminRefreshTokenUpdateManyWithWhereWithoutAdminInput = {
    where: AdminRefreshTokenScalarWhereInput
    data: XOR<AdminRefreshTokenUpdateManyMutationInput, AdminRefreshTokenUncheckedUpdateManyWithoutRefreshTokensInput>
  }

  export type AdminRefreshTokenScalarWhereInput = {
    AND?: Enumerable<AdminRefreshTokenScalarWhereInput>
    OR?: Enumerable<AdminRefreshTokenScalarWhereInput>
    NOT?: Enumerable<AdminRefreshTokenScalarWhereInput>
    id?: StringFilter | string
    adminId?: StringFilter | string
    token?: StringFilter | string
    expiresAt?: DateTimeFilter | Date | string
    createdAt?: DateTimeFilter | Date | string
    revokedAt?: DateTimeNullableFilter | Date | string | null
  }

  export type AdminAuditLogUpsertWithWhereUniqueWithoutAdminInput = {
    where: AdminAuditLogWhereUniqueInput
    update: XOR<AdminAuditLogUpdateWithoutAdminInput, AdminAuditLogUncheckedUpdateWithoutAdminInput>
    create: XOR<AdminAuditLogCreateWithoutAdminInput, AdminAuditLogUncheckedCreateWithoutAdminInput>
  }

  export type AdminAuditLogUpdateWithWhereUniqueWithoutAdminInput = {
    where: AdminAuditLogWhereUniqueInput
    data: XOR<AdminAuditLogUpdateWithoutAdminInput, AdminAuditLogUncheckedUpdateWithoutAdminInput>
  }

  export type AdminAuditLogUpdateManyWithWhereWithoutAdminInput = {
    where: AdminAuditLogScalarWhereInput
    data: XOR<AdminAuditLogUpdateManyMutationInput, AdminAuditLogUncheckedUpdateManyWithoutAuditLogsInput>
  }

  export type AdminAuditLogScalarWhereInput = {
    AND?: Enumerable<AdminAuditLogScalarWhereInput>
    OR?: Enumerable<AdminAuditLogScalarWhereInput>
    NOT?: Enumerable<AdminAuditLogScalarWhereInput>
    id?: StringFilter | string
    adminId?: StringNullableFilter | string | null
    action?: StringFilter | string
    targetType?: StringFilter | string
    targetId?: StringNullableFilter | string | null
    metadata?: JsonNullableFilter
    createdAt?: DateTimeFilter | Date | string
  }

  export type AdminUserCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: AdminRole
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: AdminAuditLogCreateNestedManyWithoutAdminInput
  }

  export type AdminUserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: AdminRole
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    auditLogs?: AdminAuditLogUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AdminUserCreateOrConnectWithoutRefreshTokensInput = {
    where: AdminUserWhereUniqueInput
    create: XOR<AdminUserCreateWithoutRefreshTokensInput, AdminUserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type AdminUserUpsertWithoutRefreshTokensInput = {
    update: XOR<AdminUserUpdateWithoutRefreshTokensInput, AdminUserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<AdminUserCreateWithoutRefreshTokensInput, AdminUserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type AdminUserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: AdminAuditLogUpdateManyWithoutAdminNestedInput
  }

  export type AdminUserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    auditLogs?: AdminAuditLogUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type AdminUserCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: AdminRole
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: AdminRefreshTokenCreateNestedManyWithoutAdminInput
  }

  export type AdminUserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    passwordHash: string
    name?: string | null
    role?: AdminRole
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    refreshTokens?: AdminRefreshTokenUncheckedCreateNestedManyWithoutAdminInput
  }

  export type AdminUserCreateOrConnectWithoutAuditLogsInput = {
    where: AdminUserWhereUniqueInput
    create: XOR<AdminUserCreateWithoutAuditLogsInput, AdminUserUncheckedCreateWithoutAuditLogsInput>
  }

  export type AdminUserUpsertWithoutAuditLogsInput = {
    update: XOR<AdminUserUpdateWithoutAuditLogsInput, AdminUserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<AdminUserCreateWithoutAuditLogsInput, AdminUserUncheckedCreateWithoutAuditLogsInput>
  }

  export type AdminUserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: AdminRefreshTokenUpdateManyWithoutAdminNestedInput
  }

  export type AdminUserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumAdminRoleFieldUpdateOperationsInput | AdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    refreshTokens?: AdminRefreshTokenUncheckedUpdateManyWithoutAdminNestedInput
  }

  export type TenantPlanCreateManyTenantInput = {
    id?: string
    planId: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantModuleCreateManyTenantInput = {
    id?: string
    moduleKey: string
    moduleName?: string | null
    status?: TenantModuleStatus
    assignedAt?: Date | string
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
  }

  export type TenantUsageSnapshotCreateManyTenantInput = {
    id?: string
    snapshotDate: Date | string
    metricType: UsageMetricType
    value?: number
    currency?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantPlanUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: ServicePlanUpdateOneRequiredWithoutTenantPlansNestedInput
  }

  export type TenantPlanUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantPlanUncheckedUpdateManyWithoutTenantPlansInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantModuleUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleKey?: StringFieldUpdateOperationsInput | string
    moduleName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantModuleStatusFieldUpdateOperationsInput | TenantModuleStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantModuleUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleKey?: StringFieldUpdateOperationsInput | string
    moduleName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantModuleStatusFieldUpdateOperationsInput | TenantModuleStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantModuleUncheckedUpdateManyWithoutModulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleKey?: StringFieldUpdateOperationsInput | string
    moduleName?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumTenantModuleStatusFieldUpdateOperationsInput | TenantModuleStatus
    assignedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUsageSnapshotUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | UsageMetricType
    value?: IntFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | UsageMetricType
    value?: IntFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantUsageSnapshotUncheckedUpdateManyWithoutUsageSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    metricType?: EnumUsageMetricTypeFieldUpdateOperationsInput | UsageMetricType
    value?: IntFieldUpdateOperationsInput | number
    currency?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantPlanCreateManyPlanInput = {
    id?: string
    tenantId: string
    status?: TenantPlanStatus
    billingCycle?: BillingCycle
    startDate?: Date | string
    endDate?: Date | string | null
    renewalDate?: Date | string | null
    monthlyRevenueCents?: number
    totalRevenueCents?: number
    transactionsCount?: number
    lastActive?: Date | string | null
    allowedModulesSnapshot?: TenantPlanCreateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantPlanUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutTenantPlansNestedInput
  }

  export type TenantPlanUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    status?: EnumTenantPlanStatusFieldUpdateOperationsInput | TenantPlanStatus
    billingCycle?: EnumBillingCycleFieldUpdateOperationsInput | BillingCycle
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    renewalDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyRevenueCents?: IntFieldUpdateOperationsInput | number
    totalRevenueCents?: IntFieldUpdateOperationsInput | number
    transactionsCount?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    allowedModulesSnapshot?: TenantPlanUpdateallowedModulesSnapshotInput | Enumerable<string>
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminRefreshTokenCreateManyAdminInput = {
    id?: string
    token: string
    expiresAt: Date | string
    createdAt?: Date | string
    revokedAt?: Date | string | null
  }

  export type AdminAuditLogCreateManyAdminInput = {
    id?: string
    action: string
    targetType: string
    targetId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AdminRefreshTokenUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminRefreshTokenUncheckedUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminRefreshTokenUncheckedUpdateManyWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AdminAuditLogUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogUncheckedUpdateWithoutAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminAuditLogUncheckedUpdateManyWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
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