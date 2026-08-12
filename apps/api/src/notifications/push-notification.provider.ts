export type PushTemplate = "NEW_TASK" | "NEW_MESSAGE" | "SCAN_REMINDER";

export type PushInput = Readonly<{
  deviceToken: string;
  template: PushTemplate;
  locale: "fa-IR" | "en-US";
}>;

export interface PushNotificationProvider {
  send(input: PushInput): Promise<string>;
  readonly enabled: boolean;
}

export const PUSH_NOTIFICATION_PROVIDER = Symbol("PUSH_NOTIFICATION_PROVIDER");
