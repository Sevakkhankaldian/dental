import { createHash, randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { PoolClient } from "pg";
import { DatabaseService } from "../database/database.service.js";

type AuditInput = Readonly<{
  actorId: string;
  organizationId: string;
  clinicId?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  purpose: string;
  result: "SUCCEEDED" | "DENIED" | "FAILED";
  requestId: string;
  traceId?: string | null;
  metadata?: Readonly<Record<string, string | number | boolean | null>>;
}>;

const forbiddenMetadataKeys = /(?:name|phone|email|message|note|media|token|otp|secret|url)/i;

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJson(item)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

@Injectable()
export class AuditService {
  constructor(private readonly database: DatabaseService) {}

  async record(input: AuditInput): Promise<void> {
    await this.database.transaction((client) => this.recordWithClient(client, input));
  }

  async recordWithClient(client: PoolClient, input: AuditInput): Promise<void> {
    const metadata = input.metadata ?? {};
    for (const key of Object.keys(metadata)) {
      if (forbiddenMetadataKeys.test(key)) throw new TypeError(`Audit metadata key is not allowed: ${key}`);
    }
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [`audit:${input.organizationId}`]);
    const previous = await client.query<{ event_hash: string }>(
      `SELECT event_hash FROM audit_events
       WHERE organization_id = $1 ORDER BY recorded_at DESC, id DESC LIMIT 1`,
      [input.organizationId],
    );
    const id = randomUUID();
    const occurredAt = new Date().toISOString();
    const previousHash = previous.rows[0]?.event_hash ?? null;
    const hashMaterial = canonicalJson({ id, occurredAt, previousHash, ...input, metadata });
    const eventHash = createHash("sha256").update(hashMaterial).digest("hex");
    await client.query(
      `INSERT INTO audit_events (
        id, occurred_at, actor_id, organization_id, clinic_id, action, resource_type,
        resource_id, purpose, result, request_id, trace_id, metadata, previous_event_hash, event_hash
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        id, occurredAt, input.actorId, input.organizationId, input.clinicId ?? null, input.action,
        input.resourceType, input.resourceId, input.purpose, input.result, input.requestId,
        input.traceId ?? null, metadata, previousHash, eventHash,
      ],
    );
  }
}
