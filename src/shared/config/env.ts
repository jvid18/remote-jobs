// Expo inlines process.env.EXPO_PUBLIC_* at build time (babel-preset-expo).
// Pure parsers keep the logic unit-testable independently of that inlining.
export function parseApiUrl(raw: string | undefined) {
  return raw ?? 'https://remotive.com/api'
}

// Default ON: client-side filtering is the safe path while API filters are unreliable.
export function parseClientSideFilters(raw: string | undefined) {
  return raw !== 'false'
}

export const env = {
  apiUrl: parseApiUrl(process.env.EXPO_PUBLIC_REMOTIVE_API_URL),
  clientSideFilters: parseClientSideFilters(process.env.EXPO_PUBLIC_CLIENT_SIDE_FILTERS),
} as const
