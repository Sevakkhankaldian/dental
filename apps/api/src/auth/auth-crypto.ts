import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const digitMap: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

export function normalizeIranianMobile(input: string): string {
  const ascii = input.replace(/[۰-۹٠-٩]/g, (digit) => digitMap[digit] ?? digit);
  let compact = ascii.replace(/[\s()-]/g, "");
  if (compact.startsWith("0098")) compact = `+98${compact.slice(4)}`;
  if (compact.startsWith("98") && !compact.startsWith("+")) compact = `+${compact}`;
  if (/^09\d{9}$/.test(compact)) compact = `+98${compact.slice(1)}`;
  if (/^9\d{9}$/.test(compact)) compact = `+98${compact}`;
  if (!/^\+989\d{9}$/.test(compact)) {
    throw new TypeError("A valid Iranian mobile number is required.");
  }
  return compact;
}

export function hmacLookup(value: string, pepper: string): string {
  return createHmac("sha256", pepper).update(value).digest("hex");
}

export function tokenHash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function newOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

function deriveOtp(value: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(value, salt, 32, { N: 16_384, r: 8, p: 1 }, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey as Buffer);
    });
  });
}

export async function hashOtp(challengeId: string, code: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await deriveOtp(`${challengeId}:${code}`, salt);
  return `scrypt-v1:${salt.toString("base64url")}:${derived.toString("base64url")}`;
}

export async function verifyOtp(challengeId: string, code: string, encoded: string): Promise<boolean> {
  const [version, saltValue, expectedValue] = encoded.split(":");
  if (version !== "scrypt-v1" || !saltValue || !expectedValue) return false;
  const expected = Buffer.from(expectedValue, "base64url");
  const actual = await deriveOtp(`${challengeId}:${code}`, Buffer.from(saltValue, "base64url"));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
