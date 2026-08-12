import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";
import { loadConfig } from "../config/app-config.service.js";

const config = loadConfig();
if (config.APP_ENV !== "local" && config.APP_ENV !== "test") {
  throw new Error("Synthetic seed is forbidden outside local/test.");
}
if (!config.SEED_SYNTHETIC_DATA) {
  throw new Error("Set SEED_SYNTHETIC_DATA=true to confirm synthetic local/test seeding.");
}

const sql = await readFile(resolve(process.cwd(), "data/synthetic/seed-foundation.sql"), "utf8");
const pool = new Pool({ connectionString: config.DATABASE_URL, max: 1 });
try {
  await pool.query(sql);
  process.stdout.write("Deterministic synthetic seed applied.\n");
} finally {
  await pool.end();
}
