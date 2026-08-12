import { Controller, Get, Header, Req, ServiceUnavailableException } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { HealthService } from "./health.service.js";

@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  @Header("cache-control", "no-store")
  snapshot(@Req() request: FastifyRequest) {
    return this.health.snapshot(request.id);
  }

  @Get("ready")
  @Header("cache-control", "no-store")
  async readiness(@Req() request: FastifyRequest) {
    const snapshot = await this.health.snapshot(request.id);
    if (snapshot.dependencies.database !== "UP" || snapshot.dependencies.cache !== "UP") {
      throw new ServiceUnavailableException("Required dependencies are not ready.");
    }
    return snapshot;
  }
}
