# AGENTS.md

Conventions and their rationale live in `docs/` — read them before changing code, don't restate them here.

- Architecture, folder layout, type design in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Decisions:
  - [ADR-001 Result pattern](docs/adr/001-result-pattern.md)
  - [ADR-002 Agnostic domain](docs/adr/002-agnostic-domain.md)
  - [ADR-003 Client-side filter](docs/adr/003-filter-intermediary.md)

## Gotchas (non-obvious, easy to get wrong)

- **Expo SDK 52** changed APIs across versions. Use the versioned docs at https://docs.expo.dev/versions/v52.0.0/ — not the generic/latest Expo guides.
- **pnpm** is the package manager. Never `npm` or `yarn`.
