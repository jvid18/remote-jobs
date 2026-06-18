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

## Path Alias

`@/*` → `src/*`

```ts
import { Colors } from '@/shared/constants/colors'
import { JobCard } from '@/modules/jobs/ui/job-card'
```
