# ADR-002: Agnostic Domain and Anti-Corruption Layer

**Status:** Accepted

## Context

The app consumes the Remotive public API, **an external service we do not own**, cannot version,
and cannot change. Its payload shape (snake_case fields, optional-and-often-empty `job_type`,
free-form `salary` text, and a raw **HTML** `description`) reflects its concerns, not ours. If
those shapes leak into the UI, every provider quirk becomes a UI dependency: a renamed field, a
changed enum value, or a new HTML tag would ripple through screens.

Two risks are specific to this API:

1. **Coupling to an uncontrolled contract.** Optional fields and loose enums invite defensive
   `?.` chains and runtime guards scattered across the UI.
2. **Untrusted HTML.** `description` is HTML authored by third parties. Rendering it by trust —
   via WebView or a generic HTML renderer fed the raw string — is an injection surface. The API
   has no reason to know how, or whether, our UI renders its content.

Normally the API should not know about the UI. The corollary: the UI should not know about the
API.

## Decision

Model the domain independently of the API and place an **anti-corruption layer** (adapters) at
the boundary. Raw payloads are mapped to domain types before they cross into the application;
domain types have no knowledge of Remotive.

- Domain types (like `Job` or `Category`) express our needs: explicit
  `null` over implicit absence, discriminated unions over flag+optional combinations, no
  snake_case, no provider field names.
- The adapter is a **pure function** `raw` to `Result<Job, JobError>` (or drops malformed records),
  making it exhaustively unit-testable against captured real responses.
- The HTML `description` is **not** carried as a string. The adapter parses it into a
  **whitelisted AST** (`DescriptionAst`): an allowlist of node types (paragraph, heading,
  list, strong, emphasis, link, text). Unknown tags are dropped; only `href` attributes
  survive and only with `http(s)` schemes; entities are decoded safely; nesting depth is
  capped. The UI renders the AST with native components and full styling control.

The AST is the intermediate representation between API and UI: the API hands us untrusted
markup, the boundary turns it into safe, structured data, and the UI decides presentation.

## Consequences

- **Provider isolation.** Swapping or upgrading the API touches only the adapter. Screens,
  hooks, and the store are unaffected as long as the domain contract holds.
- **Security by construction.** The UI can only render node types defined. There is no path
  for `<script>`, `javascript:` URLs, inline styles, or arbitrary tags to reach the renderer —
  they never make it past the parser. No blind trust in external content.
- **Testability.** Pure adapter + pure parser → deterministic unit tests with real payloads;
  these also validate the security rules (dropped nodes, rejected links).
- **No defensive UI.** Optionality and variant handling are resolved once, at the boundary, in
  the type system — not `?.` chains in every component.
- **Cost.** Mapping and parsing are extra code versus passing payloads straight through. For an
  uncontrolled, security-sensitive external API this is the boundary's job, not overhead —
  consistent with ADR-001's stance on wrapping external code.
- A heavier alternative (render HTML via WebView or a generic HTML library) was rejected: less
  styling/theming control, larger surface, weaker security guarantees, and poorer fit for
  inline content.
