import type { SendOtpInput, OtpProvider } from "./otp-provider.js";

export class KavenegarOtpProvider implements OtpProvider {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string,
  ) {}

  async send(input: SendOtpInput): Promise<void> {
    const endpoint = new URL(`/v1/${encodeURIComponent(this.apiKey)}/verify/lookup.json`, this.baseUrl);
    const body = new URLSearchParams({
      receptor: input.phone,
      token: input.code,
      template: input.template,
    });
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Kavenegar delivery failed with HTTP ${response.status}.`);
    const payload = await response.json() as { return?: { status?: number } };
    if (payload.return?.status !== 200) throw new Error("Kavenegar rejected the OTP delivery request.");
  }
}
