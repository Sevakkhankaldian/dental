-- Deterministic synthetic seed: 20260812. Never use real patient information.
BEGIN;

INSERT INTO organizations (id, legal_name, display_name, region, status)
VALUES (
  '01989a50-0000-7000-8000-000000000001',
  'آزمایشگاه دنتامانیتور',
  'آزمایشگاه دنتامانیتور',
  'IR-UNDECIDED',
  'ACTIVE'
);

INSERT INTO clinics (id, organization_id, name, timezone, locale, status)
VALUES
  ('01989a50-0000-7000-8000-000000000101', '01989a50-0000-7000-8000-000000000001', 'کلینیک تهران', 'Asia/Tehran', 'fa-IR', 'ACTIVE'),
  ('01989a50-0000-7000-8000-000000000102', '01989a50-0000-7000-8000-000000000001', 'کلینیک شیراز', 'Asia/Tehran', 'fa-IR', 'ACTIVE');

INSERT INTO users (id, user_type, locale, status)
VALUES
  ('01989a50-0000-7000-8000-000000001001', 'STAFF', 'fa-IR', 'ACTIVE'),
  ('01989a50-0000-7000-8000-000000001002', 'STAFF', 'fa-IR', 'ACTIVE');

INSERT INTO memberships (
  id, organization_id, clinic_id, user_id, role, status, effective_from
)
VALUES
  ('01989a50-0000-7000-8000-000000002001', '01989a50-0000-7000-8000-000000000001', '01989a50-0000-7000-8000-000000000101', '01989a50-0000-7000-8000-000000001001', 'DOCTOR', 'ACTIVE', '2026-08-12T00:00:00Z'),
  ('01989a50-0000-7000-8000-000000002002', '01989a50-0000-7000-8000-000000000001', '01989a50-0000-7000-8000-000000000102', '01989a50-0000-7000-8000-000000001002', 'CLINIC_ADMIN', 'ACTIVE', '2026-08-12T00:00:00Z');

COMMIT;
