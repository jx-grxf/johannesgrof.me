// Only the part of the workerd runtime module this site uses; the full
// @cloudflare/workers-types would redefine Request/Response for the whole project.
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
  export function waitUntil(promise: Promise<unknown>): void;
}
