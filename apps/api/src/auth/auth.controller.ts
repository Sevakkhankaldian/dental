import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { z } from "zod";
import { AuthService } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";

const requestSchema = z.object({ phone: z.string().min(8).max(32) }).strict();
const verifySchema = z.object({ challenge_id: z.uuid(), code: z.string().regex(/^\d{6}$/) }).strict();
const refreshSchema = z.object({ refresh_token: z.string().min(32).max(256) }).strict();

function parseBody<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new BadRequestException("The request body does not match the API contract.");
  return parsed.data;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("patient/otp/request")
  @HttpCode(202)
  requestPatientOtp(@Body() input: unknown, @Req() request: FastifyRequest) {
    const body = parseBody(requestSchema, input);
    return this.auth.requestPatientOtp(body.phone, request.ip);
  }

  @Post("patient/otp/verify")
  @HttpCode(200)
  verifyPatientOtp(@Body() input: unknown, @Req() request: FastifyRequest) {
    const body = parseBody(verifySchema, input);
    return this.auth.verifyPatientOtp(body.challenge_id, body.code, request.id);
  }

  @Post("token/refresh")
  @HttpCode(200)
  refresh(@Body() input: unknown, @Req() request: FastifyRequest) {
    const body = parseBody(refreshSchema, input);
    return this.auth.refreshSession(body.refresh_token, request.id);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async logout(@Req() request: FastifyRequest): Promise<void> {
    await this.auth.revokeSession(request.auth!, request.id);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() request: FastifyRequest) {
    const principal = request.auth!;
    return {
      user_id: principal.userId,
      session_id: principal.sessionId,
      memberships: principal.memberships,
    };
  }
}
