import type { SendOtpInput, OtpProvider } from "./otp-provider.js";

export class MockOtpProvider implements OtpProvider {
  async send(_input: SendOtpInput): Promise<void> {
    // The fixed local code is documented in README; phone/code are never logged.
  }
}
