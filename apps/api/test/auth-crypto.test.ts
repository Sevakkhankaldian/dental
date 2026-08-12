import assert from "node:assert/strict";
import test from "node:test";
import { hashOtp, hmacLookup, normalizeIranianMobile, verifyOtp } from "../src/auth/auth-crypto.js";
import { loadConfig } from "../src/config/app-config.service.js";

test("normalizes Iranian mobile formats and Persian digits", () => {
  assert.equal(normalizeIranianMobile("۰۹۱۲ ۳۴۵ ۶۷۸۹"), "+989123456789");
  assert.equal(normalizeIranianMobile("0098-912-345-6789"), "+989123456789");
  assert.equal(normalizeIranianMobile("+98 (912) 345-6789"), "+989123456789");
  assert.throws(() => normalizeIranianMobile("02188776655"), /valid Iranian mobile/);
});

test("OTP hashes use a salt and verify without persisting the code", async () => {
  const first = await hashOtp("challenge-a", "123456");
  const second = await hashOtp("challenge-a", "123456");
  assert.notEqual(first, second);
  assert.equal(await verifyOtp("challenge-a", "123456", first), true);
  assert.equal(await verifyOtp("challenge-a", "654321", first), false);
  assert.equal(await verifyOtp("challenge-b", "123456", first), false);
  assert.doesNotMatch(first, /123456/);
});

test("phone lookup is deterministic, keyed and non-reversible", () => {
  const hash = hmacLookup("+989123456789", "a-long-test-pepper-that-is-private");
  assert.equal(hash.length, 64);
  assert.equal(hash, hmacLookup("+989123456789", "a-long-test-pepper-that-is-private"));
  assert.notEqual(hash, hmacLookup("+989123456789", "another-long-private-test-pepper"));
});

test("production startup rejects mock OTP and local secrets", () => {
  assert.throws(
    () => loadConfig({ APP_ENV: "production", SMS_PROVIDER: "mock" }),
    /Mock or fixed OTP|Local development secrets/,
  );
});
