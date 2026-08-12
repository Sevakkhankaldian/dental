import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import type { PushInput, PushNotificationProvider, PushTemplate } from "./push-notification.provider.js";

const templates: Record<PushTemplate, Record<"fa-IR" | "en-US", { title: string; body: string }>> = {
  NEW_TASK: {
    "fa-IR": { title: "دنتامانیتور", body: "وظیفهٔ جدیدی دارید. اپلیکیشن را باز کنید." },
    "en-US": { title: "DentaMonitor", body: "You have a new task. Open the app for details." },
  },
  NEW_MESSAGE: {
    "fa-IR": { title: "دنتامانیتور", body: "پیام جدیدی دارید. اپلیکیشن را باز کنید." },
    "en-US": { title: "DentaMonitor", body: "You have a new message. Open the app for details." },
  },
  SCAN_REMINDER: {
    "fa-IR": { title: "دنتامانیتور", body: "زمان ثبت اسکن رسیده است. اپلیکیشن را باز کنید." },
    "en-US": { title: "DentaMonitor", body: "It is time for your scan. Open the app for details." },
  },
};

type FirebaseOptions = Readonly<{
  projectId?: string;
  serviceAccountBase64?: string;
}>;

export class FirebasePushProvider implements PushNotificationProvider {
  readonly enabled = true;
  private readonly app: App;

  constructor(options: FirebaseOptions) {
    const existing = getApps().find((app) => app.name === "dentamonitor-notifications");
    if (existing) {
      this.app = existing;
      return;
    }
    const credential = options.serviceAccountBase64
      ? cert(JSON.parse(Buffer.from(options.serviceAccountBase64, "base64").toString("utf8")))
      : applicationDefault();
    this.app = initializeApp(
      { credential, ...(options.projectId ? { projectId: options.projectId } : {}) },
      "dentamonitor-notifications",
    );
  }

  send(input: PushInput): Promise<string> {
    const message = templates[input.template][input.locale];
    return getMessaging(this.app).send({
      token: input.deviceToken,
      notification: message,
      data: { event: input.template },
      android: { priority: "high" },
      apns: { payload: { aps: { sound: "default" } } },
    });
  }
}
