BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE users
  ADD COLUMN normalized_phone_hash char(64),
  ADD COLUMN last_authenticated_at timestamptz;

CREATE UNIQUE INDEX users_normalized_phone_hash_unique
  ON users (normalized_phone_hash)
  WHERE normalized_phone_hash IS NOT NULL;

CREATE TABLE otp_challenges (
  id uuid PRIMARY KEY,
  phone_hash char(64) NOT NULL,
  code_hash text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('PATIENT_SIGN_IN', 'PATIENT_INVITATION')),
  status text NOT NULL CHECK (status IN (
    'PENDING', 'CONSUMED', 'LOCKED', 'EXPIRED', 'DELIVERY_FAILED', 'SUPPRESSED'
  )),
  delivery_status text NOT NULL CHECK (delivery_status IN ('QUEUED', 'SENT', 'FAILED', 'SUPPRESSED')),
  request_ip_hash char(64) NOT NULL,
  attempts smallint NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts smallint NOT NULL CHECK (max_attempts BETWEEN 3 AND 10),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE INDEX otp_challenges_phone_rate_idx ON otp_challenges (phone_hash, created_at DESC);
CREATE INDEX otp_challenges_ip_rate_idx ON otp_challenges (request_ip_hash, created_at DESC);
CREATE INDEX otp_challenges_expiry_idx ON otp_challenges (expires_at) WHERE status = 'PENDING';

CREATE TABLE sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  refresh_token_hash char(64) NOT NULL UNIQUE,
  assurance_level text NOT NULL CHECK (assurance_level IN ('OTP', 'MFA', 'SSO_MFA')),
  rotation_counter integer NOT NULL DEFAULT 0 CHECK (rotation_counter >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  revoke_reason text,
  CHECK (expires_at > created_at)
);

CREATE INDEX sessions_user_active_idx ON sessions (user_id, expires_at DESC) WHERE revoked_at IS NULL;

CREATE TABLE outbox_events (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  clinic_id uuid,
  aggregate_type text NOT NULL,
  aggregate_id text NOT NULL,
  event_type text NOT NULL,
  schema_version integer NOT NULL DEFAULT 1 CHECK (schema_version > 0),
  payload jsonb NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  available_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  delivery_attempts integer NOT NULL DEFAULT 0 CHECK (delivery_attempts >= 0),
  last_error_code text,
  FOREIGN KEY (organization_id, clinic_id) REFERENCES clinics(organization_id, id),
  CHECK (jsonb_typeof(payload) = 'object')
);

CREATE INDEX outbox_pending_idx ON outbox_events (available_at, occurred_at) WHERE published_at IS NULL;
CREATE INDEX outbox_aggregate_idx ON outbox_events (aggregate_type, aggregate_id, occurred_at);

CREATE TABLE notification_devices (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  clinic_id uuid,
  user_id uuid NOT NULL REFERENCES users(id),
  provider text NOT NULL CHECK (provider IN ('FCM')),
  platform text NOT NULL CHECK (platform IN ('ANDROID', 'IOS', 'WEB')),
  token_hash char(64) NOT NULL,
  token_ciphertext bytea NOT NULL,
  locale text NOT NULL DEFAULT 'fa-IR',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  disabled_at timestamptz,
  FOREIGN KEY (organization_id, clinic_id) REFERENCES clinics(organization_id, id),
  UNIQUE (provider, token_hash)
);

CREATE INDEX notification_devices_user_idx
  ON notification_devices (organization_id, user_id, enabled);

CREATE TABLE idempotency_records (
  organization_id uuid NOT NULL REFERENCES organizations(id),
  idempotency_key text NOT NULL,
  request_hash char(64) NOT NULL,
  response_status integer,
  response_body jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  PRIMARY KEY (organization_id, idempotency_key),
  CHECK (expires_at > created_at)
);

CREATE INDEX audit_events_tenant_chain_idx
  ON audit_events (organization_id, recorded_at DESC, id DESC);

DROP POLICY clinics_tenant_scope ON clinics;
CREATE POLICY clinics_tenant_scope ON clinics
  USING (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid);

DROP POLICY memberships_tenant_scope ON memberships;
CREATE POLICY memberships_tenant_scope ON memberships
  USING (
    organization_id = nullif(current_setting('app.organization_id', true), '')::uuid
    OR current_setting('app.identity_lookup', true) = 'on'
  )
  WITH CHECK (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid);

ALTER TABLE clinics FORCE ROW LEVEL SECURITY;
ALTER TABLE memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE idempotency_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbox_events FORCE ROW LEVEL SECURITY;
ALTER TABLE notification_devices FORCE ROW LEVEL SECURITY;
ALTER TABLE idempotency_records FORCE ROW LEVEL SECURITY;

CREATE POLICY outbox_events_tenant_scope ON outbox_events
  USING (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY notification_devices_tenant_scope ON notification_devices
  USING (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY idempotency_records_tenant_scope ON idempotency_records
  USING (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid)
  WITH CHECK (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid);

COMMIT;
