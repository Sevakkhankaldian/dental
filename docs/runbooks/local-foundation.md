# Local foundation runbook

## Purpose

Run the non-clinical identity/tenant foundation with deterministic synthetic data. Nothing in this runbook is suitable for real patient data.

## Startup

1. Copy `.env.example` to an untracked `.env` and keep `APP_ENV=local`.
2. Run `docker compose up -d postgres redis`. Add `minio temporal` only while working on their later slices.
3. Run `pnpm run db:migrate`.
4. Run `SEED_SYNTHETIC_DATA=true pnpm run db:seed` only when synthetic accounts are needed.
5. Run `pnpm run dev:api` and `pnpm run dev:web` in separate terminals.
6. Check `GET http://localhost:4000/api/v1/health/ready`.

The seed patient is `+989000000001`; the local/test-only OTP is `123456`. Neither is accepted by the production configuration guard.

## Verification

Run `pnpm run test:api` for crypto/config/migration checks. Set `TEST_DATABASE_URL` to a disposable PostgreSQL database to include the real RLS negative test. `pnpm run test:smoke` expects a seeded test API on port `4010` unless `SMOKE_BASE_URL` is set.

## Migration recovery

Migrations are ordered SQL files tracked in `schema_migrations` with SHA-256 checksums and a PostgreSQL advisory lock. Never edit an applied migration; add a forward compensating migration. If startup reports a checksum mismatch, stop deployment and restore the committed migration rather than bypassing the check.

## Reset and recovery

The named Docker volumes under project `dentamonitor-local` contain only data created locally. Before any reset, confirm the Compose project name and database URL. Never reuse a volume-reset command against Liara or another environment.

## Current alarms

Local failures are visible through structured API logs and `/api/v1/health/ready`. Production alert routing and SLO dashboards remain a release gate.
