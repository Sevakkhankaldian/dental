# Liara deployment runbook

## Topology

Create two Liara Docker applications from the same GitHub repository:

- Web: `Dockerfile.web`, port `3000`, public hostname.
- API: `Dockerfile.api`, port `4000`, public API hostname.

Create managed PostgreSQL 16 and Redis services in Liara and connect only the API application to their internal URLs. The web application must never receive database, Kavenegar or Firebase secrets.

## Required GitHub configuration

Repository secret:

- `LIARA_API_TOKEN`

Repository variables:

- `LIARA_WEB_APP`
- `LIARA_API_APP`
- `LIARA_BUILD_LOCATION` (`iran` by default; change only for an approved residency decision)

Protect the `production` GitHub Environment with required reviewers. The deploy workflow runs only after the `foundation-ci` workflow succeeds on `main`, or by an authorized manual dispatch.

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

## Release and rollback

1. Merge only after CI, migration review and OpenAPI compatibility review.
2. Confirm the API `/api/v1/health/ready` response is `200` before routing traffic.
3. Run the synthetic smoke flow only in a test environment, never against production patient identities.
4. For application rollback, redeploy the previously approved Git commit. Database migrations are forward-only; create a compensating migration rather than editing an applied file.
5. If authentication or provider behavior is abnormal, disable the affected public route at the edge, preserve audit/log evidence, rotate credentials and follow the incident process.

The workflow never contains Liara, Kavenegar, Firebase or database secret values.
