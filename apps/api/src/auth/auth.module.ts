import { Module } from "@nestjs/common";
import { AuditService } from "../audit/audit.service.js";
import { AppConfigService } from "../config/app-config.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { KavenegarOtpProvider } from "./kavenegar-otp.provider.js";
import { MockOtpProvider } from "./mock-otp.provider.js";
import { OTP_PROVIDER } from "./otp-provider.js";

@Module({
  controllers: [AuthController],
  providers: [
    AuditService,
    AuthService,
    JwtAuthGuard,
    {
      provide: OTP_PROVIDER,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => {
        if (config.value.SMS_PROVIDER === "kavenegar") {
          return new KavenegarOtpProvider(config.value.KAVENEGAR_API_KEY!, config.value.KAVENEGAR_API_BASE_URL);
        }
        return new MockOtpProvider();
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
