// Concurrent requests on one warm function instance may await the same upstream fetch.
export const sharesInFlight = true;

export const edgeLocation = (request: Request): string | null => request.headers.get("x-vercel-id")?.split(":")[0] ?? null;

export const functionRegion = (): string | null => process.env.VERCEL_REGION ?? null;
