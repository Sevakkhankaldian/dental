# Liara deployment runbook

## Topology

Create all production resources in the same Liara private network, named
`dentamonitor-production`:

- Web application: `dentamonitor-web`, Docker, `Dockerfile.web`, port `3000`,
  public hostname.
- API application: `dentamonitor-api`, Docker, `Dockerfile.api`, port `4000`,
  public API hostname.
- PostgreSQL: `dentamonitor-postgres`, version `16.x`, private network only.
- Redis: `dentamonitor-redis`, version `8.x`, private network only.

The API is the only application allowed to receive database, Redis, Kavenegar
or Firebase credentials. Do not enable public networking for PostgreSQL or
Redis. Do not attach a persistent disk to either application; patient media and
3D artifacts belong in private S3-compatible object storage when the media
module is enabled.

## Initial production sizing

The baseline launch sizing is:

- Web: Earth resources (512 MB), Base feature bundle.
- API: Mars resources (1 GB), Silver feature bundle. Silver is required for a
  realistic remote Docker build window and production log retention.
- PostgreSQL: Mars resources (1 GB), Gold feature bundle, daily/weekly/monthly
  automated backup retention, and Pgvector enabled. Keep PostGIS disabled until
  a reviewed feature requires it.
- Redis: Earth resources (512 MB), Base feature bundle. Redis is a cache and
  rate-limit store, not the system of record.

Liara bills resources hourly and displays current monthly estimates in the
console. Re-check the live prices and account balance immediately before
creating resources. Start with the sizing above, monitor memory/CPU/connection
pressure, and resize from evidence rather than guesswork.

## Temporary test environment

The first Liara environment is intentionally a low-cost test environment, not
the production baseline above. Its current configuration is:

- Web: Earth resources (512 MB), Base feature bundle.
- API: Earth resources (512 MB), Base feature bundle.
- PostgreSQL: Earth resources (512 MB), Base feature bundle, Pgvector enabled,
  PostGIS disabled and public networking disabled.
- Redis: Earth resources (512 MB), Base feature bundle and public networking
  disabled.
- All four services use the `dentamonitor-production` private network. The name
  is retained for compatibility, but the resources must be treated as test-only
  until the production sizing and controls are applied.

For this environment only, the API uses `APP_ENV=test`, `SMS_PROVIDER=mock`,
`OTP_FIXED_CODE=123456` and `FIREBASE_ENABLED=false`. Use synthetic identities
only. Never enter real patient, clinician or clinic data, because Base database
features do not provide the backup and retention controls required for clinical
production. Before production use, remove the fixed OTP, enable real Kavenegar
and Firebase credentials, rotate every application secret and database
credential, upgrade resources/features to the production baseline, and complete
the verification checklist below.

## Safe creation order

1. Create the `dentamonitor-production` private network.
2. Create PostgreSQL 16 in that network with public access disabled and
   Pgvector enabled.
3. Create Redis 8 in that network with public access disabled.
4. Create the API Docker application in that network.
5. Create the Web Docker application in that network.
6. Configure the API environment using the private database/Redis connection
   strings shown by Liara.
7. Deploy API first and require `GET /api/v1/health/ready` to return `200`.
8. Deploy Web, then set the final Web/API origins and redeploy both if needed.
9. Enable zero-downtime deployment for both applications after the first
   healthy release.
10. Add custom domains and SSL only after the default `liara.run` endpoints are
    healthy.

## Required GitHub configuration

Repository secret:

- `LIARA_API_TOKEN`

Repository variables:

- `LIARA_WEB_APP`
- `LIARA_API_APP`
- `LIARA_BUILD_LOCATION` (`iran` by default; change only for an approved residency decision)

Protect the `production` GitHub Environment with required reviewers. The deploy workflow runs only after the `foundation-ci` workflow succeeds on `main`, or by an authorized manual dispatch.

