import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import type { TenantContext } from "../../../../packages/domain/src/tenant-context.js";
import { AppConfigService } from "../config/app-config.service.js";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly pool: Pool;

  constructor(config: AppConfigService) {
    this.pool = new Pool({
      connectionString: config.value.DATABASE_URL,
      max: config.value.DATABASE_POOL_MAX,
      ssl: config.value.DATABASE_SSL ? { rejectUnauthorized: true } : undefined,
      application_name: "dentamonitor-api",
      statement_timeout: 10_000,
      query_timeout: 12_000,
    });
  }

  query<Row extends QueryResultRow = QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<QueryResult<Row>> {
    return this.pool.query<Row>(text, [...values]);
  }

  async transaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async withTenant<T>(context: TenantContext, work: (client: PoolClient) => Promise<T>): Promise<T> {
    return this.transaction(async (client) => {
      await client.query("SELECT set_config('app.organization_id', $1, true)", [context.organizationId]);
      await client.query("SELECT set_config('app.actor_id', $1, true)", [context.actorId]);
      await client.query("SELECT set_config('app.request_id', $1, true)", [context.requestId]);
      return work(client);
    });
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
