# AGENTS.md

Conventions and their rationale live in `docs/` — read them before changing code, don't restate them here.

- Architecture, folder layout, type design in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Decisions in [docs/adr/](docs/adr/README.md)

## Gotchas (non-obvious, easy to get wrong)

- **Expo SDK 52** changed APIs across versions. Use the versioned docs at https://docs.expo.dev/versions/v52.0.0/ — not the generic/latest Expo guides.
- **pnpm** is the package manager. Never `npm` or `yarn`.
