BEGIN;

CREATE TYPE membership_role AS ENUM (
  'PLATFORM_ADMIN', 'SECURITY_AUDITOR', 'SUPPORT_AGENT', 'ORG_OWNER',
  'CLINIC_ADMIN', 'DOCTOR', 'CLINICAL_ASSISTANT', 'RECEPTION', 'FINANCE',
  'ANNOTATOR', 'ADJUDICATOR', 'ML_RESEARCHER', 'ML_APPROVER', 'PATIENT',
  'GUARDIAN', 'INTEGRATION_CLIENT'
);

CREATE TABLE organizations (
  id uuid PRIMARY KEY,
  legal_name text NOT NULL,
  display_name text NOT NULL,
  region text NOT NULL,
  status text NOT NULL CHECK (status IN ('ACTIVE', 'SUSPENDED', 'CLOSED')),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

CREATE TABLE clinics (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name text NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Tehran',
  locale text NOT NULL DEFAULT 'fa-IR',
  status text NOT NULL CHECK (status IN ('ACTIVE', 'SUSPENDED', 'CLOSED')),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  UNIQUE (organization_id, id)
);

CREATE TABLE users (
  id uuid PRIMARY KEY,
  user_type text NOT NULL CHECK (user_type IN ('STAFF', 'PATIENT', 'GUARDIAN', 'SERVICE')),
  locale text NOT NULL DEFAULT 'fa-IR',
  status text NOT NULL CHECK (status IN ('INVITED', 'ACTIVE', 'LOCKED', 'DISABLED')),
  normalized_phone_ciphertext bytea,
  normalized_email_ciphertext bytea,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

CREATE TABLE memberships (
  id uuid PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  clinic_id uuid,
  user_id uuid NOT NULL REFERENCES users(id),
  role membership_role NOT NULL,
  status text NOT NULL CHECK (status IN ('INVITED', 'ACTIVE', 'SUSPENDED', 'EXPIRED')),
  effective_from timestamptz NOT NULL,
  effective_until timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  FOREIGN KEY (organization_id, clinic_id) REFERENCES clinics(organization_id, id),
  CHECK (effective_until IS NULL OR effective_until > effective_from)
);

CREATE INDEX memberships_effective_scope_idx
  ON memberships (organization_id, clinic_id, user_id, status);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY,
  occurred_at timestamptz NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid,
  organization_id uuid,
  clinic_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  purpose text NOT NULL,
  result text NOT NULL CHECK (result IN ('SUCCEEDED', 'DENIED', 'FAILED')),
  request_id text NOT NULL,
  trace_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  previous_event_hash text,
  event_hash text NOT NULL,
  CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE OR REPLACE FUNCTION reject_audit_event_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events are append-only';
END;
$$;

CREATE TRIGGER audit_events_no_update
  BEFORE UPDATE OR DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION reject_audit_event_mutation();

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY clinics_tenant_scope ON clinics
  USING (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid);

CREATE POLICY memberships_tenant_scope ON memberships
  USING (organization_id = nullif(current_setting('app.organization_id', true), '')::uuid);

COMMIT;
