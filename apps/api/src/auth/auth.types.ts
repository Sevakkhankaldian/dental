import type { TenantRole } from "../../../../packages/domain/src/tenant-context.js";

export type MembershipClaim = Readonly<{
  organization_id: string;
  clinic_id: string | null;
  role: TenantRole;
}>;

export type AuthPrincipal = Readonly<{
  userId: string;
  sessionId: string;
  memberships: readonly MembershipClaim[];
}>;

declare module "fastify" {
  interface FastifyRequest {
    auth?: AuthPrincipal;
  }
}
