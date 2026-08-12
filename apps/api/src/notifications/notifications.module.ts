import { Module } from "@nestjs/common";
import { AppConfigService } from "../config/app-config.service.js";
import { DisabledPushProvider } from "./disabled-push.provider.js";
import { FirebasePushProvider } from "./firebase-push.provider.js";
import { PUSH_NOTIFICATION_PROVIDER } from "./push-notification.provider.js";

@Module({
  providers: [
    {
      provide: PUSH_NOTIFICATION_PROVIDER,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => config.value.FIREBASE_ENABLED
        ? new FirebasePushProvider({
            projectId: config.value.FIREBASE_PROJECT_ID,
            serviceAccountBase64: config.value.FIREBASE_SERVICE_ACCOUNT_BASE64,
          })
        : new DisabledPushProvider(),
    },
  ],
  exports: [PUSH_NOTIFICATION_PROVIDER],
})
export class NotificationsModule {}
