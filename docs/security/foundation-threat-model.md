# Foundation threat model

## Assets and boundaries

Primary assets are tenant membership, patient identity lookup, sessions, audit integrity, notification device tokens and provider credentials. Trust boundaries exist at the public API, PostgreSQL, Redis, Kavenegar, Firebase, GitHub Actions and Liara secret storage. The web client is untrusted.

## Priority threats and current mitigations

| Threat | Current mitigation | Residual work |
|---|---|---|
| Cross-tenant IDOR | Service `TenantContext`, organization/clinic claims, PostgreSQL RLS, negative DB test | Enforce care-team/patient ABAC on every clinical repository |
| OTP enumeration and brute force | Generic responses, keyed phone lookup, scrypt OTP, TTL, attempts, phone/IP windows | Redis distributed limiter, WAF/bot scoring, SIM-swap policy |
| Session theft/replay | Short access TTL, opaque hashed refresh token, rotation, replay rejection, logout revocation | HttpOnly web BFF cookie, device binding and risk-based revocation |
| Sensitive data in logs/audit | No phone/OTP logging, audit metadata denylist, pseudonymous IDs | Automated log redaction tests and DLP monitoring |
| Audit tampering | Append-only trigger and per-tenant hash chain | External signing/anchoring and WORM export |
| Notification leakage | Fixed generic Firebase templates | Quiet hours, consent, device lifecycle and outbox worker |
| Provider/supply-chain compromise | Ports/adapters, pinned lockfile, explicit build-script allowlist, scoped secrets | SBOM, signature verification, egress allowlist, secret rotation drills |
| Malicious configuration | Strict startup validation and production demo guard | Policy-as-code checks against Liara configuration |

No clinical media, findings or patient-facing automated instructions are introduced in this slice.
