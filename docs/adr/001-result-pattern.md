# ADR-001: Result Pattern for Error Handling

**Status:** Accepted

## Context

Coming from languages like Go and, especially, Rust, throwing an exception never feels natural, it feels like the code breaking. But an error is not a break: it is a response, a natural part of the flow. Making that explicit is verbose, yes, but the tradeoff is that every time you call something you know exactly what can come out of it, including the problems.

An incorrect operation becomes inexpressible. That is what gives the code reliability.

Exceptions do not disappear with this approach, they keep existing, but they can be treated as what they actually are: exceptional cases. True programmer errors, not expected domain outcomes.

There is another problem with the traditional `try/catch` model in TypeScript: inside a `catch`, the error is `unknown`. There is no way to know what it is without reading the implementation or looking elsewhere. You end up validating manually with `instanceof` or similar checks, which leaks implementation details into the caller. The contract is invisible.

The tradeoff with external libraries is real — wrapping them adds a layer of work. But that layer is also a boundary: it forces explicit adapters between unmanaged external code and the domain, which isolates third-party concerns and makes future changes easier to contain.

## Decision

Use a discriminated union `Result<T, E>` for all domain and gateway operations that can fail in expected ways. Unrecoverable errors (programmer mistakes, null pointer, etc.) still throw.

Domain errors use `AppError<C, D>` — a structured error with a typed code and typed detail per code, without a free-form `message`. Presentation layers decide how to surface errors to users.

### Primitives (`src/shared/result.ts`)

```ts
type Ok<T> = { ok: true; value: T }
type Err<E> = { ok: false; error: E }
export type Result<T, E> = Ok<T> | Err<E>

export type NoDetail = Record<string, never>
export type ErrorDetail = Record<string, unknown>

export type AppError<C extends string, D extends ErrorDetail = NoDetail> = {
  code: C
  detail: D
  cause?: unknown
}

// Constrained alias for domain use — enforces AppError as the error type
export type DomainResult<T, E extends AppError<string, ErrorDetail>> = Result<T, E>

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value })
export const err = <E>(error: E): Err<E> => ({ ok: false, error })
export const appError = <C extends string, D extends ErrorDetail>(
  code: C,
  detail: D,
  cause?: unknown,
): AppError<C, D> => ({ code, detail, cause })
```

### Error definition per module (`src/modules/jobs/job-errors.ts`)

```ts
import type { AppError, NoDetail } from '@/shared/result'

export const JOB_ERRORS = {
  NETWORK:      'job_network',
  BAD_RESPONSE: 'job_bad_response',
  NOT_FOUND:    'job_not_found',
} as const

// Maps each code to its detail shape. The computed keys
// (`[JOB_ERRORS.X]`) keep code strings and map entries in sync.
type JobErrorMap = {
  [JOB_ERRORS.NETWORK]:      NoDetail
  [JOB_ERRORS.BAD_RESPONSE]: NoDetail
  [JOB_ERRORS.NOT_FOUND]:    { id: string }
}

export type JobError = {
  [K in keyof JobErrorMap]: AppError<K, JobErrorMap[K]>
}[keyof JobErrorMap]
```

`JobError` is derived from `JobErrorMap`: it distributes over every key to build one `AppError` per code, then unions them. Each variant carries its own typed `detail`, so narrowing on `code` narrows `detail` too.

To check at compile time that every code has a detail entry, assert it with a conditional type:

```ts
type JobErrorCode = (typeof JOB_ERRORS)[keyof typeof JOB_ERRORS]

// errors at compile time if a code is missing from JobErrorMap
type _AssertComplete = JobErrorCode extends keyof JobErrorMap ? true : never
```

### Usage at the call site

```ts
const result = await fetchJob(id)
if (!result.ok) {
  switch (result.error.code) {
    case JOB_ERRORS.NETWORK:
    case JOB_ERRORS.BAD_RESPONSE:
      // result.error.detail is NoDetail
      break
    case JOB_ERRORS.NOT_FOUND:
      // result.error.detail.id is string
      break
  }
  return
}
// use result.value
```

## Consequences

- Callers are forced by the type system to handle the failure branch before accessing `.value`.
- `JobError` is derived from the map, so each code carries its own typed detail and `switch` on `code` narrows `detail`.
- No `message` field — domain errors are codes + structured data. Presentation is a separate concern.
- `cause?: unknown` mirrors `Error.cause` from JS, allowing internal errors to propagate without over-constraining the type.
- `Result<T, E>` stays a generic primitive; `DomainResult<T, E>` constrains `E` to `AppError` for domain boundaries.
- `appError()` helper avoids verbose object construction at call sites.
- Not appropriate for truly unexpected errors (network timeout at OS level, OOM) — those remain thrown exceptions caught at the UI boundary.
