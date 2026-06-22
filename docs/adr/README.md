# Decision Log

One line per decision. The **why**, alternatives and tradeoffs live in each ADR — open the file, don't duplicate it here.

| ADR                                 | Decision                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| [001](./001-result-pattern.md)      | Expected failures return `Result<T, E>` instead of throwing; only bugs throw.          |
| [002](./002-agnostic-domain.md)     | Domain types are API-agnostic; adapters in each slice's `infra/` map the external API. |
| [003](./003-filter-intermediary.md) | Filtering goes through an env-gated intermediary, client-side by default.              |
