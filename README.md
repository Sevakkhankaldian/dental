# DentaMonitor Iran

Persian-first, multi-tenant orthodontic remote-monitoring platform with a professional public website, role-oriented dashboards and a production-shaped identity/tenant foundation. The normative baseline is `DENTAMONITOR_IRAN_MASTER_BUILD_SPEC.md` v1.0.0.

## What is real now

- NestJS 11 modular-monolith API on Fastify at `/api/v1`.
- PostgreSQL 16 migrations for organizations, clinics, users, memberships, OTP challenges, sessions, append-only audit, transactional outbox, idempotency and Firebase device registration storage.
- Patient OTP flow with Iranian phone normalization, keyed lookup, salted scrypt OTP storage, short TTL, abuse/attempt controls and generic responses.
- Kavenegar production adapter and a local/test-only mock adapter. Fixed/mock OTP causes startup failure in staging/production.
- Ten-minute JWT access tokens plus opaque, hashed and rotating refresh tokens with replay rejection and logout revocation.
- Tenant role claims, framework-independent `TenantContext` and PostgreSQL RLS integration evidence.
- Per-organization audit hash chaining without phone, OTP or other PHI metadata.
- Firebase Admin push adapter using privacy-minimized fixed notification templates.
- Dependency-aware liveness/readiness, request correlation and OpenTelemetry instrumentation hooks.
- Separate non-root Docker images and GitHub Actions for CI and Liara deployment.

The public marketing site, patient/doctor/clinic/admin portals and all route inventories remain high-fidelity product prototypes over synthetic data until each UI module is connected to the API in a reviewed vertical slice. No clinical AI, diagnostic claim or patient-facing automated clinical action is enabled.

## Product surfaces

- Public marketing website: `/`
- Role access center: `/portals`
- Shared patient/doctor app entry: `/app`
- Patient application: `/patient/*` (`PAT-01..28`)
- Doctor workspace: `/doctor/*`
- Clinic operations: `/clinic/*` (`DOC-01..32`)
- Platform admin/MLOps: `/admin/*` (`ADM-01..16`)
- Annotation/data: `/annotation/*` (`ANN-01..10`)
- Public non-diagnostic Engage: `/engage/*`

All names and records in the preview are fictional and synthetic.

## Local setup

Prerequisites: Node.js 22.13+, pnpm 11.19+ and Docker Compose.

```bash
pnpm install --frozen-lockfile
cp .env.example .env
docker compose up -d postgres redis
pnpm run db:migrate
SEED_SYNTHETIC_DATA=true pnpm run db:seed
```

Run the API and web in separate terminals:

```bash
pnpm run dev:api
pnpm run dev:web
```

- Web: `http://localhost:3000`
- API readiness: `http://localhost:4000/api/v1/health/ready`
- Synthetic patient phone: `+989000000001`
- Local/test OTP only: `123456`

Never enable the synthetic seed or fixed OTP outside `local|test`.

## Verification

```bash
pnpm run typecheck:api
pnpm run test:domain
pnpm run test:api
pnpm run build:api
pnpm run build:web
node --test tests/rendered-html.test.mjs
```

With a local test API running on port `4010`, `pnpm run test:smoke` verifies readiness, OTP, membership claims, refresh rotation, replay rejection and logout without printing tokens.

## Deployment

- Liara topology and required secrets: `docs/runbooks/liara-deployment.md`
- CI: `.github/workflows/ci.yml`
- Liara CD: `.github/workflows/deploy-liara.yml`
- API image: `Dockerfile.api`
- Web image: `Dockerfile.web`

The GitHub workflow expects a protected `production` environment, one Liara API token secret and the two Liara application-name variables. Kavenegar, Firebase, database and cryptographic secrets belong only in the Liara API application's encrypted environment.

## Governance and contracts

- Traceability: `docs/requirements-traceability.md`
- Runtime boundary ADR: `docs/adr/0001-web-preview-runtime-boundary.md`
- Production foundation ADR: `docs/adr/0002-production-foundation-liara-providers.md`
- Security baseline: `docs/security/foundation-security-baseline.md`
- Threat model: `docs/security/foundation-threat-model.md`
- Local runbook: `docs/runbooks/local-foundation.md`
- Liara runbook: `docs/runbooks/liara-deployment.md`
- OpenAPI 3.1: `packages/contracts/openapi/openapi.yaml`

## Next dependency-safe slice

Connect the web/mobile login UI to the patient OTP API through a secure web BFF/session cookie, add staff OIDC + MFA, persist clinic invitations and consent, and enforce patient/guardian/care-team ABAC before connecting the first patient overview. Clinical scan/media and AI remain later, separately gated slices.
