import { Injectable } from "@nestjs/common";
import { createClient } from "redis";
import { AppConfigService } from "../config/app-config.service.js";
import { DatabaseService } from "../database/database.service.js";

export type DependencyState = "UP" | "DOWN" | "DEGRADED" | "NOT_CONFIGURED";

@Injectable()
export class HealthService {
  constructor(
    private readonly config: AppConfigService,
    private readonly database: DatabaseService,
  ) {}

  private async cacheState(): Promise<DependencyState> {
    if (!this.config.value.REDIS_URL) return "NOT_CONFIGURED";
    const client = createClient({ url: this.config.value.REDIS_URL });
    client.on("error", () => undefined);
    try {
      await Promise.race([
        (async () => {
          await client.connect();
          await client.ping();
        })(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Redis health timeout")), 1_500)),
      ]);
      return "UP";
    } catch {
      return "DOWN";
    } finally {
      if (client.isOpen) await client.close().catch(() => undefined);
    }
  }

  async snapshot(requestId: string) {
    const [databaseUp, cache] = await Promise.all([this.database.isHealthy(), this.cacheState()]);
    const dependencies = {
      database: databaseUp ? "UP" as const : "DOWN" as const,
      cache,
      object_storage: this.config.value.S3_ENDPOINT ? "DEGRADED" as const : "NOT_CONFIGURED" as const,
      workflow: this.config.value.TEMPORAL_ADDRESS ? "DEGRADED" as const : "NOT_CONFIGURED" as const,
    };
    return {
      status: databaseUp && cache === "UP" ? "ok" : "degraded",
      service: "dentamonitor-api",
      environment: this.config.value.APP_ENV,
      version: this.config.value.APP_VERSION,
      request_id: requestId,
      dependencies,
    };
  }
}
