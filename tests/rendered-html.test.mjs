import assert from "node:assert/strict";
import test from "node:test";

async function getWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

const runtime = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const execution = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the Persian public marketing website", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html", host: "localhost" } }),
    runtime,
    execution,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="fa"[^>]*dir="rtl"/i);
  assert.match(html, /دنتامانیتور ایران \| مراقبت پیوسته، تصمیم مطمئن/);
  assert.match(html, /مراقبت هوشمند،/);
  assert.match(html, /فراتر از صندلی درمان/);
  assert.match(html, /فاصله بین ویزیت‌ها/);
  assert.match(html, /پیشنهاد هوشمند/);
  assert.match(html, /تصمیم انسانی/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("the product hub and every role-specific surface server-render independently", async () => {
  const worker = await getWorker();
  const routes = [
    ["/portals", "از کدام بخش وارد می‌شوید؟"],
    ["/patient/home", "خانه درمان"],
    ["/doctor/today", "امروز من"],
    ["/clinic/decision-signoff", "تصمیم و امضای بالینی"],
    ["/admin/model-registry", "رجیستری مدل"],
    ["/annotation/image-workspace", "فضای برچسب‌گذاری تصویر"],
    ["/engage/pre-screen", "نتیجه پیش‌غربالگری"],
  ];

  for (const [path, expected] of routes) {
    const response = await worker.fetch(
      new Request(`http://localhost${path}`, {
        headers: { accept: "text/html", host: "localhost" },
      }),
      runtime,
      execution,
    );
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp(expected), path);
    assert.match(html, /این نسخه نمایشی|داده کاملاً ساختگی|کنش‌ها در این نمونه فقط نمایشی‌اند/, path);
  }
});

test("the shared application asks for a patient or doctor role", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/app", { headers: { accept: "text/html", host: "localhost" } }),
    runtime,
    execution,
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /بیمار هستم/);
  assert.match(html, /پزشک هستم/);
  assert.match(html, /یک نقطه ورود، دو تجربه کاملاً متفاوت/);
});

test("health endpoint returns a correlated, non-cacheable foundation response", async () => {
  const worker = await getWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/v1/health", {
      headers: { "x-request-id": "req-contract-001" },
    }),
    runtime,
    execution,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-request-id"), "req-contract-001");
  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(body.request_id, "req-contract-001");
  assert.equal(body.dependencies.database, "NOT_CONFIGURED");
});

test("all clinic portal sections render as independent Persian routes", async () => {
  const worker = await getWorker();
  const sections = [
    ["/inbox", "صندوق یکپارچه"],
    ["/reviews", "صف بررسی هوشمند"],
    ["/patients", "مدیریت بیماران"],
    ["/messages", "پیام‌های کلینیک"],
    ["/appointments", "نوبت‌ها و درخواست‌ها"],
    ["/protocols", "پروتکل‌های پایش"],
    ["/analytics", "گزارش‌ها و تحلیل‌ها"],
  ];

  for (const [path, expectedTitle] of sections) {
    const response = await worker.fetch(
      new Request(`http://localhost${path}`, {
        headers: { accept: "text/html", host: "localhost" },
      }),
      runtime,
      execution,
    );
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, new RegExp(expectedTitle), path);
    assert.match(html, /محیط نمایشی · داده کاملاً ساختگی/, path);
  }
});
