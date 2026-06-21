# ADR-003: Env-Gated Client-Side Filter Intermediary

**Status:** Accepted

## Context

The challenge requires filtering jobs by search text (title + company), category, and job
type. The Remotive API documents querystring parameters for these (`search`, `category`,
`company_name`), but in practice the filtering is unreliable — results do not consistently
honor the parameters. The dataset, however, is small (the endpoint returns all active
listings, and the active set is modest).

Filtering must work today, without betting on the API, while leaving room to switch if Remotive
fixes its filtering later. A second concern: avoiding a subtle trap:
introducing a second cache layer in front of SWR, which would create two sources of truth and
the classic stale/duplicated-cache problems.

## Decision

Introduce a **filter intermediary** controlled by an environment variable
`EXPO_PUBLIC_CLIENT_SIDE_FILTERS`.

- **`true` (default):** the repository fetches the **full** job list once; a pure function
  (`client-filter.ts`) applies search, category, and type in memory. Because the dataset is
  small, fetching everything is not a performance concern.
- **`false`:** the repository forwards filters as querystring parameters to the API — the
  path we switch to when/if the API filtering is fixed.

**Caching: exactly one cache.** SWR owns the only cache. The full dataset is cached under a
single stable key (`['jobs','all']`). The `useJobs(query)` hook reads that cached array and
runs `client-filter` over it (memoized). The filter layer holds **no state and no cache** — it
derives results on read.

This is deliberate: the temptation is to cache filtered results, but that fragments the cache
(one entry per query), thrashes on every keystroke, and duplicates state SWR already holds.
Deriving on read keeps a single source of truth and makes search instant (no refetch).

## Consequences

- **Works regardless of API behavior.** Filtering is correct today because it runs client-side.
- **Removable.** The intermediary is a flag flip away from being bypassed. When the API is
  fixed, set the flag to `false`; the repository sends params and uses per-filter SWR keys. The
  `useJobs` hook signature is unchanged either way — UI is agnostic to where filtering happens.
- **No double cache.** One SWR entry holds the raw list; filters are a pure derivation. No
  stale-filtered-cache class of bugs.
- **Instant search.** Typing filters the in-memory list with zero network calls and zero new
  cache keys.
- **Trade-off — full fetch.** The `true` path always pulls the whole list. Acceptable given the
  small dataset; would need revisiting (server-side filtering, pagination) if the dataset grew
  large — which is exactly the scenario the `false` path is staged for.
- **Testability.** `client-filter` is a pure function → unit-tested directly; integration tests
  exercise it through the hook by mocking the HTTP boundary.
