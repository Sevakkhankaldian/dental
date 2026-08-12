export type SendOtpInput = Readonly<{
  phone: string;
  code: string;
  template: string;
}>;

export interface OtpProvider {
  send(input: SendOtpInput): Promise<void>;
}

export const OTP_PROVIDER = Symbol("OTP_PROVIDER");
