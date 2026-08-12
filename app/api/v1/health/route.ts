export async function GET(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  const traceparent = request.headers.get("traceparent");

  return Response.json(
    {
      status: "ok",
      service: "dentamonitor-web-foundation",
      environment: "local",
      version: "0.1.0",
      request_id: requestId,
      dependencies: {
        database: "NOT_CONFIGURED",
        cache: "NOT_CONFIGURED",
        object_storage: "NOT_CONFIGURED",
        workflow: "NOT_CONFIGURED",
      },
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store",
        "x-request-id": requestId,
        ...(traceparent ? { traceparent } : {}),
      },
    },
  );
}
