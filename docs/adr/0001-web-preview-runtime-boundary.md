# ADR-0001: Keep the preview runtime outside the core clinical boundary

- Status: Accepted for foundation preview
- Date: 2026-08-12
- Requirement references: Sections 5.1, 16.1, 23.2

## Context

The workspace was initialized with a Next-compatible Vinext web runtime to make the Persian clinician experience immediately executable and previewable. The normative architecture requires a Next.js doctor portal and a separate NestJS modular-monolith core API backed by PostgreSQL.

## Decision

Use the current Vinext application only as the doctor-web interaction preview and a thin foundation health surface. Domain authorization code remains framework-independent under `packages/domain`. PostgreSQL remains the system-of-record choice in the migration and local stack. This preview does not replace or redefine the required NestJS core API.

The next foundation step will create `apps/api` using NestJS and move the health contract and persistence adapters behind it. Until that succeeds, all clinical-looking UI data remains deterministic, synthetic, local and explicitly marked as non-clinical.

## Consequences

- The first clinician workflow can be reviewed without claiming that clinical persistence exists.
- No D1 schema is introduced, avoiding an unrecorded database substitution.
- Hosting the preview is permitted only as a private demonstration; it is not a clinical environment.
- PostgreSQL integration, OIDC staff identity, audit integrity chaining and tenant repository tests remain blocking work.
