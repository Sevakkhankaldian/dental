import "reflect-metadata";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { NestFactory, Reflector } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module.js";
import { ProblemDetailsFilter } from "./common/problem-details.filter.js";
import { TelemetryInterceptor } from "./common/telemetry.interceptor.js";
import { startTelemetry, stopTelemetry } from "./common/telemetry.js";
import { AppConfigService, loadConfig } from "./config/app-config.service.js";
import { runMigrations } from "./database/migrate.js";

async function bootstrap(): Promise<void> {
  const startupConfig = loadConfig();
  startTelemetry(startupConfig);
  if (startupConfig.MIGRATE_ON_START) await runMigrations(startupConfig);

  const adapter = new FastifyAdapter({
    trustProxy: startupConfig.TRUST_PROXY,
    logger: startupConfig.LOG_LEVEL === "silent" ? false : { level: startupConfig.LOG_LEVEL },
    requestIdHeader: "x-request-id",
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    bufferLogs: false,
  });
  const config = app.get(AppConfigService);
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: config.corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
  await app.register(rateLimit, { max: 300, timeWindow: "1 minute" });
  app.setGlobalPrefix("api/v1");
  app.useGlobalFilters(new ProblemDetailsFilter());
  app.useGlobalInterceptors(app.get(TelemetryInterceptor));
  app.enableShutdownHooks();
  process.once("SIGTERM", () => void stopTelemetry());
  process.once("SIGINT", () => void stopTelemetry());

  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook("onSend", async (request, reply) => {
    reply.header("x-request-id", request.id);
    reply.header("cache-control", reply.getHeader("cache-control") ?? "no-store");
  });

  await app.listen({ host: config.value.API_HOST, port: config.value.API_PORT });
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown startup error";
  process.stderr.write(`API startup failed: ${message}\n`);
  process.exitCode = 1;
});
