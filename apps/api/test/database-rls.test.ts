import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { Pool } from "pg";

const databaseUrl = process.env.TEST_DATABASE_URL;

test("PostgreSQL RLS hides a clinic from another organization", { skip: !databaseUrl }, async () => {
  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  const client = await pool.connect();
  const organizationA = randomUUID();
  const organizationB = randomUUID();
  const clinicA = randomUUID();
  const clinicB = randomUUID();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO organizations (id, legal_name, display_name, region, status)
       VALUES ($1,'Synthetic A','Synthetic A','IR-TEST','ACTIVE'),($2,'Synthetic B','Synthetic B','IR-TEST','ACTIVE')`,
      [organizationA, organizationB],
    );
    await client.query(
      `INSERT INTO clinics (id, organization_id, name, status)
       VALUES ($1,$2,'Clinic A','ACTIVE'),($3,$4,'Clinic B','ACTIVE')`,
      [clinicA, organizationA, clinicB, organizationB],
    );
    await client.query("CREATE ROLE dentamonitor_rls_test NOLOGIN");
    await client.query("GRANT USAGE ON SCHEMA public TO dentamonitor_rls_test");
    await client.query("GRANT SELECT ON clinics TO dentamonitor_rls_test");
    await client.query("SET LOCAL ROLE dentamonitor_rls_test");
    await client.query("SELECT set_config('app.organization_id', $1, true)", [organizationA]);
    const visible = await client.query<{ id: string }>("SELECT id FROM clinics ORDER BY id");
    assert.deepEqual(visible.rows.map((row) => row.id), [clinicA]);
    await client.query("RESET ROLE");
    await client.query("ROLLBACK");
  } finally {
    client.release();
    await pool.end();
  }
});
