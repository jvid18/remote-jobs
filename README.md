# Remote Jobs

Browse remote job listings powered by [Remotive](https://remotive.com). Built with Expo (SDK 52) and Expo Router.

## Try it

Scan with **Expo Go** to preview the latest build:

<p align="center">
  <a href="exp://u.expo.dev/235cc82d-96e8-4efc-b23d-98ebfc4e33ac">
    <img
      src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=exp://u.expo.dev/235cc82d-96e8-4efc-b23d-98ebfc4e33ac"
      alt="Open in Expo Go"
      width="160"
    />
  </a>
</p>

Or open directly: [`exp://u.expo.dev/235cc82d-96e8-4efc-b23d-98ebfc4e33ac`](exp://u.expo.dev/235cc82d-96e8-4efc-b23d-98ebfc4e33ac)

EAS dashboard: [remote-jobs @ expo.dev](https://expo.dev/accounts/jvid/projects/remote-jobs/updates/aaf18a5f-5871-4e75-add2-a804cdee45bc)

## Requirements

- Node 20+
- pnpm 11 — see [Why pnpm?](#why-pnpm) below
- Expo Go on your device, or an iOS simulator / Android emulator

## Setup

```bash
# install dependencies
pnpm install

# start the dev server
pnpm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR with Expo Go.

## Why pnpm?

This project uses **pnpm 11**. Two reasons:

1. **Disk efficiency** — pnpm stores packages in a global content-addressable cache and hard-links them into `node_modules`. A clean install on a machine that already has the cache costs almost nothing.

2. **Supply-chain security** — pnpm 11 restricts lifecycle scripts by default. Packages can only run `postinstall` and similar scripts if they are explicitly listed in `pnpm.onlyBuiltDependencies` (in `package.json`) or approved via `pnpm.ignoredBuiltDependencies`. This blocks the most common vector for malicious packages to execute arbitrary code on install. npm and yarn run every package's lifecycle scripts unconditionally.

Do not substitute `npm install` or `yarn` — the lockfile format is incompatible and you will lose the security guarantees above.

## Scripts

| Command | Description |
|---|---|
| `pnpm start` | Start Expo dev server |
| `pnpm android` | Open on Android emulator |
| `pnpm ios` | Open on iOS simulator |
| `pnpm test` | Run Jest test suite |
| `pnpm lint` | Run ESLint |

## Publishing updates

Updates are published via EAS Update:

```bash
eas update --branch main --message "your message"
```

Any device running the app via Expo Go will pick up the update on next launch.
