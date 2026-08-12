# DentaMonitor Iran

Foundation and clinician-web preview for a Persian-first, multi-tenant orthodontic remote-monitoring platform. The normative product and engineering baseline is `DENTAMONITOR_IRAN_MASTER_BUILD_SPEC.md` v1.0.0.

## Current scope

- Responsive Persian RTL clinician dashboard with a synthetic review workflow.
- Explicit human sign-off flow; no patient receives raw or unsigned AI output.
- Framework-independent `TenantContext` boundary with negative isolation tests.
- Append-only audit event model with PHI-key safeguards.
- PostgreSQL 16 foundation migration for organizations, clinics, users and memberships.
- Deterministic synthetic seed (`20260812`).
- OpenAPI 3.1 health contract and `/api/v1/health` route.
- Local PostgreSQL, Redis, MinIO and Temporal dependencies through Docker Compose.

This is not clinical software, a diagnostic system, or a production release. Every visible person and record is fictional. The mock model has zero clinical claims.

## Local setup

Prerequisites: Node.js 22.13+, npm and Docker Compose.

```bash
npm ci
npm run dev
```

Optional foundation dependencies:

```bash
docker compose up -d
```

## Verification

```bash
npm run test:domain
npm run build
node --test tests/rendered-html.test.mjs
```

## Governance artifacts

- Traceability: `docs/requirements-traceability.md`
- Architecture decision: `docs/adr/0001-web-preview-runtime-boundary.md`
- Local runbook: `docs/runbooks/local-foundation.md`
- API contract: `packages/contracts/openapi/openapi.yaml`

## Next dependency-safe slice

Create the NestJS modular-monolith core API, wire PostgreSQL repositories behind `TenantContext`, add OIDC staff identity, implement transactional audit/outbox persistence and prove tenant isolation with PostgreSQL integration tests before adding patient or scan records.
