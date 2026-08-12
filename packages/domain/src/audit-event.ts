/** Requirement refs: AC-FND-03, NFR-009, section 11.4. */

export type AuditResult = "SUCCEEDED" | "DENIED" | "FAILED";

export type AuditEvent = Readonly<{
  id: string;
  occurredAt: string;
  recordedAt: string;
  actorId: string;
  organizationId: string;
  clinicId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  purpose: string;
  result: AuditResult;
  requestId: string;
  traceId?: string;
  metadata: Readonly<Record<string, string | number | boolean | null>>;
}>;

const forbiddenMetadataKeys = /(?:name|phone|email|message|note|media|token|otp|secret|url)/i;

export function createAuditEvent(input: AuditEvent): AuditEvent {
  for (const key of Object.keys(input.metadata)) {
    if (forbiddenMetadataKeys.test(key)) {
      throw new TypeError(`Audit metadata key is not allowed: ${key}`);
    }
  }

  return Object.freeze({
    ...input,
    metadata: Object.freeze({ ...input.metadata }),
  });
}

export class InMemoryAppendOnlyAuditStore {
  readonly #events: AuditEvent[] = [];

  append(event: AuditEvent): void {
    this.#events.push(event);
  }

  list(): readonly AuditEvent[] {
    return Object.freeze([...this.#events]);
  }
}
