# DentaMonitor Iran

Full multi-surface product preview and security foundation for a Persian-first, multi-tenant orthodontic remote-monitoring platform. The normative product and engineering baseline is `DENTAMONITOR_IRAN_MASTER_BUILD_SPEC.md` v1.0.0.

## Current scope

- Public marketing website at `/`, separated from authenticated product experiences.
- Role access center at `/portals` connecting four independent web dashboards.
- Shared application entry at `/app`, asking patient or doctor before presenting the role-specific login and mobile experience.
- All 28 patient-app flows (`PAT-01` through `PAT-28`) as independent responsive routes under `/patient/*`.
- Fourteen dedicated doctor workflows under `/doctor/*`, separated from clinic operations.
- All 32 clinic modules (`DOC-01` through `DOC-32`) under `/clinic/*`, including team operations, review governance, protocols and management.
- All 16 platform-admin/MLOps consoles (`ADM-01` through `ADM-16`) under `/admin/*`.
- All 10 annotation/data workspaces (`ANN-01` through `ANN-10`) under `/annotation/*`.
- Seven public Engage steps under `/engage/*`, explicitly labeled non-diagnostic and separated from a clinical relationship.
- Responsive Persian RTL design across desktop, tablet and patient-mobile mock presentation.
- Functional synthetic interactions for local patient creation, message drafting, appointment handling, protocol simulation and clinician sign-off.
- Explicit human sign-off flow; no patient receives raw or unsigned AI output.
- Framework-independent `TenantContext` boundary with negative isolation tests.
- Append-only audit event model with PHI-key safeguards.
- PostgreSQL 16 foundation migration for organizations, clinics, users and memberships.
- Deterministic synthetic seed (`20260812`).
- OpenAPI 3.1 health contract and `/api/v1/health` route.
- Local PostgreSQL, Redis, MinIO and Temporal dependencies through Docker Compose.

These interfaces are high-fidelity functional prototypes, not connected product modules. This is not clinical software, a diagnostic system, or a production release. Every visible person and record is fictional. The mock model has zero clinical claims and all high-risk capabilities remain behind explicit safety gates.

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

Create the modular-monolith core API, wire PostgreSQL repositories behind `TenantContext`, add OIDC staff identity and patient OTP, implement transactional audit/outbox persistence, then replace the synthetic UI adapters one bounded workflow at a time. Prove tenant and patient/guardian isolation before connecting any clinical record or scan.
