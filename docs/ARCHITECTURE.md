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

Illustrative, not exhaustive — every slice follows the same `domain / infra / hooks / ui` shape, so the tree shows the pattern rather than every file.

```
src/
├── app/                 # Expo Router shells — routing only, no logic
│   ├── (tabs)/          # Jobs list + Favorites tabs
│   ├── jobs/[id].tsx    # Job detail
│   └── +not-found.tsx
├── modules/             # Vertical slices, one folder per feature
│   ├── jobs/            # Browse + detail
│   │   ├── job.ts           # Domain types
│   │   ├── job-catalog.ts   # Gateway contract
│   │   ├── infra/           # Adapters: HTTP + API→domain mapping + cache keys
│   │   ├── hooks/           # SWR-backed read models
│   │   └── ui/
│   └── favorites/      # Saved jobs (Zustand store + AsyncStorage)
└── shared/             # Cross-cutting: config, http, lib, theme, ui, hooks, result.ts
```

---

## State & Data

- **Server data**: SWR owns the cache, keyed by query. Slices expose hooks that return discriminated UI states (`loading | error | empty | ready`) instead of raw promises; the detail screen reads the same cache entry as the list.
- **Local persistence**: favorites live in a Zustand store backed by AsyncStorage, stored as self-contained snapshots so a saved job survives even if it later drops off the API.

---

## Architectural Principles

- **Vertical slices**: each module (`jobs`, `favorites`, …) owns its types, contracts, implementations, and UI — no cross-module imports
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
type PersonPoster = { type: 'person'; name: string }
type CompanyPoster = { type: 'company'; name: string; companyName: string }
type Poster = PersonPoster | CompanyPoster
```

Accessing `companyName` on a `PersonPoster` is now a compile-time error. Chained optional access (`foo?.bar?.baz`) on a domain type is a signal the type is wrong.

### Errors as part of the contract

Domain operations do not throw for expected failures — they return `Result<T, E>`. Every possible failure is named and typed; callers handle each case explicitly or the compiler complains.

See [ADR-001](./adr/001-result-pattern.md) for the full pattern and rationale.

### External libraries at the boundary

Third-party code throws, returns `null`, and follows its own conventions. Wrap it at the entry point so domain code never deals with it directly — adapters (in each slice's `infra/`) translate external shapes into domain types before they cross the boundary.

See [ADR-002](./adr/002-agnostic-domain.md) for the agnostic-domain / anti-corruption layer, and [ADR-003](./adr/003-filter-intermediary.md) for the env-gated client-side filter.

---

## Path Alias

`@/*` → `src/*`

```ts
import { Colors } from '@/shared/constants/colors'
import { JobCard } from '@/modules/jobs/ui/job-card'
```
