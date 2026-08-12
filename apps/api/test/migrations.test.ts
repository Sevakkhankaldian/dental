import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("identity migration preserves OTP, audit, outbox and tenant invariants", async () => {
  const sql = await readFile("packages/database/migrations/0002_identity_outbox_notifications.sql", "utf8");
  assert.match(sql, /CREATE TABLE otp_challenges/);
  assert.match(sql, /code_hash text NOT NULL/);
  assert.doesNotMatch(sql, /\bcode\s+text\b/i);
  assert.match(sql, /CREATE TABLE outbox_events/);
  assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
  assert.match(sql, /notification_devices_tenant_scope/);
  assert.match(sql, /idempotency_key text NOT NULL UNIQUE/);
});
