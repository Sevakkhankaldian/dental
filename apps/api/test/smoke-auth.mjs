import assert from "node:assert/strict";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:4010/api/v1";
const phone = process.env.SMOKE_PHONE ?? "+989000000001";
const code = process.env.SMOKE_OTP ?? "123456";

async function jsonRequest(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
  });
  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

const health = await jsonRequest("/health/ready");
assert.equal(health.response.status, 200, JSON.stringify(health.body));

const requested = await jsonRequest("/auth/patient/otp/request", {
  method: "POST",
  body: JSON.stringify({ phone }),
});
assert.equal(requested.response.status, 202, JSON.stringify(requested.body));
assert.match(requested.body.challenge_id, /^[0-9a-f-]{36}$/i);

const verified = await jsonRequest("/auth/patient/otp/verify", {
  method: "POST",
  body: JSON.stringify({ challenge_id: requested.body.challenge_id, code }),
});
assert.equal(verified.response.status, 200, JSON.stringify(verified.body));
assert.equal(verified.body.user.memberships[0].role, "PATIENT");

const me = await jsonRequest("/auth/me", {
  headers: { authorization: `Bearer ${verified.body.access_token}` },
});
assert.equal(me.response.status, 200, JSON.stringify(me.body));
assert.equal(me.body.user_id, verified.body.user.id);

const refreshed = await jsonRequest("/auth/token/refresh", {
  method: "POST",
  body: JSON.stringify({ refresh_token: verified.body.refresh_token }),
});
assert.equal(refreshed.response.status, 200, JSON.stringify(refreshed.body));
assert.notEqual(refreshed.body.refresh_token, verified.body.refresh_token);

const replay = await jsonRequest("/auth/token/refresh", {
  method: "POST",
  body: JSON.stringify({ refresh_token: verified.body.refresh_token }),
});
assert.equal(replay.response.status, 401, "Rotated refresh tokens must not be reusable.");

const logout = await jsonRequest("/auth/logout", {
  method: "POST",
  headers: { authorization: `Bearer ${refreshed.body.access_token}` },
});
assert.equal(logout.response.status, 204, JSON.stringify(logout.body));

process.stdout.write("Smoke passed: health, OTP, claims, refresh rotation, replay rejection and logout.\n");
