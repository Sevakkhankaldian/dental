/** Minimal Vinext/Cloudflare runtime boundary used by local typechecking. */
interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface D1Database {}

declare module "cloudflare:workers" {
  // External runtime binding shape is owned by Cloudflare and validated at startup.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const env: { DB?: any };
}
