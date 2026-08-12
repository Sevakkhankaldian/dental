import { randomInt, randomUUID } from "node:crypto";
import { ForbiddenException, Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from "@nestjs/common";
import { jwtVerify, SignJWT } from "jose";
import type { PoolClient } from "pg";
import type { TenantRole } from "../../../../packages/domain/src/tenant-context.js";
import { AuditService } from "../audit/audit.service.js";
import { AppConfigService } from "../config/app-config.service.js";
import { DatabaseService } from "../database/database.service.js";
import { hashOtp, hmacLookup, newOpaqueToken, normalizeIranianMobile, tokenHash, verifyOtp } from "./auth-crypto.js";
import type { AuthPrincipal, MembershipClaim } from "./auth.types.js";
import { OTP_PROVIDER, type OtpProvider } from "./otp-provider.js";

type ChallengeRow = {
  id: string;
  phone_hash: string;
  code_hash: string;
  status: "PENDING" | "CONSUMED" | "LOCKED" | "EXPIRED" | "DELIVERY_FAILED" | "SUPPRESSED";
  attempts: number;
  max_attempts: number;
  expires_at: Date;
};

type MembershipRow = {
  organization_id: string;
  clinic_id: string | null;
  role: TenantRole;
};

@Injectable()
export class AuthService {
  private readonly jwtKey: Uint8Array;

  constructor(
    private readonly config: AppConfigService,
    private readonly database: DatabaseService,
    private readonly audit: AuditService,
    @Inject(OTP_PROVIDER) private readonly otpProvider: OtpProvider,
  ) {
    this.jwtKey = new TextEncoder().encode(config.value.JWT_SECRET);
  }

  private async membershipsForUser(client: PoolClient, userId: string) {
    await client.query("SELECT set_config('app.identity_lookup', 'on', true)");
    return client.query<MembershipRow>(
      `SELECT organization_id, clinic_id, role
       FROM memberships
       WHERE user_id = $1 AND status = 'ACTIVE'
         AND effective_from <= now()
         AND (effective_until IS NULL OR effective_until > now())
       ORDER BY organization_id, clinic_id NULLS FIRST, role`,
      [userId],
    );
  }

  async requestPatientOtp(phoneInput: string, ipAddress: string) {
    let phone: string;
    try {
      phone = normalizeIranianMobile(phoneInput);
    } catch {
      throw new ForbiddenException("If this number is eligible, a verification code will be sent.");
    }
    const challengeId = randomUUID();
    const phoneHash = hmacLookup(phone, this.config.value.OTP_PHONE_PEPPER);
    const ipHash = hmacLookup(ipAddress || "unknown", this.config.value.IP_HASH_PEPPER);
    const fixedCode = this.config.value.APP_ENV === "local" || this.config.value.APP_ENV === "test"
      ? this.config.value.OTP_FIXED_CODE ?? "123456"
      : undefined;
    const code = fixedCode ?? randomInt(0, 1_000_000).toString().padStart(6, "0");
    const codeHash = await hashOtp(challengeId, code);
    const expiresAt = new Date(Date.now() + this.config.value.OTP_TTL_SECONDS * 1_000);

    const limits = await this.database.query<{ phone_count: string; ip_count: string }>(
      `SELECT
         count(*) FILTER (WHERE phone_hash = $1) AS phone_count,
         count(*) FILTER (WHERE request_ip_hash = $2) AS ip_count
       FROM otp_challenges WHERE created_at > now() - interval '15 minutes'`,
      [phoneHash, ipHash],
    );
    const limited = Number(limits.rows[0]?.phone_count ?? 0) >= 5 || Number(limits.rows[0]?.ip_count ?? 0) >= 20;
    await this.database.query(
      `INSERT INTO otp_challenges (
        id, phone_hash, code_hash, purpose, status, delivery_status, request_ip_hash,
        attempts, max_attempts, expires_at
      ) VALUES ($1,$2,$3,'PATIENT_SIGN_IN',$4,$5,$6,0,$7,$8)`,
      [
        challengeId, phoneHash, codeHash, limited ? "SUPPRESSED" : "PENDING",
        limited ? "SUPPRESSED" : "QUEUED", ipHash, this.config.value.OTP_MAX_ATTEMPTS, expiresAt,
      ],
    );

    if (!limited) {
      try {
        await this.otpProvider.send({
          phone,
          code,
          template: this.config.value.KAVENEGAR_VERIFY_TEMPLATE,
        });
        await this.database.query(
          "UPDATE otp_challenges SET delivery_status = 'SENT' WHERE id = $1",
          [challengeId],
        );
      } catch {
        await this.database.query(
          "UPDATE otp_challenges SET status = 'DELIVERY_FAILED', delivery_status = 'FAILED' WHERE id = $1",
          [challengeId],
        );
        throw new ServiceUnavailableException("Verification delivery is temporarily unavailable.");
      }
    }

    return {
      status: "accepted",
      challenge_id: challengeId,
      expires_in: this.config.value.OTP_TTL_SECONDS,
      resend_after: 60,
    };
  }

  async verifyPatientOtp(challengeId: string, code: string, requestId: string) {
    const outcome = await this.database.transaction(async (client) => {
      const challengeResult = await client.query<ChallengeRow>(
        "SELECT * FROM otp_challenges WHERE id = $1 FOR UPDATE",
        [challengeId],
      );
      const challenge = challengeResult.rows[0];
      if (!challenge || challenge.status !== "PENDING" || challenge.expires_at.getTime() <= Date.now()) {
        return { kind: "invalid" as const };
      }
      if (challenge.attempts >= challenge.max_attempts) return { kind: "invalid" as const };

      const valid = await verifyOtp(challenge.id, code, challenge.code_hash);
      if (!valid) {
        const nextAttempts = challenge.attempts + 1;
        await client.query(
          "UPDATE otp_challenges SET attempts = $2, status = CASE WHEN $2 >= max_attempts THEN 'LOCKED' ELSE status END WHERE id = $1",
          [challenge.id, nextAttempts],
        );
        return { kind: "invalid" as const };
      }
      await client.query(
        "UPDATE otp_challenges SET status = 'CONSUMED', consumed_at = now(), attempts = attempts + 1 WHERE id = $1",
        [challenge.id],
      );
      const userResult = await client.query<{ id: string; status: string }>(
        "SELECT id, status FROM users WHERE normalized_phone_hash = $1 LIMIT 1",
        [challenge.phone_hash],
      );
      const user = userResult.rows[0];
      if (!user || user.status !== "ACTIVE") return { kind: "not-invited" as const };
      const membershipResult = await this.membershipsForUser(client, user.id);
      if (!membershipResult.rowCount) return { kind: "not-invited" as const };

      const sessionId = randomUUID();
      const refreshToken = newOpaqueToken();
      const refreshHash = tokenHash(refreshToken);
      const refreshExpiresAt = new Date(
        Date.now() + this.config.value.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1_000,
      );
      await client.query(
        `INSERT INTO sessions (id, user_id, refresh_token_hash, assurance_level, expires_at)
         VALUES ($1,$2,$3,'OTP',$4)`,
        [sessionId, user.id, refreshHash, refreshExpiresAt],
      );
      const primaryMembership = membershipResult.rows[0]!;
      await client.query("SELECT set_config('app.organization_id', $1, true)", [primaryMembership.organization_id]);
      await client.query(
        `INSERT INTO outbox_events (
          id, organization_id, clinic_id, aggregate_type, aggregate_id, event_type, payload, idempotency_key
        ) VALUES ($1,$2,$3,'SESSION',$4,'auth.session.created',$5,$6)`,
        [
          randomUUID(), membershipResult.rows[0]!.organization_id, membershipResult.rows[0]!.clinic_id,
          sessionId, JSON.stringify({ session_id: sessionId, user_id: user.id }), `session-created:${sessionId}`,
        ],
      );
      await this.audit.recordWithClient(client, {
        actorId: user.id,
        organizationId: primaryMembership.organization_id,
        clinicId: primaryMembership.clinic_id,
        action: "AUTH.PATIENT_SIGN_IN",
        resourceType: "SESSION",
        resourceId: sessionId,
        purpose: "AUTHENTICATION",
        result: "SUCCEEDED",
        requestId,
      });
      return {
        kind: "success" as const,
        userId: user.id,
        sessionId,
        refreshToken,
        refreshExpiresAt,
        memberships: membershipResult.rows.map((membership) => ({
          organization_id: membership.organization_id,
          clinic_id: membership.clinic_id,
          role: membership.role,
        } satisfies MembershipClaim)),
      };
    });

    if (outcome.kind === "invalid") throw new UnauthorizedException("The verification code is invalid or expired.");
    if (outcome.kind === "not-invited") throw new ForbiddenException("An active clinic invitation is required.");
    const accessToken = await this.createAccessToken(outcome.userId, outcome.sessionId, outcome.memberships);
    return {
      token_type: "Bearer",
      access_token: accessToken,
      expires_in: this.config.value.ACCESS_TOKEN_TTL_SECONDS,
      refresh_token: outcome.refreshToken,
      refresh_expires_at: outcome.refreshExpiresAt.toISOString(),
      user: { id: outcome.userId, memberships: outcome.memberships },
    };
  }

  async refreshSession(refreshToken: string, requestId: string) {
    const currentHash = tokenHash(refreshToken);
    const replacement = newOpaqueToken();
    const replacementHash = tokenHash(replacement);
    const result = await this.database.transaction(async (client) => {
      const sessionResult = await client.query<{ id: string; user_id: string; expires_at: Date }>(
        `SELECT id, user_id, expires_at FROM sessions
         WHERE refresh_token_hash = $1 AND revoked_at IS NULL AND expires_at > now() FOR UPDATE`,
        [currentHash],
      );
      const session = sessionResult.rows[0];
      if (!session) return null;
      const memberships = await this.membershipsForUser(client, session.user_id);
      if (!memberships.rowCount) {
        await client.query("UPDATE sessions SET revoked_at = now(), revoke_reason = 'NO_ACTIVE_MEMBERSHIP' WHERE id = $1", [session.id]);
        return null;
      }
      await client.query(
        "UPDATE sessions SET refresh_token_hash = $2, rotation_counter = rotation_counter + 1, last_seen_at = now() WHERE id = $1",
        [session.id, replacementHash],
      );
      const mappedMemberships = memberships.rows.map((membership) => ({
        organization_id: membership.organization_id,
        clinic_id: membership.clinic_id,
        role: membership.role,
      } satisfies MembershipClaim));
      const primaryMembership = mappedMemberships[0]!;
      await this.audit.recordWithClient(client, {
        actorId: session.user_id,
        organizationId: primaryMembership.organization_id,
        clinicId: primaryMembership.clinic_id,
        action: "AUTH.SESSION_REFRESH",
        resourceType: "SESSION",
        resourceId: session.id,
        purpose: "AUTHENTICATION",
        result: "SUCCEEDED",
        requestId,
      });
      return {
        ...session,
        memberships: mappedMemberships,
      };
    });
    if (!result) throw new UnauthorizedException("The refresh token is invalid or expired.");
    const accessToken = await this.createAccessToken(result.user_id, result.id, result.memberships);
    return {
      token_type: "Bearer",
      access_token: accessToken,
      expires_in: this.config.value.ACCESS_TOKEN_TTL_SECONDS,
      refresh_token: replacement,
      refresh_expires_at: result.expires_at.toISOString(),
    };
  }

  async revokeSession(principal: AuthPrincipal, requestId: string): Promise<void> {
    await this.database.transaction(async (client) => {
      await client.query(
        "UPDATE sessions SET revoked_at = now(), revoke_reason = 'USER_LOGOUT' WHERE id = $1 AND user_id = $2",
        [principal.sessionId, principal.userId],
      );
      const primary = principal.memberships[0]!;
      await this.audit.recordWithClient(client, {
        actorId: principal.userId,
        organizationId: primary.organization_id,
        clinicId: primary.clinic_id,
        action: "AUTH.SESSION_REVOKE",
        resourceType: "SESSION",
        resourceId: principal.sessionId,
        purpose: "AUTHENTICATION",
        result: "SUCCEEDED",
        requestId,
      });
    });
  }

  private createAccessToken(userId: string, sessionId: string, memberships: readonly MembershipClaim[]) {
    return new SignJWT({ token_use: "access", sid: sessionId, memberships })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(this.config.value.JWT_ISSUER)
      .setAudience(this.config.value.JWT_AUDIENCE)
      .setSubject(userId)
      .setJti(randomUUID())
      .setIssuedAt()
      .setExpirationTime(`${this.config.value.ACCESS_TOKEN_TTL_SECONDS}s`)
      .sign(this.jwtKey);
  }

  async verifyAccessToken(token: string): Promise<AuthPrincipal> {
    try {
      const { payload } = await jwtVerify(token, this.jwtKey, {
        issuer: this.config.value.JWT_ISSUER,
        audience: this.config.value.JWT_AUDIENCE,
        algorithms: ["HS256"],
      });
      if (payload.token_use !== "access" || typeof payload.sub !== "string" || typeof payload.sid !== "string") {
        throw new Error("Invalid access token claims");
      }
      const memberships = Array.isArray(payload.memberships) ? payload.memberships as MembershipClaim[] : [];
      if (!memberships.length) throw new Error("Missing membership claims");
      return { userId: payload.sub, sessionId: payload.sid, memberships };
    } catch {
      throw new UnauthorizedException("The access token is invalid or expired.");
    }
  }
}
