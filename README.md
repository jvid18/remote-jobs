# Remote Jobs

Technical challenge submission for Redarbor — React Native Developer.

Remote job listing app with search, detail view, and favorites, powered by the [Remotive public API](https://remotive.com/api/remote-jobs).

**Stack:** Expo 52 · React Native · TypeScript · Expo Router · Zustand · SWR

Zustand manages favorites state (persisted via AsyncStorage). SWR handles all remote data fetching — the built-in caching, automatic retry, and background revalidation made it a better fit for that layer than a manual Zustand store would have been.

---

## Running locally

```bash
pnpm install
pnpm start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan the QR with Expo Go.

I used [pnpm](https://pnpm.io/installation) throughout the project — mainly for the security guarantees it gives around lifecycle scripts. npm or yarn should work too, just know you'd be bypassing the lockfile.

---

## Preview via Expo Go

> **SDK 52 only.** Expo Go is version-locked — if your installed version targets SDK 53 or 54 this won't load. Check by opening Expo Go → Profile and looking for the SDK version. If it doesn't say 52, you have two options:
> - Install [Expo Go for SDK 52 (Android)](https://expo.dev/go?sdkVersion=52&platform=android&device=true) directly.
> - Or run locally with `pnpm start` — no Expo Go version constraint applies.

<p align="center">
  <a href="exp://u.expo.dev/235cc82d-96e8-4efc-b23d-98ebfc4e33ac?channel-name=preview">
    <img
      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=exp%3A%2F%2Fu.expo.dev%2F235cc82d-96e8-4efc-b23d-98ebfc4e33ac%3Fchannel-name%3Dpreview"
      alt="Open in Expo Go"
      width="160"
    />
  </a>
</p>

Scan from inside the Expo Go app.

---

## Structure

```
src/
  app/          # Expo Router routes
  modules/
    jobs/       # listing, detail, search, filters
    favorites/  # favorites persisted with AsyncStorage
  shared/       # theme, shared components, common hooks
docs/
  adr/          # architecture decision records
```

---

## Architecture decisions

| Decision                                  | Doc                                            |
| ----------------------------------------- | ---------------------------------------------- |
| Result pattern for error handling   | [ADR-001](docs/adr/001-result-pattern.md)      |
| Agnostic domain and anti-corruption layer | [ADR-002](docs/adr/002-agnostic-domain.md)     |
| Filter intermediary                       | [ADR-003](docs/adr/003-filter-intermediary.md) |
| General structure and architecture        | [ARCHITECTURE.md](docs/ARCHITECTURE.md)        |

---

## Note: Android 16KB page size warning

Native Android builds may show a 16 KB memory page alignment warning. This is a known issue in React Native 0.76 / Expo SDK 52. The project uses Expo SDK 52 because it is a requirement of the technical assessment. Newer Expo SDK versions address this limitation, but upgrading is outside the scope of the exercise.
