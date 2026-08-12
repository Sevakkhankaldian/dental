import type { PushInput, PushNotificationProvider } from "./push-notification.provider.js";

export class DisabledPushProvider implements PushNotificationProvider {
  readonly enabled = false;

  async send(_input: PushInput): Promise<string> {
    throw new Error("Push notifications are disabled.");
  }
}