Generate the Liara API token in the Liara account security/API-token page and
store it directly as the GitHub Actions secret. Never paste it into a commit,
issue, log, chat or local `.env` file. The repository variables contain only
application identifiers and are not secrets.

## Required API environment

Set these in Liara's encrypted environment settings; use generated values of at least 32 random bytes for secrets/peppers:

```text
APP_ENV=production
API_HOST=0.0.0.0
API_PORT=4000
TRUST_PROXY=true
PUBLIC_BASE_URL=https://<web-host>
API_BASE_URL=https://<api-host>
CORS_ORIGINS=https://<web-host>
DATABASE_URL=<liara-postgresql-internal-url>
DATABASE_SSL=<provider-setting>
REDIS_URL=<liara-redis-internal-url>
MIGRATE_ON_START=true
JWT_ISSUER=https://<api-host>
JWT_AUDIENCE=dentamonitor-api
JWT_SECRET=<random-secret>
OTP_PHONE_PEPPER=<independent-random-secret>
IP_HASH_PEPPER=<independent-random-secret>
SMS_PROVIDER=kavenegar
KAVENEGAR_API_KEY=<secret>
KAVENEGAR_VERIFY_TEMPLATE=dentamonitor-login
FIREBASE_ENABLED=true
FIREBASE_PROJECT_ID=<firebase-project-id>
FIREBASE_SERVICE_ACCOUNT_BASE64=<base64-service-account-json>
```

Do not set `OTP_FIXED_CODE` in staging or production. Startup fails closed if mock OTP, a fixed OTP or local development secrets are detected.

Recommended non-secret runtime tuning for the initial API plan:

```text
DATABASE_POOL_MAX=10
ACCESS_TOKEN_TTL_SECONDS=600
REFRESH_TOKEN_TTL_DAYS=30
OTP_TTL_SECONDS=120
OTP_MAX_ATTEMPTS=5
LOG_LEVEL=info
OTEL_SERVICE_NAME=dentamonitor-api
```

Keep `FIREBASE_ENABLED=false` until either `FIREBASE_PROJECT_ID` or
`FIREBASE_SERVICE_ACCOUNT_BASE64` is configured. Production startup requires a
real Kavenegar API key because mock and fixed OTP are deliberately rejected.

## Domains and CORS

For the first release, use the default endpoints:

```text
https://dentamonitor-web.liara.run
https://dentamonitor-api.liara.run
```

If either identifier is unavailable, use the actual created identifiers
consistently in Liara, GitHub variables and the environment values. When custom
domains are added, update `PUBLIC_BASE_URL`, `API_BASE_URL`, `CORS_ORIGINS` and
`JWT_ISSUER` together and redeploy the API. Never use `*` for production CORS.

## Verification checklist

- Both database public-network toggles remain off.
- PostgreSQL automated backups are visible and a restore drill is scheduled.
- API readiness returns `200`; database and Redis dependencies report ready.
- Web serves over HTTPS and only calls the expected API origin.
- An invalid origin is rejected by CORS.
- OTP reaches a designated non-patient test number through Kavenegar.
- Refresh-token rotation rejects replay of the prior token.
- Firebase sends only privacy-minimized notification templates.
- No secret appears in GitHub logs, Liara build logs or client bundles.
- The previous approved Git commit is recorded before every production release.

## Release and rollback

1. Merge only after CI, migration review and OpenAPI compatibility review.
2. Confirm the API `/api/v1/health/ready` response is `200` before routing traffic.
3. Run the synthetic smoke flow only in a test environment, never against production patient identities.
4. For application rollback, redeploy the previously approved Git commit. Database migrations are forward-only; create a compensating migration rather than editing an applied file.
5. If authentication or provider behavior is abnormal, disable the affected public route at the edge, preserve audit/log evidence, rotate credentials and follow the incident process.

The workflow never contains Liara, Kavenegar, Firebase or database secret values.
