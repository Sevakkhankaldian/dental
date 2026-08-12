# Foundation security baseline

This is implementation evidence, not a certification claim. The controls are organized against OWASP ASVS 5.0 concepts and the security/privacy requirements in the master build specification.

## Implemented controls

- Boundary validation with strict Zod schemas; unknown request fields are rejected.
- Iranian phone normalization to E.164; only a keyed HMAC lookup is stored. Raw phone numbers are passed transiently to the SMS adapter and are not logged.
- Six-digit, single-purpose OTPs with 120-second default TTL, salted scrypt storage, attempt limits, resend/abuse limits and one-time consumption.
- Generic request responses and invitation-only verification prevent account-state disclosure.
- Ten-minute access tokens, issuer/audience/algorithm pinning, opaque 256-bit refresh tokens, server-side hashes, rotation and replay rejection.
- Environment startup guard rejects mock/fixed OTP and local secrets in staging/production.
- Global security headers, explicit CORS allowlist, request IDs, no-store API responses and global HTTP rate limiting.
- Domain tenant checks plus PostgreSQL RLS as defense in depth. A real PostgreSQL integration test proves cross-organization denial through a non-owner role.
- Append-only audit table, PHI-key denylist and serialized SHA-256 hash chaining per organization.
- Transactional outbox with schema version and idempotency key.
- Provider secrets exist only as environment/secret references. No Kavenegar or Firebase credential is committed.
- Firebase payloads use fixed generic templates and contain no patient, treatment or scan details.

## Release gates

- Replace symmetric access-token signing with the selected OIDC issuer/JWKS exchange or a managed asymmetric key before multi-service production.
- Add staff SSO/MFA, patient/guardian relationship ABAC, consent enforcement and session-device risk controls.
- Move phone/device ciphertext encryption to a managed KMS and implement audited key rotation.
- Add Redis-backed distributed OTP limiting, bot/WAF controls, SIM-swap policy and provider webhook verification.
- Add SAST, dependency review, secret scanning, container scanning and signed/SBOM release artifacts.
- Complete external penetration testing, privacy impact assessment, incident response exercises and applicable medical-device quality/risk evidence before any clinical release.
