// Concurrent requests on one warm function instance may await the same upstream fetch.
export const sharesInFlight = true;

export const edgeLocation = (request: Request): string | null => request.headers.get("x-vercel-id")?.split(":")[0] ?? null;

export const functionRegion = (): string | null => process.env.VERCEL_REGION ?? null;

// Vercel sets x-forwarded-for itself; a client-sent value never reaches the function.
export const clientAddress = (request: Request): string | null =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
