import assert from "node:assert/strict";
import test from "node:test";
import {
  assertTenantAccess,
  createTenantContext,
  isTenantAccessAllowed,
  TenantAccessDeniedError,
} from "../src/tenant-context";
import { createAuditEvent, InMemoryAppendOnlyAuditStore } from "../src/audit-event";

const context = createTenantContext({
  actorId: "usr-doctor-arya",
  organizationId: "org-dentamonitor-lab",
  clinicIds: ["clinic-tehran"],
  roles: ["DOCTOR"],
  purpose: "TREATMENT_REVIEW",
  requestId: "req-001",
});

test("AC-FND-01 allows a resource in the effective clinic scope", () => {
  assert.doesNotThrow(() =>
    assertTenantAccess(context, {
      organizationId: "org-dentamonitor-lab",
      clinicId: "clinic-tehran",
    }),
  );
});

test("AC-FND-01 denies a resource in another organization", () => {
  assert.throws(
    () =>
      assertTenantAccess(context, {
        organizationId: "org-other",
        clinicId: "clinic-tehran",
      }),
    TenantAccessDeniedError,
  );
});

test("AC-FND-01 denies a resource in an unassigned clinic", () => {
  assert.equal(
    isTenantAccessAllowed(context, {
      organizationId: "org-dentamonitor-lab",
      clinicId: "clinic-shiraz",
    }),
    false,
  );
});

test("tenant context is immutable and deduplicates scopes", () => {
  const value = createTenantContext({ ...context, clinicIds: ["clinic-tehran", "clinic-tehran"] });
  assert.deepEqual(value.clinicIds, ["clinic-tehran"]);
  assert.equal(Object.isFrozen(value), true);
  assert.equal(Object.isFrozen(value.clinicIds), true);
});

test("AC-FND-03 audit events reject likely PHI payload keys and remain append-only", () => {
  assert.throws(
    () =>
      createAuditEvent({
        id: "audit-unsafe",
        occurredAt: "2026-08-12T00:00:00.000Z",
        recordedAt: "2026-08-12T00:00:00.000Z",
        actorId: context.actorId,
        organizationId: context.organizationId,
        action: "PATIENT.READ",
        resourceType: "PATIENT",
        resourceId: "patient-001",
        purpose: context.purpose,
        result: "SUCCEEDED",
        requestId: context.requestId,
        metadata: { patient_name: "unsafe" },
      }),
    /not allowed/,
  );

  const store = new InMemoryAppendOnlyAuditStore();
  const safeEvent = createAuditEvent({
    id: "audit-001",
    occurredAt: "2026-08-12T00:00:00.000Z",
    recordedAt: "2026-08-12T00:00:00.000Z",
    actorId: context.actorId,
    organizationId: context.organizationId,
    action: "PATIENT.READ",
    resourceType: "PATIENT",
    resourceId: "patient-001",
    purpose: context.purpose,
    result: "SUCCEEDED",
    requestId: context.requestId,
    metadata: { version: 1 },
  });
  store.append(safeEvent);
  assert.deepEqual(store.list(), [safeEvent]);
  assert.equal(Object.isFrozen(store.list()), true);
});
