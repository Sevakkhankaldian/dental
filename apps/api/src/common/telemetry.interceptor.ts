import { CallHandler, ExecutionContext, Injectable, type NestInterceptor } from "@nestjs/common";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { catchError, finalize, throwError, type Observable } from "rxjs";
import { AppConfigService } from "../config/app-config.service.js";

@Injectable()
export class TelemetryInterceptor implements NestInterceptor {
  constructor(private readonly config: AppConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const handler = context.getHandler().name;
    const controller = context.getClass().name;
    const span = trace.getTracer(this.config.value.OTEL_SERVICE_NAME).startSpan(`${controller}.${handler}`);
    return next.handle().pipe(
      catchError((error: unknown) => {
        span.recordException(error instanceof Error ? error : new Error("Unknown request failure"));
        span.setStatus({ code: SpanStatusCode.ERROR });
        return throwError(() => error);
      }),
      finalize(() => span.end()),
    );
  }
}
