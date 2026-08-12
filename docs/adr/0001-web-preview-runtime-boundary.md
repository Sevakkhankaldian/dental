# ADR-0001: Keep the preview runtime outside the core clinical boundary

- Status: Accepted; API boundary implemented by ADR-0002
- Date: 2026-08-12
- Requirement references: Sections 5.1, 16.1, 23.2

## Context

The workspace was initialized with a Next-compatible Vinext web runtime to make the Persian clinician experience immediately executable and previewable. The normative architecture requires a Next.js doctor portal and a separate NestJS modular-monolith core API backed by PostgreSQL.

## Decision

Use the current Vinext application only as the doctor-web interaction preview and a thin foundation health surface. Domain authorization code remains framework-independent under `packages/domain`. PostgreSQL remains the system-of-record choice in the migration and local stack. This preview does not replace or redefine the required NestJS core API.

The NestJS API now lives in `apps/api`; PostgreSQL identity/session/audit adapters and the canonical health contract sit behind it. Clinical-looking UI data remains deterministic and synthetic until each surface is connected through a separately reviewed vertical slice.

## Consequences

- The first clinician workflow can be reviewed without claiming that clinical persistence exists.
- No D1 schema is introduced, avoiding an unrecorded database substitution.
- Hosting the preview is permitted only as a private demonstration; it is not a clinical environment.
- PostgreSQL identity integration, audit hash chaining and tenant RLS tests are implemented. OIDC staff identity and clinical repository connection remain blocking work.
