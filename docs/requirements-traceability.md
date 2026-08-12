# Requirements traceability

This register tracks implemented evidence against `DENTAMONITOR_IRAN_MASTER_BUILD_SPEC.md` v1.0.0. A row marked **partial** is not release evidence.

| Requirement | Status | Implementation evidence | Automated evidence |
|---|---|---|---|
| `NFR-006` RTL/LTR and web accessibility | Partial | Persian `lang`, RTL root, keyboard focus, responsive layouts for all five surfaces | Render assertions in `tests/rendered-html.test.mjs` |
| `NFR-008` Tenant isolation | Foundation | `packages/domain/src/tenant-context.ts`; PostgreSQL tenant keys and RLS in migration `0001` | Cross-organization and cross-clinic negative tests |
| `NFR-009` Instruction traceability | Prototype | Review prototype requires explicit simulated sign-off; patient instruction screen exposes signer and acknowledgement | UI route and configuration assertions |
| `PR-CLIN-002` Finding review states | Prototype | Doctor drawer supports accept/edit/reject/inconclusive using synthetic data | UI render assertion only |
| `PR-CLIN-003` Raw AI hidden from patients | Prototype | Patient surfaces expose only signed instruction language; raw proposal and uncertainty live in authorized clinic views | UI copy and route assertions |
| `PAT-01..28` Patient application | Prototype | Complete data-driven route inventory under `/patient/*`, mobile presentation and safety controls | Exact count, unique routes and representative render test |
| `DOC-02` Doctor dashboard | Prototype | Responsive overview with attention, workload, SLA and synthetic queue | Route render test |
| `DOC-03` Unified inbox | Prototype | `/inbox` combines urgent reports, reviews, messages, appointments and tasks | Multi-route render test |
| `DOC-04` Smart review queue | Prototype | `/reviews` includes search, quality, priority, evidence mock and sign-off state | Multi-route render test |
| `DOC-05/07` Patient directory/overview | Prototype | `/patients` supports local search, treatment filter, synthetic creation and overview | Multi-route render test |
| `DOC-18` Messages | Prototype | `/messages` includes threads, approved template examples and PHI-minimized notice | Multi-route render test |
| `DOC-19` Appointments/calendar | Prototype | `/appointments` includes Jalali week view, resources and request handling | Multi-route render test |
| `DOC-21/22` Protocol library/builder | Prototype | `/protocols` includes versions, simulation, maker-checker copy and safety gate | Multi-route render test |
| `DOC-24` Analytics | Prototype | `/analytics` includes operational/clinical metrics and semantic definitions | Multi-route render test |
| `DOC-01..32` Complete clinic portal | Prototype | Complete route inventory under `/clinic/*`; specialized clinical viewer/sign-off and general operations templates | Exact count, unique routes and representative render test |
| `ADM-01..16` Platform Admin/MLOps | Prototype | Complete route inventory under `/admin/*`; health, model lifecycle, audit and control-console presentation | Exact count, unique routes and representative render test |
| `ANN-01..10` Annotation application | Prototype | Complete route inventory under `/annotation/*`; image workspace, tools, structured finding and release controls | Exact count, unique routes and representative render test |
| `PR-ENG-001/002` Engage separation and funnel | Prototype | Seven independent `/engage/*` steps; non-diagnostic copy and explicit clinical-boundary notice | Count, unique routes and pre-screen render test |
| `PR-CLIN-007` Treatment states | Not started | — | — |
| `AC-FND-01` Cross-tenant denial | Foundation | Pure tenant boundary and PostgreSQL tenant-scoped schema | `packages/domain/test/tenant-context.test.ts` |
| `AC-FND-02` Patient/guardian subset | UI prototype | Guardian/dependent and patient privacy routes model delegated scope; domain enforcement not connected | Configuration test only |
| `AC-FND-03` Correlated audit without PHI | Foundation | Append-only domain store, metadata denylist, append-only SQL trigger | Domain audit test |
| `AC-FND-04` Persian/Jalali/UTC/English | Partial | Persian RTL and Jalali display shell; schema stores `timestamptz` | Render assertion; date conversion not yet tested |
| Section 5.4 tenant columns | Foundation | `organization_id` and `clinic_id` present on scoped foundation tables | Migration review; database integration pending |
| Section 6 identity/tenant tables | Foundation | Organizations, clinics, users, memberships migration and deterministic seed | Database integration pending |
| Section 7.1 API conventions | Partial | `/api/v1/health`, `X-Request-Id`, no-store response and OpenAPI 3.1 contract | Build/render checks; route contract test pending |
| Section 11.4 append-only audit | Foundation | Domain event + database mutation trigger | Domain audit test; PostgreSQL integration pending |
| Section 18 synthetic seed | Partial | Deterministic foundation seed `20260812`; no patient records yet | Manual schema review |

## Release caveats

- The full patient, clinician, admin/MLOps, annotation and Engage experience is a functional interaction prototype over deterministic in-memory demo data. It is not connected to clinical records.
- The AI label is `DM-MOCK-QUALITY v0.1`, shadow-only, with zero clinical claims.
- Staff authentication, care-team ABAC, patient/guardian access, durable audit signing, and PostgreSQL integration remain release blockers.
- No patient-facing clinical action or external notification is enabled.
