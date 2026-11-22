# Feature designs and implementation plans

This directory holds self-contained design specifications and implementation plans for Digital Card Shop. **Some documents are historical records of a completed implementation** and deliberately retain original assumptions. For current product and code behavior, consult [the architecture](../ARCHITECTURE.md), [the product brief](../PRODUCT_BRIEF.md) and [the city postcard publishing guide](../CITY_POSTCARDS.md). Each document should explain the feature's purpose, intended user experience, scope, key decisions, acceptance criteria, and any important constraints. A reader should not need a development conversation to understand it.

Prefer descriptive filenames based on the feature and document role:

- `sunshine-experience-design.md`
- `sunshine-experience-implementation.md`

Use dates in filenames only for genuinely chronological records, such as a dated incident report, release note, migration plan or meeting record. Do not automatically add creation/revision dates to living specifications.

When an implementation plan is superseded, add a concise status note at the top linking to current documentation. Do not silently rewrite historical assumptions as if they were originally true. Design documents define intended behavior; implementation plans identify code boundaries and verification. Where a design changes, update the specification to describe the coherent current decision, adding history only if it affects implementation or migration.
