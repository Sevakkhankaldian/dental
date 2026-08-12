import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module.js";
import { TelemetryInterceptor } from "./common/telemetry.interceptor.js";
import { ConfigModule } from "./config/config.module.js";
import { DatabaseModule } from "./database/database.module.js";
import { HealthModule } from "./health/health.module.js";
import { NotificationsModule } from "./notifications/notifications.module.js";

@Module({
  imports: [ConfigModule, DatabaseModule, HealthModule, AuthModule, NotificationsModule],
  providers: [TelemetryInterceptor],
})
export class AppModule {}
