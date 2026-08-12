/** Requirement refs: NFR-008, AC-FND-01, section 4.1, section 5.4. */

export type TenantRole =
  | "PLATFORM_ADMIN"
  | "SECURITY_AUDITOR"
  | "SUPPORT_AGENT"
  | "ORG_OWNER"
  | "CLINIC_ADMIN"
  | "DOCTOR"
  | "CLINICAL_ASSISTANT"
  | "RECEPTION"
  | "FINANCE"
  | "ANNOTATOR"
  | "ADJUDICATOR"
  | "ML_RESEARCHER"
  | "ML_APPROVER"
  | "PATIENT"
  | "GUARDIAN"
  | "INTEGRATION_CLIENT";

export type TenantContext = Readonly<{
  actorId: string;
  organizationId: string;
  clinicIds: readonly string[];
  roles: readonly TenantRole[];
  purpose: string;
  requestId: string;
}>;

export type TenantBoundResource = Readonly<{
  organizationId: string;
  clinicId?: string | null;
}>;

export class TenantAccessDeniedError extends Error {
  readonly code = "TENANT_ACCESS_DENIED";

  constructor() {
    super("The resource is outside the effective tenant scope.");
    this.name = "TenantAccessDeniedError";
  }
}

const requireIdentifier = (value: string, field: string) => {
  if (!value.trim()) throw new TypeError(`${field} must be a non-empty identifier.`);
  return value;
};

export function createTenantContext(input: TenantContext): TenantContext {
  requireIdentifier(input.actorId, "actorId");
  requireIdentifier(input.organizationId, "organizationId");
  requireIdentifier(input.purpose, "purpose");
  requireIdentifier(input.requestId, "requestId");
  if (input.roles.length === 0) throw new TypeError("At least one tenant role is required.");

  return Object.freeze({
    ...input,
    clinicIds: Object.freeze([...new Set(input.clinicIds)]),
    roles: Object.freeze([...new Set(input.roles)]),
  });
}

/**
 * Must be called at repository/service boundaries before a tenant-bound read or
 * mutation. Platform-wide support/break-glass access intentionally has no bypass
 * here; it requires a separate, audited grant flow.
 */
export function assertTenantAccess(
  context: TenantContext,
  resource: TenantBoundResource,
): void {
  if (resource.organizationId !== context.organizationId) {
    throw new TenantAccessDeniedError();
  }

  if (resource.clinicId && !context.clinicIds.includes(resource.clinicId)) {
    throw new TenantAccessDeniedError();
  }
}

export function isTenantAccessAllowed(
  context: TenantContext,
  resource: TenantBoundResource,
): boolean {
  try {
    assertTenantAccess(context, resource);
    return true;
  } catch (error) {
    if (error instanceof TenantAccessDeniedError) return false;
    throw error;
  }
}
