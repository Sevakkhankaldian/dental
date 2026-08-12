import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";
import type { AppConfig } from "../config/app-config.service.js";

const MIGRATION_LOCK_ID = 7_014_202_608_12;

export async function runMigrations(config: AppConfig): Promise<void> {
  const pool = new Pool({
    connectionString: config.DATABASE_URL,
    max: 1,
    ssl: config.DATABASE_SSL ? { rejectUnauthorized: true } : undefined,
    application_name: "dentamonitor-migrator",
  });
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock($1)", [MIGRATION_LOCK_ID]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        checksum text NOT NULL,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const migrationsDirectory = resolve(process.cwd(), "packages/database/migrations");
    const filenames = (await readdir(migrationsDirectory))
      .filter((filename) => /^\d+.*\.sql$/.test(filename))
      .sort((left, right) => left.localeCompare(right));

    for (const filename of filenames) {
      const sql = await readFile(resolve(migrationsDirectory, filename), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const applied = await client.query<{ checksum: string }>(
        "SELECT checksum FROM schema_migrations WHERE id = $1",
        [filename],
      );
      if (applied.rowCount) {
        if (applied.rows[0]?.checksum !== checksum) {
          throw new Error(`Applied migration was modified: ${filename}`);
        }
        continue;
      }
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (id, checksum) VALUES ($1, $2)", [filename, checksum]);
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock($1)", [MIGRATION_LOCK_ID]).catch(() => undefined);
    client.release();
    await pool.end();
  }
}
