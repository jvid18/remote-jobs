# Architecture — RemoteJobs

## Stack

| Layer           | Choice                                          |
| --------------- | ----------------------------------------------- |
| Framework       | Expo SDK 52 + Expo Router v4                    |
| Language        | TypeScript strict                               |
| Package manager | pnpm (hoisted, secure)                          |
| Linter          | ESLint + eslint-plugin-perfectionist            |
| Formatter       | Prettier                                        |
| Path alias      | `@/*` → `src/*`                                 |
| Env vars        | `EXPO_PUBLIC_*` (public), EAS Secrets (private) |

---

## Folder Structure

```
remotejobs/
├── src/
│   ├── app/                    # Expo Router file-based routing
│   │   ├── _layout.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx
│   │       └── index.tsx       # Jobs list screen
│   ├── assets/                 # Static assets (fonts, images)
│   ├── modules/                # Vertical slices (screaming architecture)
│   │   └── jobs/               # Job browsing feature
│   │       ├── job.ts          # Domain types
│   │       ├── job-catalog.ts  # Gateway contract
│   │       └── ui/
│   └── shared/                 # Cross-cutting concerns
│       ├── ui/                 # Reusable UI components
│       ├── hooks/              # Shared hooks
│       ├── constants/          # App-wide constants
│       └── theme/              # Theme contract + useTheme
├── .env.example
└── .env                        # git-ignored
```

---

## Architectural Principles

- **Vertical slices**: each module (`jobs`, `auth`, …) owns its types, contracts, implementations, and UI — no cross-module imports
- **Dependency flow**: `ui → domain ← infrastructure` — domain has no deps on React or Expo
- **No barrel files**: direct imports, no re-exports via `index.ts`
- **No `enum`**: use `const` objects + derived types
- **src/ boundary**: `app/` only contains routing shells; all logic lives in `src/`
- **kebab-case filenames**: all files use kebab-case (`haptic-tab.tsx`, `use-color-scheme.ts`) — exception: Expo Router files follow its own conventions (`_layout.tsx`, `+not-found.tsx`)

---

## Type Design

If a state cannot be represented by the type, it cannot happen. Constraints belong in types, not in comments or runtime checks.

### Discriminated unions over nullable fields

Avoid optional fields whose validity depends on another field's value. Model each case as its own type.

```ts
// wrong: companyName is only valid when type === 'company', but nothing enforces that
type Poster = {
  type: 'person' | 'company'
  name: string
  companyName?: string
}

// right: each case carries exactly the data it needs
type PersonPoster  = { type: 'person';  name: string }
type CompanyPoster = { type: 'company'; name: string; companyName: string }
type Poster = PersonPoster | CompanyPoster
```

Accessing `companyName` on a `PersonPoster` is now a compile-time error. Chained optional access (`foo?.bar?.baz`) on a domain type is a signal the type is wrong.

### Errors as part of the contract

Domain operations do not throw for expected failures — they return `Result<T, E>`. Every possible failure is named and typed; callers handle each case explicitly or the compiler complains.

See [ADR-001](./adr/001-result-pattern.md) for the full pattern and rationale.

### External libraries at the boundary

Third-party code throws, returns `null`, and follows its own conventions. Wrap it at the entry point so domain code never deals with it directly — adapters translate external shapes into domain types before they cross the boundary.

---

## Path Alias

`@/*` → `src/*`

```ts
import { Colors } from '@/shared/constants/colors'
import { JobCard } from '@/modules/jobs/ui/job-card'
```
