import { Injectable } from "@nestjs/common";
import { z } from "zod";

const booleanFromEnvironment = z.preprocess(
  (value) => value === true || value === "true" || value === "1",
  z.boolean(),
);

const environmentSchema = z
  .object({
    APP_ENV: z.enum(["local", "test", "staging", "production"]).default("local"),
    APP_VERSION: z.string().default("dev"),
    API_HOST: z.string().default("0.0.0.0"),
    API_PORT: z.coerce.number().int().positive().max(65_535).default(4000),
    API_BASE_URL: z.string().url().default("http://localhost:4000"),
    PUBLIC_BASE_URL: z.string().url().default("http://localhost:3000"),
    CORS_ORIGINS: z.string().default("http://localhost:3000"),
    TRUST_PROXY: booleanFromEnvironment.default(false),
    LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),

    DATABASE_URL: z.string().min(1).default("postgresql://dentamonitor:local-only@localhost:5432/dentamonitor"),
    DATABASE_POOL_MAX: z.coerce.number().int().positive().max(100).default(20),
    DATABASE_SSL: booleanFromEnvironment.default(false),
    MIGRATE_ON_START: booleanFromEnvironment.default(false),
    SEED_SYNTHETIC_DATA: booleanFromEnvironment.default(false),
    REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
    TEMPORAL_ADDRESS: z.string().optional(),
    S3_ENDPOINT: z.string().url().optional(),

    JWT_ISSUER: z.string().default("https://identity.dentamonitor.invalid"),
    JWT_AUDIENCE: z.string().default("dentamonitor-api"),
    JWT_SECRET: z.string().min(32).default("local-only-jwt-secret-change-me-32-bytes"),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().min(300).max(3600).default(600),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().min(1).max(90).default(30),
    OTP_PHONE_PEPPER: z.string().min(24).default("local-only-phone-pepper-change-me"),
    IP_HASH_PEPPER: z.string().min(24).default("local-only-ip-pepper-change-me-now"),
    OTP_TTL_SECONDS: z.coerce.number().int().min(60).max(600).default(120),
    OTP_MAX_ATTEMPTS: z.coerce.number().int().min(3).max(10).default(5),
    OTP_FIXED_CODE: z.string().regex(/^\d{6}$/).optional(),

    SMS_PROVIDER: z.enum(["mock", "kavenegar"]).default("mock"),
    KAVENEGAR_API_KEY: z.string().optional(),
    KAVENEGAR_VERIFY_TEMPLATE: z.string().default("dentamonitor-login"),
    KAVENEGAR_API_BASE_URL: z.string().url().default("https://api.kavenegar.com"),

    FIREBASE_ENABLED: booleanFromEnvironment.default(false),
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_SERVICE_ACCOUNT_BASE64: z.string().optional(),

    OTEL_SERVICE_NAME: z.string().default("dentamonitor-api"),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
  })
  .superRefine((config, context) => {
    if (config.APP_ENV === "production" || config.APP_ENV === "staging") {
      if (config.SMS_PROVIDER === "mock" || config.OTP_FIXED_CODE) {
        context.addIssue({
          code: "custom",
          message: "Mock or fixed OTP is forbidden outside local/test.",
          path: ["SMS_PROVIDER"],
        });
      }
      if (config.SMS_PROVIDER === "kavenegar" && !config.KAVENEGAR_API_KEY) {
        context.addIssue({
          code: "custom",
          message: "KAVENEGAR_API_KEY is required for the Kavenegar adapter.",
          path: ["KAVENEGAR_API_KEY"],
        });
      }
      if (config.JWT_SECRET.startsWith("local-only") || config.OTP_PHONE_PEPPER.startsWith("local-only")) {
        context.addIssue({
          code: "custom",
          message: "Local development secrets are forbidden outside local/test.",
          path: ["JWT_SECRET"],
        });
      }
    }
    if (config.FIREBASE_ENABLED && !config.FIREBASE_PROJECT_ID && !config.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      context.addIssue({
        code: "custom",
        message: "Firebase requires a project id or a base64 service account.",
        path: ["FIREBASE_PROJECT_ID"],
      });
    }
  });

export type AppConfig = z.infer<typeof environmentSchema>;

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = environmentSchema.safeParse(environment);
  if (!result.success) {
    const details = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid application configuration: ${details}`);
  }
  return result.data;
}

@Injectable()
export class AppConfigService {
  readonly value = loadConfig();

  get corsOrigins(): string[] {
    return this.value.CORS_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean);
  }
}
