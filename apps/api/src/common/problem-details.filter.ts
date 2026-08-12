import { ArgumentsHost, Catch, HttpException, HttpStatus, type ExceptionFilter } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const reply = http.getResponse<FastifyReply>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const response = exception instanceof HttpException ? exception.getResponse() : undefined;
    const suppliedMessage = typeof response === "object" && response && "message" in response
      ? (response as { message?: unknown }).message
      : undefined;
    const detail = Array.isArray(suppliedMessage)
      ? suppliedMessage.join("; ")
      : typeof suppliedMessage === "string"
        ? suppliedMessage
        : status >= 500
          ? "The service could not complete the request."
          : "The request could not be processed.";
    const title = HttpStatus[status] ?? "Error";

    reply
      .status(status)
      .type("application/problem+json")
      .header("cache-control", "no-store")
      .header("x-request-id", request.id)
      .send({
        type: `urn:dentamonitor:problem:http-${status}`,
        title,
        status,
        detail,
        instance: request.url,
        request_id: request.id,
      });
  }
}
