# ADR-0002: Modular API on Liara with replaceable provider adapters

- Status: Accepted
- Date: 2026-08-13
- Requirement references: Sections 5.1, 5.4, 6.1, 6.5, 7.1, 11.2, 16.1 and `NFR-008`

## Context

The product needs independent public web and core API release units, PostgreSQL as the system of record, patient OTP, push notifications, and deployment on Liara. The selected Iranian SMS vendor is Kavenegar and the selected push transport is Firebase Cloud Messaging. Clinical modules must not couple domain rules to hosting or vendor SDKs.

## Decision

- Keep the existing Vinext web experience as a separately deployable web image.
- Implement the core API as a NestJS 11 modular monolith using Fastify and REST `/api/v1`.
- Use PostgreSQL 16 for identity, tenant scope, sessions, audit and transactional outbox. Redis is required for readiness and will host distributed abuse controls in the next slice.
- Model SMS and push behind application ports. Kavenegar is the production OTP adapter; the mock adapter is rejected at staging/production startup. Firebase Admin is the push adapter and sends only privacy-minimized templates.
- Use short-lived signed access tokens and opaque, server-side hashed, rotating refresh tokens. Staff identity remains a separate OIDC/MFA slice.
- Package web and API as separate non-root Docker images and deploy both through GitHub Actions to Liara. Database migrations are checksum-verified and advisory-lock protected; `MIGRATE_ON_START` is explicit.

## Consequences

- Kavenegar, Firebase or Liara can be replaced without changing pure domain code.
- Web deployment does not grant database access; only the API receives database and provider secrets.
- The API is production-shaped but not yet a clinical release. Consent, care-team ABAC, staff OIDC/MFA and connected clinical repositories remain hard gates.
- The current Sites deployment remains a private product preview. Liara is the intended production runtime.
