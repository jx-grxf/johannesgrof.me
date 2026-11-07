// Awaiting a fetch that another request started is I/O across requests, which
// workerd rejects; every request fetches for itself and only plain data is shared.
export const sharesInFlight = false;

const colo = (request: Request): string | null =>
  (request as Request & { cf?: { colo?: unknown } }).cf?.colo?.toString() ?? request.headers.get("cf-ray")?.split("-")[1] ?? null;

export const edgeLocation = colo;

// A Worker runs in the data centre that took the request; there is no separate function region.
export const functionRegion = (): string | null => null;

// Cloudflare sets CF-Connecting-IP on every request; x-forwarded-for may be missing or client-sent.
export const clientAddress = (request: Request): string | null => request.headers.get("cf-connecting-ip");
