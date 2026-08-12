import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import type { AppConfig } from "../config/app-config.service.js";

let telemetrySdk: NodeSDK | undefined;

export function startTelemetry(config: AppConfig): void {
  if (!config.OTEL_EXPORTER_OTLP_ENDPOINT || telemetrySdk) return;
  const baseUrl = config.OTEL_EXPORTER_OTLP_ENDPOINT.replace(/\/$/, "");
  telemetrySdk = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": config.OTEL_SERVICE_NAME,
      "service.version": config.APP_VERSION,
      "deployment.environment.name": config.APP_ENV,
    }),
    traceExporter: new OTLPTraceExporter({ url: `${baseUrl}/v1/traces` }),
  });
  telemetrySdk.start();
}

export async function stopTelemetry(): Promise<void> {
  if (!telemetrySdk) return;
  await telemetrySdk.shutdown();
  telemetrySdk = undefined;
}
