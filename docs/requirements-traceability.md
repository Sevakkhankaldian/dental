# Requirements traceability

This register tracks implemented evidence against `DENTAMONITOR_IRAN_MASTER_BUILD_SPEC.md` v1.0.0. A row marked **partial** is not release evidence.

| Requirement | Status | Implementation evidence | Automated evidence |
|---|---|---|---|
| `NFR-006` RTL/LTR and web accessibility | Partial | Persian `lang`, RTL root, keyboard focus, skip link, responsive dashboard in `app/` | Render assertions in `tests/rendered-html.test.mjs` |
| `NFR-008` Tenant isolation | Foundation | `packages/domain/src/tenant-context.ts`; PostgreSQL tenant keys and RLS in migration `0001` | Cross-organization and cross-clinic negative tests |
| `NFR-009` Instruction traceability | Partial | Review prototype requires explicit simulated sign-off; no patient delivery exists | UI render assertion only |
| `PR-CLIN-002` Finding review states | Prototype | Doctor drawer supports accept/edit/reject/inconclusive using synthetic data | UI render assertion only |
| `PR-CLIN-003` Raw AI hidden from patients | Prototype | Doctor-only wording and safety banner; no patient surface exists | UI copy assertion |
| `PR-CLIN-007` Treatment states | Not started | — | — |
| `AC-FND-01` Cross-tenant denial | Foundation | Pure tenant boundary and PostgreSQL tenant-scoped schema | `packages/domain/test/tenant-context.test.ts` |
| `AC-FND-02` Patient/guardian subset | Not started | — | — |
| `AC-FND-03` Correlated audit without PHI | Foundation | Append-only domain store, metadata denylist, append-only SQL trigger | Domain audit test |
| `AC-FND-04` Persian/Jalali/UTC/English | Partial | Persian RTL and Jalali display shell; schema stores `timestamptz` | Render assertion; date conversion not yet tested |
| Section 5.4 tenant columns | Foundation | `organization_id` and `clinic_id` present on scoped foundation tables | Migration review; database integration pending |
| Section 6 identity/tenant tables | Foundation | Organizations, clinics, users, memberships migration and deterministic seed | Database integration pending |
| Section 7.1 API conventions | Partial | `/api/v1/health`, `X-Request-Id`, no-store response and OpenAPI 3.1 contract | Build/render checks; route contract test pending |
| Section 11.4 append-only audit | Foundation | Domain event + database mutation trigger | Domain audit test; PostgreSQL integration pending |
| Section 18 synthetic seed | Partial | Deterministic foundation seed `20260812`; no patient records yet | Manual schema review |

## Release caveats

- The clinician interface is a functional interaction prototype over deterministic in-memory demo data. It is not connected to clinical records.
- The AI label is `DM-MOCK-QUALITY v0.1`, shadow-only, with zero clinical claims.
- Staff authentication, care-team ABAC, patient/guardian access, durable audit signing, and PostgreSQL integration remain release blockers.
- No patient-facing clinical action or external notification is enabled.
